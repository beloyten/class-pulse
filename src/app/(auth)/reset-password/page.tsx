'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [checkingSession, setCheckingSession] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setHasSession(!!user)
      setCheckingSession(false)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Mật khẩu tối thiểu 6 ký tự')
      return
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError('Không đổi được mật khẩu, thử lại nhé')
      return
    }

    setDone(true)
    setTimeout(() => router.push('/dashboard'), 1500)
  }

  if (checkingSession) return null

  if (!hasSession) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="text-5xl mb-4">⏰</div>
        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Link đã hết hạn
        </h2>
        <p className="text-sm max-w-xs" style={{ color: 'var(--color-text-secondary)' }}>
          Link đặt lại mật khẩu không còn hiệu lực. Hãy yêu cầu gửi lại nhé.
        </p>
        <Link href="/forgot-password" className="mt-6 text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
          Yêu cầu lại
        </Link>
      </main>
    )
  }

  if (done) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Đã đổi mật khẩu
        </h2>
        <p className="text-sm max-w-xs" style={{ color: 'var(--color-text-secondary)' }}>
          Đang chuyển tới dashboard...
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
            ClassPulse
          </p>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Đặt mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        <div
          className="rounded-2xl p-6 shadow-sm border"
          style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Mật khẩu mới"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              required
              autoComplete="new-password"
            />
            <Input
              label="Nhập lại mật khẩu"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              required
              autoComplete="new-password"
              error={error}
            />
            <Button type="submit" loading={loading} className="w-full mt-1">
              Đổi mật khẩu
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
