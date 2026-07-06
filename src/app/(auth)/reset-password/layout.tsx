import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Đặt lại mật khẩu' }

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
