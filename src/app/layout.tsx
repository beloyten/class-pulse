import type { Metadata } from 'next'
import { Inter, Nunito } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-body',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ClassPulse — Lắng nghe lớp học mỗi ngày',
    template: '%s | ClassPulse',
  },
  description: 'Hệ thống hỗ trợ giáo viên phát hiện sớm những thay đổi của học sinh qua điểm danh cảm xúc hằng ngày.',
  openGraph: {
    title: 'ClassPulse — Lắng nghe lớp học mỗi ngày',
    description: 'Hệ thống hỗ trợ giáo viên phát hiện sớm những thay đổi của học sinh qua điểm danh cảm xúc hằng ngày.',
    type: 'website',
    locale: 'vi_VN',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${nunito.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
