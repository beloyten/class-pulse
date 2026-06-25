import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      className="min-h-dvh flex flex-col items-center justify-center px-6 text-center gap-4"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="text-5xl">🔍</div>
      <h1
        className="text-2xl font-bold"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
      >
        Trang không tìm thấy
      </h1>
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        Đường dẫn này không tồn tại hoặc đã hết hạn
      </p>
      <Link
        href="/dashboard"
        className="px-6 py-3 rounded-xl text-white font-semibold text-sm"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        Về trang chủ
      </Link>
    </main>
  )
}
