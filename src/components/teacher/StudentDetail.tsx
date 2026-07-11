'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import MoodHistory from './MoodHistory'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { StudentWithStatus, MoodValue, SeverityValue, SignalValue } from '@/types'

const ACTION_SUGGESTIONS: Record<SeverityValue, string> = {
  1: 'Quan sát thêm em trong lớp — chú ý sự tham gia và tương tác với bạn bè',
  2: 'Cân nhắc trò chuyện nhẹ nhàng, tự nhiên với em trong giờ ra chơi',
  3: 'Nên dành thời gian trò chuyện riêng với em — có thể liên hệ phụ huynh nếu cần',
}

const SIGNAL_OPTIONS: { value: SignalValue; label: string; color: string }[] = [
  { value: 1, label: '🟢 Bình thường', color: 'var(--color-status-green)' },
  { value: 2, label: '🟡 Hơi khác',    color: '#B7791F' },
  { value: 3, label: '🔴 Cần chú ý',   color: 'var(--color-status-red)' },
]

interface Props {
  student: StudentWithStatus
  moodHistory: { date: string; mood: MoodValue | null }[]
  onClose: () => void
  onObservationSave: (studentId: string, signal: SignalValue, note: string) => Promise<void>
  onChangeAvatar: () => void
  onEditStudent: (studentId: string, fullName: string, parentEmail: string) => Promise<boolean>
  onDeleteStudent: (studentId: string) => Promise<boolean>
}

export default function StudentDetail({
  student, moodHistory, onClose, onObservationSave, onChangeAvatar, onEditStudent, onDeleteStudent,
}: Props) {
  const [selectedSignal, setSelectedSignal] = useState<SignalValue | null>(student.today_signal)
  const [note, setNote] = useState(student.today_signal_note ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(student.full_name)
  const [editEmail, setEditEmail] = useState(student.parent_email ?? '')
  const [savingEdit, setSavingEdit] = useState(false)
  const [editError, setEditError] = useState('')

  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => () => { if (savedTimerRef.current) clearTimeout(savedTimerRef.current) }, [])

  async function handleSaveEdit() {
    if (!editName.trim()) return
    setSavingEdit(true)
    setEditError('')
    const ok = await onEditStudent(student.id, editName.trim(), editEmail.trim())
    setSavingEdit(false)
    if (ok) {
      setEditing(false)
    } else {
      setEditError('Không lưu được. Thử lại nhé.')
    }
  }

  async function handleConfirmDelete() {
    setDeleting(true)
    setDeleteError('')
    const ok = await onDeleteStudent(student.id)
    // Nếu thành công, parent sẽ đóng sheet (setSelected(null)) — component này unmount.
    // Nếu fail, phải tự reset state để GV thấy lỗi và thử lại.
    if (!ok) {
      setDeleting(false)
      setDeleteError('Không xóa được. Thử lại nhé.')
    }
  }

  const activeFlags = student.flags.filter(f => f.triggered)
  const maxSeverity = activeFlags.length > 0
    ? (Math.max(...activeFlags.map(f => f.severity)) as SeverityValue)
    : null

  const emoji = student.avatar?.emoji ?? '⭐'
  const color = student.avatar?.color ?? '#A29BFE'

  async function handleSaveObservation() {
    if (!selectedSignal) return
    setSaving(true)
    await onObservationSave(student.id, selectedSignal, note)
    setSaving(false)
    setSaved(true)
    savedTimerRef.current = setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        key="sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-y-auto"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          maxHeight: '92dvh',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'var(--color-border)' }} />
        </div>

        <div className="px-5 pb-10">
          {/* Header */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ backgroundColor: color }}
              >
                {emoji}
              </div>
              <div>
                <p className="font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                  {student.full_name}
                </p>
                <StatusBadge status={student.overall_status} />
              </div>
            </div>
            <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}>
              <X size={20} />
            </button>
          </div>

          {editing ? (
            <div
              className="flex flex-col gap-3 rounded-2xl p-4 mb-4"
              style={{ backgroundColor: 'var(--color-bg-secondary)' }}
            >
              <Input
                label="Họ và tên"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                required
              />
              <Input
                label="Email phụ huynh (không bắt buộc)"
                type="email"
                value={editEmail}
                onChange={e => setEditEmail(e.target.value)}
                placeholder="phuhuynh@gmail.com"
              />
              {editError && (
                <p className="text-xs" style={{ color: 'var(--color-status-red)' }}>{editError}</p>
              )}
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                  Hủy
                </Button>
                <Button size="sm" loading={savingEdit} onClick={handleSaveEdit}>
                  Lưu
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 -mt-2 mb-1">
              <button
                onClick={onChangeAvatar}
                className="text-xs font-medium"
                style={{ color: 'var(--color-primary)' }}
              >
                🔄 Đổi linh vật
              </button>
              <button
                onClick={() => setEditing(true)}
                className="text-xs font-medium"
                style={{ color: 'var(--color-primary)' }}
              >
                ✏️ Sửa thông tin
              </button>
            </div>
          )}

          <div className="flex flex-col gap-5">
            {/* Mood history */}
            <MoodHistory history={moodHistory} />

            {/* Flags */}
            {activeFlags.length > 0 && (
              <div
                className="rounded-2xl p-4 flex flex-col gap-3"
                style={{ backgroundColor: 'var(--color-bg-secondary)' }}
              >
                <p className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                  ⚠️ Tín hiệu cần chú ý:
                </p>
                <ul className="flex flex-col gap-1.5">
                  {activeFlags.map(flag => (
                    <li key={flag.rule} className="text-sm flex items-start gap-2">
                      <span>{flag.severity === 3 ? '🔴' : flag.severity === 2 ? '🟠' : '🟡'}</span>
                      <span style={{ color: 'var(--color-text-primary)' }}>{flag.reason}</span>
                    </li>
                  ))}
                </ul>

                {/* Action suggestion */}
                {maxSeverity && (
                  <div
                    className="rounded-xl p-3 text-sm"
                    style={{ backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-secondary)' }}
                  >
                    <p className="font-medium mb-1" style={{ color: 'var(--color-primary)' }}>
                      💡 Gợi ý cho bạn:
                    </p>
                    <p>{ACTION_SUGGESTIONS[maxSeverity]}</p>
                  </div>
                )}
              </div>
            )}

            {/* Teacher observation */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  👁️ Quan sát của bạn hôm nay:
                </p>
                {student.today_signal !== null && (
                  <span className="text-xs font-medium" style={{ color: 'var(--color-status-green)' }}>
                    ✓ Đã ghi nhận
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {SIGNAL_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedSignal(opt.value)}
                    className="flex-1 py-3 rounded-xl text-xs font-semibold border-2 transition-all min-h-[44px]"
                    style={{
                      borderColor: selectedSignal === opt.value ? opt.color : 'var(--color-border)',
                      backgroundColor: selectedSignal === opt.value ? `${opt.color}15` : 'transparent',
                      color: selectedSignal === opt.value ? opt.color : 'var(--color-text-secondary)',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Ghi chú ngắn (không bắt buộc)..."
                rows={2}
                maxLength={200}
                className="w-full px-3 py-2.5 rounded-xl border text-sm resize-none outline-none"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-bg-primary)',
                  color: 'var(--color-text-primary)',
                }}
              />

              <Button
                onClick={handleSaveObservation}
                disabled={!selectedSignal}
                loading={saving}
                size="sm"
                className="self-end"
              >
                {saved ? '✓ Đã lưu' : student.today_signal !== null ? 'Cập nhật' : 'Lưu'}
              </Button>
            </div>

            {/* Parent email info */}
            {student.parent_email && (
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                📧 Email PH: {student.parent_email}
              </p>
            )}

            {/* Danger zone */}
            <div className="pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
              {confirmingDelete ? (
                <div className="flex flex-col gap-2 pt-3">
                  <p className="text-xs" style={{ color: 'var(--color-status-red)' }}>
                    Xóa {student.full_name}? Toàn bộ lịch sử điểm danh cảm xúc của bé sẽ mất, không thể hoàn tác.
                  </p>
                  {deleteError && (
                    <p className="text-xs font-medium" style={{ color: 'var(--color-status-red)' }}>{deleteError}</p>
                  )}
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setConfirmingDelete(false)} className="flex-1">
                      Hủy
                    </Button>
                    <Button
                      size="sm"
                      loading={deleting}
                      onClick={handleConfirmDelete}
                      className="flex-1"
                      style={{ backgroundColor: 'var(--color-status-red)' }}
                    >
                      Xóa vĩnh viễn
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmingDelete(true)}
                  className="text-xs font-medium pt-3"
                  style={{ color: 'var(--color-status-red)' }}
                >
                  🗑 Xóa học sinh
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    red:    { label: 'Cần quan tâm', color: 'var(--color-status-red)' },
    yellow: { label: 'Cần để ý',    color: '#B7791F' },
    green:  { label: 'Bình thường', color: 'var(--color-status-green)' },
  }[status] ?? { label: 'Bình thường', color: 'var(--color-status-green)' }

  return (
    <span className="text-xs font-medium" style={{ color: config.color }}>
      {config.label}
    </span>
  )
}
