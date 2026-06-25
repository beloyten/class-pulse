-- Add unique constraint so cron can upsert by (student_id, week_start)
ALTER TABLE weekly_reports
  ADD CONSTRAINT weekly_reports_student_week_unique
  UNIQUE (student_id, week_start);
