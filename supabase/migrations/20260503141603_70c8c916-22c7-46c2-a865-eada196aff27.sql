
-- engagements
CREATE TABLE public.engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  business_id UUID NOT NULL,
  mentor_id UUID,
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (application_id)
);

ALTER TABLE public.engagements ENABLE ROW LEVEL SECURITY;

-- helper function to check team membership
CREATE OR REPLACE FUNCTION public.is_engagement_member(_engagement_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.engagements e
    WHERE e.id = _engagement_id
      AND (_user_id = e.student_id OR _user_id = e.business_id OR _user_id = e.mentor_id)
  )
$$;

CREATE POLICY "Members view engagements" ON public.engagements
FOR SELECT USING (auth.uid() = student_id OR auth.uid() = business_id OR auth.uid() = mentor_id);

CREATE POLICY "Business or mentor update engagements" ON public.engagements
FOR UPDATE USING (auth.uid() = business_id OR auth.uid() = mentor_id);

CREATE POLICY "Mentors self-assign" ON public.engagements
FOR UPDATE USING (has_role(auth.uid(), 'mentor'));

CREATE TRIGGER engagements_updated BEFORE UPDATE ON public.engagements
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- tasks
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL REFERENCES public.engagements(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo', -- todo, in_progress, review, done
  due_date DATE,
  assigned_to UUID,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team views tasks" ON public.tasks
FOR SELECT USING (public.is_engagement_member(engagement_id, auth.uid()));

CREATE POLICY "Team creates tasks" ON public.tasks
FOR INSERT WITH CHECK (public.is_engagement_member(engagement_id, auth.uid()) AND created_by = auth.uid());

CREATE POLICY "Team updates tasks" ON public.tasks
FOR UPDATE USING (public.is_engagement_member(engagement_id, auth.uid()));

CREATE POLICY "Team deletes tasks" ON public.tasks
FOR DELETE USING (public.is_engagement_member(engagement_id, auth.uid()));

CREATE TRIGGER tasks_updated BEFORE UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL REFERENCES public.engagements(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team views messages" ON public.messages
FOR SELECT USING (public.is_engagement_member(engagement_id, auth.uid()));

CREATE POLICY "Team sends messages" ON public.messages
FOR INSERT WITH CHECK (public.is_engagement_member(engagement_id, auth.uid()) AND sender_id = auth.uid());

-- realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;

-- foreign keys to profiles for joins
ALTER TABLE public.engagements
  ADD CONSTRAINT engagements_student_profiles_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  ADD CONSTRAINT engagements_business_profiles_fkey FOREIGN KEY (business_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  ADD CONSTRAINT engagements_mentor_profiles_fkey FOREIGN KEY (mentor_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_assigned_profiles_fkey FOREIGN KEY (assigned_to) REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD CONSTRAINT tasks_created_profiles_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.messages
  ADD CONSTRAINT messages_sender_profiles_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- trigger: when application accepted, create engagement
CREATE OR REPLACE FUNCTION public.create_engagement_on_accept()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_business_id UUID;
BEGIN
  IF NEW.status = 'accepted' AND (OLD.status IS DISTINCT FROM 'accepted') THEN
    SELECT business_id INTO v_business_id FROM public.projects WHERE id = NEW.project_id;
    INSERT INTO public.engagements (project_id, application_id, student_id, business_id)
    VALUES (NEW.project_id, NEW.id, NEW.student_id, v_business_id)
    ON CONFLICT (application_id) DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_create_engagement_on_accept
AFTER UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.create_engagement_on_accept();
