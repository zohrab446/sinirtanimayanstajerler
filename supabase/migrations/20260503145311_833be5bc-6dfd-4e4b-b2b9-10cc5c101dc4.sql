CREATE TRIGGER applications_create_engagement_on_accept
AFTER UPDATE OF status ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.create_engagement_on_accept();

INSERT INTO public.engagements (project_id, application_id, student_id, business_id)
SELECT a.project_id, a.id, a.student_id, p.business_id
FROM public.applications a
JOIN public.projects p ON p.id = a.project_id
WHERE a.status = 'accepted'
  AND NOT EXISTS (
    SELECT 1
    FROM public.engagements e
    WHERE e.application_id = a.id
  );