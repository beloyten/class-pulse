-- Add UNIQUE constraint so persistFlags upsert (onConflict: 'student_id,triggered_at') works correctly.
-- Without this, every upsert in status route throws a DB error and flags are never persisted.
ALTER TABLE student_flags
  ADD CONSTRAINT student_flags_student_triggered_unique
  UNIQUE (student_id, triggered_at);
