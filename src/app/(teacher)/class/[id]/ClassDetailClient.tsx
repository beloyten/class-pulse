'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import StudentDetail from '@/components/teacher/StudentDetail'
import AvatarSelectionSession from '@/components/teacher/AvatarSelectionSession'
import type { StudentWithHistory, SignalValue, Avatar, Student } from '@/types'

const STATUS_ORDER = { red: 0, yellow: 1, green: 2 } as const

const STATUS_LABEL: Record<string, { emoji: string; text: string; color: string }> = {
  red:    { emoji: '🔴', text: 'Cần quan tâm',  color: 'var(--color-status-red)' },
  yellow: { emoji: '🟡', text: 'Cần để ý',      color: '#B7791F' },
  green:  { emoji: '🟢', text: 'Bình thường',   color: 'var(--color-status-green)' },
}

interface ClassInfo {
  id: string
  name: string
  code: string
  school_name: string | null
}

interface Props {
  cls: ClassInfo
  students: StudentWithHistory[]
  today: string
  setupAvatars?: Avatar[]
  baseStudents?: Student[]
}

export default function ClassDetailClient({ cls, students, today, setupAvatars, baseStudents }: Props) {
  const [selected, setSelected] = useState<StudentWithHistory | null>(null)
  const [showSetup, setShowSetup] = useState(!!setupAvatars)
  const router = useRouter()

  // Sync selected student with fresh data after router.refresh()
  useEffect(() => {
    if (selected) {
      const updated = students.find(s => s.id === selected.id)
      if (updated) setSelected(updated)
    }
  }, [students])

  const sorted = [...students].sort(
    (a, b) => (STATUS_ORDER[a.overall_status] ?? 2) - (STATUS_ORDER[b.overall_status] ?? 2)
  )

  const checkedInToday = students.filter(s => s.today_mood !== null).length
  const total = students.length

  const handleObservationSave = useCallback(
    async (studentId: string, signal: SignalValue, note: string) => {
      await fetch('/api/observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, signal, note }),
      })
      router.refresh()
    },
    [router]
  )

  function handleSetupComplete() {
    setShowSetup(false)
    // Remove ?new=1 from URL without navigation
    const url = new URL(window.location.href)
    url.searchParams.delete('new')
    router.replace(url.pathname)
    router.refresh()
  }

  // Avatar selection overlay for new classes
  if (showSetup && setupAvatars && baseStudents) {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-center pb-2">
          <p className="text-xs font-semibold tracking-wide" style={{ color: 'var(--color-primary)' }}>
            BƯỚC TIẾP THEO
          </p>
          <h2 className="text-xl font-bold mt-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
            Chọn linh vật cho lớp
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Cho các bé tự chọn — mỗi bé một linh vật riêng
          </p>
        </div>

        <AvatarSelectionSession
          classId={cls.id}
          students={baseStudents}
          avatars={setupAvatars}
          onComplete={handleSetupComplete}
        />

        <button
          onClick={handleSetupComplete}
          className="text-sm text-center py-2"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Bỏ qua, làm sau →
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Checkin progress */}
      <div
        className="rounded-2xl p-4 mb-4 flex items-center justify-between gap-3"
        style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Điểm danh hôm nay
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            {checkedInToday}/{total} học sinh
          </p>
          <div
            className="h-1.5 rounded-full mt-2"
            style={{ backgroundColor: 'var(--color-border)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: total > 0 ? `${(checkedInToday / total) * 100}%` : '0%',
                backgroundColor: checkedInToday === total && total > 0
                  ? 'var(--color-status-green)'
                  : 'var(--color-primary)',
              }}
            />
          </div>
        </div>
        <Link
          href={`/c/${cls.code}`}
          className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Bắt đầu điểm danh
        </Link>
      </div>

      {/* Student list */}
      <div className="flex flex-col gap-2">
        {sorted.map((student, i) => {
          const cfg = STATUS_LABEL[student.overall_status]
          const emoji = student.avatar?.emoji ?? '⭐'
          const color = student.avatar?.color ?? '#A29BFE'
          const todayMoodEmoji = getTodayMoodEmoji(student.today_mood)
          const topFlag = student.flags.filter(f => f.triggered)[0]

          return (
            <motion.button
              key={student.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelected(student)}
              className="w-full flex items-center gap-3 rounded-2xl border p-3 text-left active:scale-99 transition-all"
              style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: color }}
              >
                {emoji}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-sm truncate"
                  style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}
                >
                  {student.full_name}
                </p>
                {topFlag ? (
                  <p className="text-xs truncate" style={{ color: cfg.color }}>
                    {cfg.emoji} {topFlag.reason}
                  </p>
                ) : (
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {cfg.emoji} {cfg.text}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <span className="text-lg">{todayMoodEmoji}</span>
                {student.streak_count > 1 && (
                  <span className="text-xs" style={{ color: 'var(--color-mood-happy)' }}>
                    🔥{student.streak_count}
                  </span>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      {selected && (
        <StudentDetail
          student={selected}
          moodHistory={selected.mood_history}
          onClose={() => setSelected(null)}
          onObservationSave={handleObservationSave}
        />
      )}
    </>
  )
}

function getTodayMoodEmoji(mood: number | null): string {
  if (mood === null) return '—'
  if (mood === 0) return '⬜'
  if (mood === 1) return '😊'
  if (mood === 2) return '😐'
  return '🙁'
}
