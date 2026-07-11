'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import type { Student, Avatar } from '@/types'

interface Props {
  students: Student[]
  avatars: Avatar[]
  onComplete: () => void
  singleStudentId?: string // Mode B: chỉ assign cho 1 bé
}

type SelectionStep =
  | { phase: 'pick_student' }
  | { phase: 'pick_avatar'; student: Student }
  | { phase: 'confirm'; student: Student; avatar: Avatar }

export default function AvatarSelectionSession({
  students,
  avatars,
  onComplete,
  singleStudentId,
}: Props) {
  const [assignments, setAssignments] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    students.forEach(s => { if (s.avatar_id) initial[s.id] = s.avatar_id })
    return initial
  })
  const [step, setStep] = useState<SelectionStep>(() =>
    singleStudentId
      ? { phase: 'pick_avatar', student: students.find(s => s.id === singleStudentId)! }
      : { phase: 'pick_student' }
  )
  const [confirmTimer, setConfirmTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [saving, setSaving] = useState(false)

  const takenAvatarIds = new Set(Object.values(assignments))
  const doneStudentIds = new Set(Object.keys(assignments))

  const pendingStudents = singleStudentId
    ? students.filter(s => s.id === singleStudentId)
    : students

  function handlePickStudent(student: Student) {
    setStep({ phase: 'pick_avatar', student })
  }

  function handlePickAvatar(avatar: Avatar) {
    if (step.phase !== 'pick_avatar') return
    setStep({ phase: 'confirm', student: step.student, avatar })

    // Auto-advance sau 5 giây nếu không tap "Chọn lại"
    const timer = setTimeout(() => confirmAvatar(step.student, avatar), 5000)
    setConfirmTimer(timer)
  }

  function handleChangeAvatar() {
    if (confirmTimer) clearTimeout(confirmTimer)
    if (step.phase !== 'confirm') return
    setStep({ phase: 'pick_avatar', student: step.student })
  }

  async function confirmAvatar(student: Student, avatar: Avatar) {
    if (confirmTimer) clearTimeout(confirmTimer)
    setSaving(true)

    const supabase = createClient()
    await supabase
      .from('students')
      .update({ avatar_id: avatar.id })
      .eq('id', student.id)

    const newAssignments = { ...assignments, [student.id]: avatar.id }
    setAssignments(newAssignments)
    setSaving(false)

    const allDone = pendingStudents.every(s => newAssignments[s.id])

    if (singleStudentId || allDone) {
      onComplete()
    } else {
      setStep({ phase: 'pick_student' })
    }
  }

  useEffect(() => {
    return () => { if (confirmTimer) clearTimeout(confirmTimer) }
  }, [confirmTimer])

  // ── Phase: pick student ───────────────────────────────────────────────────
  if (step.phase === 'pick_student') {
    const remaining = pendingStudents.filter(s => !doneStudentIds.has(s.id))
    const done = pendingStudents.filter(s => doneStudentIds.has(s.id))
    const allDone = remaining.length === 0

    return (
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Chọn linh vật cho lớp
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            {doneStudentIds.size}/{pendingStudents.length} bé đã chọn
          </p>
        </div>

        {allDone ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🎉</div>
            <p className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
              Tất cả bé đã có linh vật!
            </p>
            <Button onClick={onComplete} className="mt-4">
              Hoàn thành
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {remaining.map(student => {
              const avatarId = assignments[student.id]
              const avatar = avatars.find(a => a.id === avatarId)
              return (
                <motion.button
                  key={student.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePickStudent(student)}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl border-2 transition-all"
                  style={{
                    borderColor: 'var(--color-primary)',
                    backgroundColor: 'var(--color-bg-card)',
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-3xl"
                    style={{ backgroundColor: 'var(--color-bg-secondary)' }}
                  >
                    {avatar ? avatar.emoji : '⭐'}
                  </div>
                  <span className="text-xs font-medium text-center leading-tight" style={{ color: 'var(--color-text-primary)' }}>
                    {student.full_name.split(' ').pop()}
                  </span>
                </motion.button>
              )
            })}
          </div>
        )}

        {done.length > 0 && remaining.length > 0 && (
          <div>
            <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
              Đã xong ({done.length}):
            </p>
            <div className="grid grid-cols-5 gap-2">
              {done.map(student => {
                const avatar = avatars.find(a => a.id === assignments[student.id])
                return (
                  <button
                    key={student.id}
                    onClick={() => handlePickStudent(student)}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl opacity-60 active:opacity-100 transition-opacity"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                      style={{ backgroundColor: avatar?.color ?? 'var(--color-bg-secondary)' }}
                    >
                      {avatar?.emoji ?? '⭐'}
                    </div>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {student.full_name.split(' ').pop()}
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-center -mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Chạm vào bé để đổi lại linh vật
            </p>
          </div>
        )}
      </div>
    )
  }

  // ── Phase: pick avatar ────────────────────────────────────────────────────
  if (step.phase === 'pick_avatar') {
    const { student } = step
    return (
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            {student.full_name}, chọn bạn linh vật của mình nhé!
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {50 - takenAvatarIds.size} linh vật còn trống
          </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {avatars.map(avatar => {
            const isTaken = takenAvatarIds.has(avatar.id) && assignments[student.id] !== avatar.id
            return (
              <motion.button
                key={avatar.id}
                whileTap={isTaken ? {} : { scale: 0.9 }}
                animate={isTaken ? {} : { y: [0, -4, 0] }}
                transition={isTaken ? {} : { repeat: Infinity, duration: 2 + (avatar.id % 3) * 0.5, repeatDelay: 1 }}
                disabled={isTaken}
                onClick={() => !isTaken && handlePickAvatar(avatar)}
                className="flex flex-col items-center gap-1 p-2 rounded-2xl transition-all"
                style={{
                  opacity: isTaken ? 0.3 : 1,
                  backgroundColor: isTaken ? 'var(--color-bg-secondary)' : 'var(--color-bg-card)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm"
                  style={{ backgroundColor: avatar.color }}
                >
                  {isTaken ? '✓' : avatar.emoji}
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  {avatar.name}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Phase: confirm ────────────────────────────────────────────────────────
  if (step.phase === 'confirm') {
    const { student, avatar } = step
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6 py-8 text-center"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-28 h-28 rounded-full flex items-center justify-center text-6xl shadow-lg"
            style={{ backgroundColor: avatar.color }}
          >
            {avatar.emoji}
          </motion.div>

          <div>
            <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              {student.full_name.split(' ').pop()} chọn {avatar.name} đúng không?
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Tự động xác nhận sau 5 giây
            </p>
          </div>

          <div className="flex gap-3 w-full max-w-xs">
            <Button variant="secondary" onClick={handleChangeAvatar} className="flex-1">
              Chọn lại
            </Button>
            <Button
              onClick={() => confirmAvatar(student, avatar)}
              loading={saving}
              className="flex-1"
            >
              Đúng rồi! 🎉
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return null
}
