'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { X, Settings, Plus } from 'lucide-react'
import StudentDetail from '@/components/teacher/StudentDetail'
import AvatarSelectionSession from '@/components/teacher/AvatarSelectionSession'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
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
  grade: number | null
}

interface Props {
  cls: ClassInfo
  students: StudentWithHistory[]
  setupAvatars?: Avatar[]
  baseStudents?: Student[]
}

export default function ClassDetailClient({ cls, students, setupAvatars, baseStudents }: Props) {
  const [selected, setSelected] = useState<StudentWithHistory | null>(null)
  const [showSetup, setShowSetup] = useState(!!setupAvatars)
  const [changingAvatarId, setChangingAvatarId] = useState<string | null>(null)
  const [avatarList, setAvatarList] = useState<Avatar[]>([])
  const router = useRouter()

  // Class settings modal
  const [showClassSettings, setShowClassSettings] = useState(false)
  const [className, setClassName] = useState(cls.name)
  const [classSchool, setClassSchool] = useState(cls.school_name ?? '')
  const [classGrade, setClassGrade] = useState(cls.grade?.toString() ?? '')
  const [savingClass, setSavingClass] = useState(false)
  const [classError, setClassError] = useState('')
  const [confirmingDeleteClass, setConfirmingDeleteClass] = useState(false)
  const [deleteClassText, setDeleteClassText] = useState('')
  const [deletingClass, setDeletingClass] = useState(false)
  const [deleteClassError, setDeleteClassError] = useState('')

  // Add student modal
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [newStudentName, setNewStudentName] = useState('')
  const [newStudentEmail, setNewStudentEmail] = useState('')
  const [addingStudent, setAddingStudent] = useState(false)
  const [addStudentError, setAddStudentError] = useState('')

  // Nạp sẵn danh sách linh vật để dùng khi GV bấm "Đổi linh vật" cho 1 bé
  useEffect(() => {
    createClient().from('avatars').select('*').order('id').then(({ data }) => {
      if (data) setAvatarList(data as Avatar[])
    })
  }, [])

  // Sync selected student with fresh data after router.refresh().
  // Deps intentionally exclude `selected`: this should only re-run when `students`
  // changes (i.e. after a refetch), not every time it sets its own state below.
  useEffect(() => {
    if (selected) {
      const updated = students.find(s => s.id === selected.id)
      if (updated) setSelected(updated)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  function handleChangeAvatarComplete() {
    setChangingAvatarId(null)
    router.refresh()
  }

  async function handleSaveClass() {
    if (!className.trim()) return
    if (classGrade && (Number(classGrade) < 1 || Number(classGrade) > 12)) {
      setClassError('Khối phải từ 1 đến 12')
      return
    }
    setClassError('')
    setSavingClass(true)
    const res = await fetch(`/api/classes/${cls.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: className,
        school_name: classSchool || undefined,
        grade: classGrade ? Number(classGrade) : undefined,
      }),
    })
    setSavingClass(false)
    if (res.ok) {
      setShowClassSettings(false)
      router.refresh()
    } else {
      setClassError('Không lưu được. Thử lại nhé.')
    }
  }

  async function handleDeleteClass() {
    setDeletingClass(true)
    setDeleteClassError('')
    const res = await fetch(`/api/classes/${cls.id}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/dashboard')
    } else {
      setDeletingClass(false)
      setDeleteClassError('Không xóa được. Thử lại nhé.')
    }
  }

  async function handleAddStudent() {
    if (!newStudentName.trim()) return
    setAddStudentError('')
    setAddingStudent(true)
    const res = await fetch(`/api/classes/${cls.id}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: newStudentName, parent_email: newStudentEmail || undefined }),
    })
    setAddingStudent(false)
    if (res.ok) {
      setShowAddStudent(false)
      setNewStudentName('')
      setNewStudentEmail('')
      router.refresh()
    } else {
      setAddStudentError('Không thêm được. Thử lại nhé.')
    }
  }

  const handleEditStudent = useCallback(async (studentId: string, fullName: string, parentEmail: string) => {
    const res = await fetch(`/api/students/${studentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, parent_email: parentEmail || undefined }),
    })
    if (res.ok) router.refresh()
    return res.ok
  }, [router])

  const handleDeleteStudent = useCallback(async (studentId: string) => {
    const res = await fetch(`/api/students/${studentId}`, { method: 'DELETE' })
    if (res.ok) {
      setSelected(null)
      router.refresh()
    }
    return res.ok
  }, [router])

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
      {/* Class actions */}
      <div className="flex items-center justify-end gap-4 mb-3">
        <button
          onClick={() => {
            setClassName(cls.name)
            setClassSchool(cls.school_name ?? '')
            setClassGrade(cls.grade?.toString() ?? '')
            setClassError('')
            setShowClassSettings(true)
          }}
          className="flex items-center gap-1 text-xs font-medium"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <Settings size={14} /> Quản lý lớp
        </button>
      </div>

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
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Danh sách học sinh
        </p>
        <button
          onClick={() => { setAddStudentError(''); setNewStudentName(''); setNewStudentEmail(''); setShowAddStudent(true) }}
          className="flex items-center gap-1 text-xs font-semibold"
          style={{ color: 'var(--color-primary)' }}
        >
          <Plus size={14} /> Thêm học sinh
        </button>
      </div>
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
                <div className="flex items-center gap-1.5">
                  <p
                    className="font-semibold text-sm truncate"
                    style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}
                  >
                    {student.full_name}
                  </p>
                  {student.today_signal !== null && (
                    <span
                      className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--color-status-green)22', color: 'var(--color-status-green)' }}
                    >
                      ✓ Đã ghi nhận
                    </span>
                  )}
                </div>
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
          onChangeAvatar={() => {
            setChangingAvatarId(selected.id)
            setSelected(null)
          }}
          onEditStudent={handleEditStudent}
          onDeleteStudent={handleDeleteStudent}
        />
      )}

      {changingAvatarId && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="fixed inset-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={() => setChangingAvatarId(null)}
          />
          <div
            className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 max-h-[92dvh] overflow-y-auto"
            style={{ backgroundColor: 'var(--color-bg-card)' }}
          >
            <button
              onClick={() => setChangingAvatarId(null)}
              className="absolute right-4 top-4 z-10"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <X size={20} />
            </button>
            {avatarList.length > 0 ? (
              <AvatarSelectionSession
                students={students.map(toBaseStudent)}
                avatars={avatarList}
                singleStudentId={changingAvatarId}
                onComplete={handleChangeAvatarComplete}
              />
            ) : (
              <p className="text-center py-8 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Đang tải...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Class settings modal */}
      {showClassSettings && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="fixed inset-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={() => { setShowClassSettings(false); setConfirmingDeleteClass(false) }}
          />
          <div
            className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 max-h-[92dvh] overflow-y-auto flex flex-col gap-4"
            style={{ backgroundColor: 'var(--color-bg-card)' }}
          >
            <div className="flex items-center justify-between">
              <p className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                Quản lý lớp
              </p>
              <button
                onClick={() => { setShowClassSettings(false); setConfirmingDeleteClass(false) }}
                style={{ color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <Input label="Tên lớp" value={className} onChange={e => setClassName(e.target.value)} required />
            <Input label="Trường (không bắt buộc)" value={classSchool} onChange={e => setClassSchool(e.target.value)} />
            <Input
              label="Khối (không bắt buộc)"
              type="number"
              min={1}
              max={12}
              value={classGrade}
              onChange={e => setClassGrade(e.target.value)}
              error={classError}
            />
            <Button loading={savingClass} onClick={handleSaveClass} className="w-full">
              Lưu thay đổi
            </Button>

            <div className="pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
              {confirmingDeleteClass ? (
                <div className="flex flex-col gap-2 pt-3">
                  <p className="text-xs" style={{ color: 'var(--color-status-red)' }}>
                    Xóa lớp <strong>{cls.name}</strong> sẽ xóa toàn bộ học sinh, lịch sử điểm danh cảm xúc, quan sát và báo cáo liên quan — không thể hoàn tác.
                    Gõ đúng tên lớp để xác nhận:
                  </p>
                  <Input
                    value={deleteClassText}
                    onChange={e => setDeleteClassText(e.target.value)}
                    placeholder={cls.name}
                  />
                  {deleteClassError && (
                    <p className="text-xs font-medium" style={{ color: 'var(--color-status-red)' }}>{deleteClassError}</p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => { setConfirmingDeleteClass(false); setDeleteClassText('') }}
                      className="flex-1"
                    >
                      Hủy
                    </Button>
                    <Button
                      size="sm"
                      disabled={deleteClassText !== cls.name}
                      loading={deletingClass}
                      onClick={handleDeleteClass}
                      className="flex-1"
                      style={{ backgroundColor: 'var(--color-status-red)' }}
                    >
                      Xóa lớp vĩnh viễn
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmingDeleteClass(true)}
                  className="text-xs font-medium pt-3"
                  style={{ color: 'var(--color-status-red)' }}
                >
                  🗑 Xóa lớp
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add student modal */}
      {showAddStudent && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="fixed inset-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={() => setShowAddStudent(false)}
          />
          <div
            className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 max-h-[92dvh] overflow-y-auto flex flex-col gap-4"
            style={{ backgroundColor: 'var(--color-bg-card)' }}
          >
            <div className="flex items-center justify-between">
              <p className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                Thêm học sinh
              </p>
              <button onClick={() => setShowAddStudent(false)} style={{ color: 'var(--color-text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <Input
              label="Họ và tên"
              value={newStudentName}
              onChange={e => setNewStudentName(e.target.value)}
              placeholder="Nguyễn Văn A"
              required
            />
            <Input
              label="Email phụ huynh (không bắt buộc)"
              type="email"
              value={newStudentEmail}
              onChange={e => setNewStudentEmail(e.target.value)}
              placeholder="phuhuynh@gmail.com"
            />
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Bé sẽ chưa có linh vật — vào chi tiết bé sau khi thêm để chọn linh vật cho bé.
            </p>
            {addStudentError && (
              <p className="text-xs" style={{ color: 'var(--color-status-red)' }}>{addStudentError}</p>
            )}
            <Button loading={addingStudent} onClick={handleAddStudent} className="w-full">
              Thêm học sinh
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

function toBaseStudent(s: StudentWithHistory): Student {
  return {
    id: s.id,
    class_id: s.class_id,
    full_name: s.full_name,
    order_number: s.order_number,
    avatar_id: s.avatar_id,
    parent_email: s.parent_email,
    streak_count: s.streak_count,
    last_checkin_date: s.last_checkin_date,
    created_at: s.created_at,
  }
}

function getTodayMoodEmoji(mood: number | null): string {
  if (mood === null) return '—'
  if (mood === 0) return '⬜'
  if (mood === 1) return '😊'
  if (mood === 2) return '😐'
  return '🙁'
}
