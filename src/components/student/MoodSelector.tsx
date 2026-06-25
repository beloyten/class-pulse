'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { MoodValue, StudentForCheckin } from '@/types'

const MOODS: { value: MoodValue; emoji: string; label: string; color: string }[] = [
  { value: 1, emoji: '😊', label: 'Vui lắm',     color: 'var(--color-mood-happy)' },
  { value: 2, emoji: '😐', label: 'Bình thường', color: 'var(--color-mood-neutral)' },
  { value: 3, emoji: '🙁', label: 'Hơi buồn',   color: 'var(--color-mood-sad)' },
]

// Deterministic shuffle bằng date seed — giống nhau cả ngày, đổi mỗi ngày
function shuffledMoods(date: string) {
  const seed = parseInt(date.replace(/-/g, ''))  // e.g. "2026-06-25" → 20260625, unique per date
  return [...MOODS].sort((a, b) => {
    const ha = ((a.value * 2654435761 + seed) >>> 0) % 1000
    const hb = ((b.value * 2654435761 + seed) >>> 0) % 1000
    return ha - hb
  })
}

interface Props {
  student: StudentForCheckin
  today: string
  onSelect: (mood: MoodValue) => void
}

export default function MoodSelector({ student, today, onSelect }: Props) {
  const firstName = student.full_name.split(' ').pop() ?? student.full_name
  const moods = useMemo(() => shuffledMoods(today), [today])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-dvh flex flex-col"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-12">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-center"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          Hôm nay {firstName} thấy thế nào?
        </motion.h2>

        {/* 3 Emoji buttons — random order */}
        <div className="flex items-end justify-center gap-6 w-full max-w-xs">
          {moods.map((mood, idx) => (
            <motion.button
              key={mood.value}
              onClick={() => onSelect(mood.value)}
              // Idle float — staggered offset per position
              animate={{
                y: [0, -10, 0],
                transition: {
                  repeat: Infinity,
                  duration: 2.5,
                  delay: idx * 0.4,
                  ease: 'easeInOut',
                },
              }}
              whileTap={{ scale: 1.35 }}
              className="flex flex-col items-center gap-3 p-2 tap-highlight-none"
            >
              <span style={{ fontSize: 72, lineHeight: 1 }}>{mood.emoji}</span>
              <span
                className="text-sm font-semibold"
                style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-display)' }}
              >
                {mood.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Skip — nhỏ, xám, dưới cùng. Cố ý không nổi bật nhưng phải đủ 44px touch target. */}
      <div className="pb-10 flex justify-center">
        <button
          onClick={() => onSelect(0)}
          className="px-8 text-xs min-h-[44px] flex items-center"
          style={{ color: 'var(--color-text-muted)' }}
        >
          bỏ qua lần này
        </button>
      </div>
    </motion.div>
  )
}
