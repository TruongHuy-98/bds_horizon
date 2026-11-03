import { supabase } from "@/integrations/supabase/client";

/**
 * Quản lý sự đồng ý xử lý dữ liệu cá nhân.
 * Căn cứ: Điều 9, Điều 10 Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 (đồng ý phải rõ ràng,
 * tách theo từng mục đích, kiểm chứng được, rút lại được) và NĐ 356/2025/NĐ-CP.
 */

/** Tăng phiên bản mỗi khi nội dung Chính sách bảo mật thay đổi đáng kể. */
export const PRIVACY_POLICY_VERSION = "2026-11-03";

export type ConsentPurpose =
  | "account_signup"
  | "cccd_verification"
  | "contact_request"
  | "analytics";

const ANALYTICS_KEY = "bds_consent_analytics";
export const CONSENT_CHANGED_EVENT = "bds-consent-changed";

export type AnalyticsConsent = "granted" | "denied" | null;

export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { value: AnalyticsConsent; version: string };
    // Chính sách đổi phiên bản -> hỏi lại
    if (parsed.version !== PRIVACY_POLICY_VERSION) return null;
    return parsed.value;
  } catch {
    return null;
  }
}

export function setAnalyticsConsent(value: "granted" | "denied"): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      ANALYTICS_KEY,
      JSON.stringify({ value, version: PRIVACY_POLICY_VERSION, at: new Date().toISOString() }),
    );
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
  void logConsent("analytics", value === "granted");
}

/** Xóa lựa chọn cookie để banner hiện lại (dùng cho nút "Thay đổi lựa chọn cookie"). */
export function resetAnalyticsConsent(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ANALYTICS_KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
}

function isMock(): boolean {
  if (typeof window === "undefined") return true;
  return (
    localStorage.getItem("bds_mock_admin") === "true" ||
    !!localStorage.getItem("bds_mock_role") ||
    !import.meta.env.VITE_SUPABASE_URL
  );
}

/**
 * Lưu vết sự đồng ý (thời điểm, mục đích, phiên bản chính sách) để kiểm chứng khi cần.
 * Không bao giờ ném lỗi ra ngoài: việc ghi log không được chặn thao tác của người dùng.
 */
export async function logConsent(
  purpose: ConsentPurpose,
  granted: boolean,
  userId?: string | null,
): Promise<void> {
  if (typeof window === "undefined" || isMock()) return;
  try {
    await (supabase as any).from("consent_logs").insert({
      user_id: userId ?? null,
      purpose,
      granted,
      policy_version: PRIVACY_POLICY_VERSION,
      user_agent: navigator.userAgent?.slice(0, 300) ?? null,
    });
  } catch (err) {
    console.warn("Could not record consent log:", err);
  }
}

