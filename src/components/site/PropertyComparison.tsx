import * as React from "react";
import { useState, useEffect } from "react";
import { X, Scale, Info, Check, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

// ============================================================================
// 1. DATA TYPES & SCHEMAS
// ============================================================================

export interface PropertyToCompare {
  id: string;
  name: string;
  img: string;
  developer: string;
  district: string;
  price: number;     // Total price in Billion VND (tỷ VNĐ)
  area: number;      // Area in m2
  beds: number;      // Number of bedrooms
  baths: number;     // Number of bathrooms
  address: string;   // Full location/address
}

// ============================================================================
// 2. CUSTOM HOOK
// ============================================================================

export function usePropertyComparison() {
  const [selectedProperties, setSelectedProperties] = useState<PropertyToCompare[]>([]);

  const addToComparison = (property: PropertyToCompare) => {
    if (selectedProperties.some((p) => p.id === property.id)) {
      // If already added, remove it (toggle off)
      removeFromComparison(property.id);
      return;
    }

    if (selectedProperties.length >= 3) {
      toast.error("Bạn chỉ có thể so sánh tối đa 3 bất động sản.", {
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        className: "bg-destructive/10 text-destructive border-destructive/20 font-semibold",
      });
      return;
    }

    setSelectedProperties((prev) => [...prev, property]);
    toast.success(`Đã thêm "${property.name}" vào danh sách so sánh.`, {
      icon: <Check className="h-5 w-5 text-green-500" />,
    });
  };

  const removeFromComparison = (id: string) => {
    setSelectedProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const clearComparison = () => {
    setSelectedProperties([]);
  };

  const isSelected = (id: string) => {
    return selectedProperties.some((p) => p.id === id);
  };

  return {
    selectedProperties,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isSelected,
  };
}

// ============================================================================
// 3. FLOATING COMPARISON BAR COMPONENT
// ============================================================================

interface ComparisonBarProps {
  selectedProperties: PropertyToCompare[];
  onRemove: (id: string) => void;
  onCompareNow: () => void;
}

export function ComparisonBar({
  selectedProperties,
  onRemove,
  onCompareNow,
}: ComparisonBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (selectedProperties.length > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [selectedProperties]);

  if (!isVisible) return null;

  const canCompare = selectedProperties.length >= 2;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 px-4 flex justify-center animate-in slide-in-from-bottom duration-300">
      <Card className="glass border-white/40 bg-white/85 backdrop-blur-lg shadow-2xl rounded-2xl w-full max-w-4xl p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Property List Preview */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 pr-2 border-r border-border/60">
              <Scale className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                So sánh ({selectedProperties.length}/3)
              </span>
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto py-1">
              {selectedProperties.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2.5 bg-card/65 border border-border/60 p-1.5 pr-3 rounded-xl shadow-sm relative group shrink-0"
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-10 w-14 object-cover rounded-lg"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground line-clamp-1 max-w-[120px]">
                      {p.name}
                    </span>
                    <span className="text-[10px] font-semibold text-primary">
                      {p.price} tỷ
                    </span>
                  </div>
                  <button
                    onClick={() => onRemove(p.id)}
                    className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full h-4 w-4 grid place-items-center cursor-pointer shadow-md"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {/* Placeholder slots */}
              {Array.from({ length: 3 - selectedProperties.length }).map((_, index) => (
                <div
                  key={index}
                  className="hidden sm:flex items-center justify-center border-2 border-dashed border-muted-foreground/25 bg-muted/20 w-36 h-[50px] rounded-xl text-[10px] font-medium text-muted-foreground"
                >
                  Trống
                </div>
              ))}
            </div>
          </div>

          {/* Action Trigger button */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {!canCompare && (
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <Info className="h-4 w-4 text-orange" />
                Thêm ít nhất 1 dự án để so sánh
              </span>
            )}
            <Button
              disabled={!canCompare}
              onClick={onCompareNow}
              className="bg-primary hover:bg-primary/95 text-white h-11 px-6 rounded-xl font-bold shadow-md hover:scale-[1.02] transition-transform duration-200"
            >
              So sánh ngay
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// 4. DETAILED COMPARISON TABLE MODAL COMPONENT
// ============================================================================

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProperties: PropertyToCompare[];
  onRemove: (id: string) => void;
}

export function ComparisonModal({
  isOpen,
  onClose,
  selectedProperties,
  onRemove,
}: ComparisonModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-5xl w-[92vw] max-h-[90vh] overflow-y-auto rounded-2xl p-6 border-white/30 shadow-2xl">
        <DialogHeader className="border-b pb-4 mb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            Bảng So sánh Chi tiết Bất Động Sản
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 overflow-x-auto rounded-xl border border-border/80">
          <Table className="min-w-[700px]">
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-1/4 font-bold text-foreground">Thuộc tính</TableHead>
                {selectedProperties.map((p) => (
                  <TableHead key={p.id} className="w-1/4 relative p-4">
                    <div className="flex flex-col gap-2">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="h-28 w-full object-cover rounded-lg shadow-sm"
                      />
                      <div className="font-bold text-sm text-foreground line-clamp-2 mt-1">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-semibold">
                        {p.developer}
                      </div>
                      <button
                        onClick={() => onRemove(p.id)}
                        className="absolute top-2 right-2 bg-destructive/10 hover:bg-destructive/20 text-destructive p-1 rounded-full cursor-pointer transition-colors"
                        title="Xóa khỏi danh sách"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </TableHead>
                ))}
                {/* Pad columns to match 3 slots visually */}
                {Array.from({ length: Math.max(0, 3 - selectedProperties.length) }).map((_, index) => (
                  <TableHead key={`pad-${index}`} className="w-1/4 bg-muted/10" />
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Row: Price */}
              <TableRow className="hover:bg-transparent">
                <TableCell className="font-bold text-foreground text-xs uppercase tracking-wider bg-muted/5">
                  Giá tổng
                </TableCell>
                {selectedProperties.map((p) => (
                  <TableCell key={p.id} className="font-extrabold text-primary text-sm">
                    {p.price} tỷ VNĐ
                  </TableCell>
                ))}
                {Array.from({ length: Math.max(0, 3 - selectedProperties.length) }).map((_, index) => (
                  <TableCell key={`pad-${index}`} className="bg-muted/10" />
                ))}
              </TableRow>

              {/* Row: Area */}
              <TableRow className="hover:bg-transparent">
                <TableCell className="font-bold text-foreground text-xs uppercase tracking-wider bg-muted/5">
                  Diện tích
                </TableCell>
                {selectedProperties.map((p) => (
                  <TableCell key={p.id} className="font-semibold text-foreground">
                    {p.area} m²
                  </TableCell>
                ))}
                {Array.from({ length: Math.max(0, 3 - selectedProperties.length) }).map((_, index) => (
                  <TableCell key={`pad-${index}`} className="bg-muted/10" />
                ))}
              </TableRow>

              {/* Row: Price per m2 */}
              <TableRow className="hover:bg-transparent">
                <TableCell className="font-bold text-foreground text-xs uppercase tracking-wider bg-muted/5">
                  Đơn giá / m²
                </TableCell>
                {selectedProperties.map((p) => {
                  // Price is in Billion VND (1,000,000,000)
                  // So unit price in million VND = (Price * 1000) / Area
                  const pricePerM2 = ((p.price * 1000) / p.area).toFixed(1);
                  return (
                    <TableCell key={p.id} className="font-bold text-indigo-600">
                      {pricePerM2} triệu/m²
                    </TableCell>
                  );
                })}
                {Array.from({ length: Math.max(0, 3 - selectedProperties.length) }).map((_, index) => (
                  <TableCell key={`pad-${index}`} className="bg-muted/10" />
                ))}
              </TableRow>

              {/* Row: Address */}
              <TableRow className="hover:bg-transparent">
                <TableCell className="font-bold text-foreground text-xs uppercase tracking-wider bg-muted/5">
                  Vị trí / Địa chỉ
                </TableCell>
                {selectedProperties.map((p) => (
                  <TableCell key={p.id} className="text-foreground/90 text-xs leading-relaxed">
                    {p.address}
                  </TableCell>
                ))}
                {Array.from({ length: Math.max(0, 3 - selectedProperties.length) }).map((_, index) => (
                  <TableCell key={`pad-${index}`} className="bg-muted/10" />
                ))}
              </TableRow>

              {/* Row: Beds & Baths */}
              <TableRow className="hover:bg-transparent">
                <TableCell className="font-bold text-foreground text-xs uppercase tracking-wider bg-muted/5">
                  Phòng ngủ / Vệ sinh
                </TableCell>
                {selectedProperties.map((p) => (
                  <TableCell key={p.id} className="text-foreground font-medium text-xs">
                    {p.beds} PN / {p.baths} WC
                  </TableCell>
                ))}
                {Array.from({ length: Math.max(0, 3 - selectedProperties.length) }).map((_, index) => (
                  <TableCell key={`pad-${index}`} className="bg-muted/10" />
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end gap-3 mt-6 border-t pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-10 px-5 rounded-xl font-bold border-border/80 text-foreground"
          >
            Đóng bảng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
