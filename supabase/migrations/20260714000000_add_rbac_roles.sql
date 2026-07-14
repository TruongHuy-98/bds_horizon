-- Add new roles to public.app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'broker';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'collaborator';

-- Add policy to user_roles to allow new signups to assign their own role (excluding admin)
CREATE POLICY "Users insert own role on registration" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND role IN ('user', 'broker', 'collaborator'));

-- Update properties policies to allow Brokers to insert/update their own properties
DROP POLICY IF EXISTS "Anyone reads published properties" ON public.properties;
CREATE POLICY "Anyone reads published properties" ON public.properties
  FOR SELECT USING (published = true OR public.has_role(auth.uid(), 'admin') OR (public.has_role(auth.uid(), 'broker') AND created_by = auth.uid()));

DROP POLICY IF EXISTS "Admins insert properties" ON public.properties;
CREATE POLICY "Admins insert properties" ON public.properties
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'broker'));

DROP POLICY IF EXISTS "Admins update properties" ON public.properties;
CREATE POLICY "Admins update properties" ON public.properties
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR (public.has_role(auth.uid(), 'broker') AND created_by = auth.uid()));

DROP POLICY IF EXISTS "Admins delete properties" ON public.properties;
CREATE POLICY "Admins delete properties" ON public.properties
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR (public.has_role(auth.uid(), 'broker') AND created_by = auth.uid()));

-- Update news_posts policies to allow Collaborators to insert/update their own news
DROP POLICY IF EXISTS "Anyone reads published news" ON public.news_posts;
CREATE POLICY "Anyone reads published news" ON public.news_posts
  FOR SELECT USING (published = true OR public.has_role(auth.uid(), 'admin') OR (public.has_role(auth.uid(), 'collaborator') AND created_by = auth.uid()));

DROP POLICY IF EXISTS "Admins insert news" ON public.news_posts;
CREATE POLICY "Admins insert news" ON public.news_posts
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'collaborator'));

DROP POLICY IF EXISTS "Admins update news" ON public.news_posts;
CREATE POLICY "Admins update news" ON public.news_posts
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR (public.has_role(auth.uid(), 'collaborator') AND created_by = auth.uid()));

DROP POLICY IF EXISTS "Admins delete news" ON public.news_posts;
CREATE POLICY "Admins delete news" ON public.news_posts
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR (public.has_role(auth.uid(), 'collaborator') AND created_by = auth.uid()));
