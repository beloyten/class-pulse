import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/observations
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { student_id, signal, note } = await request.json()
  if (!student_id || !signal) {
    return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 })
  }
  if (signal < 1 || signal > 3) {
    return NextResponse.json({ error: 'Signal không hợp lệ' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('teacher_signals')
    .insert({ student_id, teacher_id: user.id, signal, note: note ?? null })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ observation: data }, { status: 201 })
}
