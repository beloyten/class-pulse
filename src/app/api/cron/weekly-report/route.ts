import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/server'
import { weeklyReportHtml } from '@/lib/email/weeklyReportHtml'
import type { MoodValue, MoodSummary } from '@/types'

export const runtime = 'nodejs'
export const maxDuration = 60

type StoredSummary = MoodSummary & { days: { date: string; mood: MoodValue | null }[] }

// GET /api/cron/weekly-report
// Called by Vercel Cron every Monday 01:00 UTC (= 08:00 UTC+7)
// Vercel Cron sends GET requests, not POST
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const resend = new Resend(process.env.RESEND_API_KEY)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'ClassPulse <noreply@classpulse.app>'

  const { weekStartStr, weekEndStr, weekDates } = getPreviousWeek()

  // All students with a parent email
  const { data: students, error: studentsErr } = await supabase
    .from('students')
    .select('id, full_name, parent_email, class_id, avatar:avatars(emoji, color), class:classes(name)')
    .not('parent_email', 'is', null)

  if (studentsErr) {
    return NextResponse.json({ error: studentsErr.message }, { status: 500 })
  }
  if (!students?.length) {
    return NextResponse.json({ processed: 0, sent: 0, week: weekStartStr })
  }

  const studentIds = students.map(s => s.id)

  const { data: moodLogs } = await supabase
    .from('mood_logs')
    .select('student_id, mood, checked_at')
    .in('student_id', studentIds)
    .gte('checked_at', weekStartStr)
    .lte('checked_at', weekEndStr)

  let processed = 0, sent = 0, failed = 0

  for (const student of students) {
    const logsForStudent = (moodLogs ?? []).filter(l => l.student_id === student.id)
    const moodByDate = new Map(logsForStudent.map(l => [l.checked_at as string, l.mood as MoodValue]))

    const days = weekDates.map(date => ({ date, mood: moodByDate.get(date) ?? null }))
    const summary = computeSummary(days)
    const stored: StoredSummary = { ...summary, days }

    // Check for existing report (avoid regenerating token)
    const { data: existing } = await supabase
      .from('weekly_reports')
      .select('id, token, sent_at')
      .eq('student_id', student.id)
      .eq('week_start', weekStartStr)
      .maybeSingle()

    let reportToken: string
    let reportId: string

    if (existing) {
      reportToken = existing.token
      reportId = existing.id
      // Update mood_summary in case check-ins came in after first generation
      await supabase
        .from('weekly_reports')
        .update({ mood_summary: stored })
        .eq('id', existing.id)
    } else {
      const token = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      const { data: newReport, error: insertErr } = await supabase
        .from('weekly_reports')
        .insert({
          student_id: student.id,
          week_start: weekStartStr,
          mood_summary: stored,
          token,
          expires_at: expiresAt,
        })
        .select('id, token')
        .single()

      if (insertErr || !newReport) {
        failed++
        continue
      }
      reportToken = newReport.token
      reportId = newReport.id
    }

    processed++

    // Skip if already emailed this week
    if (existing?.sent_at) continue

    const avatar = student.avatar as unknown as { emoji: string; color: string } | null
    const cls = student.class as unknown as { name: string } | null

    const html = weeklyReportHtml({
      studentName: student.full_name,
      avatarEmoji: avatar?.emoji ?? '⭐',
      avatarColor: avatar?.color ?? '#A29BFE',
      className: cls?.name ?? 'Lớp',
      weekStart: weekStartStr,
      weekEnd: weekEndStr,
      summary,
      days,
      reportUrl: `${appUrl}/report/${reportToken}`,
    })

    const firstName = student.full_name.split(' ').pop() ?? student.full_name
    const { error: emailErr } = await resend.emails.send({
      from: fromEmail,
      to: student.parent_email!,
      subject: `Báo cáo tuần của ${firstName} 💙`,
      html,
    })

    if (!emailErr) {
      await supabase
        .from('weekly_reports')
        .update({ sent_at: new Date().toISOString() })
        .eq('id', reportId)
      sent++
    } else {
      failed++
    }
  }

  return NextResponse.json({ processed, sent, failed, week: weekStartStr })
}

function getPreviousWeek() {
  const now = new Date()
  const dow = now.getUTCDay() // 0=Sun, 1=Mon ... 6=Sat
  // Days since last Monday (even if today IS Monday, go back 7 more to get previous Monday)
  const daysSinceMonday = dow === 0 ? 6 : dow - 1
  const weekStart = new Date(now)
  weekStart.setUTCDate(now.getUTCDate() - daysSinceMonday - 7)
  weekStart.setUTCHours(0, 0, 0, 0)

  const weekEnd = new Date(weekStart)
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6)

  const weekDates: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart)
    d.setUTCDate(weekStart.getUTCDate() + i)
    weekDates.push(d.toISOString().split('T')[0])
  }

  return {
    weekStartStr: weekStart.toISOString().split('T')[0],
    weekEndStr: weekEnd.toISOString().split('T')[0],
    weekDates,
  }
}

function computeSummary(days: { date: string; mood: MoodValue | null }[]): MoodSummary {
  const summary: MoodSummary = { happy: 0, neutral: 0, sad: 0, skip: 0, missing: 0 }
  for (const d of days) {
    const dow = new Date(d.date + 'T12:00:00').getDay()
    if (dow === 0 || dow === 6) continue  // skip weekends
    if (d.mood === 1) summary.happy++
    else if (d.mood === 2) summary.neutral++
    else if (d.mood === 3) summary.sad++
    else if (d.mood === 0) summary.skip++
    else summary.missing++
  }
  return summary
}
