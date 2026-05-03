
-- Roles enum and table
CREATE TYPE public.app_role AS ENUM ('student', 'business', 'mentor', 'admin');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  country TEXT,
  timezone TEXT,
  bio TEXT,
  university TEXT,
  company_name TEXT,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  skills_needed TEXT[] DEFAULT '{}',
  duration_weeks INT DEFAULT 4,
  country TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  cover_letter TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, student_id)
);

-- has_role function (security definer)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student'));
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- profiles policies
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- user_roles policies
CREATE POLICY "Roles viewable by self" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- projects policies
CREATE POLICY "Projects viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Businesses create projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = business_id AND public.has_role(auth.uid(), 'business'));
CREATE POLICY "Businesses update own projects" ON public.projects FOR UPDATE USING (auth.uid() = business_id);
CREATE POLICY "Businesses delete own projects" ON public.projects FOR DELETE USING (auth.uid() = business_id);

-- applications policies
CREATE POLICY "Students view own applications" ON public.applications FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Businesses view applications to own projects" ON public.applications FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.business_id = auth.uid()));
CREATE POLICY "Students create applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = student_id AND public.has_role(auth.uid(), 'student'));
CREATE POLICY "Businesses update applications to own projects" ON public.applications FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.business_id = auth.uid()));
