'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Props {
  initialName: string
  email: string
}

export default function SettingsClient({ initialName, email }: Props) {
  const [name, setName] = useState(initialName)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError('')
    setSaved(false)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Phiên đăng nhập đã hết hạn.')
      setSaving(false)
      return
    }
    const { error: err } = await supabase
      .from('teachers')
      .update({ full_name: name.trim() })
      .eq('id', user.id)

    setSaving(false)
    if (err) {
      setError('Không lưu được. Thử lại nhé.')
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Profile */}
      <div
        className="rounded-2xl p-5 flex flex-col gap-4"
        style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
      >
        <p className="text-xs font-semibold tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
          HỒ SƠ
        </p>

        <form onSubmit={handleSaveName} className="flex flex-col gap-3">
          <Input
            label="Tên hiển thị"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nguyễn Thị Lan"
          />
          <div>
            <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Email
            </p>
            <p className="text-sm px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)' }}>
              {email}
            </p>
          </div>

          {error && <p className="text-sm" style={{ color: 'var(--color-status-red)' }}>{error}</p>}

          <Button type="submit" loading={saving} size="sm" className="self-end">
            {saved ? '✓ Đã lưu' : 'Lưu tên'}
          </Button>
        </form>
      </div>

      {/* App version */}
      <p className="text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
        ClassPulse · MVP v1.0
      </p>
    </div>
  )
}
