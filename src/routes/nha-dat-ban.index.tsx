import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { ListingFilterBar, FilterState, initialFilterState } from "@/components/listings/ListingFilterBar";
import { PropertyListingCard } from "@/components/listings/PropertyListingCard";
import { ListingSidebar } from "@/components/listings/ListingSidebar";
import { sampleListings, ListingItem } from "@/data/listingsData";
import { useFilteredListings } from "@/hooks/useFilteredListings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Search, ShieldCheck, AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface NhaDatBanSearch {
  keyword?: string;
  city?: string;
  district?: string;
  category?: string;
  type?: string;
  priceRange?: string;
  price?: string;
  areaRange?: string;
  area?: string;
  direction?: string;
  bedrooms?: string;
}

export const Route = createFileRoute("/nha-dat-ban")({
  validateSearch: (search: Record<string, unknown>): NhaDatBanSearch => ({
    keyword: typeof search.keyword === "string" ? search.keyword : undefined,
    city: typeof search.city === "string" ? search.city : undefined,
    district: typeof search.district === "string" ? search.district : undefined,
    category:
      typeof search.category === "string"
        ? search.category
        : typeof search.type === "string"
        ? search.type
        : undefined,
    priceRange:
      typeof search.priceRange === "string"
        ? search.priceRange
        : typeof search.price === "string"
        ? search.price
        : undefined,
    areaRange:
      typeof search.areaRange === "string"
        ? search.areaRange
        : typeof search.area === "string"
        ? search.area
        : undefined,
    direction: typeof search.direction === "string" ? search.direction : undefined,
    bedrooms: typeof search.bedrooms === "string" ? search.bedrooms : undefined,
  }),
  component: NhaDatBanPage,
  head: () => ({
    meta: [
      { title: "Nhà đất bán Đà Nẵng — Mua bán đất nền, nhà phố, biệt thự uy tín" },
      {
        name: "description",
        content:
          "Danh sách mua bán nhà đất, đất nền thổ cư, biệt thự ven biển Đà Nẵng chính chủ, pháp lý minh bạch, cập nhật liên tục.",
      },
    ],
  }),
});

function NhaDatBanPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedProperty, setSelectedProperty] = useState<ListingItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", message: "" });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  // Sync active filters from URL query search parameters
  const currentFilters: FilterState = useMemo(() => {
    return {
      keyword: searchParams.keyword || "",
      city: searchParams.city || "danang",
      district: searchParams.district || "all",
      category: searchParams.category || searchParams.type || "all",
      priceRange: searchParams.priceRange || searchParams.price || "all",
      areaRange: searchParams.areaRange || searchParams.area || "all",
      direction: searchParams.direction || "all",
      bedrooms: searchParams.bedrooms || "all",
    };
  }, [searchParams]);

  // Execute client-side filtering via custom hook
  const rawFiltered = useFilteredListings(sampleListings, currentFilters, "sale");

  // Apply sorting
  const filteredListings = useMemo(() => {
    const sorted = [...rawFiltered];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "area-desc") {
      sorted.sort((a, b) => b.area - a.area);
    }
    return sorted;
  }, [rawFiltered, sortBy]);

  // Filter change handlers updating URL params seamlessly
  const handleFilterChange = (newFilters: FilterState) => {
    const query: Record<string, string> = {};
    if (newFilters.keyword) query.keyword = newFilters.keyword;
    if (newFilters.district && newFilters.district !== "all") query.district = newFilters.district;
    if (newFilters.category && newFilters.category !== "all") query.category = newFilters.category;
    if (newFilters.priceRange && newFilters.priceRange !== "all") query.priceRange = newFilters.priceRange;
    if (newFilters.areaRange && newFilters.areaRange !== "all") query.areaRange = newFilters.areaRange;
    if (newFilters.direction && newFilters.direction !== "all") query.direction = newFilters.direction;
    if (newFilters.bedrooms && newFilters.bedrooms !== "all") query.bedrooms = newFilters.bedrooms;

    navigate({
      to: "/nha-dat-ban",
      search: query,
      replace: true,
    });
  };

  const handleResetFilters = () => {
    navigate({
      to: "/nha-dat-ban",
      search: {},
      replace: true,
    });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) {
      toast.error("Vui lòng nhập họ tên và số điện thoại.");
      return;
    }
    setIsSubmittingContact(true);
    setTimeout(() => {
      toast.success("Yêu cầu tư vấn đã được gửi đến môi giới! Chúng tôi sẽ liên hệ lại ngay.");
      setIsSubmittingContact(false);
      setContactForm({ name: "", phone: "", message: "" });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pb-16">
        {/* Page Banner / Header */}
        <div className="bg-surface-container/50 border-b border-border/60 py-6 md:py-8">
          <div className="container-page">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Link to="/" className="hover:text-primary">Trang chủ</Link>
              <span>/</span>
              <span className="text-foreground font-semibold">Nhà đất bán</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              Mua Bán Nhà Đất Đà Nẵng
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Tìm thấy <span className="font-bold text-primary">{filteredListings.length}</span> bất động sản phù hợp nhu cầu.
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="container-page mt-6">
          {/* Top Filter Bar (Syncs URL & State) */}
          <ListingFilterBar
            filters={currentFilters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            totalCount={filteredListings.length}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Listings Column */}
            <div className="lg:col-span-3 space-y-4">
              {/* Header result info & sorting */}
              <div className="flex items-center justify-between gap-4 bg-card border border-border/70 rounded-xl p-3 px-4 shadow-xs">
                <div className="text-sm font-semibold text-foreground">
                  Tìm thấy <span className="text-primary font-bold">{filteredListings.length}</span> bất động sản
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground hidden sm:inline">Sắp xếp:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-9 text-xs bg-background border-border w-40">
                      <SelectValue placeholder="Sắp xếp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Tin mới nhất</SelectItem>
                      <SelectItem value="price-asc">Giá thấp đến cao</SelectItem>
                      <SelectItem value="price-desc">Giá cao đến thấp</SelectItem>
                      <SelectItem value="area-desc">Diện tích lớn nhất</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Listing Cards / Empty State */}
              {filteredListings.length === 0 ? (
                <div className="bg-card border border-border/80 rounded-2xl p-12 text-center my-6 shadow-xs flex flex-col items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-muted/80 flex items-center justify-center mb-4 text-muted-foreground">
                    <AlertCircle className="h-8 w-8 text-amber-500" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-1">
                    Không tìm thấy bất động sản phù hợp với bộ lọc của bạn
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-md mb-6 leading-relaxed">
                    Hãy thử thay đổi từ khóa tìm kiếm, mở rộng khoảng giá hoặc bỏ bớt các điều kiện lọc để xem thêm kết quả.
                  </p>
                  <Button
                    onClick={handleResetFilters}
                    className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold h-10 px-5 gap-2"
                  >
                    <RotateCcw className="h-4 w-4" /> Xóa bộ lọc & Hiển thị tất cả
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredListings.map((item) => (
                    <PropertyListingCard
                      key={item.id}
                      item={item}
                      onSelect={(i) => {
                        setSelectedProperty(i);
                        setActiveImageIndex(0);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-1">
              <ListingSidebar
                onSelectDistrict={(dist) => handleFilterChange({ ...currentFilters, district: dist })}
                onSelectProperty={(i) => {
                  setSelectedProperty(i);
                  setActiveImageIndex(0);
                }}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Property Detail Modal */}
      <Dialog open={!!selectedProperty} onOpenChange={(open) => { if (!open) setSelectedProperty(null); }}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border border-border/80 bg-card rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="p-6 pb-0 border-b border-border/50 shrink-0">
            <div className="flex items-center gap-2">
              <span className="bg-teal text-teal-foreground text-[11px] font-semibold px-2.5 py-1 rounded-full">
                {selectedProperty?.listingType === "sale" ? "Mua bán" : "Cho thuê"}
              </span>
              {selectedProperty?.isVip && (
                <span className="bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                  VIP
                </span>
              )}
              {selectedProperty?.isOwner && (
                <span className="bg-muted text-muted-foreground text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-primary" /> Chính chủ
                </span>
              )}
            </div>
            <DialogTitle className="text-xl md:text-2xl font-bold mt-2 text-foreground pr-8">
              {selectedProperty?.title}
            </DialogTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground pb-4 mt-1">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span>{selectedProperty?.location}</span>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted border border-border/40">
                <img
                  src={selectedProperty?.images[activeImageIndex] || selectedProperty?.images[0]}
                  alt={selectedProperty?.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {selectedProperty && selectedProperty.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {selectedProperty.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                        idx === activeImageIndex ? "border-primary shadow-sm" : "border-transparent opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-surface-container/50 border border-border/40 rounded-xl p-3 text-center">
                  <div className="text-xs text-muted-foreground">Mức giá</div>
                  <div className="text-base font-bold text-primary mt-0.5">{selectedProperty?.priceLabel}</div>
                </div>
                <div className="bg-surface-container/50 border border-border/40 rounded-xl p-3 text-center">
                  <div className="text-xs text-muted-foreground">Diện tích</div>
                  <div className="text-base font-bold mt-0.5">{selectedProperty?.area} m²</div>
                </div>
                <div className="bg-surface-container/50 border border-border/40 rounded-xl p-3 text-center">
                  <div className="text-xs text-muted-foreground">Hướng nhà</div>
                  <div className="text-sm font-bold mt-1 text-foreground">
                    {selectedProperty?.directions || "Đang cập nhật"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-6">
              <div>
                <h4 className="font-bold text-sm text-foreground uppercase tracking-wider mb-2">Mô tả chi tiết</h4>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line border-l-2 border-primary/20 pl-3">
                  {selectedProperty?.description}
                </div>
              </div>

              <div className="border border-border/50 bg-surface-container/20 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border/40">
                  <img
                    src={selectedProperty?.brokerAvatar}
                    alt={selectedProperty?.brokerName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-sm text-foreground">{selectedProperty?.brokerName}</div>
                    <div className="text-xs text-muted-foreground">SĐT: {selectedProperty?.brokerPhone}</div>
                  </div>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <Input
                    required
                    placeholder="Họ và tên của bạn"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="bg-card border-border h-10 text-sm"
                  />
                  <Input
                    type="tel"
                    required
                    placeholder="Số điện thoại liên hệ"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="bg-card border-border h-10 text-sm"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmittingContact}
                    className="w-full bg-teal hover:bg-teal/90 text-teal-foreground font-semibold h-10 rounded-md"
                  >
                    {isSubmittingContact ? "Đang gửi..." : "Yêu cầu gọi lại tư vấn"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
