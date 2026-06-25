import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TeacherHeader from '@/components/teacher/TeacherHeader'
import DashboardClient from './DashboardClient'

export const metadata: Metadata = { title: 'Tổng quan' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Date().toISOString().split('T')[0]

  const [{ data: teacher }, { data: classes }] = await Promise.all([
    supabase.from('teachers').select('full_name').eq('id', user.id).single(),
    supabase
      .from('classes')
      .select('id, name, code, school_name, grade, is_active, created_at')
      .eq('teacher_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
  ])

  const classIds = (classes ?? []).map(c => c.id)

  const { data: studentRows } = classIds.length
    ? await supabase.from('students').select('id, class_id').in('class_id', classIds)
    : { data: [] as { id: string; class_id: string }[] }

  const allStudentIds = (studentRows ?? []).map(s => s.id)

  const [{ data: activeFlags }, { data: todayMoods }] = await Promise.all([
    allStudentIds.length
      ? supabase.from('student_flags').select('student_id, severity').in('student_id', allStudentIds).eq('is_active', true)
      : { data: [] as { student_id: string; severity: number }[] },
    allStudentIds.length
      ? supabase.from('mood_logs').select('student_id, class_id').in('student_id', allStudentIds).eq('checked_at', today).neq('mood', 0)
      : { data: [] as { student_id: string; class_id: string }[] },
  ])

  const classesList = (classes ?? []).map(c => {
    const classStudentIds = (studentRows ?? []).filter(s => s.class_id === c.id).map(s => s.id)
    const classStudentSet = new Set(classStudentIds)
    const studentCount = classStudentIds.length

    const maxPerStudent = new Map<string, number>()
    for (const f of (activeFlags ?? []).filter(f => classStudentSet.has(f.student_id))) {
      const cur = maxPerStudent.get(f.student_id) ?? 0
      if ((f.severity as number) > cur) maxPerStudent.set(f.student_id, f.severity as number)
    }
    const severities = Array.from(maxPerStudent.values())
    const redCount = severities.filter(s => s === 3).length
    const yellowCount = severities.filter(s => s <= 2).length
    const checkinCount = (todayMoods ?? []).filter(m => classStudentSet.has(m.student_id)).length

    return {
      ...c,
      teacher_id: user.id,
      student_count: studentCount,
      red_count: redCount,
      yellow_count: yellowCount,
      green_count: Math.max(0, studentCount - redCount - yellowCount),
      checkin_count_today: checkinCount,
    }
  })

  const teacherName = teacher?.full_name ?? user.email ?? 'Giáo viên'

  return (
    <div className="min-h-dvh" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <TeacherHeader
        title="ClassPulse"
        actions={
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {teacherName.split(' ').pop()}
          </span>
        }
      />

      <main className="px-4 py-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
          >
            Lớp của tôi
          </h2>
        </div>

        <DashboardClient initialClasses={classesList} />
      </main>
    </div>
  )
}
