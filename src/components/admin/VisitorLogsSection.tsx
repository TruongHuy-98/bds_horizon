import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Globe,
  RefreshCw,
  Search,
  Laptop,
  Smartphone,
  Tablet,
  MapPin,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Compass,
} from "lucide-react";
import {
  VisitorLog,
  getVisitorLogs,
  getFriendlyPageName,
  recordVisitorLog,
} from "@/lib/visitorTracking";
import { toast } from "sonner";

interface VisitorLogsSectionProps {
  isMock: boolean;
  onLogsUpdated?: () => void;
}

export function VisitorLogsSection({ isMock, onLogsUpdated }: VisitorLogsSectionProps) {
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deviceFilter, setDeviceFilter] = useState<"all" | "Desktop" | "Mobile" | "Tablet">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [simulating, setSimulating] = useState(false);

  // Load logs
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getVisitorLogs(isMock);
      setLogs(data);
    } catch (e) {
      console.error("Failed to load visitor logs:", e);
      toast.error("Không thể tải nhật ký truy cập");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [isMock]);

  // Handle manual refresh
  const handleRefresh = async () => {
    await fetchLogs();
    if (onLogsUpdated) onLogsUpdated();
    toast.success("Đã làm mới dữ liệu nhật ký truy cập");
  };

  // Simulate mock visit for testing
  const handleSimulateVisit = async () => {
    setSimulating(true);
    const mockRoutes = [
      "/check-quy-hoach",
      "/nha-dat-ban",
      "/du-an",
      "/tin-tuc",
      "/on-thi",
      "/moi-gioi",
      "/nha-dat-cho-thue",
    ];
    const randomRoute = mockRoutes[Math.floor(Math.random() * mockRoutes.length)];
    await recordVisitorLog(randomRoute);
    await fetchLogs();
    if (onLogsUpdated) onLogsUpdated();
    setSimulating(false);
    toast.success(`Đã giả lập lượt truy cập mới vào ${getFriendlyPageName(randomRoute)}`);
  };

  // Format relative timestamp
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMinutes / 60);

      const timeStr = date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const dateStr = date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      let relativeText = "";
      if (diffMinutes < 1) {
        relativeText = "Vừa xong";
      } else if (diffMinutes < 60) {
        relativeText = `${diffMinutes} phút trước`;
      } else if (diffHours < 24) {
        relativeText = `${diffHours} giờ trước`;
      } else {
        const days = Math.floor(diffHours / 24);
        relativeText = `${days} ngày trước`;
      }

      return {
        relative: relativeText,
        full: `${timeStr} - ${dateStr}`,
        isToday: date.toDateString() === now.toDateString(),
      };
    } catch {
      return { relative: "Gần đây", full: isoString, isToday: false };
    }
  };

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Device filter
      if (deviceFilter !== "all" && log.device !== deviceFilter) {
        return false;
      }

      // Search query filter (IP, Location, Path, Friendly Name)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const friendlyName = getFriendlyPageName(log.page_path).toLowerCase();
        const matchIp = log.ip_address.toLowerCase().includes(q);
        const matchLocation = log.location.toLowerCase().includes(q);
        const matchPath = log.page_path.toLowerCase().includes(q);
        const matchName = friendlyName.includes(q);
        const matchBrowser = log.browser.toLowerCase().includes(q);
        return matchIp || matchLocation || matchPath || matchName || matchBrowser;
      }

      return true;
    });
  }, [logs, deviceFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  // Render device icon & badge
  const renderDeviceBadge = (device: string) => {
    switch (device) {
      case "Mobile":
        return (
          <Badge
            variant="outline"
            className="bg-violet-50 text-violet-700 border-violet-200/80 font-medium text-[11px] gap-1 px-2 py-0.5"
          >
            <Smartphone className="size-3" />
            Mobile
          </Badge>
        );
      case "Tablet":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200/80 font-medium text-[11px] gap-1 px-2 py-0.5"
          >
            <Tablet className="size-3" />
            Tablet
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200/80 font-medium text-[11px] gap-1 px-2 py-0.5"
          >
            <Laptop className="size-3" />
            Desktop
          </Badge>
        );
    }
  };

  // Render location badge
  const renderLocationBadge = (location: string) => {
    let colorClasses = "bg-slate-100 text-slate-700 border-slate-200";
    if (location.includes("Đà Nẵng")) {
      colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else if (location.includes("Hà Nội")) {
      colorClasses = "bg-sky-50 text-sky-700 border-sky-200";
    } else if (location.includes("Hồ Chí Minh") || location.includes("TP.HCM")) {
      colorClasses = "bg-indigo-50 text-indigo-700 border-indigo-200";
    }

    return (
      <Badge
        variant="outline"
        className={`${colorClasses} font-medium text-xs gap-1 px-2 py-0.5 rounded-full inline-flex items-center`}
      >
        <MapPin className="size-3 shrink-0" />
        {location}
      </Badge>
    );
  };

  return (
    <Card id="visitor-logs-table" className="p-6 border-slate-200/80 bg-white shadow-sm space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Globe className="size-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Nhật ký truy cập gần đây</h3>
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1.5 py-0.5 px-2 font-semibold text-[11px]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Trực tiếp
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            Theo dõi phiên truy cập của khách ghé thăm website theo thời gian thực (đã lọc các phiên quản trị).
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Simulate visit button for testing */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleSimulateVisit}
            disabled={simulating}
            className="h-8 text-xs text-indigo-600 bg-indigo-50/50 border-indigo-200 hover:bg-indigo-100/60 font-medium"
            title="Tạo nhanh một lượt truy cập mẫu ngẫu nhiên để kiểm tra"
          >
            <Sparkles className={`size-3.5 mr-1 ${simulating ? "animate-spin" : ""}`} />
            Giả lập truy cập
          </Button>

          {/* Refresh Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="h-8 text-xs border-slate-200 hover:bg-slate-50 font-medium text-slate-700"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
          <Input
            placeholder="Tìm theo IP, đường dẫn, vị trí..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8 h-8 text-xs bg-slate-50/70 border-slate-200 rounded-lg focus-visible:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Device Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg self-stretch sm:self-auto">
          {(
            [
              { key: "all", label: "Tất cả" },
              { key: "Desktop", label: "Desktop" },
              { key: "Mobile", label: "Mobile" },
              { key: "Tablet", label: "Tablet" },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setDeviceFilter(item.key);
                setCurrentPage(1);
              }}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                deviceFilter === item.key
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-slate-100 rounded-xl overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[180px] text-xs font-semibold text-slate-600">Thời gian</TableHead>
              <TableHead className="w-[160px] text-xs font-semibold text-slate-600">Địa chỉ IP</TableHead>
              <TableHead className="w-[180px] text-xs font-semibold text-slate-600">Thiết bị / Trình duyệt</TableHead>
              <TableHead className="w-[150px] text-xs font-semibold text-slate-600">Vị trí</TableHead>
              <TableHead className="text-xs font-semibold text-slate-600">Trang truy cập (URL/Path)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeletons
              Array.from({ length: pageSize }).map((_, idx) => (
                <TableRow key={idx} className="border-slate-50">
                  <TableCell>
                    <div className="h-4 w-28 bg-slate-100 animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-slate-100 animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 bg-slate-100 animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-slate-100 animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-48 bg-slate-100 animate-pulse rounded"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1.5 py-4">
                    <Compass className="size-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">Không tìm thấy lượt truy cập nào</p>
                    <p className="text-xs text-slate-400">
                      {searchQuery
                        ? "Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc."
                        : "Chưa có dữ liệu lượt truy cập nào được ghi nhận."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedLogs.map((log) => {
                const timeInfo = formatTime(log.visited_at);
                const friendlyName = getFriendlyPageName(log.page_path);

                return (
                  <TableRow key={log.id} className="hover:bg-slate-50/60 border-slate-100 transition-colors">
                    {/* Time Column */}
                    <TableCell className="align-middle">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                          <Clock className="size-3 text-slate-400 shrink-0" />
                          <span>{timeInfo.relative}</span>
                          {timeInfo.isToday && (
                            <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" title="Hôm nay" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-normal pl-4.5">{timeInfo.full}</p>
                      </div>
                    </TableCell>

                    {/* IP Column */}
                    <TableCell className="align-middle">
                      <div className="inline-flex items-center gap-1.5">
                        <code className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200/80">
                          {log.ip_address}
                        </code>
                        <span className="size-1.5 rounded-full bg-slate-300" title="Đã xác thực" />
                      </div>
                    </TableCell>

                    {/* Device / Browser */}
                    <TableCell className="align-middle">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {renderDeviceBadge(log.device)}
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-700 hover:bg-slate-100 font-medium text-[11px] px-1.5 py-0.5 border-none"
                        >
                          {log.browser}
                        </Badge>
                      </div>
                    </TableCell>

                    {/* Location */}
                    <TableCell className="align-middle">{renderLocationBadge(log.location)}</TableCell>

                    {/* Page Path */}
                    <TableCell className="align-middle">
                      <div className="flex items-center gap-2">
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {friendlyName}
                          </p>
                          <p className="text-[11px] font-mono text-slate-400 truncate">
                            {log.page_path}
                          </p>
                        </div>
                        <a
                          href={log.page_path}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-300 hover:text-indigo-600 p-1 rounded transition-colors shrink-0"
                          title="Xem trang trong tab mới"
                        >
                          <ExternalLink className="size-3" />
                        </a>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination & Counter Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>
            Hiển thị{" "}
            <span className="font-semibold text-slate-800">
              {filteredLogs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            -{" "}
            <span className="font-semibold text-slate-800">
              {Math.min(currentPage * pageSize, filteredLogs.length)}
            </span>{" "}
            trên tổng số{" "}
            <span className="font-semibold text-slate-800">{filteredLogs.length}</span> lượt truy cập
          </span>

          {/* Page size dropdown */}
          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-slate-200">
            <span>Mỗi trang:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Pagination buttons */}
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1 || loading}
            className="h-7 w-7 p-0 border-slate-200 text-slate-600 disabled:opacity-40"
          >
            <ChevronLeft className="size-3.5" />
          </Button>

          <span className="px-2.5 text-xs font-semibold text-slate-700">
            Trang {currentPage} / {totalPages}
          </span>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages || loading}
            className="h-7 w-7 p-0 border-slate-200 text-slate-600 disabled:opacity-40"
          >
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
