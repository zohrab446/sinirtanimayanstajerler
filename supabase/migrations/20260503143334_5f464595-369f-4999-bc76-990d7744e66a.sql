CREATE OR REPLACE FUNCTION public.create_engagement_on_accept()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_business_id UUID;
BEGIN
  IF NEW.status = 'accepted' AND (OLD.status IS DISTINCT FROM 'accepted') THEN
    SELECT business_id INTO v_business_id
    FROM public.projects
    WHERE id = NEW.project_id;

    INSERT INTO public.engagements (project_id, application_id, student_id, business_id)
    VALUES (NEW.project_id, NEW.id, NEW.student_id, v_business_id)
    ON CONFLICT (application_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_create_engagement_on_accept ON public.applications;

CREATE TRIGGER trg_create_engagement_on_accept
AFTER UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.create_engagement_on_accept();