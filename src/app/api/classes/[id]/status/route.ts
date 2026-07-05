import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runRules } from '@/lib/rules'
import type { RuleInput, MoodValue, SignalValue, StudentWithStatus, StudentWithHistory } from '@/types'

// GET /api/classes/[id]/status
// Fetch toàn bộ students + run rule engine cho từng bé
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify class belongs to teacher
  const { data: cls } = await supabase
    .from('classes')
    .select('id, name, code, school_name, grade')
    .eq('id', id)
    .eq('teacher_id', user.id)
    .single()

  if (!cls) return NextResponse.json({ error: 'Không tìm thấy lớp' }, { status: 404 })

  const today = new Date().toISOString().split('T')[0]
  const since14 = new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0]
  const since7 = new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0]

  // Batch 1: students + mood logs (don't need student IDs yet)
  const [{ data: students }, { data: moodLogs }] = await Promise.all([
    supabase
      .from('students')
      .select('id, full_name, order_number, streak_count, last_checkin_date, avatar:avatars(*), parent_email')
      .eq('class_id', id)
      .order('order_number'),
    supabase
      .from('mood_logs')
      .select('student_id, mood, checked_at')
      .eq('class_id', id)
      .gte('checked_at', since14)
      .order('checked_at', { ascending: false }),
  ])

  if (!students?.length) {
    return NextResponse.json({ class: cls, students: [], today })
  }

  const studentIds = students.map(s => s.id)

  // Batch 2: signals + flags (need student IDs)
  const [{ data: signals }, { data: flags }] = await Promise.all([
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

  // Compute school days in last 7 (Mon-Fri only)
  const schoolDaysLast7 = countSchoolDays(since7, today)

  // Build 7-day date array (oldest → newest)
  const last7Dates: string[] = []
  for (let i = 6; i >= 0; i--) {
    last7Dates.push(new Date(Date.now() - i * 86400000).toISOString().split('T')[0])
  }

  // Build per-student result
  const overallSeverityByStudent = new Map<string, number>()
  const result: StudentWithHistory[] = students.map(student => {
    const studentMoods = (moodLogs ?? [])
      .filter(l => l.student_id === student.id)
      .map(l => ({ date: l.checked_at as string, mood: l.mood as MoodValue }))

    const activeDates = studentMoods
      .filter(l => l.mood >= 1 && l.mood <= 3)
      .filter(l => l.date >= since7)
      .map(l => l.date)

    const skipDates = studentMoods
      .filter(l => l.mood === 0)
      .filter(l => l.date >= since7)
      .map(l => l.date)

    const studentSignals = (signals ?? [])
      .filter(s => s.student_id === student.id)
      .map(s => ({
        date: s.created_at.split('T')[0] as string,
        signal: s.signal as SignalValue,
      }))

    const ruleInput: RuleInput = {
      studentId: student.id,
      moodLogs: studentMoods,
      teacherSignals: studentSignals,
      activeMoodDates: activeDates,
      skipDates,
      schoolDaysLast7,
      streakCount: student.streak_count,
    }

    const { flags: ruleFlags, overall_status, overall_severity } = runRules(ruleInput)
    overallSeverityByStudent.set(student.id, overall_severity)

    const activeFlag = (flags ?? []).find(f => f.student_id === student.id)
    const todayMoodEntry = studentMoods.find(l => l.date === today)

    const moodByDate = new Map(studentMoods.map(l => [l.date.split('T')[0], l.mood]))
    const mood_history = last7Dates.map(date => ({
      date,
      mood: moodByDate.get(date) ?? null,
    }))

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
      avatar: student.avatar as unknown as StudentWithStatus['avatar'],
      today_mood: todayMoodEntry?.mood ?? null,
      flag_severity: (activeFlag?.severity as StudentWithStatus['flag_severity']) ?? null,
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

  // Persist updated flags (upsert) — async, không block response
  persistFlags(id, result as StudentWithStatus[], overallSeverityByStudent, supabase).catch(() => {})

  const checkinCountToday = result.filter(s => s.today_mood !== null).length

  return NextResponse.json({
    class: cls,
    students: result,
    today,
    checkin_count_today: checkinCountToday,
    school_days_last7: schoolDaysLast7,
  })
}

// Upsert flags vào DB sau khi tính xong
async function persistFlags(
  classId: string,
  students: StudentWithStatus[],
  overallSeverityByStudent: Map<string, number>,
  supabase: Awaited<ReturnType<typeof import('@/lib/supabase/server').createClient>>
) {
  const today = new Date().toISOString().split('T')[0]

  for (const student of students) {
    const triggeredFlags = student.flags.filter(f => f.triggered)

    const now = new Date().toISOString()

    if (triggeredFlags.length === 0) {
      await supabase
        .from('student_flags')
        .update({ is_active: false, resolved_at: now })
        .eq('student_id', student.id)
        .eq('is_active', true)
      continue
    }

    // Resolve flags từ ngày khác trước khi upsert ngày hôm nay
    await supabase
      .from('student_flags')
      .update({ is_active: false, resolved_at: now })
      .eq('student_id', student.id)
      .eq('is_active', true)
      .neq('triggered_at', today)

    // Lưu severity đã escalate (khớp với overall_status), giữ đúng severity 1 khi không escalate
    const escalatedSeverity = overallSeverityByStudent.get(student.id) ?? 1
    const top = triggeredFlags.reduce((a, b) => a.severity >= b.severity ? a : b)
    await supabase
      .from('student_flags')
      .upsert(
        {
          student_id: student.id,
          rule_triggered: top.rule,
          severity: escalatedSeverity,
          reason: top.reason,
          is_active: true,
          triggered_at: today,
        },
        { onConflict: 'student_id,triggered_at' }
      )
  }
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
