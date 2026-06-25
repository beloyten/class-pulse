'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, BookOpen } from 'lucide-react'
import CreateClassWizard from '@/components/teacher/CreateClassWizard'
import type { ClassWithStats } from '@/types'

interface Props {
  initialClasses: ClassWithStats[]
}

export default function DashboardClient({ initialClasses }: Props) {
  const [showCreate, setShowCreate] = useState(false)
  const router = useRouter()

  function handleCreateClose() {
    setShowCreate(false)
    router.refresh()
  }

  if (showCreate) {
    return (
      <div>
        <button
          onClick={() => setShowCreate(false)}
          className="mb-4 text-sm flex items-center gap-1"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          ← Quay lại
        </button>
        <CreateClassWizard onClose={handleCreateClose} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {initialClasses.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🏫</div>
          <p
            className="font-semibold text-base mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
          >
            Chưa có lớp nào
          </p>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
            Tạo lớp đầu tiên để bắt đầu
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Plus size={18} /> Tạo lớp mới
          </button>
        </div>
      ) : (
        <>
          {initialClasses.map(cls => (
            <Link
              key={cls.id}
              href={`/class/${cls.id}`}
              className="block rounded-2xl border p-4 transition-all hover:shadow-md active:scale-99"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className="font-bold text-base"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                  >
                    {cls.name}
                  </p>
                  {cls.school_name && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      {cls.school_name}
                    </p>
                  )}
                  <p className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
                    <BookOpen size={12} /> {cls.student_count} học sinh
                    {cls.checkin_count_today > 0 && (
                      <span style={{ color: 'var(--color-status-green)' }}>
                        · ✓ {cls.checkin_count_today} điểm danh
                      </span>
                    )}
                  </p>
                </div>

                {/* Status dots */}
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="flex items-center gap-1" style={{ color: 'var(--color-status-green)' }}>
                    🟢 {cls.green_count}
                  </span>
                  {cls.yellow_count > 0 && (
                    <span className="flex items-center gap-1" style={{ color: '#B7791F' }}>
                      🟡 {cls.yellow_count}
                    </span>
                  )}
                  {cls.red_count > 0 && (
                    <span className="flex items-center gap-1" style={{ color: 'var(--color-status-red)' }}>
                      🔴 {cls.red_count}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}

          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-4 text-sm font-medium transition-colors"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-muted)',
            }}
          >
            <Plus size={16} /> Thêm lớp mới
          </button>
        </>
      )}
    </div>
  )
}
