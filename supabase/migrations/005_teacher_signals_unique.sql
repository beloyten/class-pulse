-- One observation per teacher per student per day.
-- Without this, saving an observation always inserts a new row, so repeated
-- saves for the same student on the same day silently pile up as duplicates
-- (and skew rules that read "3 most recent signals", e.g. mixed_signal).
ALTER TABLE teacher_signals
  ADD COLUMN signal_date date GENERATED ALWAYS AS ((created_at AT TIME ZONE 'UTC')::date) STORED;

ALTER TABLE teacher_signals
  ADD CONSTRAINT teacher_signals_student_teacher_date_unique
  UNIQUE (student_id, teacher_id, signal_date);
