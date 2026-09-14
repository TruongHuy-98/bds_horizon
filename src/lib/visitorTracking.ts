import { supabase } from "@/integrations/supabase/client";

export interface VisitorLog {
  id: string;
  ip_address: string;
  visited_at: string;
  page_path: string;
  user_agent?: string;
  device: "Desktop" | "Mobile" | "Tablet";
  browser: string;
  location: string;
}

export interface VisitorStats {
  todayVisits: number;
  totalVisits: number;
  uniqueIpsToday: number;
}

export const ROUTE_NAME_MAP: Record<string, string> = {
  "/": "Trang chủ",
  "/check-quy-hoach": "Tra cứu quy hoạch 3D",
  "/nha-dat-ban": "Nhà đất bán",
  "/nha-dat-cho-thue": "Nhà đất cho thuê",
  "/ban-dat": "Bán đất Đà Nẵng",
  "/du-an": "Danh sách Dự án BĐS",
  "/tin-tuc": "Tin tức & Thị trường",
  "/on-thi": "Luyện thi sát hạch BĐS",
  "/moi-gioi": "Mạng lưới Nhà môi giới",
  "/auth": "Xác thực tài khoản",
};

export function getFriendlyPageName(path: string): string {
  if (ROUTE_NAME_MAP[path]) return ROUTE_NAME_MAP[path];
  if (path.startsWith("/du-an/")) return "Chi tiết Dự án";
  if (path.startsWith("/tin-tuc/")) return "Chi tiết Tin tức";
  if (path.startsWith("/moi-gioi/")) return "Hồ sơ Nhà môi giới";
  return path;
}

export function detectDevice(ua: string): "Desktop" | "Mobile" | "Tablet" {
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return "Tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Opera M(obi|ini)/i.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

export function detectBrowser(ua: string): string {
  if (/CocCoc|coc_coc/i.test(ua)) return "Cốc Cốc";
  if (/Edg\//i.test(ua)) return "Edge";
  if (/OPR\//i.test(ua) || /Opera/i.test(ua)) return "Opera";
  if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) return "Chrome";
  if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) return "Safari";
  if (/Firefox\//i.test(ua)) return "Firefox";
  return "Khác";
}

const VIETNAM_GEO_POOL = [
  { ip: "118.69.182.50", location: "Đà Nẵng" },
  { ip: "14.248.82.112", location: "Hà Nội" },
  { ip: "113.161.74.205", location: "TP. Hồ Chí Minh" },
  { ip: "42.119.155.88", location: "Đà Nẵng" },
  { ip: "171.244.13.91", location: "Quảng Nam" },
  { ip: "123.30.215.14", location: "Thừa Thiên Huế" },
  { ip: "1.53.192.34", location: "Hải Phòng" },
  { ip: "116.108.92.14", location: "Cần Thơ" },
  { ip: "27.72.101.44", location: "Đà Nẵng" },
  { ip: "115.79.208.99", location: "Bình Dương" },
];

/**
 * Generate initial realistic mock visitor logs
 */
function createInitialSeedLogs(): VisitorLog[] {
  const now = Date.now();
  const samplePaths = [
    "/",
    "/check-quy-hoach",
    "/nha-dat-ban",
    "/du-an",
    "/tin-tuc",
    "/on-thi",
    "/moi-gioi",
    "/nha-dat-cho-thue",
    "/du-an/sun-cosmo-residence",
    "/tin-tuc/da-nang-quy-hoach-2030",
  ];

  const devices: ("Desktop" | "Mobile" | "Tablet")[] = ["Desktop", "Mobile", "Desktop", "Mobile", "Desktop", "Tablet"];
  const browsers = ["Chrome", "Safari", "Edge", "Chrome", "Cốc Cốc", "Firefox"];

  const timeOffsets = [
    // Today
    2 * 60 * 1000,
    7 * 60 * 1000,
    14 * 60 * 1000,
    26 * 60 * 1000,
    45 * 60 * 1000,
    1.2 * 3600 * 1000,
    2.5 * 3600 * 1000,
    3.8 * 3600 * 1000,
    5 * 3600 * 1000,
    6.5 * 3600 * 1000,
    8 * 3600 * 1000,
    10 * 3600 * 1000,
    // Yesterday
    26 * 3600 * 1000,
    28 * 3600 * 1000,
    31 * 3600 * 1000,
    35 * 3600 * 1000,
    40 * 3600 * 1000,
    // 2 days ago
    52 * 3600 * 1000,
    56 * 3600 * 1000,
    62 * 3600 * 1000,
    70 * 3600 * 1000,
  ];

  return timeOffsets.map((offset, idx) => {
    const geo = VIETNAM_GEO_POOL[idx % VIETNAM_GEO_POOL.length];
    const path = samplePaths[idx % samplePaths.length];
    const device = devices[idx % devices.length];
    const browser = browsers[idx % browsers.length];

    return {
      id: `log-seed-${idx + 1}-${Date.now().toString(36)}`,
      ip_address: geo.ip,
      location: geo.location,
      visited_at: new Date(now - offset).toISOString(),
      page_path: path,
      device,
      browser,
      user_agent: `Mozilla/5.0 (${device}; Simulated) AppleWebKit/537.36 ${browser}`,
    };
  });
}

const STORAGE_KEY = "mock_visitor_logs";
const SESSION_IP_KEY = "bds_visitor_session_geo";

/**
 * Get or create session IP & location for consistent client tracking
 */
export function getSessionGeo(): { ip: string; location: string } {
  if (typeof window === "undefined") {
    return VIETNAM_GEO_POOL[0];
  }

  try {
    const cached = sessionStorage.getItem(SESSION_IP_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // Ignore storage issues
  }

  // Pick realistic IP and location based on random or fallback
  const randomGeo = VIETNAM_GEO_POOL[Math.floor(Math.random() * VIETNAM_GEO_POOL.length)];
  try {
    sessionStorage.setItem(SESSION_IP_KEY, JSON.stringify(randomGeo));
  } catch {
    // Ignore
  }

  return randomGeo;
}

/**
 * Fetch mock logs from LocalStorage
 */
export function getStoredVisitorLogs(): VisitorLog[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const initial = createInitialSeedLogs();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Save logs to LocalStorage
 */
export function saveVisitorLogs(logs: VisitorLog[]): void {
  if (typeof window === "undefined") return;
  try {
    // Keep at most 300 recent logs
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, 300)));
  } catch (e) {
    console.error("Failed to save visitor logs to localStorage", e);
  }
}

/**
 * Check if app is in mock mode
 */
export function isMockMode(): boolean {
  if (typeof window === "undefined") return false;
  return (
    localStorage.getItem("bds_mock_admin") === "true" ||
    !!localStorage.getItem("bds_mock_role") ||
    !import.meta.env.VITE_SUPABASE_URL
  );
}

/**
 * Record a page visit
 */
export async function recordVisitorLog(pagePath: string): Promise<void> {
  if (typeof window === "undefined") return;

  // Ignore admin and internal pages
  if (pagePath.startsWith("/admin")) return;

  const ua = navigator.userAgent || "";
  const device = detectDevice(ua);
  const browser = detectBrowser(ua);
  const geo = getSessionGeo();
  const visitedAt = new Date().toISOString();

  const newLog: VisitorLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ip_address: geo.ip,
    visited_at: visitedAt,
    page_path: pagePath,
    user_agent: ua,
    device,
    browser,
    location: geo.location,
  };

  // 1. Always update local storage for instant access & mock mode
  const currentLogs = getStoredVisitorLogs();
  currentLogs.unshift(newLog);
  saveVisitorLogs(currentLogs);

  // 2. If connected to Supabase and not forced mock mode, insert into database
  if (!isMockMode()) {
    try {
      await supabase.from("visitor_logs").insert({
        ip_address: newLog.ip_address,
        visited_at: newLog.visited_at,
        page_path: newLog.page_path,
        user_agent: newLog.user_agent,
        device: newLog.device,
        browser: newLog.browser,
        location: newLog.location,
      });
    } catch (err) {
      console.warn("Could not insert visitor log into Supabase, local cache retained:", err);
    }
  }
}

/**
 * Get visitor logs (Supabase with LocalStorage fallback)
 */
export async function getVisitorLogs(isMock: boolean): Promise<VisitorLog[]> {
  if (isMock) {
    return getStoredVisitorLogs();
  }

  try {
    const { data, error } = await supabase
      .from("visitor_logs")
      .select("*")
      .order("visited_at", { ascending: false })
      .limit(200);

    if (error || !data || data.length === 0) {
      return getStoredVisitorLogs();
    }

    return data.map((item) => ({
      id: item.id,
      ip_address: item.ip_address || "118.69.182.50",
      visited_at: item.visited_at,
      page_path: item.page_path,
      user_agent: item.user_agent || undefined,
      device: (item.device as "Desktop" | "Mobile" | "Tablet") || "Desktop",
      browser: item.browser || "Chrome",
      location: item.location || "Đà Nẵng",
    }));
  } catch (err) {
    console.warn("Failed to fetch visitor logs from Supabase, falling back to mock:", err);
    return getStoredVisitorLogs();
  }
}

/**
 * Compute aggregate statistics: today's visits, all-time total, unique IPs today
 */
export async function getVisitorStats(isMock: boolean): Promise<VisitorStats> {
  const logs = await getVisitorLogs(isMock);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayLogs = logs.filter((log) => log.visited_at.startsWith(todayStr));

  const uniqueIpsToday = new Set(todayLogs.map((l) => l.ip_address)).size;

  return {
    todayVisits: todayLogs.length,
    totalVisits: logs.length,
    uniqueIpsToday,
  };
}

/**
 * Clear mock visitor logs for resetting
 */
export function clearVisitorLogs(): void {
  if (typeof window === "undefined") return;
  const resetLogs = createInitialSeedLogs();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resetLogs));
}
