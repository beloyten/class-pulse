// ─── Database row types ──────────────────────────────────────────────────────

export type MoodValue = 0 | 1 | 2 | 3
// 0 = skip (chủ động bỏ qua), 1 = 😊 happy, 2 = 😐 neutral, 3 = 🙁 sad
// null / không có record = missing (vắng học, không được reach)

export type SignalValue = 1 | 2 | 3
// 1 = 🟢 bình thường, 2 = 🟡 hơi khác, 3 = 🔴 cần chú ý

export type SeverityValue = 1 | 2 | 3
// 1 = low, 2 = medium, 3 = high

export type OverallStatus = 'green' | 'yellow' | 'red'

export type AvatarCategory = 'mammal' | 'bird' | 'sea' | 'insect'

// ─── Supabase DB types ────────────────────────────────────────────────────────

export interface Teacher {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  created_at: string
}

export interface Class {
  id: string
  teacher_id: string
  name: string
  code: string
  school_name: string | null
  grade: number | null
  is_active: boolean
  created_at: string
}

export interface Avatar {
  id: number
  name: string
  emoji: string
  color: string
  svg_path: string
  category: AvatarCategory
}

export interface Student {
  id: string
  class_id: string
  full_name: string
  order_number: number
  avatar_id: number | null
  parent_email: string | null
  streak_count: number
  last_checkin_date: string | null
  created_at: string
}

export interface MoodLog {
  id: string
  student_id: string
  class_id: string
  mood: MoodValue
  checked_at: string
  created_at: string
}

export interface TeacherSignal {
  id: string
  student_id: string
  teacher_id: string
  signal: SignalValue
  note: string | null
  created_at: string
}

export interface StudentFlag {
  id: string
  student_id: string
  rule_triggered: RuleId
  severity: SeverityValue
  reason: string
  is_active: boolean
  triggered_at: string
  resolved_at: string | null
  created_at: string
}

export interface WeeklyReport {
  id: string
  student_id: string
  week_start: string
  mood_summary: MoodSummary
  token: string
  sent_at: string | null
  expires_at: string
  created_at: string
}

// ─── Domain types ─────────────────────────────────────────────────────────────

export interface MoodSummary {
  happy: number
  neutral: number
  sad: number
  skip: number
  missing: number
}

export type RuleId =
  | 'sudden_change'
  | 'downward_trend'
  | 'repeated_negative'
  | 'silent_risk'
  | 'mixed_signal'
  | 'skip_pattern'

export interface RuleResult {
  rule: RuleId
  triggered: boolean
  severity: SeverityValue
  reason: string
}

export interface StudentWithStatus extends Student {
  avatar: Avatar | null
  today_mood: MoodValue | null
  today_signal: SignalValue | null
  today_signal_note: string | null
  flag_severity: SeverityValue | null
  flag_reason: string | null
  flags: RuleResult[]
  overall_status: OverallStatus
}

export interface StudentWithHistory extends StudentWithStatus {
  mood_history: { date: string; mood: MoodValue | null }[]
  teacher_signals: TeacherSignal[]
}

export interface ClassWithStats extends Class {
  student_count: number
  green_count: number
  yellow_count: number
  red_count: number
  checkin_count_today: number
}

// ─── Rule engine input ────────────────────────────────────────────────────────

export interface RuleInput {
  studentId: string
  moodLogs: { date: string; mood: MoodValue }[]
  teacherSignals: { date: string; signal: SignalValue }[]
  activeMoodDates: string[]
  skipDates: string[]
  schoolDaysLast7: number
  streakCount: number
}

// ─── API request/response types ───────────────────────────────────────────────

export interface CheckinRequest {
  classCode: string
  studentId: string
  mood: MoodValue
}

export interface CheckinResponse {
  success: boolean
  streakCount: number
  isNewStreak: boolean
}

export interface CreateClassRequest {
  name: string
  school_name?: string
  grade?: number
  students: { full_name: string; parent_email?: string }[]
}

// ─── UI state types ───────────────────────────────────────────────────────────

export interface CheckinSession {
  classId: string
  className: string
  students: StudentForCheckin[]
  completedIds: Set<string>
}

export interface StudentForCheckin {
  id: string
  full_name: string
  avatar: Avatar | null
  streak_count: number
}

export type CheckinStep =
  | { step: 'grid' }
  | { step: 'welcome'; student: StudentForCheckin }
  | { step: 'mood'; student: StudentForCheckin }
  | { step: 'celebration'; student: StudentForCheckin; mood: MoodValue; newStreak: number }
