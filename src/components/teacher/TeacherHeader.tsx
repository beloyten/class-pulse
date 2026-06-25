'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, ChevronLeft } from 'lucide-react'

interface Props {
  title?: string
  backHref?: string
  actions?: React.ReactNode
}

export default function TeacherHeader({ title, backHref, actions }: Props) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between px-4 h-14 border-b"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        {backHref && (
          <Link
            href={backHref}
            className="flex items-center justify-center w-8 h-8 rounded-lg -ml-1"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <ChevronLeft size={20} />
          </Link>
        )}
        {title && (
          <span
            className="font-bold truncate text-base"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
          >
            {title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {actions}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ color: 'var(--color-text-muted)' }}
          title="Đăng xuất"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
