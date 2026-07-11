import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/classes/[id]/students — add a new student to an existing class
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { full_name, parent_email } = await request.json()
  if (!full_name?.trim()) {
    return NextResponse.json({ error: 'Thiếu tên học sinh' }, { status: 400 })
  }

  const { data: cls } = await supabase
    .from('classes')
    .select('id')
    .eq('id', id)
    .eq('teacher_id', user.id)
    .single()

  if (!cls) return NextResponse.json({ error: 'Không tìm thấy lớp' }, { status: 404 })

  const { data: last } = await supabase
    .from('students')
    .select('order_number')
    .eq('class_id', id)
    .order('order_number', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: student, error } = await supabase
    .from('students')
    .insert({
      class_id: id,
      full_name: full_name.trim(),
      order_number: (last?.order_number ?? 0) + 1,
      parent_email: parent_email?.trim() || null,
    })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ student }, { status: 201 })
}
