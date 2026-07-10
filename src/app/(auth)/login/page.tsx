'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email hoặc mật khẩu không đúng')
      setLoading(false)
      return
    }

    router.refresh()
    router.push('/dashboard')
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
            ClassPulse
          </Link>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Đăng nhập để quản lý lớp học
          </p>
        </div>

        <div
          className="rounded-2xl p-6 shadow-sm border"
          style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
        >
          {/* Email/password form */}
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="giaovien@truong.edu.vn"
              required
              autoComplete="email"
            />
            <Input
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••"
              required
              autoComplete="current-password"
              error={error}
            />
            <Link
              href="/forgot-password"
              className="text-sm text-right -mt-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Quên mật khẩu?
            </Link>
            <Button type="submit" loading={loading} className="w-full mt-1">
              Đăng nhập
            </Button>
          </form>
        </div>

        <p className="text-center mt-5 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Chưa có tài khoản?{' '}
          <Link href="/register" className="font-semibold" style={{ color: 'var(--color-primary)' }}>
            Đăng ký miễn phí
          </Link>
        </p>
      </div>
    </main>
  )
}
