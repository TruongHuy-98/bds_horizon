import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import {
  CONSENT_CHANGED_EVENT,
  getAnalyticsConsent,
  setAnalyticsConsent,
} from "@/lib/consent";

/**
 * Banner xin đồng ý trước khi ghi nhận lượt truy cập (thống kê).
 * Từ chối vẫn dùng đầy đủ chức năng chính của website.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sync = () => setVisible(getAnalyticsConsent() === null);
    sync();
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Thông báo về cookie và dữ liệu truy cập"
      className="fixed inset-x-3 bottom-3 z-[1000] md:inset-x-auto md:left-4 md:max-w-md rounded-2xl border border-border bg-card/95 backdrop-blur shadow-2xl p-4 text-sm"
    >
      <div className="flex items-start gap-3">
        <Cookie className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-3">
          <p className="text-muted-foreground leading-relaxed text-xs">
            Chúng tôi muốn ghi nhận lượt truy cập ẩn danh (trang đã xem, loại thiết bị, trình duyệt)
            để thống kê và cải thiện website. Dữ liệu này chỉ được xử lý khi bạn đồng ý. Từ chối không
            ảnh hưởng đến việc sử dụng website. Xem{" "}
            <Link to="/chinh-sach-bao-mat" className="text-primary underline underline-offset-2">
              Chính sách bảo mật
            </Link>
            .
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAnalyticsConsent("denied")}
              className="flex-1 h-9 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-colors"
            >
              Từ chối
            </button>
            <button
              type="button"
              onClick={() => setAnalyticsConsent("granted")}
              className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              Đồng ý
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

