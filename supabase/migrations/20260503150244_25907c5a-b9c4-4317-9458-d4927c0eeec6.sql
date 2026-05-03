
ALTER TABLE public.tasks 
  ADD COLUMN IF NOT EXISTS submission_url TEXT,
  ADD COLUMN IF NOT EXISTS submission_filename TEXT,
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS submitted_by UUID;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('task-submissions', 'task-submissions', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Engagement members view submissions"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'task-submissions'
  AND public.is_engagement_member(((storage.foldername(name))[1])::uuid, auth.uid())
);

CREATE POLICY "Engagement members upload submissions"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'task-submissions'
  AND public.is_engagement_member(((storage.foldername(name))[1])::uuid, auth.uid())
);

CREATE POLICY "Engagement members update submissions"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'task-submissions'
  AND public.is_engagement_member(((storage.foldername(name))[1])::uuid, auth.uid())
);
