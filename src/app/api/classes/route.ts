import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateClassCode } from '@/lib/utils/classCode'
import type { CreateClassRequest } from '@/types'

// GET /api/classes — list teacher's classes with stats
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: classes } = await supabase
    .from('classes')
    .select('id, name, code, school_name, grade, is_active, created_at')
    .eq('teacher_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (!classes?.length) return NextResponse.json({ classes: [] })

  // Lấy student counts + today's flag counts
  const classIds = classes.map(c => c.id)

  const [{ data: studentCounts }, { data: activeFlags }] = await Promise.all([
    supabase
      .from('students')
      .select('class_id')
      .in('class_id', classIds),
    supabase
      .from('student_flags')
      .select('student_id, severity, students!inner(class_id)')
      .in('students.class_id', classIds)
      .eq('is_active', true),
  ])

  const result = classes.map(cls => {
    const studentCount = studentCounts?.filter(s => s.class_id === cls.id).length ?? 0

    // Deduplicate: take max severity per student_id (a student may have flags from multiple days)
    const flagsForClass = (activeFlags ?? []).filter(
      (f: { student_id: string; students: unknown; severity: number }) =>
        (f.students as { class_id: string } | null)?.class_id === cls.id
    )
    const maxPerStudent = new Map<string, number>()
    for (const f of flagsForClass as { student_id: string; severity: number }[]) {
      const cur = maxPerStudent.get(f.student_id) ?? 0
      if (f.severity > cur) maxPerStudent.set(f.student_id, f.severity)
    }
    const severities = Array.from(maxPerStudent.values())
    const redCount = severities.filter(s => s === 3).length
    const yellowCount = severities.filter(s => s <= 2).length

    return {
      ...cls,
      student_count: studentCount,
      red_count: redCount,
      yellow_count: yellowCount,
      green_count: Math.max(0, studentCount - redCount - yellowCount),
    }
  })

  return NextResponse.json({ classes: result })
}

// POST /api/classes — create new class
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body: CreateClassRequest = await request.json()
  const { name, school_name, grade, students } = body

  if (!name || !students?.length) {
    return NextResponse.json({ error: 'Thiếu tên lớp hoặc danh sách học sinh' }, { status: 400 })
  }

  // Generate unique class code
  let code = generateClassCode()
  for (let i = 0; i < 5; i++) {
    const { data: existing } = await supabase
      .from('classes').select('id').eq('code', code).single()
    if (!existing) break
    code = generateClassCode()
  }

  const { data: newClass, error: classError } = await supabase
    .from('classes')
    .insert({ teacher_id: user.id, name, code, school_name, grade })
    .select().single()

  if (classError) return NextResponse.json({ error: classError.message }, { status: 500 })

  const studentRows = students.map((s, idx) => ({
    class_id: newClass.id,
    full_name: s.full_name,
    order_number: idx + 1,
    parent_email: s.parent_email ?? null,
  }))

  const { error: studentsError } = await supabase.from('students').insert(studentRows)
  if (studentsError) {
    await supabase.from('classes').delete().eq('id', newClass.id)
    return NextResponse.json({ error: studentsError.message }, { status: 500 })
  }

  return NextResponse.json({ class: newClass }, { status: 201 })
}
