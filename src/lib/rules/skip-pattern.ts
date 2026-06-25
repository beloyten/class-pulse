import type { RuleInput, RuleResult, SeverityValue } from '@/types'

export function skipPattern(input: RuleInput): RuleResult {
  const { skipDates, moodLogs, schoolDaysLast7, streakCount } = input

  // Grace period: ít hơn 10 ngày dữ liệu → không trigger
  if (moodLogs.length < 5) {
    return { rule: 'skip_pattern', triggered: false, severity: 1, reason: '' }
  }

  // Lấy 5 ngày học gần nhất
  const last5SchoolDays = schoolDaysLast7 >= 5 ? 5 : schoolDaysLast7
  const sortedSkips = [...skipDates].sort((a, b) => b.localeCompare(a))
  const skipCountLast5 = sortedSkips.slice(0, last5SchoolDays).length

  if (skipCountLast5 < 3) {
    return { rule: 'skip_pattern', triggered: false, severity: 1, reason: '' }
  }

  let severity: SeverityValue = skipCountLast5 >= 4 ? 2 : 1

  // Bonus: trước đó chia sẻ đều (streak > 5 với mood ≠ 0) rồi đột ngột skip
  if (streakCount > 5 && skipCountLast5 >= 3 && severity < 3) {
    severity = (severity + 1) as SeverityValue
  }

  const reason =
    severity >= 2
      ? 'Hay bỏ qua sau giai đoạn chia sẻ đều đặn'
      : 'Hay bỏ qua điểm danh — quan sát thêm'

  return { rule: 'skip_pattern', triggered: true, severity, reason }
}
