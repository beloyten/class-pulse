-- ClassPulse — Initial Schema
-- Run in Supabase SQL editor or via supabase db push

-- ─── Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── teachers ─────────────────────────────────────────────────────────────────
CREATE TABLE teachers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text NOT NULL UNIQUE,
  full_name   text NOT NULL,
  avatar_url  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ─── classes ──────────────────────────────────────────────────────────────────
CREATE TABLE classes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id  uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  name        text NOT NULL,
  code        text NOT NULL UNIQUE,
  school_name text,
  grade       smallint CHECK (grade BETWEEN 1 AND 12),
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_classes_code ON classes (code);
CREATE INDEX idx_classes_teacher ON classes (teacher_id);

-- ─── avatars ──────────────────────────────────────────────────────────────────
CREATE TABLE avatars (
  id        smallint PRIMARY KEY,
  name      text NOT NULL,
  emoji     text NOT NULL,
  color     text NOT NULL,
  svg_path  text NOT NULL,
  category  text NOT NULL CHECK (category IN ('mammal', 'bird', 'sea', 'insect'))
);

-- ─── students ─────────────────────────────────────────────────────────────────
CREATE TABLE students (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id            uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  full_name           text NOT NULL,
  order_number        smallint NOT NULL,
  avatar_id           smallint REFERENCES avatars(id),
  parent_email        text,
  streak_count        integer NOT NULL DEFAULT 0,
  last_checkin_date   date,
  created_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (class_id, order_number),
  UNIQUE (class_id, avatar_id)
);

CREATE INDEX idx_students_class ON students (class_id, order_number);

-- ─── mood_logs ────────────────────────────────────────────────────────────────
CREATE TABLE mood_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id    uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  mood        smallint NOT NULL CHECK (mood BETWEEN 0 AND 3),
  checked_at  date NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, checked_at)
);

CREATE INDEX idx_mood_logs_student_date ON mood_logs (student_id, checked_at DESC);
CREATE INDEX idx_mood_logs_class_date   ON mood_logs (class_id, checked_at DESC);

-- ─── teacher_signals ──────────────────────────────────────────────────────────
CREATE TABLE teacher_signals (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id  uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  signal      smallint NOT NULL CHECK (signal BETWEEN 1 AND 3),
  note        text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_teacher_signals_student ON teacher_signals (student_id, created_at DESC);

-- ─── student_flags ────────────────────────────────────────────────────────────
CREATE TABLE student_flags (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  rule_triggered  text NOT NULL,
  severity        smallint NOT NULL CHECK (severity BETWEEN 1 AND 3),
  reason          text NOT NULL,
  is_active       boolean NOT NULL DEFAULT true,
  triggered_at    date NOT NULL,
  resolved_at     timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_flags_student_active ON student_flags (student_id, is_active);

-- ─── weekly_reports ───────────────────────────────────────────────────────────
CREATE TABLE weekly_reports (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  week_start    date NOT NULL,
  mood_summary  jsonb NOT NULL,
  token         text NOT NULL UNIQUE,
  sent_at       timestamptz,
  expires_at    timestamptz NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_token      ON weekly_reports (token);
CREATE INDEX idx_reports_student    ON weekly_reports (student_id, week_start DESC);

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE teachers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE students        ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_flags   ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports  ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatars         ENABLE ROW LEVEL SECURITY;

-- Avatars: public read
CREATE POLICY "avatars_public_read" ON avatars
  FOR SELECT USING (true);

-- Teachers: chỉ đọc/sửa profile của mình
CREATE POLICY "teacher_own_profile" ON teachers
  FOR ALL USING (id = auth.uid());

-- Classes: GV chỉ thấy lớp của mình
CREATE POLICY "teacher_own_classes" ON classes
  FOR ALL USING (teacher_id = auth.uid());

-- Students: GV chỉ thấy HS trong lớp của mình
CREATE POLICY "teacher_own_students" ON students
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM classes c
      WHERE c.id = students.class_id AND c.teacher_id = auth.uid()
    )
  );

-- Mood logs: insert public (điểm danh không cần auth) nhưng validate class_id
CREATE POLICY "public_checkin_insert" ON mood_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM students s
      JOIN classes c ON c.id = s.class_id
      WHERE s.id = mood_logs.student_id
        AND s.class_id = mood_logs.class_id
        AND c.is_active = true
    )
  );

-- Mood logs: GV chỉ đọc mood của lớp mình
CREATE POLICY "teacher_read_mood" ON mood_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM classes c
      JOIN students s ON s.class_id = c.id
      WHERE s.id = mood_logs.student_id AND c.teacher_id = auth.uid()
    )
  );

-- Teacher signals: GV chỉ đọc/ghi signal cho HS trong lớp mình
CREATE POLICY "teacher_own_signals" ON teacher_signals
  FOR ALL USING (teacher_id = auth.uid());

-- Student flags: GV chỉ đọc/ghi flag cho lớp mình
CREATE POLICY "teacher_own_flags" ON student_flags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM students s
      JOIN classes c ON c.id = s.class_id
      WHERE s.id = student_flags.student_id AND c.teacher_id = auth.uid()
    )
  );

-- Weekly reports: read bằng token (public), write chỉ service role (cron)
CREATE POLICY "report_public_read_by_token" ON weekly_reports
  FOR SELECT USING (true);
