import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Quên mật khẩu' }

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
