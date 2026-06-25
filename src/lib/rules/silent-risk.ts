import type { RuleInput, RuleResult, SeverityValue } from '@/types'

export function silentRisk(input: RuleInput): RuleResult {
  const { activeMoodDates, skipDates, schoolDaysLast7, streakCount } = input

  const missingCount = schoolDaysLast7 - activeMoodDates.length - skipDates.length

  if (missingCount < 2) {
    return { rule: 'silent_risk', triggered: false, severity: 1, reason: '' }
  }

  let severity: SeverityValue =
    missingCount >= 4 ? 3
    : missingCount >= 3 ? 2
    : 1

  // Bonus: trước đó streak > 5 rồi đột ngột miss → severity +1
  if (streakCount > 5 && missingCount >= 2 && severity < 3) {
    severity = (severity + 1) as SeverityValue
  }

  const reason =
    severity === 3
      ? `Im lặng: không tương tác ${missingCount} ngày`
      : missingCount >= 3
      ? `Vắng mặt ${missingCount} ngày — trước đó rất đều đặn`
      : `Không điểm danh ${missingCount} ngày trong tuần qua`

  return { rule: 'silent_risk', triggered: true, severity, reason }
}
