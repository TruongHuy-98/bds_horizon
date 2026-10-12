import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, ChevronLeft, ChevronRight, ImageIcon, Building2, Ruler, Tag } from "lucide-react";

type ProjectStatus = "Đang mở bán" | "Sắp mở bán" | "Đã bàn giao";

interface Project {
  id: string;
  name: string;
  slug: string;
  location: string;
  district: string;
  status: ProjectStatus;
  priceFrom: string;
  area: string;
  units: string;
  developer: string;
  img: string;
  imageCount: number;
  description: string;
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Sun Cosmo Residence",
    slug: "sun-cosmo-residence",
    location: "Nguyễn Tất Thành, Ngũ Hành Sơn",
    district: "Ngũ Hành Sơn, Đà Nẵng",
    status: "Đang mở bán",
    priceFrom: "55 tr/m²",
    area: "42 - 98m²",
    units: "1.250 căn",
    developer: "Sun Group",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80",
    imageCount: 14,
    description: "Tổ hợp căn hộ cao cấp mặt tiền sông Cổ Cò, view biển và núi Ngũ Hành Sơn.",
  },
  {
    id: "2",
    name: "The Filmore Da Nang",
    slug: "the-filmore-da-nang",
    location: "Mỹ An, Ngũ Hành Sơn",
    district: "Ngũ Hành Sơn, Đà Nẵng",
    status: "Đang mở bán",
    priceFrom: "4.9 tỷ/căn",
    area: "65 - 120m²",
    units: "840 căn",
    developer: "VinaCapital",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80",
    imageCount: 9,
    description: "Căn hộ hạng sang phong cách Mỹ, vị trí vàng sát biển Mỹ An, bàn giao full nội thất.",
  },
  {
    id: "3",
    name: "Da Nang Landmark Tower",
    slug: "da-nang-landmark-tower",
    location: "Bạch Đằng, Hải Châu",
    district: "Hải Châu, Đà Nẵng",
    status: "Sắp mở bán",
    priceFrom: "Đang cập nhật",
    area: "75 - 200m²",
    units: "600 căn",
    developer: "Đà Nẵng Landmark",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&auto=format&fit=crop&q=80",
    imageCount: 7,
    description: "Biểu tượng mới của trung tâm thành phố, tòa tháp 50 tầng view sông Hàn và biển.",
  },
  {
    id: "4",
    name: "Nam Hòa Xuân",
    slug: "nam-hoa-xuan",
    location: "Hòa Xuân, Cẩm Lệ",
    district: "Cẩm Lệ, Đà Nẵng",
    status: "Đang mở bán",
    priceFrom: "3.2 tỷ/căn",
    area: "80 - 150m²",
    units: "2.500 căn",
    developer: "VRG Đà Nẵng",
    img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=80",
    imageCount: 12,
    description: "Khu đô thị sinh thái ven sông Cẩm Lệ, mảng xanh chiếm 70% diện tích, hạ tầng hoàn chỉnh.",
  },
  {
    id: "5",
    name: "Newtown Diamond Legend",
    slug: "newtown-diamond-legend",
    location: "Phạm Văn Đồng, Sơn Trà",
    district: "Sơn Trà, Đà Nẵng",
    status: "Sắp mở bán",
    priceFrom: "Liên hệ",
    area: "50 - 90m²",
    units: "480 căn",
    developer: "Newtown Group",
    img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop&q=80",
    imageCount: 6,
    description: "Căn hộ view biển Mỹ Khê trực diện, chuẩn resort 5 sao, cách biển chỉ 300m.",
  },
  {
    id: "6",
    name: "Charm City Đà Nẵng",
    slug: "charm-city-da-nang",
    location: "Nguyễn Sinh Sắc, Liên Chiểu",
    district: "Liên Chiểu, Đà Nẵng",
    status: "Đang mở bán",
    priceFrom: "1.8 tỷ/căn",
    area: "55 - 100m²",
    units: "3.200 căn",
    developer: "Charm Group",
    img: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&auto=format&fit=crop&q=80",
    imageCount: 11,
    description: "Khu đô thị phức hợp quy mô lớn phía Bắc thành phố, liền kề Cảng Liên Chiểu tương lai.",
  },
];

const STATUS_STYLES: Record<ProjectStatus, { bg: string; text: string; dot: string }> = {
  "Đang mở bán": {
    bg: "bg-emerald-500/90",
    text: "text-white",
    dot: "bg-emerald-300",
  },
  "Sắp mở bán": {
    bg: "bg-orange-500/90",
    text: "text-white",
    dot: "bg-orange-300",
  },
  "Đã bàn giao": {
    bg: "bg-slate-500/90",
    text: "text-white",
    dot: "bg-slate-300",
  },
};

function ProjectCard({ project }: { project: Project }) {
  const statusStyle = STATUS_STYLES[project.status];

  return (
    <Link
      to="/du-an/$slug"
      params={{ slug: project.slug }}
      className="group block bg-card rounded-2xl overflow-hidden border border-border/60 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex-shrink-0"
      style={{ width: "320px" }}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={project.img}
          alt={project.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Status badge */}
        <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot} animate-pulse`} />
          {project.status}
        </div>
        {/* Image count badge */}
        <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 text-white text-xs backdrop-blur-sm">
          <ImageIcon className="h-3 w-3" />
          <span>{project.imageCount}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-foreground text-base leading-snug group-hover:text-primary transition-colors line-clamp-1">
          {project.name}
        </h3>
        <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0 text-primary" />
          <span className="line-clamp-1">{project.district}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Specs row */}
        <div className="mt-3 pt-3 border-t border-border flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Tag className="h-3 w-3 text-primary" />
            <span className="font-semibold text-primary">{project.priceFrom}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Ruler className="h-3 w-3" />
            {project.area}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Building2 className="h-3 w-3" />
            {project.units}
          </span>
        </div>

        <div className="mt-2 text-[11px] text-muted-foreground">
          CĐT: <span className="font-semibold text-foreground">{project.developer}</span>
        </div>
      </div>
    </Link>
  );
}

export function ProjectsSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const CARD_WIDTH = 336; // card width (320) + gap (16)

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -CARD_WIDTH * 2 : CARD_WIDTH * 2, behavior: "smooth" });
  };

  // Mouse drag scroll
  const onMouseDown = (e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!el) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, scrollLeft: el.scrollLeft };
    el.style.cursor = "grabbing";
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    e.preventDefault();
    const dx = e.clientX - dragStart.current.x;
    trackRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
  };
  const onMouseUp = () => {
    setIsDragging(false);
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  };

  return (
    <section className="py-16 md:py-20">
      <div className="container-page">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-3">
              <Building2 className="h-3.5 w-3.5" />
              Dự án mới nhất
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Dự án bất động sản nổi bật
            </h2>
            <p className="mt-2 text-muted-foreground text-sm md:text-base">
              Những dự án tiềm năng và đang mở bán tại Đà Nẵng.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Desktop arrow buttons */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Trước"
                className={`h-9 w-9 rounded-full border flex items-center justify-center transition-all ${
                  canScrollLeft
                    ? "border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-card"
                    : "border-border/40 bg-muted/40 text-muted-foreground/40 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Tiếp theo"
                className={`h-9 w-9 rounded-full border flex items-center justify-center transition-all ${
                  canScrollRight
                    ? "border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-card"
                    : "border-border/40 bg-muted/40 text-muted-foreground/40 cursor-not-allowed"
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <Link
              to="/du-an"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all whitespace-nowrap"
            >
              Xem thêm
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Slider track */}
        <div className="relative">
          {/* Left fade */}
          {canScrollLeft && (
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
          )}
          {/* Right fade */}
          {canScrollRight && (
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />
          )}

          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto pb-3 select-none"
            style={{ cursor: "grab", scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {mockProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Mobile arrow buttons */}
        <div className="flex items-center justify-center gap-3 mt-4 md:hidden">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Trước"
            className={`h-9 w-9 rounded-full border flex items-center justify-center transition-all ${
              canScrollLeft
                ? "border-border bg-card hover:bg-primary hover:text-primary-foreground"
                : "border-border/40 bg-muted/40 text-muted-foreground/40 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Tiếp theo"
            className={`h-9 w-9 rounded-full border flex items-center justify-center transition-all ${
              canScrollRight
                ? "border-border bg-card hover:bg-primary hover:text-primary-foreground"
                : "border-border/40 bg-muted/40 text-muted-foreground/40 cursor-not-allowed"
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
