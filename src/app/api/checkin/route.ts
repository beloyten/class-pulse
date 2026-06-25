import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { CheckinRequest } from '@/types'

// GET /api/checkin?classCode=AB12CD
// Public — không cần auth. Trả về class + students + avatar + today checkin status.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const classCode = searchParams.get('classCode')?.toUpperCase()

  if (!classCode) {
    return NextResponse.json({ error: 'Thiếu mã lớp' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: cls } = await supabase
    .from('classes')
    .select('id, name, code')
    .eq('code', classCode)
    .eq('is_active', true)
    .single()

  if (!cls) {
    return NextResponse.json({ error: 'Không tìm thấy lớp' }, { status: 404 })
  }

  const today = new Date().toISOString().split('T')[0]

  const { data: students } = await supabase
    .from('students')
    .select(`
      id, full_name, order_number, streak_count, last_checkin_date,
      avatar:avatars(id, name, emoji, color, svg_path, category)
    `)
    .eq('class_id', cls.id)
    .order('order_number')

  const { data: todayLogs } = await supabase
    .from('mood_logs')
    .select('student_id, mood')
    .eq('class_id', cls.id)
    .eq('checked_at', today)

  const doneSet = new Set(todayLogs?.map(l => l.student_id) ?? [])

  return NextResponse.json({
    class: cls,
    students: (students ?? []).map(s => ({
      ...s,
      done_today: doneSet.has(s.id),
    })),
    today,
  })
}

// POST /api/checkin
// Public — không cần auth.
export async function POST(request: Request) {
  const body: CheckinRequest = await request.json()
  const { classCode, studentId, mood } = body

  if (!classCode || !studentId || mood === undefined) {
    return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 })
  }
  if (mood < 0 || mood > 3) {
    return NextResponse.json({ error: 'Mood không hợp lệ' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const today = new Date().toISOString().split('T')[0]

  // Verify student belongs to this class
  const { data: student } = await supabase
    .from('students')
    .select('id, class_id, streak_count, last_checkin_date, classes!inner(code, is_active)')
    .eq('id', studentId)
    .single()

  if (!student) {
    return NextResponse.json({ error: 'Không tìm thấy học sinh' }, { status: 404 })
  }

  const cls = (student as unknown as { classes: { code: string; is_active: boolean } | null }).classes
  if (!cls || cls.code !== classCode.toUpperCase() || !cls.is_active) {
    return NextResponse.json({ error: 'Không hợp lệ' }, { status: 403 })
  }

  // Upsert mood log
  const { error: logError } = await supabase
    .from('mood_logs')
    .upsert(
      { student_id: studentId, class_id: student.class_id, mood, checked_at: today },
      { onConflict: 'student_id,checked_at' }
    )

  if (logError) {
    return NextResponse.json({ error: logError.message }, { status: 500 })
  }

  // Tính streak mới
  const newStreak = calculateStreak(
    student.streak_count,
    student.last_checkin_date,
    today
  )

  const isNewStreak = newStreak > student.streak_count

  // Update streak (chỉ nếu chưa điểm danh hôm nay)
  if (student.last_checkin_date !== today) {
    await supabase
      .from('students')
      .update({ streak_count: newStreak, last_checkin_date: today })
      .eq('id', studentId)
  }

  return NextResponse.json({ success: true, streakCount: newStreak, isNewStreak })
}

function calculateStreak(currentStreak: number, lastDate: string | null, today: string): number {
  if (!lastDate) return 1

  const last = new Date(lastDate)
  const now = new Date(today)
  const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return currentStreak       // Đã điểm danh hôm nay rồi
  if (diffDays <= 3) return currentStreak + 1    // 1-3 ngày = cuối tuần ok
  return 1                                        // gap > 3 ngày = reset
}
