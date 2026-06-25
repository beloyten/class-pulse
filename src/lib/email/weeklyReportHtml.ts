import type { MoodValue, MoodSummary } from '@/types'

interface Params {
  studentName: string
  avatarEmoji: string
  avatarColor: string
  className: string
  weekStart: string   // YYYY-MM-DD
  weekEnd: string     // YYYY-MM-DD
  summary: MoodSummary
  days: { date: string; mood: MoodValue | null }[]
  reportUrl: string
}

const MOOD_EMOJI: Record<number, string> = { 1: '😊', 2: '😐', 3: '🙁', 0: '⬜' }
const MOOD_COLOR: Record<number, string> = {
  1: '#FFD93D',   // happy
  2: '#74B9FF',   // neutral
  3: '#A29BFE',   // sad
  0: '#e9ecef',   // skip
}
const DOW_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function fmt(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

function dow(dateStr: string) {
  return DOW_VI[new Date(dateStr + 'T12:00:00').getDay()]
}

function warmMessage(name: string, summary: MoodSummary): string {
  const firstName = escapeHtml(name.split(' ').pop() ?? name)
  if (summary.sad >= 3) {
    return `Có vẻ ${firstName} đang có một tuần khó khăn hơn bình thường. Hãy hỏi thăm con nhé 💛`
  }
  if (summary.sad >= 1) {
    return `${firstName} có vài ngày hơi buồn trong tuần — điều bình thường với trẻ em. Một cuộc trò chuyện nhỏ sẽ giúp con nhiều 💙`
  }
  if (summary.missing >= 3) {
    return `Có ${summary.missing} ngày chưa điểm danh trong tuần — có thể con vắng học hoặc chưa thực hiện 📋`
  }
  return `${firstName} có một tuần học vui vẻ! Cảm ơn bạn đã đồng hành cùng con 🌟`
}

export function weeklyReportHtml(p: Params): string {
  const firstName = escapeHtml(p.studentName.split(' ').pop() ?? p.studentName)
  const safeClassName = escapeHtml(p.className)
  const weekLabel = `${fmt(p.weekStart)} – ${fmt(p.weekEnd)}/${new Date(p.weekEnd + 'T12:00:00').getFullYear()}`
  const message = warmMessage(p.studentName, p.summary)

  const dayCircles = p.days.map(d => {
    const m = d.mood
    const bg = m !== null ? (MOOD_COLOR[m] ?? '#e9ecef') : '#e9ecef'
    const em = m !== null ? (MOOD_EMOJI[m] ?? '–') : '–'
    return `
      <td style="text-align:center;padding:4px 2px;">
        <div style="width:40px;height:40px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;font-size:20px;margin:0 auto;">${em}</div>
        <div style="font-size:11px;color:#999;margin-top:4px;">${dow(d.date)}</div>
      </td>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f9fa;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa;padding:32px 16px;">
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.07);">

        <!-- Header -->
        <tr>
          <td style="background:#6C63FF;padding:24px 28px;text-align:center;">
            <p style="margin:0;color:#fff;font-size:13px;opacity:0.85;letter-spacing:0.5px;">CLASSPULSE</p>
            <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:700;">Báo cáo tuần của ${firstName} 💌</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">${weekLabel} · ${safeClassName}</p>
          </td>
        </tr>

        <!-- Avatar + name -->
        <tr>
          <td style="padding:24px 28px 0;text-align:center;">
            <div style="width:72px;height:72px;border-radius:50%;background:${p.avatarColor};display:inline-flex;align-items:center;justify-content:center;font-size:40px;margin-bottom:12px;">${p.avatarEmoji}</div>
          </td>
        </tr>

        <!-- 7-day mood row -->
        <tr>
          <td style="padding:8px 20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>${dayCircles}</tr>
            </table>
          </td>
        </tr>

        <!-- Summary stats -->
        <tr>
          <td style="padding:0 28px 24px;">
            <table width="100%" cellpadding="12" cellspacing="0" style="background:#f8f9fa;border-radius:14px;">
              <tr>
                <td style="text-align:center;border-right:1px solid #e9ecef;">
                  <div style="font-size:22px;">😊</div>
                  <div style="font-size:20px;font-weight:700;color:#2d3436;">${p.summary.happy}</div>
                  <div style="font-size:11px;color:#999;">Vui</div>
                </td>
                <td style="text-align:center;border-right:1px solid #e9ecef;">
                  <div style="font-size:22px;">😐</div>
                  <div style="font-size:20px;font-weight:700;color:#2d3436;">${p.summary.neutral}</div>
                  <div style="font-size:11px;color:#999;">Bình thường</div>
                </td>
                <td style="text-align:center;border-right:1px solid #e9ecef;">
                  <div style="font-size:22px;">🙁</div>
                  <div style="font-size:20px;font-weight:700;color:#2d3436;">${p.summary.sad}</div>
                  <div style="font-size:11px;color:#999;">Buồn</div>
                </td>
                <td style="text-align:center;">
                  <div style="font-size:22px;">➖</div>
                  <div style="font-size:20px;font-weight:700;color:#2d3436;">${p.summary.missing}</div>
                  <div style="font-size:11px;color:#999;">Vắng</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Warm message -->
        <tr>
          <td style="padding:0 28px 24px;">
            <div style="background:#FFF9E6;border-left:4px solid #FDCB6E;border-radius:0 12px 12px 0;padding:14px 16px;font-size:14px;color:#2d3436;line-height:1.6;">
              ${message}
            </div>
          </td>
        </tr>

        <!-- CTA button -->
        <tr>
          <td style="padding:0 28px 32px;text-align:center;">
            <a href="${p.reportUrl}" style="display:inline-block;background:#6C63FF;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:600;">
              Xem báo cáo đầy đủ →
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8f9fa;padding:16px 28px;text-align:center;border-top:1px solid #e9ecef;">
            <p style="margin:0;font-size:12px;color:#999;">
              Email này được gửi tự động từ ClassPulse mỗi tuần.<br>
              Nếu bạn không muốn nhận, hãy liên hệ giáo viên của con.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
