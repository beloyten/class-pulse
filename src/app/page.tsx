import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-lg">
        <div className="text-6xl mb-6">🏫</div>
        <h1
          className="text-4xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}
        >
          ClassPulse
        </h1>
        <p
          className="text-lg mb-2"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Lắng nghe lớp học mỗi ngày
        </p>
        <p
          className="text-sm mb-10 max-w-sm mx-auto"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Hỗ trợ giáo viên phát hiện sớm những thay đổi nhỏ của học sinh — thứ mà con người rất dễ bỏ sót trong một lớp học đông học sinh.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="px-8 py-3 rounded-xl text-white font-semibold text-base transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Đăng ký dùng thử
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 rounded-xl font-semibold text-base transition-colors border"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            Đăng nhập
          </Link>
        </div>

        <p
          className="mt-8 text-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Dữ liệu chỉ dùng để hỗ trợ giáo viên — không chia sẻ bên ngoài
        </p>
      </div>
    </main>
  )
}
