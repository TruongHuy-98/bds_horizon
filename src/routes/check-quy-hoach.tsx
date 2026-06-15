import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  Map as MapIcon,
  LayoutGrid,
  Info,
  Plus,
  Minus,
  LocateFixed,
  MapPin,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/site/Header";
import planMap from "@/assets/planning-map.jpg";
import {
  PoiControlPanel,
  PoiMarker,
  PoiPopup,
  useMapPoi,
  type PoiCategory,
  type Coordinates,
  type POIWithDistance,
} from "@/components/site/MapPoiLayers";

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
  { color: "#f5a623", label: "Residential (Đất ở)" },
  { color: "#4ea7e3", label: "Commercial (Thương mại)" },
  { color: "#5fbf6a", label: "Green spaces (Công viên)" },
  { color: "#b770c9", label: "Industrial (Công nghiệp)" },
];

function CoordTabs({
  tab,
  setTab,
}: {
  tab: "manual" | "upload";
  setTab: (t: "manual" | "upload") => void;
}) {
  return (
    <div className="grid grid-cols-2 bg-muted rounded-md p-1">
      {(["manual", "upload"] as const).map((t) => (
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
          {t === "manual" ? "Nhập tay" : "Upload file"}
        </button>
      ))}
    </div>
  );
}

interface MapPanelProps {
  activeProperty: Coordinates | null;
  setActiveProperty: (coords: Coordinates | null) => void;
  activeCategories: Record<PoiCategory, boolean>;
  onCategoryToggle: (category: PoiCategory, enabled: boolean) => void;
}

function MapPanel({
  activeProperty,
  setActiveProperty,
  activeCategories,
  onCategoryToggle,
}: MapPanelProps) {
  const [selectedPoi, setSelectedPoi] = useState<POIWithDistance | null>(null);

  // Use the generalized POI hook to retrieve nearby points of interest
  const activePois = useMapPoi({
    activeProperty,
    activeCategories,
    maxRadiusMeters: 2000,
  });

  // Function to convert geographic coordinates to simulated map percentages
  const getPoiPositions = (poi: POIWithDistance) => {
    const centerPctX = 44;
    const centerPctY = 42;
    const scale = 1500; // Increased scale for cleaner visual spacing on the map

    const xPct = centerPctX + (poi.longitude - 108.2208) * scale;
    const yPct = centerPctY - (poi.latitude - 16.0678) * scale;
    return { xPct, yPct };
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicking on the container directly (not a marker/button/popup), close active selections
    if (e.target === e.currentTarget) {
      setSelectedPoi(null);
    }
  };

  const togglePropertyActive = () => {
    if (activeProperty) {
      setActiveProperty(null);
      setSelectedPoi(null);
    } else {
      setActiveProperty({ latitude: 16.0678, longitude: 108.2208 });
    }
  };

  return (
    <div
      onClick={handleMapClick}
      className="relative w-full h-[640px] md:h-[760px] rounded-xl overflow-hidden shadow-card bg-surface-container border border-border cursor-default select-none"
    >
      <img
        src={planMap}
        alt="Bản đồ quy hoạch Đà Nẵng 2030"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-transparent to-background/20 pointer-events-none" />

      {/* Floating Control Panel (Glassmorphism card from Antigravity UI) */}
      <PoiControlPanel
        activeCategories={activeCategories}
        onCategoryToggle={onCategoryToggle}
        activePoiCount={activePois.length}
        className="absolute top-5 left-5 z-30"
      />

      {/* Active Property Pin Marker */}
      <div
        onClick={togglePropertyActive}
        className={`absolute left-[44%] top-[42%] -translate-x-1/2 -translate-y-full cursor-pointer z-30 transition-all duration-300 ${
          activeProperty ? "scale-110" : "opacity-40 hover:opacity-100 scale-95 filter grayscale"
        }`}
        title={activeProperty ? "Click để bỏ chọn Bất động sản" : "Click để chọn xem Bất động sản"}
      >
        <div className="relative">
          {activeProperty && (
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/40 h-12 w-12 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
          )}
          <div className={`relative h-11 w-11 rounded-full rounded-bl-none rotate-[-45deg] shadow-card-hover flex items-center justify-center border-2 border-white transition-all ${
            activeProperty ? "bg-primary" : "bg-muted-foreground"
          }`}>
            <div className="h-4 w-4 bg-white rounded-full rotate-45" />
          </div>
        </div>
      </div>

      {/* Render POI markers if a property is active */}
      {activeProperty &&
        activePois.map((poi) => {
          const { xPct, yPct } = getPoiPositions(poi);
          return (
            <PoiMarker
              key={poi.id}
              poi={poi}
              xPct={xPct}
              yPct={yPct}
              isActive={selectedPoi?.id === poi.id}
              onClick={(clickedPoi) => setSelectedPoi(clickedPoi)}
            />
          );
        })}

      {/* Render POI popup/tooltip if selected */}
      {activeProperty && selectedPoi && (() => {
        const { xPct, yPct } = getPoiPositions(selectedPoi);
        return (
          <PoiPopup
            poi={selectedPoi}
            xPct={xPct}
            yPct={yPct}
            onClose={() => setSelectedPoi(null)}
          />
        );
      })()}

      {/* Zoom controls */}
      <div className="absolute top-5 right-5 flex flex-col bg-card rounded-md shadow-card border border-border overflow-hidden z-20">
        <button className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors border-b border-border">
          <Plus className="h-4 w-4" />
        </button>
        <button className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors">
          <Minus className="h-4 w-4" />
        </button>
      </div>
      <button className="absolute top-[120px] right-5 h-10 w-10 flex items-center justify-center bg-card rounded-md shadow-card border border-border hover:bg-muted transition-colors z-20">
        <LocateFixed className="h-4 w-4 text-primary" />
      </button>

      {/* Legend */}
      <div className="absolute bottom-5 left-5 glass rounded-xl shadow-card border border-white/50 p-4 w-64 z-20 pointer-events-auto">
        <div className="text-sm font-semibold mb-3">Chú giải màu sắc</div>
        <ul className="space-y-2.5">
          {legend.map((l) => (
            <li key={l.label} className="flex items-center gap-3 text-sm">
              <span className="h-4 w-4 rounded-sm shrink-0" style={{ backgroundColor: l.color }} />
              <span className="text-foreground/90">{l.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Traffic density chart */}
      <div className="absolute bottom-5 right-5 glass rounded-xl shadow-card border border-white/50 p-4 w-64 z-20">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold">Mật độ Giao thông</div>
          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            +29K
          </span>
        </div>
        <div className="flex items-end gap-1.5 h-20">
          {[
            { h: 22, c: "bg-primary/30" },
            { h: 30, c: "bg-primary/40" },
            { h: 38, c: "bg-primary/50" },
            { h: 58, c: "bg-primary/70" },
            { h: 45, c: "bg-orange/70", label: "16k" },
            { h: 70, c: "bg-primary/80" },
            { h: 88, c: "bg-primary/90" },
            { h: 100, c: "bg-primary" },
          ].map((b, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end relative">
              {b.label && (
                <span className="absolute -top-1 text-[10px] font-semibold bg-foreground text-background px-1.5 py-0.5 rounded">
                  {b.label}
                </span>
              )}
              <div className={`${b.c} w-full rounded-t`} style={{ height: `${b.h}%` }} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          <span>2010</span>
          <span>2015</span>
          <span>2030</span>
        </div>
      </div>
    </div>
  );
}

function CheckQuyHoachPage() {
  const [tab, setTab] = useState<"manual" | "upload">("manual");
  const [layer2026, setLayer2026] = useState(true);
  const [layerSubzone, setLayerSubzone] = useState(false);

  // States for interactive POI (Points of Interest) Layers
  const [activeProperty, setActiveProperty] = useState<Coordinates | null>({
    latitude: 16.0678,
    longitude: 108.2208,
  });
  const [activeCategories, setActiveCategories] = useState<Record<PoiCategory, boolean>>({
    school: true,
    hospital: true,
    supermarket: false,
    park: false,
  });

  const handleCategoryToggle = (category: PoiCategory, enabled: boolean) => {
    setActiveCategories((prev) => ({
      ...prev,
      [category]: enabled,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-page py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Tra cứu Quy hoạch</h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Tra cứu thông tin quy hoạch sử dụng đất mới nhất tại TP. Đà Nẵng.
              </p>
            </div>

            {/* Search by parcel */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold">Tìm kiếm theo Số tờ / Số thửa</h2>
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <Input placeholder="Số tờ" className="h-11 bg-card" />
                <Input placeholder="Số thửa" className="h-11 bg-card" />
                <Button className="h-11 w-11 p-0 bg-primary hover:bg-primary/90">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </section>

            {/* Search by coordinates */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold">Tìm kiếm theo tọa độ</h2>
              <CoordTabs tab={tab} setTab={setTab} />
              {tab === "manual" ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Tọa độ X" className="h-11 bg-card" />
                    <Input placeholder="Tọa độ Y" className="h-11 bg-card" />
                  </div>
                  <Button className="w-full h-11 bg-teal hover:bg-teal/90 text-teal-foreground font-medium">
                    <MapPin className="h-4 w-4 mr-2" />
                    Thêm điểm mốc
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-md p-6 text-center bg-card cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm font-medium">Tải lên file tọa độ</span>
                  <span className="text-xs text-muted-foreground">Hỗ trợ .csv, .kml, .gpx</span>
                  <input type="file" className="hidden" />
                </label>
              )}
            </section>

            <div className="border-t border-border" />

            {/* Map layers */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold">Lớp bản đồ</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-card border border-border rounded-md px-4 py-3">
                  <div className="flex items-center gap-3">
                    <MapIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Quy hoạch sử dụng đất 2026</span>
                  </div>
                  <Switch checked={layer2026} onCheckedChange={setLayer2026} />
                </div>
                <div className="flex items-center justify-between bg-card border border-border rounded-md px-4 py-3">
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Quy hoạch phân khu</span>
                  </div>
                  <Switch checked={layerSubzone} onCheckedChange={setLayerSubzone} />
                </div>
              </div>
            </section>

            {/* Legal info */}
            <section className="rounded-md bg-accent/60 border border-primary/15 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Info className="h-4 w-4" />
                Thông tin pháp lý
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Dữ liệu được cập nhật từ Sở Tài nguyên và Môi trường TP. Đà Nẵng ngày 15/05/2024.
                Thông tin mang tính chất tham khảo cho việc tìm hiểu đầu tư.
              </p>
            </section>
          </aside>

          {/* Interactive Map with POI Layers */}
          <MapPanel
            activeProperty={activeProperty}
            setActiveProperty={setActiveProperty}
            activeCategories={activeCategories}
            onCategoryToggle={handleCategoryToggle}
          />
        </div>
      </main>
    </div>
  );
}
