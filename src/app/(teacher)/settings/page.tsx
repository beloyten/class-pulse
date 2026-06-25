import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Cài đặt' }
import { createClient } from '@/lib/supabase/server'
import TeacherHeader from '@/components/teacher/TeacherHeader'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: teacher } = await supabase
    .from('teachers')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-dvh" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <TeacherHeader title="Cài đặt" backHref="/dashboard" />

      <main className="px-4 py-6 max-w-lg mx-auto">
        <SettingsClient
          initialName={teacher?.full_name ?? ''}
          email={teacher?.email ?? user.email ?? ''}
        />
      </main>
    </div>
  )
}
