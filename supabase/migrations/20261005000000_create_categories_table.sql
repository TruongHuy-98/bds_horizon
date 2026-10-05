-- Migration: Create categories table and link to news_posts
-- Date: 2026-10-05

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on slug and parent_id
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);

-- Enable RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone reads categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Admins insert categories" ON public.categories
  FOR INSERT TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update categories" ON public.categories
  FOR UPDATE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete categories" ON public.categories
  FOR DELETE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for categories updated_at
CREATE OR REPLACE FUNCTION public.set_categories_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_categories_updated ON public.categories;
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_categories_updated_at();

-- 2. Add category_id foreign key to news_posts table (1-N relation)
ALTER TABLE public.news_posts 
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_news_posts_category_id ON public.news_posts(category_id);

-- 3. Create post_categories table for optional N-N relation
CREATE TABLE IF NOT EXISTS public.post_categories (
  post_id UUID NOT NULL REFERENCES public.news_posts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, category_id)
);

ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads post_categories" ON public.post_categories FOR SELECT USING (true);
CREATE POLICY "Admins insert post_categories" ON public.post_categories FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete post_categories" ON public.post_categories FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 4. Seed default categories
INSERT INTO public.categories (id, name, slug, description)
VALUES 
  ('c1000000-0000-0000-0000-000000000001', 'Pháp lý', 'phap-ly', 'Tư vấn pháp lý, thủ tục cấp sổ đỏ, tranh chấp đất đai, quy hoạch và thẩm định pháp lý dự án BĐS.'),
  ('c1000000-0000-0000-0000-000000000002', 'Thị trường BĐS', 'thi-truong-bds', 'Tổng hợp tin tức, biến động thị trường và xu hướng giao dịch BĐS mới nhất.'),
  ('c1000000-0000-0000-0000-000000000003', 'Quy hoạch & Bản đồ', 'quy-hoach-ban-do', 'Tra cứu đồ án quy hoạch phân khu, chỉ giới đường đỏ và phân tích vị trí.'),
  ('c1000000-0000-0000-0000-000000000004', 'Dự án', 'du-an', 'Cập nhật tiến độ, chính sách bán hàng và thông tin các đại dự án nổi bật.'),
  ('c1000000-0000-0000-0000-000000000005', 'Lời khuyên mua nhà', 'loi-khuyen-mua-nha', 'Kinh nghiệm đàm phán giá, tài chính vay ngân hàng và kiểm tra an toàn giao dịch.')
ON CONFLICT (slug) DO UPDATE 
SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description;
