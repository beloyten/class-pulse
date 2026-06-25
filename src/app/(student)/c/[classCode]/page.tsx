import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import CheckinFlow from '@/components/student/CheckinFlow'
import type { StudentForCheckin } from '@/types'

interface Props {
  params: Promise<{ classCode: string }>
}

export default async function CheckinPage({ params }: Props) {
  const { classCode } = await params
  const supabase = createServiceClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: cls } = await supabase
    .from('classes')
    .select('id, name, code')
    .eq('code', classCode.toUpperCase())
    .eq('is_active', true)
    .single()

  if (!cls) notFound()

  const [{ data: studentsData }, { data: todayLogs }] = await Promise.all([
    supabase
      .from('students')
      .select('id, full_name, streak_count, avatar:avatars(id, name, emoji, color, svg_path, category)')
      .eq('class_id', cls.id)
      .order('order_number'),
    supabase
      .from('mood_logs')
      .select('student_id')
      .eq('class_id', cls.id)
      .eq('checked_at', today),
  ])

  const doneSet = new Set((todayLogs ?? []).map(l => l.student_id))

  const students: StudentForCheckin[] = (studentsData ?? []).map(s => ({
    id: s.id,
    full_name: s.full_name,
    streak_count: s.streak_count,
    avatar: (s.avatar as unknown as StudentForCheckin['avatar']) ?? null,
  }))

  const initialDoneIds = new Set<string>(
    (studentsData ?? []).filter(s => doneSet.has(s.id)).map(s => s.id)
  )

  return (
    <CheckinFlow
      classCode={cls.code}
      className={cls.name}
      students={students}
      initialDoneIds={initialDoneIds}
      today={today}
    />
  )
}

export async function generateMetadata({ params }: Props) {
  const { classCode } = await params
  return {
    title: `Điểm danh — ${classCode.toUpperCase()} | ClassPulse`,
  }
}
