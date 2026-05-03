ALTER TABLE public.projects ADD COLUMN cover_url TEXT;

INSERT INTO storage.buckets (id, name, public) VALUES ('project-covers', 'project-covers', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Project covers are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-covers');

CREATE POLICY "Authenticated users upload project covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own project covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'project-covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own project covers"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-covers' AND auth.uid()::text = (storage.foldername(name))[1]);