-- Create public.profiles table for user profile & role management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  avatar TEXT,
  role TEXT DEFAULT 'user',
  district TEXT,
  specialties TEXT[],
  years_exp INTEGER DEFAULT 0,
  id_card_number TEXT,
  id_card_date TEXT,
  id_card_place TEXT,
  id_card_front_url TEXT,
  id_card_back_url TEXT,
  license_number TEXT,
  license_issuer TEXT,
  license_issue_date TEXT,
  license_expiry_date TEXT,
  license_image_url TEXT,
  verification_status TEXT DEFAULT 'unverified',
  bank_name TEXT,
  bank_account_number TEXT,
  bank_account_holder TEXT,
  referral_code TEXT,
  tax_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public can read all profiles (brokers, members, authors)
CREATE POLICY "Public can view profiles" ON public.profiles
  FOR SELECT USING (true);

-- Authenticated users can insert their own profile
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Authenticated users can update their own profile
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins have full access to all profiles
CREATE POLICY "Admins manage all profiles" ON public.profiles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
