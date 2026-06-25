import type { RuleInput, RuleResult, SeverityValue, StudentWithStatus } from '@/types'
import { suddenChange } from './sudden-change'
import { downwardTrend } from './downward-trend'
import { repeatedNegative } from './repeated-negative'
import { silentRisk } from './silent-risk'
import { mixedSignal } from './mixed-signal'
import { skipPattern } from './skip-pattern'

export function runRules(input: RuleInput): Pick<StudentWithStatus, 'flags' | 'overall_status'> {
  const results: RuleResult[] = [
    suddenChange(input),
    downwardTrend(input),
    repeatedNegative(input),
    silentRisk(input),
    mixedSignal(input),
    skipPattern(input),
  ]

  const active = results.filter(r => r.triggered)
  const overallSeverity = calculateOverallSeverity(active)

  return {
    flags: results,
    overall_status:
      overallSeverity >= 3 ? 'red'
      : overallSeverity >= 1 ? 'yellow'
      : 'green',
  }
}

function calculateOverallSeverity(active: RuleResult[]): number {
  if (active.length === 0) return 0

  const maxSeverity = Math.max(...active.map(f => f.severity)) as SeverityValue

  // mixed_signal + bất kỳ rule nào khác → luôn severity 3
  if (active.some(f => f.rule === 'mixed_signal') && active.length > 1) return 3

  // Nhiều flag nhẹ → escalate
  if (active.length >= 3 && maxSeverity < 3) return maxSeverity + 1

  return maxSeverity
}

// Lấy N ngày gần nhất từ moodLogs, chỉ lấy ngày có data (không gồm missing)
export function getRecentMoods(input: RuleInput, n: number) {
  return [...input.moodLogs]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, n)
    .reverse()
}
