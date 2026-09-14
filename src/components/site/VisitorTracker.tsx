import { useLocation } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { recordVisitorLog } from "@/lib/visitorTracking";

/**
 * Automatically records a page visit whenever the user navigates
 * to any client-facing page (excluding admin routes).
 */
export function VisitorTracker() {
  const location = useLocation();
  const lastTrackedPath = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

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
  }, [location.pathname]);

  return null;
}
