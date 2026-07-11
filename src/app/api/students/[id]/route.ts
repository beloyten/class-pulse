import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

// PATCH /api/students/[id] — edit student info
export async function PATCH(
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

  // RLS (teacher_own_students) already scopes this update to classes owned by the caller;
  // .select().single() lets us tell "not found/not owned" apart from a real server error.
  const { data, error } = await supabase
    .from('students')
    .update({ full_name: full_name.trim(), parent_email: parent_email?.trim() || null })
    .eq('id', id)
    .select().single()

  if (error || !data) return NextResponse.json({ error: 'Không tìm thấy học sinh' }, { status: 404 })
  return NextResponse.json({ student: data })
}

// DELETE /api/students/[id] — remove a student + cascade their mood/flag/report history
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify ownership via RLS-scoped client first (teacher_own_students only
  // lets this SELECT return a row if the student's class belongs to this teacher).
  const { data: owned } = await supabase
    .from('students')
    .select('id')
    .eq('id', id)
    .single()

  if (!owned) return NextResponse.json({ error: 'Không tìm thấy học sinh' }, { status: 404 })

  // Cascade xóa mood_logs/weekly_reports không có DELETE policy cho user thường
  // (RLS chỉ cho SELECT/INSERT) — phải dùng service client mới xóa hết được.
  const serviceClient = createServiceClient()
  const { data, error } = await serviceClient
    .from('students')
    .delete()
    .eq('id', id)
    .select().single()

  if (error || !data) return NextResponse.json({ error: 'Không tìm thấy học sinh' }, { status: 404 })
  return NextResponse.json({ success: true })
}
