'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    // Luôn hiện thông báo thành công dù email có tồn tại hay không (tránh lộ thông tin email đã đăng ký)
    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="text-5xl mb-4">📬</div>
        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Kiểm tra email của bạn
        </h2>
        <p className="text-sm max-w-xs" style={{ color: 'var(--color-text-secondary)' }}>
          Nếu <strong>{email}</strong> đã đăng ký, chúng tôi đã gửi link đặt lại mật khẩu đến email đó.
        </p>
        <Link href="/login" className="mt-6 text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
          Quay lại đăng nhập
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
            ClassPulse
          </Link>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Nhập email để nhận link đặt lại mật khẩu
          </p>
        </div>

        <div
          className="rounded-2xl p-6 shadow-sm border"
          style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="giaovien@truong.edu.vn"
              required
              autoComplete="email"
            />
            <Button type="submit" loading={loading} className="w-full mt-1">
              Gửi link đặt lại mật khẩu
            </Button>
          </form>
        </div>

        <p className="text-center mt-5 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          <Link href="/login" className="font-semibold" style={{ color: 'var(--color-primary)' }}>
            ← Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </main>
  )
}
