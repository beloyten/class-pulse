'use client'

import { useState, useCallback, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import AvatarGrid from './AvatarGrid'
import WelcomeScreen from './WelcomeScreen'
import MoodSelector from './MoodSelector'
import CelebrationScreen from './CelebrationScreen'
import type { MoodValue, StudentForCheckin, CheckinStep } from '@/types'

interface Props {
  classCode: string
  className: string
  students: StudentForCheckin[]
  initialDoneIds: Set<string>
  today: string
}

export default function CheckinFlow({
  classCode,
  className,
  students,
  initialDoneIds,
  today,
}: Props) {
  const [step, setStep] = useState<CheckinStep>({ step: 'grid' })
  const stepRef = useRef(step)
  const submittingRef = useRef(false)
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set(initialDoneIds))

  async function saveMood(studentId: string, mood: MoodValue): Promise<{ streakCount: number; isNewStreak: boolean }> {
    const res = await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classCode, studentId, mood }),
    })
    if (!res.ok) return { streakCount: 0, isNewStreak: false }
    return res.json()
  }

  // Sync ref so callbacks always see latest step without being recreated
  stepRef.current = step

  // Màn 1 → Màn 2
  function handleSelectStudent(student: StudentForCheckin) {
    setStep({ step: 'welcome', student })
  }

  // Màn 2 → Màn 3 (stable reference — WelcomeScreen timer won't reset on parent re-render)
  const handleWelcomeDone = useCallback(() => {
    const s = stepRef.current
    if (s.step !== 'welcome') return
    setStep({ step: 'mood', student: s.student })
  }, [])

  // Màn 3 → Màn 4 (lưu ngay lên DB)
  async function handleMoodSelect(mood: MoodValue) {
    if (step.step !== 'mood') return
    if (submittingRef.current) return
    submittingRef.current = true
    const { student } = step

    const { streakCount } = await saveMood(student.id, mood)

    setStep({ step: 'celebration', student, mood, newStreak: streakCount })
  }

  // Undo: quay về Màn 3 (không phải Màn 1)
  function handleUndo() {
    if (step.step !== 'celebration') return
    submittingRef.current = false  // Allow re-submission after undo
    setStep({ step: 'mood', student: step.student })
  }

  // Màn 4 hết timer → reset về Màn 1 + đánh dấu done
  // Empty deps — dùng stepRef để tránh trigger restart CelebrationScreen countdown
  const handleCelebrationDone = useCallback(() => {
    const s = stepRef.current
    if (s.step !== 'celebration') return
    submittingRef.current = false  // Reset for next student
    setDoneIds(prev => new Set(Array.from(prev).concat(s.student.id)))
    setStep({ step: 'grid' })
  }, [])

  return (
    <AnimatePresence mode="wait">
      {step.step === 'grid' && (
        <AvatarGrid
          key="grid"
          students={students}
          doneIds={doneIds}
          className={className}
          onSelect={handleSelectStudent}
        />
      )}

      {step.step === 'welcome' && (
        <WelcomeScreen
          key="welcome"
          student={step.student}
          onContinue={handleWelcomeDone}
        />
      )}

      {step.step === 'mood' && (
        <MoodSelector
          key="mood"
          student={step.student}
          today={today}
          onSelect={handleMoodSelect}
        />
      )}

      {step.step === 'celebration' && (
        <CelebrationScreen
          key="celebration"
          student={step.student}
          mood={step.mood}
          newStreak={step.newStreak}
          today={today}
          onUndo={handleUndo}
          onDone={handleCelebrationDone}
        />
      )}
    </AnimatePresence>
  )
}
