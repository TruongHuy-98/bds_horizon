-- Privacy hardening (rà soát pháp lý theo Luật BVDLCN 91/2025/QH15 & NĐ 356/2025/NĐ-CP)
--
-- 1. profiles: trước đây ai cũng đọc được toàn bộ bảng (kể cả khách chưa đăng nhập),
--    bao gồm số CCCD, ảnh CCCD, số tài khoản ngân hàng, mã số thuế.
--    -> Chỉ chủ tài khoản và admin được đọc bản ghi đầy đủ.
--    -> Thông tin công khai của môi giới được cung cấp qua view public_profiles (chỉ cột an toàn).
-- 2. visitor_logs: trước đây ai cũng SELECT được (IP, user agent, đường dẫn đã xem).
--    -> Chỉ admin được đọc. Khách vẫn được INSERT (ghi nhận lượt xem khi đã đồng ý).
--    -> Thêm hàm dọn log cũ hơn 12 tháng.
-- 3. consent_logs: lưu vết sự đồng ý xử lý dữ liệu cá nhân để kiểm chứng khi cần.

-- ============ 1. profiles ============
-- Thời điểm đồng ý xử lý dữ liệu CCCD (đồng ý riêng cho mục đích xác minh danh tính)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cccd_consent_at TIMESTAMPTZ;

DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;

DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Admin đã có policy "Admins manage all profiles" (FOR ALL) nên vẫn đọc được mọi hồ sơ.

-- View công khai: KHÔNG chứa CCCD, ngân hàng, mã số thuế, số điện thoại cá nhân.
CREATE OR REPLACE VIEW public.public_profiles AS
  SELECT
    id,
    name,
    avatar,
    role,
    district,
    specialties,
    years_exp,
    verification_status,
    license_number,
    license_issuer
  FROM public.profiles
  WHERE role IN ('broker', 'collaborator', 'admin');

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- ============ 2. visitor_logs ============
DROP POLICY IF EXISTS "Allow select access to visitor_logs" ON public.visitor_logs;

CREATE POLICY "Admins read visitor_logs" ON public.visitor_logs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete visitor_logs" ON public.visitor_logs
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Xóa log truy cập cũ hơn 12 tháng (giữ tối thiểu 12 tháng theo NĐ 333/2026, không giữ vô thời hạn).
-- Có thể gọi định kỳ bằng pg_cron:  SELECT cron.schedule('purge-visitor-logs', '0 3 * * *', 'SELECT public.purge_old_visitor_logs()');
CREATE OR REPLACE FUNCTION public.purge_old_visitor_logs()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.visitor_logs WHERE visited_at < now() - interval '12 months';
$$;

REVOKE ALL ON FUNCTION public.purge_old_visitor_logs() FROM public, anon, authenticated;

-- ============ 3. consent_logs ============
CREATE TABLE IF NOT EXISTS public.consent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  purpose TEXT NOT NULL,           -- ví dụ: 'account_signup', 'cccd_verification', 'contact_request', 'analytics'
  granted BOOLEAN NOT NULL,        -- true = đồng ý, false = rút lại / từ chối
  policy_version TEXT NOT NULL,    -- phiên bản chính sách tại thời điểm đồng ý
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.consent_logs ENABLE ROW LEVEL SECURITY;

-- Người dùng đã đăng nhập ghi consent của chính mình; khách ẩn danh ghi consent không gắn user_id.
CREATE POLICY "Insert own consent" ON public.consent_logs
  FOR INSERT TO anon, authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Users read own consent" ON public.consent_logs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_consent_logs_user ON public.consent_logs(user_id, created_at DESC);
