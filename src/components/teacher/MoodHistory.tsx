'use client'

import type { MoodValue } from '@/types'

const MOOD_CONFIG: Record<number, { emoji: string; label: string; bg: string }> = {
  1: { emoji: '😊', label: 'Vui',          bg: 'var(--color-mood-happy)' },
  2: { emoji: '😐', label: 'Bình thường',  bg: 'var(--color-mood-neutral)' },
  3: { emoji: '🙁', label: 'Hơi buồn',    bg: 'var(--color-mood-sad)' },
  0: { emoji: '⬜', label: 'Bỏ qua',       bg: 'var(--color-bg-secondary)' },
}

interface Props {
  history: { date: string; mood: MoodValue | null }[]
}

const DOW = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

export default function MoodHistory({ history }: Props) {
  return (
    <div>
      <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>
        7 ngày gần nhất
      </p>
      <div className="flex gap-1.5">
        {history.map(({ date, mood }) => {
          const dow = DOW[new Date(date + 'T12:00:00').getDay()]
          const cfg = mood !== null ? MOOD_CONFIG[mood] : null

          return (
            <div key={date} className="flex flex-col items-center gap-1 flex-1">
              <div
                className="w-full aspect-square rounded-xl flex items-center justify-center text-lg"
                style={{
                  backgroundColor: cfg?.bg ?? 'var(--color-border)',
                  opacity: cfg ? 1 : 0.4,
                }}
                title={cfg?.label ?? 'Vắng'}
              >
                {cfg ? cfg.emoji : '➖'}
              </div>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {dow}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
