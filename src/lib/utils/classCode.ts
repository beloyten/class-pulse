const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
// Bỏ O, 0, I, 1 để tránh nhầm lẫn

export function generateClassCode(): string {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return code
}

export function parseStudentList(raw: string): { full_name: string; parent_email?: string }[] {
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => ({ full_name: line }))
}
