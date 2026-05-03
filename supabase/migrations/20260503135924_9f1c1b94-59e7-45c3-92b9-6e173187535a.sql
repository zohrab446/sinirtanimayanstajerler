ALTER TABLE public.applications
  ADD CONSTRAINT applications_student_id_profiles_fkey
  FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE;