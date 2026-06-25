import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import type { MoodValue, MoodSummary } from '@/types'

export const metadata: Metadata = { title: 'Báo cáo tuần học' }

interface Props {
  params: Promise<{ token: string }>
}

type StoredSummary = MoodSummary & { days: { date: string; mood: MoodValue | null }[] }

const MOOD_EMOJI: Record<number, string> = { 1: '😊', 2: '😐', 3: '🙁', 0: '⬜' }
const MOOD_LABEL: Record<number, string> = { 1: 'Vui', 2: 'Bình thường', 3: 'Hơi buồn', 0: 'Bỏ qua' }
const MOOD_BG: Record<number, string> = {
  1: 'var(--color-mood-happy)',
  2: 'var(--color-mood-neutral)',
  3: 'var(--color-mood-sad)',
  0: 'var(--color-bg-secondary)',
}
const DOW = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

function fmt(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default async function ReportPage({ params }: Props) {
  const { token } = await params
  const supabase = createServiceClient()

  const { data: report } = await supabase
    .from('weekly_reports')
    .select('id, student_id, week_start, mood_summary, expires_at')
    .eq('token', token)
    .single()

  if (!report) notFound()

  const isExpired = new Date(report.expires_at) < new Date()
  if (isExpired) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="max-w-sm w-full text-center flex flex-col gap-4">
          <div className="text-5xl">⏰</div>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
            Báo cáo đã hết hạn
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Link báo cáo này đã quá 30 ngày. Báo cáo tuần mới sẽ được gửi vào thứ Hai hàng tuần.
          </p>
        </div>
      </div>
    )
  }

  const { data: student } = await supabase
    .from('students')
    .select('full_name, class_id, avatar:avatars(emoji, color), class:classes(name)')
    .eq('id', report.student_id)
    .single()

  if (!student) notFound()

  const avatar = student.avatar as unknown as { emoji: string; color: string } | null
  const cls = student.class as unknown as { name: string } | null
  const summary = report.mood_summary as StoredSummary
  const days = summary.days ?? []

  const firstName = student.full_name.split(' ').pop() ?? student.full_name
  const weekEnd = new Date(report.week_start + 'T12:00:00')
  weekEnd.setDate(weekEnd.getDate() + 6)
  const weekLabel = `${fmt(report.week_start)} – ${fmt(weekEnd.toISOString().split('T')[0])}`

  const warmMessage = getWarmMessage(firstName, summary)

  return (
    <div
      className="min-h-dvh px-4 py-8"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="max-w-sm mx-auto flex flex-col gap-5">

        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
            CLASSPULSE
          </p>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-5xl mx-auto mb-3"
            style={{ backgroundColor: avatar?.color ?? '#A29BFE' }}
          >
            {avatar?.emoji ?? '⭐'}
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
          >
            {student.full_name}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {cls?.name ?? 'Lớp'} · Tuần {weekLabel}
          </p>
        </div>

        {isExpired && (
          <div
            className="rounded-2xl p-4 text-center text-sm"
            style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)' }}
          >
            ⏰ Báo cáo này đã hết hạn (sau 30 ngày)
          </div>
        )}

        {/* 7-day mood grid */}
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
        >
          <p
            className="text-xs font-semibold mb-3"
            style={{ color: 'var(--color-text-muted)' }}
          >
            CẢM XÚC 7 NGÀY
          </p>
          <div className="flex gap-1.5">
            {days.map(({ date, mood }) => {
              const d = new Date(date + 'T12:00:00')
              const isWeekend = d.getDay() === 0 || d.getDay() === 6
              return (
                <div key={date} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full aspect-square rounded-xl flex items-center justify-center text-lg"
                    style={{
                      backgroundColor: mood !== null ? (MOOD_BG[mood] ?? 'var(--color-border)') : 'var(--color-border)',
                      opacity: isWeekend ? 0.35 : mood !== null ? 1 : 0.4,
                    }}
                    title={mood !== null ? MOOD_LABEL[mood] : isWeekend ? 'Cuối tuần' : 'Vắng'}
                  >
                    {mood !== null ? (MOOD_EMOJI[mood] ?? '–') : isWeekend ? '' : '➖'}
                  </div>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {DOW[d.getDay()]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Summary stats */}
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
        >
          <p
            className="text-xs font-semibold mb-3"
            style={{ color: 'var(--color-text-muted)' }}
          >
            TỔNG KẾT TUẦN
          </p>
          <div className="grid grid-cols-4 gap-2">
            {([
              { emoji: '😊', label: 'Vui', count: summary.happy },
              { emoji: '😐', label: 'Ổn', count: summary.neutral },
              { emoji: '🙁', label: 'Buồn', count: summary.sad },
              { emoji: '➖', label: 'Vắng', count: summary.missing },
            ] as const).map(item => (
              <div key={item.label} className="text-center">
                <div className="text-2xl">{item.emoji}</div>
                <div
                  className="text-xl font-bold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {item.count}
                </div>
                <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warm message */}
        <div
          className="rounded-2xl p-4 text-sm leading-relaxed"
          style={{
            backgroundColor: '#FFF9E6',
            borderLeft: '4px solid var(--color-status-yellow)',
            color: 'var(--color-text-primary)',
          }}
        >
          <p className="font-semibold mb-1" style={{ color: '#B7791F' }}>
            💌 Tin nhắn từ giáo viên
          </p>
          {warmMessage}
        </div>

        {/* Footer */}
        <p
          className="text-center text-xs pb-4"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Được tạo bởi ClassPulse · Báo cáo hết hạn sau 30 ngày
        </p>
      </div>
    </div>
  )
}

function getWarmMessage(firstName: string, s: MoodSummary): string {
  if (s.sad >= 3) {
    return `Có vẻ ${firstName} đang trải qua một tuần khó khăn hơn bình thường. Hãy dành chút thời gian hỏi thăm và lắng nghe con nhé — đôi khi chỉ cần được nghe là con đã cảm thấy tốt hơn rất nhiều 💛`
  }
  if (s.sad >= 1) {
    return `${firstName} có vài ngày hơi buồn trong tuần — điều này rất bình thường với trẻ em. Một cuộc trò chuyện nhỏ về ngày học của con sẽ giúp ích rất nhiều 💙`
  }
  if (s.missing >= 3) {
    return `Có ${s.missing} ngày chưa điểm danh trong tuần — có thể con vắng học hoặc chưa thực hiện. Nhắc nhở nhẹ nhàng để con tham gia đầy đủ hơn nhé 📋`
  }
  if (s.happy >= 3) {
    return `${firstName} có một tuần học thật vui vẻ! Hãy hỏi con về điều gì làm con vui nhất tuần này — những khoảnh khắc đó xứng đáng được ghi nhớ 🌟`
  }
  return `${firstName} có một tuần học ổn định. Cảm ơn bạn đã luôn đồng hành cùng con trong hành trình học tập 💙`
}
