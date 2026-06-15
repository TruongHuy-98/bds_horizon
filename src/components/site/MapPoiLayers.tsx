import * as React from "react";
import { useState, useMemo } from "react";
import {
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  Trees,
  MapPin,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

// ============================================================================
// 1. DATA TYPES & SCHEMAS
// ============================================================================

export type PoiCategory = "school" | "hospital" | "supermarket" | "park";

export interface POI {
  id: string;
  name: string;
  category: PoiCategory;
  latitude: number;
  longitude: number;
}

export interface POIWithDistance extends POI {
  distance: number; // in meters
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// ============================================================================
// 2. MOCK DATA SET
// ============================================================================

export const MOCK_POIS: POI[] = [
  // Schools
  { id: "s1", name: "Trường THPT Nguyễn Khuyến", category: "school", latitude: 16.0710, longitude: 108.2170 },
  { id: "s2", name: "Trường Tiểu học Phù Đổng", category: "school", latitude: 16.0630, longitude: 108.2230 },
  { id: "s3", name: "Trường THCS Trưng Vương", category: "school", latitude: 16.0745, longitude: 108.2195 },
  
  // Hospitals
  { id: "h1", name: "Bệnh viện Đa khoa Đà Nẵng", category: "hospital", latitude: 16.0750, longitude: 108.2120 },
  { id: "h2", name: "Bệnh viện Hoàn Mỹ Đà Nẵng", category: "hospital", latitude: 16.0610, longitude: 108.2100 },
  { id: "h3", name: "Bệnh viện Phụ sản - Nhi", category: "hospital", latitude: 16.0400, longitude: 108.2500 }, // out of range
  
  // Supermarkets
  { id: "m1", name: "Siêu thị Go! Đà Nẵng", category: "supermarket", latitude: 16.0665, longitude: 108.2130 },
  { id: "m2", name: "Co.opmart Đà Nẵng", category: "supermarket", latitude: 16.0690, longitude: 108.2050 },
  { id: "m3", name: "Lotte Mart Đà Nẵng", category: "supermarket", latitude: 16.0350, longitude: 108.2280 }, // out of range
  
  // Parks
  { id: "p1", name: "Công viên APEC", category: "park", latitude: 16.0605, longitude: 108.2225 },
  { id: "p2", name: "Công viên 29 Tháng 3", category: "park", latitude: 16.0640, longitude: 108.2010 }, // out of range
  { id: "p3", name: "Công viên Biển Đông", category: "park", latitude: 16.0720, longitude: 108.2450 }, // out of range
];

// ============================================================================
// 3. UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculates the distance between two coordinates in meters using the Haversine formula.
 */
export function calculateDistance(
  coords1: Coordinates,
  coords2: Coordinates
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (coords1.latitude * Math.PI) / 180;
  const φ2 = (coords2.latitude * Math.PI) / 180;
  const Δφ = ((coords2.latitude - coords1.latitude) * Math.PI) / 180;
  const Δλ = ((coords2.longitude - coords1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) *
      Math.cos(φ2) *
      Math.sin(Δλ / 2) *
      Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// ============================================================================
// 4. REUSABLE HOOK
// ============================================================================

export interface UseMapPoiProps {
  activeProperty: Coordinates | null;
  activeCategories: Record<PoiCategory, boolean>;
  maxRadiusMeters?: number; // defaults to 2000 (2km)
}

/**
 * Custom hook to filter and calculate distances for POIs near the active property.
 * Memoized to prevent performance lags and memory leaks.
 */
export function useMapPoi({
  activeProperty,
  activeCategories,
  maxRadiusMeters = 2000,
}: UseMapPoiProps) {
  return useMemo(() => {
    if (!activeProperty) return [];

    // Filter, calculate distance and sort by distance
    return MOCK_POIS.map((poi) => {
      const distance = calculateDistance(activeProperty, {
        latitude: poi.latitude,
        longitude: poi.longitude,
      });
      return { ...poi, distance };
    })
      .filter((poi) => {
        // Only return POIs belonging to active categories and within the specified radius
        return activeCategories[poi.category] && poi.distance <= maxRadiusMeters;
      })
      .sort((a, b) => a.distance - b.distance);
  }, [activeProperty, activeCategories, maxRadiusMeters]);
}

// ============================================================================
// 5. COMPONENT CONFIGURATIONS
// ============================================================================

export const CATEGORY_CONFIGS: Record<
  PoiCategory,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    colorClass: string;
    bgClass: string;
    markerColorClass: string;
  }
> = {
  school: {
    label: "Trường học",
    icon: GraduationCap,
    colorClass: "text-blue-600",
    bgClass: "bg-blue-500/10 border-blue-500/20",
    markerColorClass: "bg-blue-600 text-white",
  },
  hospital: {
    label: "Bệnh viện",
    icon: HeartPulse,
    colorClass: "text-red-600",
    bgClass: "bg-red-500/10 border-red-500/20",
    markerColorClass: "bg-red-600 text-white",
  },
  supermarket: {
    label: "Siêu thị",
    icon: ShoppingBag,
    colorClass: "text-amber-600",
    bgClass: "bg-amber-500/10 border-amber-500/20",
    markerColorClass: "bg-amber-600 text-white",
  },
  park: {
    label: "Công viên",
    icon: Trees,
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-500/10 border-emerald-500/20",
    markerColorClass: "bg-emerald-600 text-white",
  },
};

// ============================================================================
// 6. UI WIDGET COMPONENTS
// ============================================================================

interface PoiControlPanelProps {
  activeCategories: Record<PoiCategory, boolean>;
  onCategoryToggle: (category: PoiCategory, enabled: boolean) => void;
  className?: string;
  activePoiCount?: number;
}

/**
 * Floating Widget panel for toggling POI layers on/off.
 * Uses glassmorphism (mờ kính) and Antigravity UI components.
 */
export function PoiControlPanel({
  activeCategories,
  onCategoryToggle,
  className,
  activePoiCount = 0,
}: PoiControlPanelProps) {
  return (
    <Card
      className={`glass border-white/40 shadow-card bg-white/75 backdrop-blur-md rounded-2xl w-72 transition-all duration-300 ${className}`}
    >
      <CardHeader className="p-4 pb-2 border-b border-border/40">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-primary flex items-center justify-between">
          <span>Tiện ích xung quanh</span>
          {activePoiCount > 0 && (
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
              {activePoiCount} điểm
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {(Object.keys(CATEGORY_CONFIGS) as PoiCategory[]).map((cat) => {
          const config = CATEGORY_CONFIGS[cat];
          const IconComp = config.icon;
          const isChecked = activeCategories[cat];

          return (
            <div
              key={cat}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                isChecked
                  ? `${config.bgClass} border-current/10 shadow-sm`
                  : "bg-transparent border-transparent hover:bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 rounded-lg grid place-items-center transition-all ${
                    isChecked
                      ? "bg-white shadow-sm"
                      : "bg-muted"
                  }`}
                >
                  <IconComp className={`h-5 w-5 ${config.colorClass} stroke-[2]`} />
                </div>
                <span className="text-xs font-bold text-foreground">
                  {config.label}
                </span>
              </div>
              <Switch
                checked={isChecked}
                onCheckedChange={(val) => onCategoryToggle(cat, val)}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// 7. MAP OVERLAY MARKER SIMULATOR (FOR DEMO/GENERAL IMPLEMENTATION)
// ============================================================================

interface PoiMarkerProps {
  poi: POIWithDistance;
  xPct: number;
  yPct: number;
  onClick: (poi: POIWithDistance) => void;
  isActive: boolean;
}

export function PoiMarker({ poi, xPct, yPct, onClick, isActive }: PoiMarkerProps) {
  const config = CATEGORY_CONFIGS[poi.category];
  const IconComp = config.icon;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
      style={{ left: `${xPct}%`, top: `${yPct}%` }}
      onClick={() => onClick(poi)}
    >
      <div className="relative">
        {/* Pulsing ring */}
        <div
          className={`absolute inset-0 rounded-full h-8 w-8 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 opacity-35 animate-ping ${config.markerColorClass.split(" ")[0]}`}
        />
        
        {/* Main pin marker */}
        <div
          className={`h-9 w-9 rounded-full shadow-lg border-2 border-white flex items-center justify-center transition-all ${
            isActive ? "scale-125 ring-4 ring-primary/20" : "hover:scale-110"
          } ${config.markerColorClass}`}
        >
          <IconComp className="h-4.5 w-4.5 stroke-[2]" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. POPUP TOOLTIP COMPONENT
// ============================================================================

interface PoiPopupProps {
  poi: POIWithDistance;
  xPct: number;
  yPct: number;
  onClose: () => void;
}

export function PoiPopup({ poi, xPct, yPct, onClose }: PoiPopupProps) {
  const config = CATEGORY_CONFIGS[poi.category];

  return (
    <div
      className="absolute -translate-x-1/2 z-30 transition-all duration-300 bottom-[calc(100%-10px)]"
      style={{
        left: `${xPct}%`,
        top: `${yPct - 6}%`, // float above the marker
      }}
    >
      <Card className="glass border-white/50 bg-white/95 backdrop-blur shadow-2xl p-3 w-56 rounded-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground p-0.5 rounded-full hover:bg-muted"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <div className="flex gap-2.5 items-start mt-1">
          <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${config.bgClass.split(" ")[0]} ${config.colorClass}`}>
            {config.label}
          </span>
        </div>
        <div className="font-bold text-xs text-foreground mt-2 leading-snug pr-4">
          {poi.name}
        </div>
        <div className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1.5 font-semibold">
          <MapPin className={`h-3.5 w-3.5 ${config.colorClass}`} />
          Cách {poi.distance >= 1000 ? `${(poi.distance / 1000).toFixed(1)} km` : `${poi.distance}m`}
        </div>
        {/* Speech bubble arrow pointer */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white/95 drop-shadow-sm" />
      </Card>
    </div>
  );
}
