'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { StudentForCheckin } from '@/types'

interface Props {
  student: StudentForCheckin
  onContinue: () => void
}

export default function WelcomeScreen({ student, onContinue }: Props) {
  const emoji = student.avatar?.emoji ?? '⭐'
  const color = student.avatar?.color ?? '#A29BFE'
  const firstName = student.full_name.split(' ').pop() ?? student.full_name

  // Auto-advance sau 1.5s
  useEffect(() => {
    const timer = setTimeout(onContinue, 1500)
    return () => clearTimeout(timer)
  }, [onContinue])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-dvh flex flex-col items-center justify-center gap-8 px-6"
      style={{
        background: `radial-gradient(ellipse at center, ${color}30 0%, var(--color-bg-primary) 70%)`,
      }}
      onClick={onContinue}
    >
      {/* Avatar waving */}
      <motion.div
        animate={{
          rotate: [0, 10, -8, 10, 0],
          y: [0, -8, 0],
        }}
        transition={{
          rotate: { duration: 1.2, ease: 'easeInOut' },
          y: { duration: 1.2, ease: 'easeInOut' },
        }}
        className="rounded-full flex items-center justify-center shadow-lg"
        style={{
          width: 120,
          height: 120,
          backgroundColor: color,
          fontSize: 64,
        }}
      >
        {emoji}
      </motion.div>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="text-center"
      >
        <h2
          className="text-3xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          Chào {firstName}! ✨
        </h2>
      </motion.div>

      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        Nhấn bất kỳ để tiếp tục
      </p>
    </motion.div>
  )
}
