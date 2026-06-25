'use client'

import { motion } from 'framer-motion'
import type { StudentForCheckin } from '@/types'

interface Props {
  students: StudentForCheckin[]
  doneIds: Set<string>
  className: string
  onSelect: (student: StudentForCheckin) => void
}

export default function AvatarGrid({ students, doneIds, className, onSelect }: Props) {
  return (
    <div className="flex flex-col min-h-dvh" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Header */}
      <div className="px-4 pt-8 pb-4 text-center">
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
          {className}
        </p>
        <h1
          className="text-xl font-bold mt-1"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          Tìm bạn linh vật của mình nhé!
        </h1>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
          {doneIds.size}/{students.length} đã điểm danh
        </p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-3 pb-6">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {students.map((student, idx) => {
            const done = doneIds.has(student.id)
            const emoji = student.avatar?.emoji ?? '⭐'
            const color = student.avatar?.color ?? '#A29BFE'
            const displayName = student.full_name.split(' ').pop() ?? student.full_name

            return (
              <motion.button
                key={student.id}
                disabled={done}
                onClick={() => !done && onSelect(student)}
                // Stagger bounce on idle — each card has a different delay
                animate={done ? {} : {
                  y: [0, -5, 0],
                  transition: {
                    repeat: Infinity,
                    duration: 2,
                    delay: Math.min(idx * 0.08, 1.0),
                    ease: 'easeInOut',
                  },
                }}
                whileTap={done ? {} : { scale: 0.92 }}
                className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl transition-all"
                style={{
                  backgroundColor: done ? 'var(--color-bg-secondary)' : 'var(--color-bg-card)',
                  opacity: done ? 0.45 : 1,
                  boxShadow: done ? 'none' : '0 2px 8px rgba(108,99,255,0.10)',
                  cursor: done ? 'default' : 'pointer',
                }}
              >
                {/* Avatar circle */}
                <div
                  className="rounded-full flex items-center justify-center relative"
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: color,
                  }}
                >
                  <span style={{ fontSize: 28 }}>{done ? '✓' : emoji}</span>
                </div>

                {/* Name */}
                <span
                  className="text-xs font-semibold text-center leading-tight w-full px-0.5"
                  style={{
                    color: done ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                    fontFamily: 'var(--font-display)',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {displayName}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
