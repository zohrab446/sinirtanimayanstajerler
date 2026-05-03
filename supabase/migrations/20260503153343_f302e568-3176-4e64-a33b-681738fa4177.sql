ALTER TABLE public.projects ADD COLUMN mentor_id UUID;

CREATE OR REPLACE FUNCTION public.create_engagement_on_accept()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_business_id UUID;
  v_mentor_id UUID;
BEGIN
  IF NEW.status = 'accepted' AND (OLD.status IS DISTINCT FROM 'accepted') THEN
    SELECT business_id, mentor_id INTO v_business_id, v_mentor_id
    FROM public.projects
    WHERE id = NEW.project_id;

    INSERT INTO public.engagements (project_id, application_id, student_id, business_id, mentor_id)
    VALUES (NEW.project_id, NEW.id, NEW.student_id, v_business_id, v_mentor_id)
    ON CONFLICT (application_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS on_application_accepted ON public.applications;
CREATE TRIGGER on_application_accepted
AFTER UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.create_engagement_on_accept();

-- Allow viewing mentor profiles list (already public via profiles policy)
-- Allow viewing user_roles for mentor selection
DROP POLICY IF EXISTS "Roles viewable by all authenticated" ON public.user_roles;
CREATE POLICY "Roles viewable by all authenticated"
ON public.user_roles FOR SELECT
TO authenticated
USING (true);