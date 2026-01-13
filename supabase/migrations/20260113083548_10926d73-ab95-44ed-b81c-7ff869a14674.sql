-- Create development_projects table for tracking construction projects
CREATE TABLE public.development_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_bn TEXT,
  location TEXT NOT NULL,
  location_bn TEXT,
  description TEXT,
  description_bn TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  total_units INTEGER,
  start_date DATE,
  expected_completion_date DATE,
  actual_completion_date DATE,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_milestones table for timeline tracking
CREATE TABLE public.project_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.development_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_bn TEXT,
  description TEXT,
  target_date DATE,
  completed_date DATE,
  is_completed BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.development_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

-- Development projects are publicly viewable
CREATE POLICY "Development projects are viewable by everyone"
ON public.development_projects
FOR SELECT
USING (true);

-- Only admins can manage development projects
CREATE POLICY "Admins can manage development projects"
ON public.development_projects
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Project milestones are publicly viewable
CREATE POLICY "Project milestones are viewable by everyone"
ON public.project_milestones
FOR SELECT
USING (true);

-- Only admins can manage milestones
CREATE POLICY "Admins can manage milestones"
ON public.project_milestones
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_development_projects_updated_at
BEFORE UPDATE ON public.development_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();