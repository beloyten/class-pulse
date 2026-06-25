// Client-side Excel parser sử dụng xlsx
// Cột A = Họ và tên (bắt buộc), Cột B = Email phụ huynh (optional)

export interface ParsedStudent {
  full_name: string
  parent_email?: string
}

export interface ParseResult {
  students: ParsedStudent[]
  warnings: string[]
}

export async function parseExcelFile(file: File): Promise<ParseResult> {
  const XLSX = await import('xlsx')
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })

  const students: ParsedStudent[] = []
  const warnings: string[] = []

  // Bỏ qua hàng 1 (header)
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    const rawName = (row[0] ?? '').toString().trim()
    const rawEmail = (row[1] ?? '').toString().trim()

    if (!rawName) {
      if (row.some(cell => cell !== '')) {
        warnings.push(`Dòng ${i + 1} không có tên, đã bỏ qua`)
      }
      continue
    }

    const student: ParsedStudent = { full_name: rawName }

    if (rawEmail) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
        student.parent_email = rawEmail
      } else {
        warnings.push(`Dòng ${i + 1} (${rawName}): email phụ huynh không hợp lệ, đã bỏ qua email`)
      }
    }

    students.push(student)
  }

  return { students, warnings }
}

export async function generateExcelTemplate(): Promise<ArrayBuffer> {
  const XLSX = await import('xlsx')
  const ws = XLSX.utils.aoa_to_sheet([
    ['Họ và tên', 'Email phụ huynh'],
    ['Nguyễn Minh An', 'an.parent@gmail.com'],
    ['Trần Thu Bình', ''],
  ])
  ws['!cols'] = [{ wch: 25 }, { wch: 30 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Danh sách học sinh')
  const result = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as number[]
  return new Uint8Array(result).buffer
}
