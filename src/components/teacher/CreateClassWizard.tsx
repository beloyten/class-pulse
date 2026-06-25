'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { parseStudentList } from '@/lib/utils/classCode'
import { parseExcelFile, generateExcelTemplate, type ParsedStudent } from '@/lib/utils/excelParser'

type Step = 'info' | 'students' | 'confirm'
type InputMode = 'paste' | 'excel'

export default function CreateClassWizard({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Step 1: class info
  const [step, setStep] = useState<Step>('info')
  const [name, setName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [grade, setGrade] = useState('')

  // Step 2: students
  const [inputMode, setInputMode] = useState<InputMode>('paste')
  const [pasteText, setPasteText] = useState('')
  const [students, setStudents] = useState<ParsedStudent[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  // Submit
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setStep('students')
  }

  function handleParsePaste() {
    const parsed = parseStudentList(pasteText)
    setStudents(parsed)
    setWarnings([])
    if (parsed.length > 0) setStep('confirm')
  }

  async function handleExcelUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setSubmitError('')
    try {
      const result = await parseExcelFile(file)
      setStudents(result.students)
      setWarnings(result.warnings)
      if (result.students.length === 0) {
        setSubmitError('File không có dữ liệu học sinh. Hãy kiểm tra lại template.')
      } else {
        setStep('confirm')
      }
    } catch {
      setSubmitError('Không đọc được file. Hãy dùng đúng template Excel.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function downloadTemplate() {
    const data = await generateExcelTemplate()
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'danh-sach-hoc-sinh-mau.xlsx'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleSubmit() {
    setSubmitting(true)
    setSubmitError('')

    const res = await fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        school_name: schoolName.trim() || undefined,
        grade: grade ? parseInt(grade) : undefined,
        students,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setSubmitError(data.error ?? 'Có lỗi xảy ra')
      setSubmitting(false)
      return
    }

    const data = await res.json()
    router.push(`/class/${data.class.id}?new=1`)
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 text-sm">
        {(['info', 'students', 'confirm'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: step === s ? 'var(--color-primary)' : s < step ? 'var(--color-status-green)' : 'var(--color-border)',
                color: step === s || s < step ? 'white' : 'var(--color-text-muted)',
              }}
            >
              {i + 1}
            </div>
            {i < 2 && <div className="h-px w-8 flex-1" style={{ backgroundColor: 'var(--color-border)' }} />}
          </div>
        ))}
        <span className="ml-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {step === 'info' ? 'Thông tin lớp' : step === 'students' ? 'Danh sách học sinh' : 'Xác nhận'}
        </span>
      </div>

      {/* Step 1: Class info */}
      {step === 'info' && (
        <form onSubmit={handleStep1} className="flex flex-col gap-4">
          <Input
            label="Tên lớp *"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Lớp 3A"
            required
          />
          <Input
            label="Tên trường (không bắt buộc)"
            value={schoolName}
            onChange={e => setSchoolName(e.target.value)}
            placeholder="Tiểu học Nguyễn Du"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
              Khối lớp (không bắt buộc)
            </label>
            <select
              value={grade}
              onChange={e => setGrade(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border outline-none text-base"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-bg-card)',
                color: grade ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              }}
            >
              <option value="">Chọn khối...</option>
              {[1, 2, 3, 4, 5].map(g => (
                <option key={g} value={g}>Khối {g}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 mt-2">
            <Button variant="secondary" type="button" onClick={onClose} className="flex-1">
              Hủy
            </Button>
            <Button type="submit" className="flex-1">
              Tiếp tục →
            </Button>
          </div>
        </form>
      )}

      {/* Step 2: Students */}
      {step === 'students' && (
        <div className="flex flex-col gap-4">
          {/* Mode toggle */}
          <div
            className="flex rounded-xl p-1 gap-1"
            style={{ backgroundColor: 'var(--color-bg-secondary)' }}
          >
            {(['paste', 'excel'] as InputMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setInputMode(mode)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: inputMode === mode ? 'white' : 'transparent',
                  color: inputMode === mode ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  boxShadow: inputMode === mode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {mode === 'paste' ? '📋 Dán danh sách' : '📊 Upload Excel'}
              </button>
            ))}
          </div>

          {inputMode === 'paste' && (
            <div className="flex flex-col gap-3">
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Dán danh sách học sinh (mỗi dòng 1 tên):
              </p>
              <textarea
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
                rows={8}
                placeholder={'Nguyễn Minh An\nTrần Thu Bình\nLê Hoàng Cúc'}
                className="w-full px-4 py-3 rounded-xl border outline-none text-base resize-none"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-bg-card)',
                  fontFamily: 'monospace',
                }}
              />
              {pasteText.trim() && (
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Đã đếm: {pasteText.trim().split('\n').filter(l => l.trim()).length} học sinh
                </p>
              )}
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep('info')} className="flex-1">
                  ← Quay lại
                </Button>
                <Button
                  onClick={handleParsePaste}
                  disabled={!pasteText.trim()}
                  className="flex-1"
                >
                  Tiếp tục →
                </Button>
              </div>
            </div>
          )}

          {inputMode === 'excel' && (
            <div className="flex flex-col gap-3">
              <Button variant="ghost" size="sm" onClick={downloadTemplate} type="button">
                📥 Tải template Excel mẫu
              </Button>
              <div
                className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer"
                style={{ borderColor: 'var(--color-border)' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <p className="text-2xl mb-2">📊</p>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  {uploading ? 'Đang đọc file...' : 'Nhấn để chọn file Excel'}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  Chấp nhận .xlsx, .csv
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.csv"
                className="hidden"
                onChange={handleExcelUpload}
              />
              {warnings.length > 0 && (
                <div
                  className="rounded-xl p-3 text-sm flex flex-col gap-1"
                  style={{ backgroundColor: '#FFF9E6', color: '#B7791F' }}
                >
                  {warnings.map((w, i) => <p key={i}>⚠️ {w}</p>)}
                </div>
              )}
              {submitError && (
                <p className="text-sm" style={{ color: 'var(--color-status-red)' }}>{submitError}</p>
              )}
              <Button variant="secondary" onClick={() => setStep('info')}>
                ← Quay lại
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 'confirm' && (
        <div className="flex flex-col gap-4">
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: 'var(--color-bg-secondary)' }}
          >
            <p className="font-semibold text-base" style={{ fontFamily: 'var(--font-display)' }}>
              {name} {grade ? `— Khối ${grade}` : ''}
            </p>
            {schoolName && (
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                {schoolName}
              </p>
            )}
            <p className="text-sm mt-2 font-medium" style={{ color: 'var(--color-primary)' }}>
              ✅ {students.length} học sinh
            </p>
          </div>

          {/* Student list preview */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div
              className="px-4 py-2 text-xs font-medium flex justify-between"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <span>STT</span>
              <span>Họ và tên</span>
              <span>Email PH</span>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '240px' }}>
              {students.map((s, i) => (
                <div
                  key={i}
                  className="px-4 py-2.5 flex items-center justify-between text-sm border-t"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <span style={{ color: 'var(--color-text-muted)' }}>{i + 1}</span>
                  <span className="flex-1 mx-3 font-medium">{s.full_name}</span>
                  <span
                    className="text-xs truncate"
                    style={{ color: 'var(--color-text-muted)', maxWidth: '100px' }}
                  >
                    {s.parent_email ?? '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {warnings.length > 0 && (
            <div
              className="rounded-xl p-3 text-sm flex flex-col gap-1"
              style={{ backgroundColor: '#FFF9E6', color: '#B7791F' }}
            >
              {warnings.map((w, i) => <p key={i}>⚠️ {w}</p>)}
            </div>
          )}

          {submitError && (
            <p className="text-sm" style={{ color: 'var(--color-status-red)' }}>
              {submitError}
            </p>
          )}

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep('students')} className="flex-1">
              ← Đổi file
            </Button>
            <Button onClick={handleSubmit} loading={submitting} className="flex-1">
              Tạo lớp 🎉
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
