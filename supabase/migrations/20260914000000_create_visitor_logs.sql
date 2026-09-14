-- Migration: Create visitor_logs table for website visitor tracking and analytics
CREATE TABLE IF NOT EXISTS public.visitor_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  page_path TEXT NOT NULL,
  user_agent TEXT,
  device TEXT DEFAULT 'Desktop',
  browser TEXT DEFAULT 'Chrome',
  location TEXT DEFAULT 'Đà Nẵng'
);

-- Enable Row Level Security
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous or authenticated clients to insert visitor tracking records
CREATE POLICY "Allow public insert to visitor_logs"
  ON public.visitor_logs
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users / admins / public to view visitor analytics
CREATE POLICY "Allow select access to visitor_logs"
  ON public.visitor_logs
  FOR SELECT
  TO public
  USING (true);

-- Index for fast queries by visited_at and page_path
CREATE INDEX IF NOT EXISTS idx_visitor_logs_visited_at ON public.visitor_logs(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_page_path ON public.visitor_logs(page_path);
