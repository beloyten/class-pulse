'use client'

import { useEffect } from 'react'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main
      className="min-h-dvh flex flex-col items-center justify-center px-6 text-center gap-4"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="text-5xl">⚠️</div>
      <h1
        className="text-2xl font-bold"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
      >
        Có lỗi xảy ra
      </h1>
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        Xin lỗi vì sự bất tiện này. Thử lại hoặc tải lại trang.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl text-white font-semibold text-sm"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Thử lại
        </button>
        <a
          href="/dashboard"
          className="px-6 py-3 rounded-xl font-semibold text-sm border"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
        >
          Về trang chủ
        </a>
      </div>
    </main>
  )
}
