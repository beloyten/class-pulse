import type { RuleInput, RuleResult } from '@/types'
import { getRecentMoods } from './index'

export function mixedSignal(input: RuleInput): RuleResult {
  const { teacherSignals, skipDates } = input
  const recent = getRecentMoods(input, 7)

  if (teacherSignals.length === 0) {
    return { rule: 'mixed_signal', triggered: false, severity: 2, reason: '' }
  }

  // 3 signals gần nhất (teacherSignals đã được filter 7 ngày từ API)
  const recentSignals = [...teacherSignals]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  if (recentSignals.length === 0) {
    return { rule: 'mixed_signal', triggered: false, severity: 2, reason: '' }
  }

  const sorted = [...recent].sort((a, b) => b.date.localeCompare(a.date))
  const recentDates = sorted.slice(0, 3).map(d => d.date)
  const maxSignal = Math.max(...recentSignals.map(s => s.signal))
  const todayMood = sorted[0]?.mood

  // Student sad hôm nay + teacher yellow/red
  if (todayMood === 3 && maxSignal >= 2) {
    const severity = maxSignal === 3 ? 3 : 2
    return {
      rule: 'mixed_signal',
      triggered: true,
      severity,
      reason: maxSignal === 3
        ? 'Nhiều tín hiệu cùng lúc — cần quan tâm sớm'
        : 'Học sinh chọn 🙁 + Giáo viên cũng nhận thấy bất thường',
    }
  }

  // Mood ≥ 2 liên tiếp 3+ ngày gần nhất + teacher red
  let consecutiveNegative = 0
  for (const d of sorted) {
    if (d.mood >= 2) consecutiveNegative++
    else break
  }
  if (consecutiveNegative >= 3 && maxSignal === 3) {
    return {
      rule: 'mixed_signal',
      triggered: true,
      severity: 3,
      reason: 'Nhiều tín hiệu cùng lúc — cần quan tâm sớm',
    }
  }

  // Skip nhiều ngày + teacher yellow/red
  const recentSkips = skipDates.filter(d => recentDates.includes(d)).length
  if (recentSkips >= 2 && maxSignal >= 2) {
    return {
      rule: 'mixed_signal',
      triggered: true,
      severity: 2,
      reason: 'Bỏ qua nhiều ngày + Giáo viên đã mark bất thường',
    }
  }

  return { rule: 'mixed_signal', triggered: false, severity: 2, reason: '' }
}
