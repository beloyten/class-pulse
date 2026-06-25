'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import type { MoodValue, StudentForCheckin } from '@/types'

// Text rotate theo ngày cho mood sad
const SAD_TEXTS = [
  'Hôm nay hơi buồn cũng không sao, cảm ơn bạn đã chia sẻ nhé 💛',
  'Ai cũng có ngày không vui, cảm ơn bạn nhé ✨',
  'Cảm ơn bạn đã thật thà hôm nay 💛',
  'Ngày mai sẽ khác nhé, hẹn gặp lại 🌈',
]

const SKIP_TEXTS = [
  'Không sao, hôm nay có mặt là tuyệt rồi! ✨',
  'Cảm ơn bạn đã tham gia hôm nay nhé 💛',
]

const HAPPY_TEXTS = ['Tuyệt vời! 🌟', 'Thật vui khi biết điều này! 🎉', 'Tuyệt! Tiếp tục nhé! ⭐']
const NEUTRAL_TEXTS = ['Cảm ơn nhé! 💙', 'Cảm ơn bạn đã chia sẻ! ✨']

function getRotatingText(texts: string[], today: string): string {
  const dayIdx = parseInt(today.replace(/-/g, '')) % texts.length
  return texts[dayIdx]
}

const UNDO_DURATION = 3000

interface Props {
  student: StudentForCheckin
  mood: MoodValue
  newStreak: number
  today: string
  onUndo: () => void
  onDone: () => void
}

export default function CelebrationScreen({ student, mood, newStreak, today, onUndo, onDone }: Props) {
  const [progress, setProgress] = useState(100)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef(Date.now())
  const doneCalledRef = useRef(false)

  const emoji = student.avatar?.emoji ?? '⭐'
  const color = student.avatar?.color ?? '#A29BFE'
  const firstName = student.full_name.split(' ').pop() ?? student.full_name

  const isSkip = mood === 0
  const isSad = mood === 3

  const celebrationText = isSkip
    ? getRotatingText(SKIP_TEXTS, today)
    : isSad
    ? getRotatingText(SAD_TEXTS, today)
    : mood === 1
    ? getRotatingText(HAPPY_TEXTS, today)
    : getRotatingText(NEUTRAL_TEXTS, today)

  // Avatar reaction per mood
  const avatarAnimation = isSkip
    ? { rotate: [0, 5, -5, 0] }
    : isSad
    ? { scale: [1, 1.05, 1], rotate: 0 }
    : { y: [0, -18, 0, -12, 0], rotate: [0, -5, 5, -5, 0] }

  const triggerDone = useCallback(() => {
    if (doneCalledRef.current) return
    doneCalledRef.current = true
    if (intervalRef.current) clearInterval(intervalRef.current)
    onDone()
  }, [onDone])

  // Confetti — chỉ khi có mood (không skip)
  useEffect(() => {
    if (isSkip) return
    let active = true

    import('canvas-confetti').then(({ default: confetti }) => {
      if (!active) return
      const options = isSad
        ? { particleCount: 40, spread: 60, colors: ['#A29BFE', '#DDA0DD', '#FFB5C2'], origin: { y: 0.5 } }
        : { particleCount: 90, spread: 80, colors: ['#FFD93D', '#6C63FF', '#00B894', '#FF6B35'], origin: { y: 0.5 } }
      confetti(options)
    })

    return () => { active = false }
  }, [isSkip, isSad])

  // Countdown bar cho undo
  useEffect(() => {
    startRef.current = Date.now()
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current
      const remaining = Math.max(0, 100 - (elapsed / UNDO_DURATION) * 100)
      setProgress(remaining)
      if (remaining === 0) triggerDone()
    }, 50)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [triggerDone])

  function handleUndo() {
    if (doneCalledRef.current) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    onUndo()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-dvh flex flex-col items-center justify-between py-12 px-6"
      style={{
        background: `radial-gradient(ellipse at center, ${color}25 0%, var(--color-bg-primary) 65%)`,
      }}
    >
      {/* Top: avatar + text */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* Avatar reacting */}
        <motion.div
          animate={avatarAnimation}
          transition={{ duration: 1.0, ease: 'easeInOut', repeat: isSkip ? 0 : 1 }}
          className="rounded-full flex items-center justify-center shadow-xl"
          style={{ width: 120, height: 120, backgroundColor: color, fontSize: 64 }}
        >
          {emoji}
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-xs"
        >
          <p
            className="text-xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
          >
            Cảm ơn {firstName} nhé!
          </p>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {celebrationText}
          </p>
        </motion.div>

        {/* Streak badge */}
        {newStreak > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 300, damping: 20 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              color: 'var(--color-text-primary)',
              boxShadow: '0 2px 12px rgba(108,99,255,0.15)',
            }}
          >
            <span>🔥</span>
            <span>{newStreak} ngày liên tiếp!</span>
          </motion.div>
        )}
      </div>

      {/* Bottom: undo button + countdown */}
      <div className="w-full max-w-xs flex flex-col gap-3">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={handleUndo}
          className="w-full py-3.5 rounded-xl border font-semibold text-base transition-opacity"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-secondary)',
            backgroundColor: 'var(--color-bg-card)',
            opacity: progress / 100 * 0.6 + 0.4,
          }}
        >
          ↩ Đổi lại
        </motion.button>

        {/* Countdown bar */}
        <div
          className="h-1 w-full rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--color-border)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: 'var(--color-primary)',
              transition: 'width 50ms linear',
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}
