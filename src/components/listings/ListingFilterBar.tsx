import { useState } from "react";
import { Search, RotateCcw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export interface FilterState {
  keyword: string;
  city: string;
  district: string;
  category: string;
  priceRange: string;
  areaRange: string;
  direction: string;
  bedrooms: string;
}

export const initialFilterState: FilterState = {
  keyword: "",
  city: "danang",
  district: "all",
  category: "all",
  priceRange: "all",
  areaRange: "all",
  direction: "all",
  bedrooms: "all",
};

interface ListingFilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  totalCount?: number;
}

export function ListingFilterBar({
  filters,
  onFilterChange,
  onReset,
  totalCount,
}: ListingFilterBarProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const handleChange = (key: keyof FilterState, value: string) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
  };

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    setLocalFilters(initialFilterState);
    onReset();
  };

  const formFields = (
    <div className="space-y-4">
      {/* Search keyword */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Nhập từ khóa, tiêu đề, tên đường..."
          value={localFilters.keyword}
          onChange={(e) => handleChange("keyword", e.target.value)}
          className="pl-9 h-10 bg-white dark:bg-card border-border"
        />
      </div>

      {/* Location Cascading */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Tỉnh/Thành</label>
          <Select value={localFilters.city} onValueChange={(val) => handleChange("city", val)}>
            <SelectTrigger className="h-10 bg-white dark:bg-card">
              <SelectValue placeholder="Tỉnh / Thành" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="danang">Đà Nẵng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Quận / Huyện</label>
          <Select
            value={localFilters.district}
            onValueChange={(val) => handleChange("district", val)}
          >
            <SelectTrigger className="h-10 bg-white dark:bg-card">
              <SelectValue placeholder="Tất cả quận huyện" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả quận/huyện</SelectItem>
              <SelectItem value="Hải Châu">Hải Châu</SelectItem>
              <SelectItem value="Sơn Trà">Sơn Trà</SelectItem>
              <SelectItem value="Ngũ Hành Sơn">Ngũ Hành Sơn</SelectItem>
              <SelectItem value="Cẩm Lệ">Cẩm Lệ</SelectItem>
              <SelectItem value="Thanh Khê">Thanh Khê</SelectItem>
              <SelectItem value="Liên Chiểu">Liên Chiểu</SelectItem>
              <SelectItem value="Hòa Vang">Hòa Vang</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Property Category */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Loại bất động sản</label>
        <Select
          value={localFilters.category}
          onValueChange={(val) => handleChange("category", val)}
        >
          <SelectTrigger className="h-10 bg-white dark:bg-card">
            <SelectValue placeholder="Tất cả loại BĐS" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại BĐS</SelectItem>
            <SelectItem value="land">Đất thổ cư / Đất nền</SelectItem>
            <SelectItem value="house">Nhà riêng / Nhà phố</SelectItem>
            <SelectItem value="villa">Biệt thự / Khách sạn</SelectItem>
            <SelectItem value="apartment">Căn hộ chung cư</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Mức giá</label>
        <Select
          value={localFilters.priceRange}
          onValueChange={(val) => handleChange("priceRange", val)}
        >
          <SelectTrigger className="h-10 bg-white dark:bg-card">
            <SelectValue placeholder="Tất cả mức giá" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả mức giá</SelectItem>
            <SelectItem value="under-2">Dưới 2 tỷ</SelectItem>
            <SelectItem value="2-5">2 - 5 tỷ</SelectItem>
            <SelectItem value="5-10">5 - 10 tỷ</SelectItem>
            <SelectItem value="over-10">Trên 10 tỷ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Area Range */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Diện tích</label>
        <Select
          value={localFilters.areaRange}
          onValueChange={(val) => handleChange("areaRange", val)}
        >
          <SelectTrigger className="h-10 bg-white dark:bg-card">
            <SelectValue placeholder="Tất cả diện tích" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả diện tích</SelectItem>
            <SelectItem value="under-50">Dưới 50 m²</SelectItem>
            <SelectItem value="50-100">50 - 100 m²</SelectItem>
            <SelectItem value="100-200">100 - 200 m²</SelectItem>
            <SelectItem value="over-200">Trên 200 m²</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Direction & Bedrooms */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Hướng nhà/đất</label>
          <Select
            value={localFilters.direction}
            onValueChange={(val) => handleChange("direction", val)}
          >
            <SelectTrigger className="h-10 bg-white dark:bg-card">
              <SelectValue placeholder="Tất cả hướng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả hướng</SelectItem>
              <SelectItem value="Đông">Đông</SelectItem>
              <SelectItem value="Tây">Tây</SelectItem>
              <SelectItem value="Nam">Nam</SelectItem>
              <SelectItem value="Bắc">Bắc</SelectItem>
              <SelectItem value="Đông Nam">Đông Nam</SelectItem>
              <SelectItem value="Đông Bắc">Đông Bắc</SelectItem>
              <SelectItem value="Tây Nam">Tây Nam</SelectItem>
              <SelectItem value="Tây Bắc">Tây Bắc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Số phòng ngủ</label>
          <Select
            value={localFilters.bedrooms}
            onValueChange={(val) => handleChange("bedrooms", val)}
          >
            <SelectTrigger className="h-10 bg-white dark:bg-card">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="1">1+ phòng</SelectItem>
              <SelectItem value="2">2+ phòng</SelectItem>
              <SelectItem value="3">3+ phòng</SelectItem>
              <SelectItem value="4">4+ phòng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex gap-2">
        <Button
          onClick={handleApply}
          className="flex-1 bg-primary hover:bg-primary/95 text-primary-foreground h-10 font-medium"
        >
          <Search className="h-4 w-4 mr-2" /> Tìm kiếm
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="h-10 px-3 border-border hover:bg-muted text-muted-foreground"
          title="Xóa bộ lọc"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Horizontal Bar (All Filters 2-Row Grid) */}
      <div className="hidden lg:block bg-card border border-border/80 rounded-xl p-4 shadow-sm mb-6 space-y-3">
        {/* Row 1: Search, City, District, Category, Price */}
        <div className="grid grid-cols-6 gap-3 items-end">
          <div className="col-span-2 relative">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Từ khóa</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm tiêu đề, địa chỉ..."
                value={localFilters.keyword}
                onChange={(e) => handleChange("keyword", e.target.value)}
                className="pl-9 h-10 bg-white dark:bg-background border-border"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Tỉnh / Thành</label>
            <Select value={localFilters.city} onValueChange={(val) => handleChange("city", val)}>
              <SelectTrigger className="h-10 bg-white dark:bg-background">
                <SelectValue placeholder="Tỉnh/Thành" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="danang">Đà Nẵng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Quận / Huyện</label>
            <Select
              value={localFilters.district}
              onValueChange={(val) => handleChange("district", val)}
            >
              <SelectTrigger className="h-10 bg-white dark:bg-background">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả quận/huyện</SelectItem>
                <SelectItem value="Hải Châu">Hải Châu</SelectItem>
                <SelectItem value="Sơn Trà">Sơn Trà</SelectItem>
                <SelectItem value="Ngũ Hành Sơn">Ngũ Hành Sơn</SelectItem>
                <SelectItem value="Cẩm Lệ">Cẩm Lệ</SelectItem>
                <SelectItem value="Thanh Khê">Thanh Khê</SelectItem>
                <SelectItem value="Liên Chiểu">Liên Chiểu</SelectItem>
                <SelectItem value="Hòa Vang">Hòa Vang</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Loại BĐS</label>
            <Select
              value={localFilters.category}
              onValueChange={(val) => handleChange("category", val)}
            >
              <SelectTrigger className="h-10 bg-white dark:bg-background">
                <SelectValue placeholder="Loại BĐS" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại BĐS</SelectItem>
                <SelectItem value="land">Đất thổ cư / Đất nền</SelectItem>
                <SelectItem value="house">Nhà riêng / Nhà phố</SelectItem>
                <SelectItem value="villa">Biệt thự / Khách sạn</SelectItem>
                <SelectItem value="apartment">Căn hộ chung cư</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Mức giá</label>
            <Select
              value={localFilters.priceRange}
              onValueChange={(val) => handleChange("priceRange", val)}
            >
              <SelectTrigger className="h-10 bg-white dark:bg-background">
                <SelectValue placeholder="Tất cả giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả giá</SelectItem>
                <SelectItem value="under-2">Dưới 2 tỷ</SelectItem>
                <SelectItem value="2-5">2 - 5 tỷ</SelectItem>
                <SelectItem value="5-10">5 - 10 tỷ</SelectItem>
                <SelectItem value="over-10">Trên 10 tỷ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 2: Area, Direction, Bedrooms, Search & Reset Buttons */}
        <div className="grid grid-cols-6 gap-3 items-end pt-1">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Diện tích</label>
            <Select
              value={localFilters.areaRange}
              onValueChange={(val) => handleChange("areaRange", val)}
            >
              <SelectTrigger className="h-10 bg-white dark:bg-background">
                <SelectValue placeholder="Diện tích" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả diện tích</SelectItem>
                <SelectItem value="under-50">Dưới 50 m²</SelectItem>
                <SelectItem value="50-100">50 - 100 m²</SelectItem>
                <SelectItem value="100-200">100 - 200 m²</SelectItem>
                <SelectItem value="over-200">Trên 200 m²</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Hướng nhà/đất</label>
            <Select
              value={localFilters.direction}
              onValueChange={(val) => handleChange("direction", val)}
            >
              <SelectTrigger className="h-10 bg-white dark:bg-background">
                <SelectValue placeholder="Tất cả hướng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả hướng</SelectItem>
                <SelectItem value="Đông">Đông</SelectItem>
                <SelectItem value="Tây">Tây</SelectItem>
                <SelectItem value="Nam">Nam</SelectItem>
                <SelectItem value="Bắc">Bắc</SelectItem>
                <SelectItem value="Đông Nam">Đông Nam</SelectItem>
                <SelectItem value="Đông Bắc">Đông Bắc</SelectItem>
                <SelectItem value="Tây Nam">Tây Nam</SelectItem>
                <SelectItem value="Tây Bắc">Tây Bắc</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Số phòng ngủ</label>
            <Select
              value={localFilters.bedrooms}
              onValueChange={(val) => handleChange("bedrooms", val)}
            >
              <SelectTrigger className="h-10 bg-white dark:bg-background">
                <SelectValue placeholder="Số phòng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="1">1+ phòng</SelectItem>
                <SelectItem value="2">2+ phòng</SelectItem>
                <SelectItem value="3">3+ phòng</SelectItem>
                <SelectItem value="4">4+ phòng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1"></div>

          <div className="col-span-2 flex gap-2">
            <Button
              onClick={handleApply}
              className="flex-1 bg-teal hover:bg-teal/90 text-teal-foreground h-10 font-medium"
            >
              <Search className="h-4 w-4 mr-1.5" /> Tìm kiếm BĐS
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="h-10 px-3 border-border hover:bg-muted text-muted-foreground"
              title="Đặt lại bộ lọc"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Filter Trigger */}
      <div className="lg:hidden flex items-center justify-between gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm địa chỉ, từ khóa..."
            value={localFilters.keyword}
            onChange={(e) => {
              handleChange("keyword", e.target.value);
              onFilterChange({ ...localFilters, keyword: e.target.value });
            }}
            className="pl-9 h-10 bg-card border-border"
          />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-10 px-4 border-border flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <span>Bộ lọc</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[340px] sm:w-[400px] overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle className="text-lg font-bold flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" /> Bộ lọc bất động sản
              </SheetTitle>
            </SheetHeader>
            {formFields}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
