-- Bug fix: no code path ever inserted into public.teachers after auth signup,
-- so classes.teacher_id FK violated on first class creation for every new user.
-- This trigger provisions a teachers row automatically for both email and OAuth signups.

CREATE FUNCTION public.handle_new_teacher()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.teachers (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_teacher();

-- Backfill: create teachers rows for any existing auth users missing one
-- (fixes accounts that already hit the FK error, e.g. before this migration ran)
INSERT INTO public.teachers (id, email, full_name, avatar_url)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', u.email),
  u.raw_user_meta_data->>'avatar_url'
FROM auth.users u
LEFT JOIN public.teachers t ON t.id = u.id
WHERE t.id IS NULL;
