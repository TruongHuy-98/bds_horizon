import { useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { recordVisitorLog } from "@/lib/visitorTracking";
import { CONSENT_CHANGED_EVENT, getAnalyticsConsent } from "@/lib/consent";

/**
 * Automatically records a page visit whenever the user navigates
 * to any client-facing page (excluding admin routes).
 *
 * Chỉ ghi nhận khi người dùng đã đồng ý qua CookieConsentBanner
 * (Luật BVDLCN 91/2025/QH15: dữ liệu theo dõi hành vi trực tuyến cần sự đồng ý).
 */
export function VisitorTracker() {
  const location = useLocation();
  const lastTrackedPath = useRef<string>("");
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const sync = () => setConsented(getAnalyticsConsent() === "granted");
    sync();
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!consented) return;

    const path = location.pathname;

    // Ignore admin routes to prevent skewing visitor numbers
    if (path.startsWith("/admin")) return;

    // Avoid immediate duplicate tracking on the same path
    if (lastTrackedPath.current === path) return;
    lastTrackedPath.current = path;

    // Log the page view
    recordVisitorLog(path).catch((err) => {
      console.warn("Visitor tracking encountered an error:", err);
    });
  }, [location.pathname, consented]);

  return null;
}
