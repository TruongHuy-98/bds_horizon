import React, { useEffect, useRef, useState } from "react";
import { type Coordinates, type PoiCategory, type POIWithDistance } from "./MapPoiLayers";
import { Info, Map as MapIcon, Loader2 } from "lucide-react";
import { queryPlanningProxy } from "@/lib/planningProxy";

interface InteractivePlanningMapProps {
  activeProperty: Coordinates | null;
  setActiveProperty: (coords: Coordinates | null) => void;
  activeCategories: Record<PoiCategory, boolean>;
  layer2026: boolean;
  layerSubzone: boolean;
  onPlanningQuery: (info: PlanningInfo | null, isLoading: boolean) => void;
}

export interface PlanningInfo {
  success: boolean;
  landUse?: string;
  projectName?: string;
  zoneName?: string;
  areaSize?: string;
  decisionNo?: string;
  rawAttributes?: Record<string, any>;
  lat: number;
  lng: number;
}

// Icon SVG map helper for custom markers
const iconSvgs: Record<PoiCategory, string> = {
  school: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/><path d="M21.5 12v6"/></svg>`,
  hospital: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3H5C3.34 3 2 4.34 2 6v5c0 1.66 1.34 3 3 3"/><path d="M12 14v7"/><path d="M9 21h6"/><path d="M6 8h12"/><path d="M12 5v6"/></svg>`,
  supermarket: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  park: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-3"/><path d="M19 19c-2.33-3-6-3-6-3h-2s-3.67 0-6 3"/><path d="M12 16V9"/><path d="M12 9a4 4 0 0 0 4-4 4 4 0 0 0-4-4 4 4 0 0 0-4 4 4 4 0 0 0 4 4Z"/></svg>`,
};

const markerColorClasses: Record<PoiCategory, string> = {
  school: "bg-blue-600 text-white border-blue-100 shadow-blue-500/20",
  hospital: "bg-red-600 text-white border-red-100 shadow-red-500/20",
  supermarket: "bg-amber-600 text-white border-amber-100 shadow-amber-500/20",
  park: "bg-emerald-600 text-white border-emerald-100 shadow-emerald-500/20",
};

// Static mock POI list (same as MapPoiLayers.tsx to keep consistent, but map them to real leaflet markers)
import { MOCK_POIS, calculateDistance } from "./MapPoiLayers";

export function InteractivePlanningMap({
  activeProperty,
  setActiveProperty,
  activeCategories,
  layer2026,
  layerSubzone,
  onPlanningQuery,
}: InteractivePlanningMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const esriLayerRef = useRef<any>(null);
  const activeMarkerRef = useRef<any>(null);
  const poiMarkersGroupRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [baseMapType, setBaseMapType] = useState<"osm" | "satellite">("osm");
  const baseMapLayerRef = useRef<any>(null);

  // Initialize Map (Client-only load)
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    let isMounted = true;
    let L: any;
    let esri: any;

    const initLeaflet = async () => {
      try {
        // Dynamic import to prevent SSR errors
        L = await import("leaflet");
        esri = await import("esri-leaflet");

        if (!isMounted) return;

        // Create map
        const initialCenter = activeProperty
          ? [activeProperty.latitude, activeProperty.longitude]
          : [16.0678, 108.2208]; // Da Nang center
        
        const map = L.map(mapContainerRef.current!, {
          zoomControl: false, // Custom zoom control positioned on top-right
        }).setView(initialCenter, 14);

        mapRef.current = map;

        // Base Map (OSM default)
        const baseLayer = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            attribution: "© OpenStreetMap contributors",
          }
        ).addTo(map);
        baseMapLayerRef.current = baseLayer;

        // Create POI markers group
        poiMarkersGroupRef.current = L.layerGroup().addTo(map);

        // Add Planning layer from ArcGIS of Da Nang
        const esriLayer = esri.dynamicMapLayer({
          url: "https://thongtinquyhoachxaydung.danang.gov.vn/arcgis/rest/services/SoXayDung/QuyHoachDoThi/MapServer",
          layers: getVisibleLayers(layer2026, layerSubzone),
          opacity: 0.65,
          useCors: true,
        }).addTo(map);

        esriLayerRef.current = esriLayer;

        // Map Click Event
        map.on("click", async (e: any) => {
          const { lat, lng } = e.latlng;
          setActiveProperty({ latitude: lat, longitude: lng });
        });

        setMapLoaded(true);
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.invalidateSize();
          }
        }, 150);
      } catch (err) {
        console.error("Failed to initialize Leaflet Map:", err);
      }
    };

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Helper to determine visible layer IDs based on switches
  const getVisibleLayers = (show2026: boolean, showSubzone: boolean) => {
    const layers: number[] = [4]; // Detail 1/500 layer is always useful
    if (show2026) layers.push(5);  // General planning
    if (showSubzone) layers.push(6); // Subdivision planning
    return layers;
  };

  // Switch Base Maps
  const toggleBaseMap = async () => {
    if (!mapRef.current) return;
    const L = await import("leaflet");

    if (baseMapLayerRef.current) {
      mapRef.current.removeLayer(baseMapLayerRef.current);
    }

    if (baseMapType === "osm") {
      // Switch to Satellite Hybrid
      const satLayer = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        {
          maxZoom: 20,
          attribution: "© Google Maps Satellite",
        }
      ).addTo(mapRef.current);
      baseMapLayerRef.current = satLayer;
      setBaseMapType("satellite");
    } else {
      // Switch to OSM
      const osmLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution: "© OpenStreetMap",
        }
      ).addTo(mapRef.current);
      baseMapLayerRef.current = osmLayer;
      setBaseMapType("osm");
    }
  };

  // Sync planning layers when switches change
  useEffect(() => {
    if (!esriLayerRef.current) return;
    esriLayerRef.current.setLayers(getVisibleLayers(layer2026, layerSubzone));
  }, [layer2026, layerSubzone]);

  // Sync active property marker & query ArcGIS API on change
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const updateActiveMarker = async () => {
      const L = await import("leaflet");

      // 1. Remove old marker
      if (activeMarkerRef.current) {
        mapRef.current.removeLayer(activeMarkerRef.current);
        activeMarkerRef.current = null;
      }

      if (!activeProperty) {
        onPlanningQuery(null, false);
        return;
      }

      const center = [activeProperty.latitude, activeProperty.longitude];

      // 2. Add new custom marker with pulsing animation
      const customIcon = L.divIcon({
        className: "custom-property-pin-container",
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute h-12 w-12 rounded-full bg-primary/30 animate-ping"></div>
            <div class="relative h-10 w-10 bg-primary border-2 border-white rounded-full flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker(center, { icon: customIcon }).addTo(mapRef.current);
      activeMarkerRef.current = marker;

      // Pan to marker
      mapRef.current.setView(center, mapRef.current.getZoom());

      // 3. Query ArcGIS REST API
      fetchPlanningData(activeProperty.latitude, activeProperty.longitude);
    };

    updateActiveMarker();
  }, [activeProperty, mapLoaded]);

  // Sync POI markers when category switches or active property changes
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !poiMarkersGroupRef.current) return;

    const renderPois = async () => {
      const L = await import("leaflet");
      poiMarkersGroupRef.current.clearLayers();

      if (!activeProperty) return;

      // Filter and render POIs within 2km
      MOCK_POIS.forEach((poi) => {
        if (!activeCategories[poi.category]) return;

        const distance = calculateDistance(activeProperty, {
          latitude: poi.latitude,
          longitude: poi.longitude,
        });

        if (distance > 2000) return; // 2km radius limit

        const colorClass = markerColorClasses[poi.category];
        const svgContent = iconSvgs[poi.category];

        const poiIcon = L.divIcon({
          className: "custom-poi-marker",
          html: `
            <div class="h-8 w-8 rounded-full border-2 border-white flex items-center justify-center shadow-lg ${colorClass} transition-transform hover:scale-110">
              ${svgContent}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([poi.latitude, poi.longitude], { icon: poiIcon });
        
        // Add Leaflet Popup for POI
        marker.bindPopup(`
          <div class="p-2 font-sans">
            <span class="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded ${poi.category === 'school' ? 'bg-blue-100 text-blue-800' : poi.category === 'hospital' ? 'bg-red-100 text-red-800' : poi.category === 'supermarket' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}">
              ${poi.category === 'school' ? 'Trường học' : poi.category === 'hospital' ? 'Bệnh viện' : poi.category === 'supermarket' ? 'Siêu thị' : 'Công viên'}
            </span>
            <div class="font-bold text-xs mt-1.5 text-slate-800">${poi.name}</div>
            <div class="text-[10px] text-slate-500 mt-0.5">Khoảng cách: ${distance >= 1000 ? `${(distance / 1000).toFixed(1)} km` : `${distance}m`}</div>
          </div>
        `, {
          closeButton: false,
          offset: [0, -10]
        });

        poiMarkersGroupRef.current.addLayer(marker);
      });
    };

    renderPois();
  }, [activeProperty, activeCategories, mapLoaded]);

  // Main function to query the ArcGIS API
  const fetchPlanningData = async (lat: number, lng: number) => {
    onPlanningQuery(null, true); // Set loading state to true

    const queryArcGIS = async (layerId: number) => {
      // Call the Server Function Proxy to bypass CORS completely
      const response = await queryPlanningProxy({ data: { layerId, lat, lng } });
      if (response && 'error' in response) {
        throw new Error(response.message || "Failed to query ArcGIS via server proxy");
      }
      return response;
    };

    try {
      // 1. Try Subdivision Planning (Layer 6)
      let data = await queryArcGIS(6);
      let features = data.features || [];

      // 2. If nothing found, try General Planning (Layer 5)
      if (features.length === 0) {
        data = await queryArcGIS(5);
        features = data.features || [];
      }

      // 3. If still nothing, try Detail Planning (Layer 4)
      if (features.length === 0) {
        data = await queryArcGIS(4);
        features = data.features || [];
      }

      if (features.length > 0) {
        const attr = features[0].attributes;
        
        // Map common Vietnamese GIS columns to standard fields
        const landUse = attr.MoTa || attr.MOTA || attr.LoaiDat || attr.KieuDat || attr.KIEUDAT || attr.LOAIDAT || attr.MucDichSD || attr.MaLoaiPolygon || "Đất chưa xác định";
        const projectName = attr.TenDuAn || attr.TENDUAN || attr.TenPhanKhu || attr.TENPHANKHU || attr.MoTa || "Chưa có dự án";
        const zoneName = attr.TenPhanKhu || attr.TenKhuVuc || attr.District || (attr.MaPhanKhu ? `Phân khu ${attr.MaPhanKhu}` : "Khu vực Đà Nẵng");
        const areaSize = attr.DienTich || attr.DIENTICH ? `${Math.round(attr.DienTich || attr.DIENTICH)} m²` : undefined;
        const decisionNo = attr.SoQD || attr.SOQD || attr.QuyetDinh || attr.QUYETDINH || "Chưa cập nhật";

        onPlanningQuery({
          success: true,
          landUse,
          projectName,
          zoneName,
          areaSize,
          decisionNo,
          rawAttributes: attr,
          lat,
          lng,
        }, false);
      } else {
        onPlanningQuery({
          success: false,
          lat,
          lng,
        }, false);
      }
    } catch (err) {
      console.error("Error fetching planning information from ArcGIS:", err);
      // Fallback: mock response or error state so that app doesn't crash
      onPlanningQuery({
        success: false,
        lat,
        lng,
      }, false);
    }
  };

  // Zoom controls
  const handleZoom = (type: "in" | "out") => {
    if (!mapRef.current) return;
    if (type === "in") {
      mapRef.current.zoomIn();
    } else {
      mapRef.current.zoomOut();
    }
  };

  const handleLocate = () => {
    if (!mapRef.current || !activeProperty) return;
    mapRef.current.setView([activeProperty.latitude, activeProperty.longitude], 16);
  };

  return (
    <div className="relative w-full h-[640px] md:h-[760px] rounded-xl overflow-hidden shadow-card border border-border bg-slate-100">
      {/* Real Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating BaseMap Toggle Control */}
      <button
        onClick={toggleBaseMap}
        className="absolute bottom-5 left-5 z-20 h-10 px-4 bg-card rounded-md shadow-card border border-border hover:bg-muted text-xs font-bold flex items-center gap-2 transition-all"
      >
        <MapIcon className="h-4 w-4 text-primary" />
        {baseMapType === "osm" ? "Bản đồ Vệ tinh" : "Bản đồ Đường phố"}
      </button>

      {/* Floating Zoom & Locate Controls */}
      <div className="absolute top-5 right-5 flex flex-col gap-2 z-20">
        <div className="flex flex-col bg-card rounded-md shadow-card border border-border overflow-hidden">
          <button
            onClick={() => handleZoom("in")}
            className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors border-b border-border font-bold text-lg"
          >
            +
          </button>
          <button
            onClick={() => handleZoom("out")}
            className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors font-bold text-lg"
          >
            -
          </button>
        </div>
        <button
          onClick={handleLocate}
          disabled={!activeProperty}
          className={`h-10 w-10 flex items-center justify-center bg-card rounded-md shadow-card border border-border hover:bg-muted transition-colors ${
            !activeProperty ? "opacity-50 cursor-not-allowed" : "text-primary"
          }`}
          title="Định vị điểm mốc đang chọn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-locate-fixed"><line x1="2" x2="5" y1="12" y2="12"/><line x1="19" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="5"/><line x1="12" x2="12" y1="19" y2="22"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>

      {/* Map loading overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm font-semibold text-muted-foreground">Đang tải bản đồ quy hoạch...</span>
        </div>
      )}
    </div>
  );
}
