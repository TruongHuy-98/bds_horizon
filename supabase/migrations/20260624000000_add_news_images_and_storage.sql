-- Create storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('bds_images', 'bds_images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access to images
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'bds_images');

-- Admin upload access
CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'bds_images' AND
  auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role::text = 'admin')
);

-- Admin delete access
CREATE POLICY "Admin Delete Access"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'bds_images' AND
  auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role::text = 'admin')
);

-- Add images column to news_posts to allow galleries
ALTER TABLE public.news_posts 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
