import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, ChevronLeft, ChevronRight, ImageIcon, Building2, Ruler, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type ProjectStatus = "Đang mở bán" | "Sắp mở bán" | "Đã bàn giao" | "Đang bàn giao";

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

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  "Đang mở bán": {
    bg: "bg-teal/95 shadow-sm",
    text: "text-teal-foreground",
    dot: "bg-teal-foreground",
  },
  "Sắp mở bán": {
    bg: "bg-orange/95 shadow-sm",
    text: "text-orange-foreground",
    dot: "bg-orange-foreground",
  },
  "Đã bàn giao": {
    bg: "bg-muted/95 border border-border/80 backdrop-blur-sm",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground/60",
  },
  "Đang bàn giao": {
    bg: "bg-muted/95 border border-border/80 backdrop-blur-sm",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground/60",
  },
};

const DEFAULT_STATUS_STYLE = STATUS_STYLES["Đang mở bán"];

function ProjectCard({ project }: { project: Project }) {
  const statusStyle = STATUS_STYLES[project.status] || DEFAULT_STATUS_STYLE;

  return (
    <Link
      to="/du-an/$slug"
      params={{ slug: project.slug || "du-an" }}
      className="group block bg-card rounded-2xl overflow-hidden border border-border/60 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 w-80 shrink-0"
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

function mapDbProject(p: any): Project {
  const guessDistrict = (loc: string) => {
    const text = (loc || "").toLowerCase();
    if (text.includes("hải châu")) return "Hải Châu, Đà Nẵng";
    if (text.includes("sơn trà")) return "Sơn Trà, Đà Nẵng";
    if (text.includes("ngũ hành sơn")) return "Ngũ Hành Sơn, Đà Nẵng";
    if (text.includes("cẩm lệ")) return "Cẩm Lệ, Đà Nẵng";
    if (text.includes("liên chiểu")) return "Liên Chiểu, Đà Nẵng";
    if (text.includes("thanh khê")) return "Thanh Khê, Đà Nẵng";
    if (text.includes("hòa vang")) return "Hòa Vang, Đà Nẵng";
    return loc || "Đà Nẵng";
  };

  const images = Array.isArray(p.images) ? p.images : [];
  const img =
    p.image_url ||
    images[0] ||
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80";
  const imageCount = Math.max(
    1,
    (p.image_url ? 1 : 0) + (images.length > 0 && images[0] === p.image_url ? images.length - 1 : images.length)
  );

  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug || p.name.toLowerCase().replace(/\s+/g, "-"),
    location: p.location || "Đà Nẵng",
    district: p.district || guessDistrict(p.location),
    status: (p.status as ProjectStatus) || "Đang mở bán",
    priceFrom: p.price_from || p.priceFrom || "Liên hệ",
    area: p.area || "Đang cập nhật",
    units: p.scale || p.units || "N/A",
    developer: p.developer || "Chưa rõ CĐT",
    img,
    imageCount,
    description: p.description || "",
  };
}

export function ProjectsSlider() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const CARD_WIDTH = 336; // card width (320) + gap (16)

  // Fetch dynamic projects from Supabase or LocalStorage
  useEffect(() => {
    let isMounted = true;
    const fetchProjects = async () => {
      setLoading(true);
      const isMock =
        typeof window !== "undefined"
          ? localStorage.getItem("bds_mock_admin") === "true" ||
            !!localStorage.getItem("bds_mock_role") ||
            !import.meta.env.VITE_SUPABASE_URL
          : true;

      if (isMock) {
        try {
          const localData = localStorage.getItem("mock_projects");
          if (localData) {
            const list = JSON.parse(localData);
            if (Array.isArray(list) && list.length > 0) {
              if (isMounted) setProjects(list.map(mapDbProject));
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn("Error reading mock_projects:", e);
        }
        if (isMounted) setProjects([]);
      } else {
        try {
          const { data, error } = await supabase
            .from("projects")
            .select("*")
            .eq("published", true)
            .order("created_at", { ascending: false });

          if (error) throw error;
          if (isMounted) {
            if (data && data.length > 0) {
              setProjects(data.map(mapDbProject));
            } else {
              setProjects([]);
            }
          }
        } catch (err) {
          console.warn("Failed to fetch projects from Supabase:", err);
          if (isMounted) setProjects([]);
        }
      }
      if (isMounted) setLoading(false);
    };

    fetchProjects();
    return () => {
      isMounted = false;
    };
  }, []);

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

  if (projects.length === 0) {
    return null;
  }

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
            {projects.map((project) => (
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
