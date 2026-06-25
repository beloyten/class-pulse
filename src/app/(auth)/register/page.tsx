'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Mật khẩu tối thiểu 6 ký tự')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      setError(signUpError.message === 'User already registered'
        ? 'Email này đã được đăng ký rồi'
        : 'Có lỗi xảy ra, thử lại nhé')
      setLoading(false)
      return
    }

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
          Chúng tôi đã gửi link xác nhận đến <strong>{email}</strong>. Nhấn vào link để kích hoạt tài khoản.
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
            Tạo tài khoản miễn phí
          </p>
        </div>

        <div
          className="rounded-2xl p-6 shadow-sm border"
          style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
        >
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <Input
              label="Họ và tên"
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Nguyễn Thị Hương"
              required
              autoComplete="name"
            />
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
              placeholder="Tối thiểu 6 ký tự"
              required
              autoComplete="new-password"
              error={error}
            />
            <Button type="submit" loading={loading} className="w-full mt-1">
              Đăng ký
            </Button>
          </form>

          <p
            className="text-xs text-center mt-4"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Dữ liệu học sinh chỉ dùng để hỗ trợ giáo viên — không chia sẻ bên ngoài
          </p>
        </div>

        <p className="text-center mt-5 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Đã có tài khoản?{' '}
          <Link href="/login" className="font-semibold" style={{ color: 'var(--color-primary)' }}>
            Đăng nhập
          </Link>
        </p>
      </div>
    </main>
  )
}
