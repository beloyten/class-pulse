import type { RuleInput, RuleResult } from '@/types'
import { getRecentMoods } from './index'

export function downwardTrend(input: RuleInput): RuleResult {
  const recent = getRecentMoods(input, 5)

  if (recent.length < 3) {
    return { rule: 'downward_trend', triggered: false, severity: 1, reason: '' }
  }

  const moods = recent.map(d => d.mood)
  const n = moods.length

  // Linear regression slope: positive = xấu đi (mood tăng số = buồn hơn)
  const xMean = (n - 1) / 2
  const yMean = moods.reduce((s: number, v) => s + v, 0) / n
  let num = 0, den = 0
  moods.forEach((y, x) => {
    num += (x - xMean) * (y - yMean)
    den += (x - xMean) ** 2
  })
  const slope = den === 0 ? 0 : num / den

  // Không có ngày nào quay về 1 (vui) sau khi bắt đầu giảm
  const hasRecovery = moods.slice(1).some(m => m === 1)

  if (slope <= 0.3 || hasRecovery) {
    return { rule: 'downward_trend', triggered: false, severity: 1, reason: '' }
  }

  const lastMood = moods[n - 1]
  const severity =
    slope > 0.8 || (n >= 4 && moods[n - 1] > moods[n - 2] && moods[n - 2] > moods[n - 3]) ? 3
    : slope > 0.5 || lastMood === 3 ? 2
    : 1

  return {
    rule: 'downward_trend',
    triggered: true,
    severity,
    reason: severity === 3
      ? 'Xu hướng tiêu cực kéo dài'
      : 'Mood có xu hướng giảm dần trong 5 ngày qua',
  }
}
