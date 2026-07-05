import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TeacherHeader from '@/components/teacher/TeacherHeader'
import ClassDetailClient from './ClassDetailClient'
import { runRules } from '@/lib/rules'
import type { RuleInput, MoodValue, SignalValue, StudentWithHistory, Avatar } from '@/types'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ new?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('classes').select('name').eq('id', id).single()
  return { title: data?.name ?? 'Chi tiết lớp' }
}

export default async function ClassDetailPage({ params, searchParams }: Props) {
  const [{ id }, sp] = await Promise.all([params, searchParams])
  const isNewClass = sp.new === '1'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: cls } = await supabase
    .from('classes')
    .select('id, name, code, school_name, grade')
    .eq('id', id)
    .eq('teacher_id', user.id)
    .single()

  if (!cls) redirect('/dashboard')

  const today = new Date().toISOString().split('T')[0]
  const since14 = new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0]
  const since7 = new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0]

  const { data: students } = await supabase
    .from('students')
    .select('id, full_name, order_number, streak_count, last_checkin_date, avatar:avatars(*), parent_email')
    .eq('class_id', id)
    .order('order_number')

  if (!students?.length) {
    return (
      <div className="min-h-dvh" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <TeacherHeader title={cls.name} backHref="/dashboard" />
        <main className="px-4 py-6 max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center py-16 gap-3">
            <div className="text-5xl">🏫</div>
            <p
              className="font-semibold text-base"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              Lớp chưa có học sinh nào
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Mã lớp:{' '}
              <span className="font-mono font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                {cls.code}
              </span>
            </p>
          </div>
        </main>
      </div>
    )
  }

  const studentIds = students.map(s => s.id)

  const [{ data: moodLogs }, { data: signals }, { data: flags }] = await Promise.all([
    supabase
      .from('mood_logs')
      .select('student_id, mood, checked_at')
      .eq('class_id', id)
      .gte('checked_at', since14)
      .order('checked_at', { ascending: false }),
    supabase
      .from('teacher_signals')
      .select('student_id, signal, created_at')
      .in('student_id', studentIds)
      .gte('created_at', since7)
      .order('created_at', { ascending: false }),
    supabase
      .from('student_flags')
      .select('id, student_id, rule_triggered, severity, reason, is_active, triggered_at')
      .in('student_id', studentIds)
      .eq('is_active', true),
  ])

  const schoolDaysLast7 = countSchoolDays(since7, today)

  const last7Dates: string[] = []
  for (let i = 6; i >= 0; i--) {
    last7Dates.push(new Date(Date.now() - i * 86400000).toISOString().split('T')[0])
  }

  const result: StudentWithHistory[] = students.map(student => {
    const studentMoods = (moodLogs ?? [])
      .filter(l => l.student_id === student.id)
      .map(l => ({ date: l.checked_at as string, mood: l.mood as MoodValue }))

    const activeDates = studentMoods
      .filter(l => l.mood >= 1 && l.mood <= 3 && l.date >= since7)
      .map(l => l.date)

    const skipDates = studentMoods
      .filter(l => l.mood === 0 && l.date >= since7)
      .map(l => l.date)

    const studentSignals = (signals ?? [])
      .filter(s => s.student_id === student.id)
      .map(s => ({ date: s.created_at.split('T')[0] as string, signal: s.signal as SignalValue }))

    const ruleInput: RuleInput = {
      studentId: student.id,
      moodLogs: studentMoods,
      teacherSignals: studentSignals,
      activeMoodDates: activeDates,
      skipDates,
      schoolDaysLast7,
      streakCount: student.streak_count,
    }

    const { flags: ruleFlags, overall_status } = runRules(ruleInput)
    const activeFlag = (flags ?? []).find(f => f.student_id === student.id)
    const todayMoodEntry = studentMoods.find(l => l.date.split('T')[0] === today)

    const moodByDate = new Map(studentMoods.map(l => [l.date.split('T')[0], l.mood]))
    const mood_history = last7Dates.map(date => ({ date, mood: moodByDate.get(date) ?? null }))

    return {
      id: student.id,
      class_id: id,
      full_name: student.full_name,
      order_number: student.order_number,
      avatar_id: (student.avatar as unknown as { id: number } | null)?.id ?? null,
      parent_email: student.parent_email,
      streak_count: student.streak_count,
      last_checkin_date: student.last_checkin_date,
      created_at: '',
      avatar: student.avatar as unknown as StudentWithHistory['avatar'],
      today_mood: todayMoodEntry?.mood ?? null,
      flag_severity: (activeFlag?.severity as StudentWithHistory['flag_severity']) ?? null,
      flag_reason: activeFlag?.reason ?? null,
      flags: ruleFlags,
      overall_status,
      mood_history,
      teacher_signals: (signals ?? [])
        .filter(s => s.student_id === student.id)
        .map(s => ({
          id: '',
          student_id: s.student_id,
          teacher_id: user.id,
          signal: s.signal as SignalValue,
          note: null,
          created_at: s.created_at,
        })),
    }
  })

  // Fetch avatars only for new-class setup
  let setupAvatars: Avatar[] | undefined
  if (isNewClass) {
    const { data: avatars } = await supabase.from('avatars').select('*').order('id')
    setupAvatars = (avatars ?? []) as Avatar[]
  }

  // Students in base Student shape for avatar selection
  const baseStudents = result.map(s => ({
    id: s.id,
    class_id: s.class_id,
    full_name: s.full_name,
    order_number: s.order_number,
    avatar_id: s.avatar_id,
    parent_email: s.parent_email,
    streak_count: s.streak_count,
    last_checkin_date: s.last_checkin_date,
    created_at: s.created_at,
  }))

  return (
    <div className="min-h-dvh" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <TeacherHeader
        title={cls.name}
        backHref="/dashboard"
        actions={
          cls.school_name ? (
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {cls.school_name}
            </span>
          ) : undefined
        }
      />

      <main className="px-4 py-6 max-w-2xl mx-auto">
        <ClassDetailClient
          cls={cls}
          students={result}
          setupAvatars={setupAvatars}
          baseStudents={baseStudents}
        />
      </main>
    </div>
  )
}

function countSchoolDays(from: string, to: string): number {
  let count = 0
  const d = new Date(from)
  const end = new Date(to)
  while (d <= end) {
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) count++
    d.setDate(d.getDate() + 1)
  }
  return count
}
