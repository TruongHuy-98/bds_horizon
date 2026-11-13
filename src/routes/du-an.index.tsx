import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Search,
  MapPin,
  Building2,
  CalendarDays,
  Layers,
  ArrowRight,
  TrendingUp,
  Scale,
  ShieldCheck,
  Star,
  ChevronDown,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { ListPagination } from "@/components/listings/ListPagination";
import {
  ComparisonBar,
  ComparisonModal,
  usePropertyComparison,
  type PropertyToCompare,
} from "@/components/site/PropertyComparison";

// Asset imports
import heroBg from "@/assets/hero-capital-square.jpg";
import proj1 from "@/assets/project-1.jpg";
import proj2 from "@/assets/project-2.jpg";
import proj3 from "@/assets/project-3.jpg";
import proj4 from "@/assets/project-4.jpg";
import proj5 from "@/assets/project-5.jpg";
import proj6 from "@/assets/project-6.jpg";

export const Route = createFileRoute("/du-an/")(({
  component: DuAnPage,
  head: () => ({
    meta: [
      { title: "Dự án Bất động sản Đà Nẵng — Da Nang Real Estate" },
      {
        name: "description",
        content:
          "Khám phá các dự án căn hộ, biệt thự, khu đô thị và nghỉ dưỡng nổi bật tại Đà Nẵng — thông tin minh bạch, cập nhật tiến độ và pháp lý.",
      },
      { property: "og:title", content: "Dự án Bất động sản Đà Nẵng" },
      {
        property: "og:description",
        content: "Tổng hợp các dự án nổi bật, cập nhật tiến độ và giá bán mới nhất.",
      },
    ],
  }),
}));

type Status = "Đang mở bán" | "Sắp mở bán" | "Đã bàn giao";
type Category = "Căn hộ" | "Biệt thự" | "Khu đô thị" | "Nghỉ dưỡng" | "Văn phòng";

const statusTone: Record<Status, string> = {
  "Đang mở bán": "bg-teal text-teal-foreground",
  "Sắp mở bán": "bg-orange text-orange-foreground",
  "Đã bàn giao": "bg-muted text-foreground/70",
};

const statusDotColor: Record<Status, string> = {
  "Đang mở bán": "bg-teal",
  "Sắp mở bán": "bg-orange",
  "Đã bàn giao": "bg-muted-foreground",
};

// Fallback mock projects (shown when DB returns 0 rows due to RLS)
const FALLBACK_PROJECTS = [
  {
    img: proj1,
    name: "Capital Square Đà Nẵng",
    developer: "Tập đoàn Capital Land",
    district: "Hải Châu",
    category: "Căn hộ" as Category,
    status: "Đang mở bán" as Status,
    priceFrom: "Từ 4,8 tỷ",
    units: "1.200 căn",
    handover: "Q4/2026",
    slug: "capital-square-da-nang",
    location: "Trần Hưng Đạo, Hải Châu, Đà Nẵng",
    description: "Tổ hợp căn hộ cao cấp trung tâm Đà Nẵng, view sông Hàn trực diện, tiện ích 5 sao đẳng cấp quốc tế.",
  },
  {
    img: proj2,
    name: "The Ocean Villas Mỹ Khê",
    developer: "Sun Group",
    district: "Sơn Trà",
    category: "Biệt thự" as Category,
    status: "Đang mở bán" as Status,
    priceFrom: "Từ 25 tỷ",
    units: "150 villa",
    handover: "Q2/2026",
    slug: "the-ocean-villas-my-khe",
    location: "Võ Nguyên Giáp, Sơn Trà, Đà Nẵng",
    description: "Biệt thự biển sang trọng ngay bãi Mỹ Khê, thiết kế mở, hồ bơi riêng, pháp lý lâu dài.",
  },
  {
    img: proj3,
    name: "Hòa Xuân Riverside City",
    developer: "Nam Long Group",
    district: "Cẩm Lệ",
    category: "Khu đô thị" as Category,
    status: "Sắp mở bán" as Status,
    priceFrom: "Từ 2,9 tỷ",
    units: "800 căn",
    handover: "Q1/2027",
    slug: "hoa-xuan-riverside-city",
    location: "Nguyễn Phước Lan, Cẩm Lệ, Đà Nẵng",
    description: "Khu đô thị sinh thái ven sông Cẩm Lệ, mật độ xây dựng thấp, hệ thống tiện ích đầy đủ.",
  },
  {
    img: proj4,
    name: "Azura Riverfront Tower",
    developer: "VinaCapital",
    district: "Hải Châu",
    category: "Căn hộ" as Category,
    status: "Đã bàn giao" as Status,
    priceFrom: "Từ 5,5 tỷ",
    units: "420 căn",
    handover: "Q3/2024",
    slug: "azura-riverfront-tower",
    location: "Trần Hưng Đạo, Hải Châu, Đà Nẵng",
    description: "Tòa tháp căn hộ cao cấp bên sông Hàn, nội thất bàn giao hoàn thiện, pháp lý sổ hồng vĩnh viễn.",
  },
  {
    img: proj5,
    name: "Eco Green Hòa Vang",
    developer: "Ecopark",
    district: "Hòa Vang",
    category: "Khu đô thị" as Category,
    status: "Sắp mở bán" as Status,
    priceFrom: "Từ 3,2 tỷ",
    units: "2.000 lô",
    handover: "Q2/2027",
    slug: "eco-green-hoa-vang",
    location: "Quốc lộ 14B, Hòa Vang, Đà Nẵng",
    description: "Khu đô thị xanh rộng lớn tại Hòa Vang, mảng cây xanh chiếm 60%, không khí trong lành.",
  },
  {
    img: proj6,
    name: "Da Nang Smart Plaza",
    developer: "FPT Corp",
    district: "Ngũ Hành Sơn",
    category: "Văn phòng" as Category,
    status: "Đang mở bán" as Status,
    priceFrom: "Từ 7,8 tỷ",
    units: "300 văn phòng",
    handover: "Q4/2025",
    slug: "da-nang-smart-plaza",
    location: "FPT City, Ngũ Hành Sơn, Đà Nẵng",
    description: "Tòa nhà văn phòng thông minh tại FPT City, hạ tầng công nghệ cao, phù hợp startup & doanh nghiệp.",
  },
];

const statusFilters: { key: string; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "selling", label: "Đang mở bán" },
  { key: "soon", label: "Sắp mở bán" },
  { key: "done", label: "Đã bàn giao" },
];

const mapProjectToCompare = (p: any): PropertyToCompare => {
  const detailsMap: Record<string, { price: number; area: number; beds: number; baths: number; address: string }> = {
    "Capital Square Đà Nẵng": { price: 4.8, area: 85, beds: 2, baths: 2, address: "Trần Hưng Đạo, Hải Châu, Đà Nẵng" },
    "The Ocean Villas Mỹ Khê": { price: 25.0, area: 320, beds: 4, baths: 4, address: "Võ Nguyên Giáp, Sơn Trà, Đà Nẵng" },
    "Hòa Xuân Riverside City": { price: 2.9, area: 100, beds: 3, baths: 2, address: "Nguyễn Phước Lan, Cẩm Lệ, Đà Nẵng" },
    "Azura Riverfront Tower": { price: 5.5, area: 110, beds: 2, baths: 2, address: "Trần Hưng Đạo, Hải Châu, Đà Nẵng" },
    "Eco Green Hòa Vang": { price: 3.2, area: 180, beds: 3, baths: 3, address: "Quốc lộ 14B, Hòa Vang, Đà Nẵng" },
    "Da Nang Smart Plaza": { price: 7.8, area: 150, beds: 0, baths: 2, address: "FPT City, Ngũ Hành Sơn, Đà Nẵng" },
  };
  const details = detailsMap[p.name] || {
    price: parseFloat(p.priceFrom) || 5.0,
    area: 90,
    beds: 2,
    baths: 2,
    address: p.location || `${p.district}, Đà Nẵng`,
  };
  return {
    id: p.slug || p.name.toLowerCase().replace(/\s+/g, "-"),
    name: p.name,
    img: p.img,
    developer: p.developer,
    district: p.district,
    ...details,
  };
};

// ─── Hero Section ───────────────────────────────────────────────────────────
function ProjectsHero({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  return (
    <section className="relative min-h-[480px] md:min-h-[560px] flex items-end overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Dự án bất động sản Đà Nẵng"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-slate-900/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="container-page relative pb-16 pt-32 md:pb-20 md:pt-40 w-full">
        {/* Pill badge */}
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-semibold mb-5">
          <Building2 className="h-3.5 w-3.5 text-teal-300" />
          Dự án Bất động sản Đà Nẵng
        </span>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white max-w-3xl leading-tight">
          Khám phá các dự án{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">
            nổi bật
          </span>{" "}
          tại Đà Nẵng
        </h1>

        <p className="mt-4 text-white/80 max-w-2xl text-base md:text-lg">
          Thẩm định pháp lý minh bạch, cập nhật tiến độ và chính sách bán hàng mới nhất từ các chủ đầu tư uy tín.
        </p>

        {/* Quick search */}
        <div className="mt-8 flex gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên dự án..."
              className="pl-10 h-12 bg-white text-slate-800 border-0 rounded-xl shadow-lg placeholder:text-muted-foreground/60 text-sm"
            />
          </div>
          <Button className="h-12 px-6 bg-orange text-orange-foreground hover:bg-orange/90 rounded-xl font-semibold text-sm shadow-lg">
            Tìm kiếm
          </Button>
        </div>

        {/* Trust badges */}
        <div className="mt-7 flex flex-wrap gap-5">
          {[
            { icon: ShieldCheck, text: "100% thẩm định pháp lý" },
            { icon: Star, text: "6+ dự án nổi bật" },
            { icon: TrendingUp, text: "Cập nhật tiến độ định kỳ" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-white/85 text-sm">
              <Icon className="h-4 w-4 text-teal-300 flex-shrink-0" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Sticky Filter Bar ───────────────────────────────────────────────────────
interface StickyFilterBarProps {
  activeStatus: string;
  setActiveStatus: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  district: string;
  setDistrict: (v: string) => void;
  resultCount: number;
}

function StickyFilterBar({
  activeStatus,
  setActiveStatus,
  category,
  setCategory,
  district,
  setDistrict,
  resultCount,
}: StickyFilterBarProps) {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const hasActiveFilter = activeStatus !== "all" || category !== "all" || district !== "all";

  return (
    <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container-page">
        <div className="flex items-center gap-3 py-3 overflow-x-auto scrollbar-hide">
          {/* Status pills */}
          <div className="flex gap-2 flex-shrink-0">
            {statusFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveStatus(f.key)}
                className={`px-4 h-9 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${
                  activeStatus === f.key
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-foreground/70 border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-border flex-shrink-0 hidden md:block" />

          {/* Dropdowns — hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-9 rounded-full border-border text-sm w-auto px-4 gap-1 bg-card">
                <SelectValue placeholder="Loại dự án" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại dự án</SelectItem>
                <SelectItem value="apt">Căn hộ</SelectItem>
                <SelectItem value="villa">Biệt thự</SelectItem>
                <SelectItem value="urban">Khu đô thị</SelectItem>
                <SelectItem value="resort">Nghỉ dưỡng</SelectItem>
                <SelectItem value="office">Văn phòng</SelectItem>
              </SelectContent>
            </Select>

            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="h-9 rounded-full border-border text-sm w-auto px-4 gap-1 bg-card">
                <SelectValue placeholder="Quận / Huyện" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả quận/huyện</SelectItem>
                <SelectItem value="hc">Hải Châu</SelectItem>
                <SelectItem value="st">Sơn Trà</SelectItem>
                <SelectItem value="nhs">Ngũ Hành Sơn</SelectItem>
                <SelectItem value="cl">Cẩm Lệ</SelectItem>
                <SelectItem value="hv">Hòa Vang</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="md:hidden flex-shrink-0 h-9 px-3 rounded-full border border-border bg-card text-sm text-foreground/70 flex items-center gap-1.5"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Lọc
          </button>

          {/* Result count */}
          <div className="ml-auto flex-shrink-0 flex items-center gap-2">
            {hasActiveFilter && (
              <button
                onClick={() => { setActiveStatus("all"); setCategory("all"); setDistrict("all"); }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <X className="h-3 w-3" />
                Xóa lọc
              </button>
            )}
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              <span className="font-semibold text-foreground">{resultCount}</span> dự án
            </span>
          </div>
        </div>

        {/* Mobile expanded filter */}
        {showMobileFilter && (
          <div className="md:hidden flex gap-3 pb-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-9 rounded-full border-border text-sm flex-1">
                <SelectValue placeholder="Loại dự án" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại dự án</SelectItem>
                <SelectItem value="apt">Căn hộ</SelectItem>
                <SelectItem value="villa">Biệt thự</SelectItem>
                <SelectItem value="urban">Khu đô thị</SelectItem>
                <SelectItem value="resort">Nghỉ dưỡng</SelectItem>
                <SelectItem value="office">Văn phòng</SelectItem>
              </SelectContent>
            </Select>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="h-9 rounded-full border-border text-sm flex-1">
                <SelectValue placeholder="Quận / Huyện" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả quận</SelectItem>
                <SelectItem value="hc">Hải Châu</SelectItem>
                <SelectItem value="st">Sơn Trà</SelectItem>
                <SelectItem value="nhs">Ngũ Hành Sơn</SelectItem>
                <SelectItem value="cl">Cẩm Lệ</SelectItem>
                <SelectItem value="hv">Hòa Vang</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Featured Project Strip ──────────────────────────────────────────────────
function FeaturedProjectStrip({
  project,
  onAddToComparison,
  isCompared,
}: {
  project: any;
  onAddToComparison: (p: PropertyToCompare) => void;
  isCompared: boolean;
}) {
  const propertyToCompare = mapProjectToCompare(project);
  return (
    <section className="pt-10 md:pt-14">
      <div className="container-page">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-6">
          <span className="h-1 w-6 rounded-full bg-orange" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Dự án nổi bật</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 bg-card rounded-3xl overflow-hidden border border-border/60 shadow-card">
          {/* Image — 3/5 */}
          <Link
            to="/du-an/$slug"
            params={{ slug: project.slug || project.name.toLowerCase().replace(/\s+/g, "-") }}
            className="relative lg:col-span-3 aspect-[16/10] lg:aspect-auto lg:min-h-[400px] overflow-hidden block group"
          >
            <img
              src={project.img}
              alt={project.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Status badge */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm ${statusTone[project.status as Status] || "bg-teal text-teal-foreground"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${statusDotColor[project.status as Status] || "bg-teal"} animate-pulse`} />
                {project.status}
              </span>
              <span className="bg-white/95 text-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                {project.category}
              </span>
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {/* Info — 2/5 */}
          <div className="lg:col-span-2 p-7 md:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{project.developer}</p>
              <Link
                to="/du-an/$slug"
                params={{ slug: project.slug || project.name.toLowerCase().replace(/\s+/g, "-") }}
                className="hover:text-primary transition-colors"
              >
                <h2 className="mt-2 text-2xl md:text-3xl font-bold leading-snug">{project.name}</h2>
              </Link>
              <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                {project.location || `${project.district}, Đà Nẵng`}
              </div>
              {project.description && (
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {project.description}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: TrendingUp, label: "Giá từ", value: project.priceFrom, highlight: true },
                { icon: Layers, label: "Quy mô", value: project.units, highlight: false },
                { icon: CalendarDays, label: "Bàn giao", value: project.handover, highlight: false },
              ].map(({ icon: Icon, label, value, highlight }) => (
                <div key={label} className="rounded-xl bg-surface-container/60 p-3">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                    <Icon className="h-3 w-3" />
                    {label}
                  </div>
                  <div className={`text-sm font-bold leading-tight ${highlight ? "text-primary" : "text-foreground"}`}>
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <Button
                asChild
                className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm"
              >
                <Link
                  to="/du-an/$slug"
                  params={{ slug: project.slug || project.name.toLowerCase().replace(/\s+/g, "-") }}
                >
                  Xem chi tiết
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => onAddToComparison(propertyToCompare)}
                className={`h-11 px-4 rounded-xl border-border text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  isCompared
                    ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                    : "hover:bg-muted"
                }`}
              >
                <Scale className="h-4 w-4" />
                {isCompared ? "Đã thêm" : "So sánh"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Project Card ────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  onAddToComparison,
  isCompared,
}: {
  project: any;
  onAddToComparison: (p: PropertyToCompare) => void;
  isCompared: boolean;
}) {
  const propertyToCompare = mapProjectToCompare(project);
  const slug = project.slug || project.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <article className="group bg-card rounded-2xl overflow-hidden border border-border/60 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300">
      {/* Image */}
      <Link to="/du-an/$slug" params={{ slug }} className="relative aspect-[16/10] overflow-hidden block">
        <img
          src={project.img}
          alt={project.name}
          width={800}
          height={500}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm ${statusTone[project.status as Status] || "bg-teal text-teal-foreground"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${statusDotColor[project.status as Status] || "bg-teal"}`} />
            {project.status}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-white/95 text-foreground text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {project.category}
          </span>
        </div>
        {/* Price overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
          <div className="text-white text-sm font-bold">{project.priceFrom}</div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-5">
        <div className="text-xs text-muted-foreground font-medium">{project.developer}</div>
        <Link to="/du-an/$slug" params={{ slug }} className="block hover:text-primary transition-colors">
          <h3 className="mt-1.5 font-bold text-base leading-snug line-clamp-1">{project.name}</h3>
        </Link>
        <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          {project.district}, Đà Nẵng
        </div>

        {/* Stats grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-surface-container/60 p-2.5">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1 mb-0.5">
              <Layers className="h-3 w-3" /> Quy mô
            </div>
            <div className="font-semibold text-foreground">{project.units}</div>
          </div>
          <div className="rounded-lg bg-surface-container/60 p-2.5">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1 mb-0.5">
              <CalendarDays className="h-3 w-3" /> Bàn giao
            </div>
            <div className="font-semibold text-foreground">{project.handover}</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onAddToComparison(propertyToCompare)}
            className={`h-9 px-3 rounded-lg border-border text-xs font-semibold flex items-center gap-1 transition-colors ${
              isCompared
                ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                : "hover:bg-muted"
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            {isCompared ? "Đã thêm" : "So sánh"}
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 h-9 rounded-lg border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-semibold"
          >
            <Link to="/du-an/$slug" params={{ slug }}>
              Xem chi tiết
              <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

// ─── Project Grid ─────────────────────────────────────────────────────────────
interface ProjectGridProps {
  projects: any[];
  loading: boolean;
  onAddToComparison: (property: PropertyToCompare) => void;
  isSelected: (id: string) => boolean;
}

function ProjectGrid({ projects, loading, onAddToComparison, isSelected }: ProjectGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    setCurrentPage(1);
  }, [projects.length]);

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const paginated = projects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="container-page py-20 text-center text-muted-foreground">
        <div className="animate-spin size-8 border-t-2 border-b-2 border-primary rounded-full mx-auto mb-4" />
        <p className="text-sm">Đang tải danh sách dự án...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="container-page py-20">
        <div className="text-center text-muted-foreground bg-card rounded-2xl border border-dashed border-border p-16">
          <Building2 className="size-10 mx-auto mb-3 text-muted-foreground/50" />
          <h3 className="text-base font-semibold text-foreground">Không tìm thấy dự án</h3>
          <p className="text-xs text-muted-foreground mt-1.5">Thử thay đổi bộ lọc hoặc tìm kiếm khác.</p>
        </div>
      </div>
    );
  }

  // First project is featured, rest go in grid
  const [featuredProject, ...restProjects] = paginated;
  const paginatedRest = restProjects;

  return (
    <div>
      {/* Featured strip (only on page 1) */}
      {currentPage === 1 && featuredProject && (
        <FeaturedProjectStrip
          project={featuredProject}
          onAddToComparison={onAddToComparison}
          isCompared={isSelected(mapProjectToCompare(featuredProject).id)}
        />
      )}

      {/* Rest of projects in 3-col grid */}
      {paginatedRest.length > 0 && (
        <section className="pt-10 pb-6">
          <div className="container-page">
            {currentPage === 1 && (
              <div className="flex items-center gap-2 mb-6">
                <span className="h-1 w-6 rounded-full bg-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Tất cả dự án</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(currentPage > 1 ? paginated : paginatedRest).map((p, idx) => {
                const propertyId = mapProjectToCompare(p).id;
                return (
                  <ProjectCard
                    key={idx}
                    project={p}
                    onAddToComparison={onAddToComparison}
                    isCompared={isSelected(propertyId)}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="container-page pb-10">
          <ListPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 300, behavior: "smooth" });
            }}
            className="pt-4"
          />
        </div>
      )}
    </div>
  );
}

// ─── Stats Bar ───────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { value: "6+", label: "Dự án đang theo dõi", accent: "text-primary" },
    { value: "100%", label: "Thẩm định pháp lý", accent: "text-teal" },
    { value: "3", label: "Quận trung tâm", accent: "text-orange" },
    { value: "2026", label: "Bàn giao sớm nhất", accent: "text-primary" },
  ];
  return (
    <div className="bg-surface-container/40 border-b border-border">
      <div className="container-page py-5 grid grid-cols-2 md:grid-cols-4 gap-5">
        {stats.map(({ value, label, accent }) => (
          <div key={label} className="text-center">
            <div className={`text-2xl md:text-3xl font-bold ${accent}`}>{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-14 md:py-16">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary to-teal p-10 md:p-14 text-white">
          {/* Decorative circles */}
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-16 h-56 w-56 rounded-full bg-teal/20 blur-3xl pointer-events-none" />

          <div className="relative md:flex items-center justify-between gap-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-semibold mb-5 border border-white/20">
                <Building2 className="h-3.5 w-3.5" />
                Dành cho chủ đầu tư
              </div>
              <h3 className="text-2xl md:text-4xl font-bold leading-snug">
                Bạn là chủ đầu tư?<br />
                <span className="text-teal-200">Đăng dự án ngay hôm nay.</span>
              </h3>
              <p className="mt-3 text-white/80 text-sm md:text-base leading-relaxed">
                Tiếp cận hơn 200.000 khách hàng tiềm năng mỗi tháng tại khu vực miền Trung. Thông tin minh bạch, hiển thị ưu tiên và công cụ quản lý tiến độ.
              </p>
            </div>
            <div className="mt-8 md:mt-0 flex flex-col gap-3 flex-shrink-0">
              <Button className="h-13 px-8 bg-orange text-orange-foreground hover:bg-orange/90 rounded-xl font-semibold text-sm shadow-xl">
                Đăng dự án ngay
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <button
                type="button"
                className="h-11 px-8 rounded-xl border border-white/40 text-white/90 hover:bg-white/15 hover:text-white font-medium text-sm transition-colors"
              >
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function DuAnPage() {
  const { selectedProperties, addToComparison, removeFromComparison, isSelected } = usePropertyComparison();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [district, setDistrict] = useState("all");

  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      let list: any[] = [];
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("published", true)
          .order("created_at", { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          list = data;
        }
      } catch (err) {
        console.warn("[du-an.index] Supabase query failed, using fallback:", err);
      }

      if (list.length === 0) {
        const localData = typeof window !== "undefined" ? localStorage.getItem("mock_projects") : null;
        list = localData ? JSON.parse(localData) : [];
      }

      setDbProjects(list);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const guessCategory = (name: string, description: string): Category => {
    const text = `${name} ${description || ""}`.toLowerCase();
    if (text.includes("villa") || text.includes("biệt thự")) return "Biệt thự";
    if (text.includes("resort") || text.includes("nghỉ dưỡng")) return "Nghỉ dưỡng";
    if (text.includes("đô thị") || text.includes("khu đô")) return "Khu đô thị";
    if (text.includes("văn phòng") || text.includes("office")) return "Văn phòng";
    return "Căn hộ";
  };

  const guessDistrict = (location: string): string => {
    const t = (location || "").toLowerCase();
    if (t.includes("hải châu")) return "Hải Châu";
    if (t.includes("sơn trà")) return "Sơn Trà";
    if (t.includes("ngũ hành sơn")) return "Ngũ Hành Sơn";
    if (t.includes("cẩm lệ")) return "Cẩm Lệ";
    if (t.includes("hòa vang")) return "Hòa Vang";
    if (t.includes("liên chiểu")) return "Liên Chiểu";
    if (t.includes("thanh khê")) return "Thanh Khê";
    return "Đà Nẵng";
  };

  const projectImages = [proj1, proj2, proj3, proj4, proj5, proj6];

  const mappedDbProjects = dbProjects.map((p, idx) => ({
    img: p.image_url || projectImages[idx % projectImages.length],
    name: p.name,
    developer: p.developer || "Chưa rõ CĐT",
    district: p.district || guessDistrict(p.location),
    category: (Array.isArray(p.categories) && p.categories.length > 0
      ? (p.categories[0].includes("Biệt thự") ? "Biệt thự"
        : p.categories[0].includes("Nghỉ dưỡng") ? "Nghỉ dưỡng"
        : p.categories[0].includes("đô thị") ? "Khu đô thị"
        : p.categories[0].includes("Văn phòng") ? "Văn phòng"
        : "Căn hộ")
      : guessCategory(p.name, p.description)) as Category,
    status: (p.status || "Đang mở bán") as Status,
    priceFrom: p.price_from || "Liên hệ",
    units: p.scale || "N/A",
    handover: p.handover || "N/A",
    slug: p.slug,
    location: p.location,
    description: p.description,
  }));

  const allProjects = mappedDbProjects.length > 0 ? mappedDbProjects : FALLBACK_PROJECTS;

  const filteredProjects = allProjects.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeStatus === "selling" && p.status !== "Đang mở bán") return false;
    if (activeStatus === "soon" && p.status !== "Sắp mở bán") return false;
    if (activeStatus === "done" && p.status !== "Đã bàn giao") return false;
    if (category && category !== "all") {
      const catMap: Record<string, string> = { apt: "Căn hộ", villa: "Biệt thự", urban: "Khu đô thị", resort: "Nghỉ dưỡng", office: "Văn phòng" };
      if (catMap[category] && p.category !== catMap[category]) return false;
    }
    if (district && district !== "all") {
      const distMap: Record<string, string> = { hc: "Hải Châu", st: "Sơn Trà", nhs: "Ngũ Hành Sơn", cl: "Cẩm Lệ", hv: "Hòa Vang" };
      if (distMap[district] && !p.district.includes(distMap[district])) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProjectsHero search={search} setSearch={setSearch} />
        <StatsBar />
        <StickyFilterBar
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          category={category}
          setCategory={setCategory}
          district={district}
          setDistrict={setDistrict}
          resultCount={filteredProjects.length}
        />
        <ProjectGrid
          projects={filteredProjects}
          loading={loading}
          onAddToComparison={addToComparison}
          isSelected={isSelected}
        />
        <CTASection />
      </main>

      <ComparisonBar
        selectedProperties={selectedProperties}
        onRemove={removeFromComparison}
        onCompareNow={() => setIsModalOpen(true)}
      />
      <ComparisonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedProperties={selectedProperties}
        onRemove={removeFromComparison}
      />
      <Footer />
    </div>
  );
}
