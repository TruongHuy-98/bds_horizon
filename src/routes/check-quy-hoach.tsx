import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  Map as MapIcon,
  LayoutGrid,
  Info,
  MapPin,
  Loader2,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import Header from "@/components/site/Header";
import {
  PoiControlPanel,
  useMapPoi,
  type PoiCategory,
  type Coordinates,
} from "@/components/site/MapPoiLayers";
import {
  InteractivePlanningMap,
  type PlanningInfo,
} from "@/components/site/InteractivePlanningMap";
import { useAddressSearch } from "@/hooks/useAddressSearch";

export const Route = createFileRoute("/check-quy-hoach")({
  component: CheckQuyHoachPage,
  head: () => ({
    meta: [
      { title: "Tra cứu Quy hoạch Đà Nẵng 2030 — Da Nang Real Estate" },
      {
        name: "description",
        content:
          "Tra cứu quy hoạch sử dụng đất, phân khu chức năng và mật độ giao thông Đà Nẵng 2030 — dữ liệu cập nhật từ Sở Tài nguyên & Môi trường.",
      },
    ],
  }),
});

const legend = [
  { color: "#f5a623", label: "Đất ở (Residential)" },
  { color: "#4ea7e3", label: "Thương mại - Dịch vụ" },
  { color: "#5fbf6a", label: "Công viên - Cây xanh" },
  { color: "#b770c9", label: "Công nghiệp" },
  { color: "#f5dd29", label: "Hỗn hợp đô thị" },
  { color: "#e03535", label: "Trung tâm hành chính" },
];

function SearchTabs({
  tab,
  setTab,
}: {
  tab: "address" | "parcel";
  setTab: (t: "address" | "parcel") => void;
}) {
  return (
    <div className="grid grid-cols-2 bg-muted rounded-md p-1">
      {(["address", "parcel"] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setTab(t)}
          className={`text-sm font-medium py-2 rounded transition-colors ${
            tab === t
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t === "address" ? "Tìm theo Địa chỉ" : "Tìm theo Số thửa"}
        </button>
      ))}
    </div>
  );
}

function CheckQuyHoachPage() {
  const [tab, setTab] = useState<"address" | "parcel">("address");
  const [layer2026, setLayer2026] = useState(true);
  const [layerSubzone, setLayerSubzone] = useState(false);

  // Active property marker coordinate state (Default to a location in Da Nang)
  const [activeProperty, setActiveProperty] = useState<Coordinates | null>({
    latitude: 16.0678,
    longitude: 108.2208,
  });

  // Category switches state for nearby Points of Interest (POIs)
  const [activeCategories, setActiveCategories] = useState<Record<PoiCategory, boolean>>({
    school: true,
    hospital: true,
    supermarket: false,
    park: false,
  });

  // Planning query data state from ArcGIS Server
  const [planningInfo, setPlanningInfo] = useState<PlanningInfo | null>(null);
  const [isPlanningLoading, setIsPlanningLoading] = useState(false);

  // Address search hook (Nominatim Geocoding API)
  const { query, setQuery, results, isLoading: isSearchLoading } = useAddressSearch();
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Compute nearby POIs to show total count
  const activePois = useMapPoi({
    activeProperty,
    activeCategories,
    maxRadiusMeters: 2000,
  });

  const handleCategoryToggle = (category: PoiCategory, enabled: boolean) => {
    setActiveCategories((prev) => ({
      ...prev,
      [category]: enabled,
    }));
  };

  const handleSelectSuggestion = (suggestion: any) => {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    
    // Set coordinates to center the map and drop pin
    setActiveProperty({ latitude: lat, longitude: lon });
    
    // Clean and set the short address in the input field
    const shortAddress = getShortAddress(suggestion.display_name);
    setQuery(shortAddress);
    setShowSuggestions(false);
  };

  const getShortAddress = (displayName: string) => {
    const parts = displayName.split(",");
    if (parts.length > 3) {
      return parts.slice(0, 3).join(",").trim();
    }
    return displayName;
  };

  const handlePlanningQuery = (info: PlanningInfo | null, isLoading: boolean) => {
    setPlanningInfo(info);
    setIsPlanningLoading(isLoading);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-page py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 lg:gap-8">
          {/* Sidebar controls */}
          <aside className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Tra cứu Quy hoạch</h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Tra cứu thông tin quy hoạch sử dụng đất mới nhất tại TP. Đà Nẵng.
              </p>
            </div>

            {/* Smart Search Panel */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold">Tìm kiếm vị trí quy hoạch</h2>
              <SearchTabs tab={tab} setTab={setTab} />
              
              {tab === "address" ? (
                <div className="relative">
                  <div className="relative flex items-center">
                    <Input
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Nhập tên đường, phường, quận..."
                      className="h-11 pr-10 bg-card text-sm"
                    />
                    {isSearchLoading ? (
                      <Loader2 className="absolute right-3 h-4.5 w-4.5 animate-spin text-muted-foreground" />
                    ) : (
                      <Search className="absolute right-3 h-4.5 w-4.5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Address Search Dropdown */}
                  {showSuggestions && query.trim().length >= 2 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-border bg-card shadow-lg p-1 space-y-0.5">
                      {results.length > 0 ? (
                        results.map((r) => (
                          <button
                            key={r.place_id}
                            type="button"
                            onClick={() => handleSelectSuggestion(r)}
                            className="w-full text-left px-3 py-2 text-xs rounded hover:bg-muted font-medium transition-colors truncate block"
                            title={r.display_name}
                          >
                            {getShortAddress(r.display_name)}
                          </button>
                        ))
                      ) : !isSearchLoading ? (
                        <div className="px-3 py-2.5 text-xs text-muted-foreground text-center">
                          Không tìm thấy kết quả phù hợp tại Đà Nẵng
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <Input placeholder="Số tờ" className="h-11 bg-card text-sm" />
                  <Input placeholder="Số thửa" className="h-11 bg-card text-sm" />
                  <Button className="h-11 w-11 p-0 bg-primary hover:bg-primary/90">
                    <Search className="h-4.5 w-4.5" />
                  </Button>
                </div>
              )}
            </section>

            {/* Planning Details Display Panel */}
            {(isPlanningLoading || planningInfo) && (
              <section className="space-y-3 animate-fade-in">
                <h2 className="text-sm font-semibold">Kết quả tra cứu</h2>
                {isPlanningLoading ? (
                  <Card className="border border-border p-5 bg-card flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground font-medium">Đang truy vấn dữ liệu từ Sở Xây dựng...</span>
                  </Card>
                ) : planningInfo ? (
                  <Card className="border border-primary/20 bg-primary/[0.03] p-4 rounded-xl space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                      <Navigation className="h-4 w-4" />
                      Thông tin lô đất
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {planningInfo.success ? (
                        <>
                          <div className="flex flex-col gap-1 border-b border-border/40 pb-2">
                            <span className="text-muted-foreground font-semibold">Quy hoạch sử dụng đất (Loại đất):</span>
                            <span className="font-bold text-sm text-foreground bg-primary/10 text-primary px-2.5 py-1 rounded w-fit mt-1">
                              {planningInfo.landUse}
                            </span>
                          </div>
                          <div className="flex justify-between items-center border-b border-border/40 pb-2">
                            <span className="text-muted-foreground font-semibold">Dự án áp dụng:</span>
                            <span className="font-bold text-foreground text-right max-w-[200px] truncate" title={planningInfo.projectName}>
                              {planningInfo.projectName}
                            </span>
                          </div>
                          <div className="flex justify-between items-center border-b border-border/40 pb-2">
                            <span className="text-muted-foreground font-semibold">Tên phân khu:</span>
                            <span className="font-bold text-foreground">{planningInfo.zoneName}</span>
                          </div>
                          {planningInfo.areaSize && (
                            <div className="flex justify-between items-center border-b border-border/40 pb-2">
                              <span className="text-muted-foreground font-semibold">Diện tích dự kiến:</span>
                              <span className="font-bold text-foreground">{planningInfo.areaSize}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center pb-1">
                            <span className="text-muted-foreground font-semibold">Số quyết định pháp lý:</span>
                            <span className="font-bold text-slate-700 bg-muted px-1.5 py-0.5 rounded">{planningInfo.decisionNo}</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-muted-foreground py-3 text-center text-xs leading-relaxed">
                          ⚠️ Vị trí này nằm ngoài khu vực có bản vẽ quy hoạch phân khu chi tiết hoặc chưa được Sở Xây dựng cập nhật dữ liệu số hóa.
                        </div>
                      )}
                      
                      <div className="pt-2 text-[10px] text-muted-foreground border-t border-dashed border-border/50 flex justify-between">
                        <span>Tọa độ GPS: {planningInfo.lat.toFixed(5)}, {planningInfo.lng.toFixed(5)}</span>
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${planningInfo.lat},${planningInfo.lng}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-primary hover:underline font-bold"
                        >
                          Google Maps ↗
                        </a>
                      </div>
                    </div>
                  </Card>
                ) : null}
              </section>
            )}

            <div className="border-t border-border" />

            {/* Map layers switches */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold">Lớp bản đồ quy hoạch</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-card border border-border rounded-md px-4 py-3">
                  <div className="flex items-center gap-3">
                    <MapIcon className="h-4.5 w-4.5 text-primary" />
                    <span className="text-sm font-medium">Quy hoạch chung đô thị (1/10000)</span>
                  </div>
                  <Switch checked={layer2026} onCheckedChange={setLayer2026} />
                </div>
                <div className="flex items-center justify-between bg-card border border-border rounded-md px-4 py-3">
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="h-4.5 w-4.5 text-primary" />
                    <span className="text-sm font-medium">Quy hoạch phân khu (1/5000)</span>
                  </div>
                  <Switch checked={layerSubzone} onCheckedChange={setLayerSubzone} />
                </div>
              </div>
            </section>

            {/* Legal info disclaimer */}
            <section className="rounded-md bg-accent/60 border border-primary/15 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Info className="h-4.5 w-4.5" />
                Thông tin pháp lý
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Bản đồ quy hoạch được kết nối trực tiếp đến dữ liệu ArcGIS của Sở Xây dựng TP. Đà Nẵng.
                Thông tin chỉ mang tính chất tham khảo trực quan, không dùng thay thế cho chứng chỉ quy hoạch chính thức.
              </p>
            </section>
          </aside>

          {/* Interactive Map Layout Container */}
          <div className="relative w-full h-[640px] md:h-[760px] rounded-xl overflow-hidden shadow-card border border-border bg-slate-100">
            <InteractivePlanningMap
              activeProperty={activeProperty}
              setActiveProperty={setActiveProperty}
              activeCategories={activeCategories}
              layer2026={layer2026}
              layerSubzone={layerSubzone}
              onPlanningQuery={handlePlanningQuery}
            />

            {/* Floating POI Utility Layer Switch panel */}
            <PoiControlPanel
              activeCategories={activeCategories}
              onCategoryToggle={handleCategoryToggle}
              activePoiCount={activePois.length}
              className="absolute bottom-[20px] left-3 md:bottom-auto md:top-5 md:left-5 z-20"
            />

            {/* Legend overlay */}
            <div className="hidden md:block absolute bottom-5 left-[175px] md:left-[300px] glass rounded-xl shadow-card border border-white/50 p-4 w-60 z-20 pointer-events-auto">
              <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Chú giải quy hoạch</div>
              <ul className="space-y-1.5">
                {legend.map((l) => (
                  <li key={l.label} className="flex items-center gap-2.5 text-xs font-semibold">
                    <span className="h-3.5 w-3.5 rounded-sm shrink-0 shadow-sm" style={{ backgroundColor: l.color }} />
                    <span className="text-foreground/90">{l.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mock Traffic Density Overlay */}
            <div className="hidden xl:block absolute bottom-5 right-5 glass rounded-xl shadow-card border border-white/50 p-4 w-60 z-20">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold uppercase tracking-wider text-primary">Lưu lượng giao thông</div>
                <span className="text-[10px] font-bold text-teal bg-teal/10 px-2 py-0.5 rounded-full">
                  +18% năm nay
                </span>
              </div>
              <div className="flex items-end gap-1.5 h-16 mt-2">
                {[
                  { h: 22, c: "bg-teal/30" },
                  { h: 30, c: "bg-teal/40" },
                  { h: 38, c: "bg-teal/50" },
                  { h: 58, c: "bg-teal/70" },
                  { h: 45, c: "bg-orange/70", label: "16k" },
                  { h: 70, c: "bg-teal/80" },
                  { h: 88, c: "bg-teal/90" },
                  { h: 100, c: "bg-teal" },
                ].map((b, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end relative">
                    {b.label && (
                      <span className="absolute -top-1.5 text-[9px] font-extrabold bg-foreground text-background px-1.5 py-0.5 rounded scale-90">
                        {b.label}
                      </span>
                    )}
                    <div className={`${b.c} w-full rounded-t`} style={{ height: `${b.h}%` }} />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[9px] font-semibold text-muted-foreground">
                <span>Giờ thấp điểm</span>
                <span>Giờ cao điểm</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
