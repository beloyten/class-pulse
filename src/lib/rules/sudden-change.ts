import type { RuleInput, RuleResult } from '@/types'
import { getRecentMoods } from './index'

export function suddenChange(input: RuleInput): RuleResult {
  const recent = getRecentMoods(input, 5)

  if (recent.length < 2) {
    return { rule: 'sudden_change', triggered: false, severity: 1, reason: '' }
  }

  const today = recent[recent.length - 1]
  const yesterday = recent[recent.length - 2]

  if (today.mood !== 3) {
    return { rule: 'sudden_change', triggered: false, severity: 1, reason: '' }
  }

  // Hôm qua vui → hôm nay buồn đột ngột
  if (yesterday.mood === 1) {
    return {
      rule: 'sudden_change',
      triggered: true,
      severity: 2,
      reason: 'Mood giảm đột ngột hôm nay (vui → buồn)',
    }
  }

  // Trung bình 3 ngày trước rất vui → hôm nay buồn
  const before = recent.slice(0, -1)
  if (before.length >= 2) {
    const avg = before.reduce((s, d) => s + d.mood, 0) / before.length
    if (avg < 1.5) {
      return {
        rule: 'sudden_change',
        triggered: true,
        severity: 3,
        reason: 'Thay đổi lớn so với xu hướng tuần qua',
      }
    }
  }

  return { rule: 'sudden_change', triggered: false, severity: 1, reason: '' }
}
