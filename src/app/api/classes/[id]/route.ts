import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

// PATCH /api/classes/[id] — update class info
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, school_name, grade } = await request.json()
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Thiếu tên lớp' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('classes')
    .update({ name: name.trim(), school_name: school_name?.trim() || null, grade: grade || null })
    .eq('id', id)
    .eq('teacher_id', user.id)
    .select().single()

  if (error || !data) return NextResponse.json({ error: 'Không tìm thấy lớp' }, { status: 404 })
  return NextResponse.json({ class: data })
}

// DELETE /api/classes/[id] — delete class + cascade all related data
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Cascade xóa mood_logs/weekly_reports không có DELETE policy cho user thường
  // (RLS chỉ cho SELECT/INSERT) — phải dùng service client mới xóa hết được.
  const serviceClient = createServiceClient()
  const { data, error } = await serviceClient
    .from('classes')
    .delete()
    .eq('id', id)
    .eq('teacher_id', user.id)
    .select().single()

  if (error || !data) return NextResponse.json({ error: 'Không tìm thấy lớp' }, { status: 404 })
  return NextResponse.json({ success: true })
}
