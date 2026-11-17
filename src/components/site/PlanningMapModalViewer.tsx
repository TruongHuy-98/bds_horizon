import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  MapPin,
  Move,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import mapCityWide from "@/assets/quy-hoach-2050-toan-tp.jpg";
import mapUrbanCenter from "@/assets/quy-hoach-2050-do-thi-trung-tam.jpg";

interface PlanningMapModalViewerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "city" | "urban";
}

export function PlanningMapModalViewer({
  isOpen,
  onClose,
  defaultTab = "city",
}: PlanningMapModalViewerProps) {
  const [activeTab, setActiveTab] = useState<"city" | "urban">(defaultTab);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const currentImg = activeTab === "city" ? mapCityWide : mapUrbanCenter;
  const currentTitle =
    activeTab === "city"
      ? "Sơ đồ định hướng sử dụng đất toàn thành phố Đà Nẵng đến 2050"
      : "Bản đồ sử dụng đất quy hoạch khu vực đô thị trung tâm Đà Nẵng đến 2050";

  // Reset transform when modal opens or tab changes
  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (isOpen) {
      handleReset();
      // Lock body scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, activeTab, handleReset]);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") handleZoomIn();
      if (e.key === "-") handleZoomOut();
      if (e.key === "0") handleReset();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleReset]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.35, 4.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.35, 0.5));
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 4.5));
  };

  // Mouse pan / drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Download high-res image
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = currentImg;
    link.download = `ban-do-quy-hoach-da-nang-2050-${activeTab}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-slate-950/95 backdrop-blur-md animate-fade-in select-none"
      onMouseUp={handleMouseUp}
    >
      {/* Top Header Bar */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 bg-slate-900/80 text-white shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 text-primary">
            <Maximize2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-bold text-white leading-tight">
              Bản đồ Quy hoạch TP. Đà Nẵng đến 2050
            </h2>
            <p className="text-xs text-slate-400 hidden sm:block truncate max-w-[450px]">
              {currentTitle}
            </p>
          </div>
        </div>

        {/* Tab switch between 2 maps */}
        <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("city")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === "city"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Toàn thành phố
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("urban")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === "urban"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Khu vực đô thị
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {/* Main Interactive Canvas Area */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        className={`flex-1 relative overflow-hidden flex items-center justify-center ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? "none" : "transform 0.12s ease-out",
          }}
          className="max-w-none max-h-none origin-center inline-block pointer-events-none"
        >
          <img
            src={currentImg}
            alt={currentTitle}
            draggable={false}
            className="max-h-[82vh] w-auto object-contain rounded-lg shadow-2xl border border-white/10 bg-white"
          />
        </div>

        {/* Hint helper */}
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur border border-white/10 text-slate-300 text-[11px] px-3 py-1.5 rounded-full pointer-events-none flex items-center gap-1.5 shadow">
          <Move className="h-3.5 w-3.5 text-primary" />
          <span>Kéo chuột để di chuyển • Lăn chuột để phóng to/thu nhỏ</span>
        </div>
      </div>

      {/* Floating Bottom Control Bar */}
      <footer className="px-4 py-3 bg-slate-900/90 border-t border-white/10 flex items-center justify-between text-white shrink-0 z-10">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>Tỉ lệ:</span>
          <span className="font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
            {Math.round(scale * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="h-8 px-2.5 text-white hover:bg-white/10"
            title="Phóng to (+)"
          >
            <ZoomIn className="h-4 w-4 mr-1" />
            <span className="text-xs">Phóng to</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="h-8 px-2.5 text-white hover:bg-white/10"
            title="Thu nhỏ (-)"
          >
            <ZoomOut className="h-4 w-4 mr-1" />
            <span className="text-xs">Thu nhỏ</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2.5 text-white hover:bg-white/10"
            title="Vừa màn hình (0)"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            <span className="text-xs">Đặt lại</span>
          </Button>
          <div className="h-4 w-[1px] bg-white/20 mx-1" />
          <Button
            type="button"
            size="sm"
            onClick={handleDownload}
            className="h-8 px-3 bg-primary hover:bg-primary/90 text-white"
            title="Tải ảnh gốc chất lượng cao"
          >
            <Download className="h-4 w-4 mr-1.5" />
            <span className="text-xs font-medium">Tải ảnh</span>
          </Button>
        </div>
      </footer>
    </div>
  );
}

