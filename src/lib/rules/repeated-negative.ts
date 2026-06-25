import type { RuleInput, RuleResult } from '@/types'
import { getRecentMoods } from './index'

export function repeatedNegative(input: RuleInput): RuleResult {
  const recent = getRecentMoods(input, 7)
  if (recent.length < 2) {
    return { rule: 'repeated_negative', triggered: false, severity: 1, reason: '' }
  }

  // Đếm chuỗi mood=3 liên tiếp ở cuối
  let consecutiveSad = 0
  for (let i = recent.length - 1; i >= 0; i--) {
    if (recent[i].mood === 3) consecutiveSad++
    else break
  }

  if (consecutiveSad >= 3) {
    return {
      rule: 'repeated_negative',
      triggered: true,
      severity: 3,
      reason: `Chọn 🙁 ${consecutiveSad} ngày liên tiếp — cần quan tâm`,
    }
  }
  if (consecutiveSad >= 2) {
    return {
      rule: 'repeated_negative',
      triggered: true,
      severity: 2,
      reason: 'Chọn 🙁 2 ngày liên tiếp',
    }
  }

  // Mood ≥ 2 (neutral hoặc sad) liên tiếp ≥ 4 ngày
  let consecutiveNegative = 0
  for (let i = recent.length - 1; i >= 0; i--) {
    if (recent[i].mood >= 2) consecutiveNegative++
    else break
  }

  if (consecutiveNegative >= 4) {
    return {
      rule: 'repeated_negative',
      triggered: true,
      severity: 2,
      reason: 'Không vui suốt 4 ngày qua',
    }
  }

  return { rule: 'repeated_negative', triggered: false, severity: 1, reason: '' }
}
