import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
import {
  ComparisonBar,
  ComparisonModal,
  usePropertyComparison,
  type PropertyToCompare,
} from "@/components/site/PropertyComparison";

import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";
import p5 from "@/assets/project-5.jpg";
import p6 from "@/assets/project-6.jpg";

export const Route = createFileRoute("/du-an/")({
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
});

type Status = "Đang mở bán" | "Sắp mở bán" | "Đã bàn giao";
type Category = "Căn hộ" | "Biệt thự" | "Khu đô thị" | "Nghỉ dưỡng" | "Văn phòng";

const projects: {
  img: string;
  name: string;
  developer: string;
  district: string;
  category: Category;
  status: Status;
  priceFrom: string;
  units: string;
  handover: string;
}[] = [
  {
    img: p1,
    name: "Sun Cosmo Residence",
    developer: "Sun Group",
    district: "Ngũ Hành Sơn",
    category: "Căn hộ",
    status: "Đang mở bán",
    priceFrom: "55 tr/m²",
    units: "1.250 căn",
    handover: "Q4/2026",
  },
  {
    img: p2,
    name: "The Ocean Villas Mỹ Khê",
    developer: "VinaCapital",
    district: "Sơn Trà",
    category: "Nghỉ dưỡng",
    status: "Đang mở bán",
    priceFrom: "28 tỷ/căn",
    units: "120 biệt thự",
    handover: "Q2/2027",
  },
  {
    img: p3,
    name: "Hòa Xuân Riverside City",
    developer: "Đất Xanh Miền Trung",
    district: "Cẩm Lệ",
    category: "Khu đô thị",
    status: "Đã bàn giao",
    priceFrom: "42 tr/m²",
    units: "3.400 sản phẩm",
    handover: "Q3/2024",
  },
  {
    img: p4,
    name: "Azura Riverfront Tower",
    developer: "CapitaLand",
    district: "Hải Châu",
    category: "Căn hộ",
    status: "Đang mở bán",
    priceFrom: "62 tr/m²",
    units: "680 căn",
    handover: "Q1/2027",
  },
  {
    img: p5,
    name: "Eco Green Hòa Vang",
    developer: "Ecopark",
    district: "Hòa Vang",
    category: "Biệt thự",
    status: "Sắp mở bán",
    priceFrom: "6.5 tỷ/căn",
    units: "450 biệt thự",
    handover: "Q4/2027",
  },
  {
    img: p6,
    name: "Da Nang Smart Plaza",
    developer: "FPT City",
    district: "Ngũ Hành Sơn",
    category: "Văn phòng",
    status: "Sắp mở bán",
    priceFrom: "Liên hệ",
    units: "85.000 m² sàn",
    handover: "Q2/2028",
  },
];

const statusTone: Record<Status, string> = {
  "Đang mở bán": "bg-teal text-teal-foreground",
  "Sắp mở bán": "bg-orange text-orange-foreground",
  "Đã bàn giao": "bg-muted text-foreground/70",
};

interface ProjectsHeroProps {
  search: string;
  setSearch: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  district: string;
  setDistrict: (v: string) => void;
}

function ProjectsHero({
  search,
  setSearch,
  category,
  setCategory,
  district,
  setDistrict,
}: ProjectsHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-teal text-white">
      <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
      <div className="container-page relative py-16 md:py-20">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold">
          <Building2 className="h-3.5 w-3.5" /> Dự án Bất động sản
        </span>
        <h1 className="mt-4 text-3xl md:text-5xl font-bold max-w-3xl">
          Các dự án nổi bật tại Đà Nẵng
        </h1>
        <p className="mt-3 text-white/85 max-w-2xl">
          Cập nhật tiến độ, mặt bằng và chính sách bán hàng mới nhất từ các chủ đầu tư uy tín. Tất
          cả dự án đều được thẩm định pháp lý.
        </p>

        <div className="mt-8 glass rounded-xl p-4 md:p-5 grid grid-cols-1 md:grid-cols-5 gap-3 border border-white/30 shadow-card">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm dự án theo tên..."
              className="pl-9 h-11 bg-white text-slate-800 border-border rounded-md placeholder:text-muted-foreground/60"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-11 bg-white text-slate-800 rounded-md border-border">
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
            <SelectTrigger className="h-11 bg-white text-slate-800 rounded-md border-border">
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
          <Button className="h-11 bg-orange text-orange-foreground hover:bg-orange/90 rounded-md font-medium">
            Lọc dự án
          </Button>
        </div>
      </div>
    </section>
  );
}

const filters: { key: string; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "selling", label: "Đang mở bán" },
  { key: "soon", label: "Sắp mở bán" },
  { key: "done", label: "Đã bàn giao" },
];

const mapProjectToCompare = (p: any): PropertyToCompare => {
  // Realistic mock pricing, area, rooms, and address for each development project
  const detailsMap: Record<string, { price: number; area: number; beds: number; baths: number; address: string }> = {
    "Sun Cosmo Residence": { price: 5.2, area: 95, beds: 2, baths: 2, address: "Trần Hưng Đạo, Ngũ Hành Sơn, Đà Nẵng" },
    "The Ocean Villas Mỹ Khê": { price: 28.0, area: 320, beds: 4, baths: 4, address: "Võ Nguyên Giáp, Sơn Trà, Đà Nẵng" },
    "Hòa Xuân Riverside City": { price: 4.5, area: 100, beds: 3, baths: 2, address: "Nguyễn Phước Lan, Cẩm Lệ, Đà Nẵng" },
    "Azura Riverfront Tower": { price: 6.8, area: 110, beds: 2, baths: 2, address: "Trần Hưng Đạo, Hải Châu, Đà Nẵng" },
    "Eco Green Hòa Vang": { price: 6.5, area: 180, beds: 3, baths: 3, address: "Quốc lộ 14B, Hòa Vang, Đà Nẵng" },
    "Da Nang Smart Plaza": { price: 8.2, area: 150, beds: 3, baths: 2, address: "FPT City, Ngũ Hành Sơn, Đà Nẵng" },
  };

  const details = detailsMap[p.name] || { 
    price: parseFloat(p.priceFrom) || 5.0, 
    area: 90, 
    beds: 2, 
    baths: 2, 
    address: p.location || `${p.district}, Đà Nẵng` 
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

interface ProjectGridProps {
  projects: any[];
  loading: boolean;
  onAddToComparison: (property: PropertyToCompare) => void;
  isSelected: (id: string) => boolean;
}

function ProjectGrid({ projects, loading, onAddToComparison, isSelected }: ProjectGridProps) {
  const [active, setActive] = useState("all");

  const list = projects.filter((p) => {
    if (active === "selling") return p.status === "Đang mở bán";
    if (active === "soon") return p.status === "Sắp mở bán";
    if (active === "done") return p.status === "Đã bàn giao";
    return true;
  });

  return (
    <section className="py-14 md:py-16">
      <div className="container-page">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Danh sách dự án</h2>
            <p className="mt-1.5 text-muted-foreground text-sm">
              {list.length} dự án phù hợp với bộ lọc của bạn.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={`px-4 h-9 rounded-full text-sm font-medium border transition-colors ${
                  active === f.key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground/80 border-border hover:border-primary/40"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-muted-foreground">
            <div className="animate-spin size-8 border-t-2 border-b-2 border-primary rounded-full mx-auto mb-3"></div>
            Đang tải danh sách dự án...
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((p, idx) => {
              const propertyToCompare = mapProjectToCompare(p);
              const isCompared = isSelected(propertyToCompare.id);

              return (
                <article
                  key={idx}
                  className="group bg-card rounded-xl overflow-hidden border border-border/60 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                >
                  <Link
                    to="/du-an/$slug"
                    params={{ slug: p.slug || p.name.toLowerCase().replace(/\s+/g, "-") }}
                    className="relative aspect-[16/10] overflow-hidden block"
                  >
                    <img
                      src={p.img}
                      alt={p.name}
                      width={1024}
                      height={640}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm ${statusTone[p.status as Status] || "bg-teal text-teal-foreground"}`}
                      >
                        {p.status}
                      </span>
                      <span className="bg-white/95 text-foreground text-[11px] font-semibold px-2.5 py-1 rounded-full">
                        {p.category}
                      </span>
                    </div>
                  </Link>
                  <div className="p-5">
                    <div className="text-xs text-muted-foreground">{p.developer}</div>
                    <Link
                      to="/du-an/$slug"
                      params={{ slug: p.slug || p.name.toLowerCase().replace(/\s+/g, "-") }}
                      className="block hover:text-primary transition-colors"
                    >
                      <h3 className="mt-1 font-semibold text-lg leading-snug line-clamp-1">{p.name}</h3>
                    </Link>
                    <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {p.district}, Đà Nẵng
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                      <div className="rounded-md bg-surface-container/60 p-2">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" /> Giá từ
                        </div>
                        <div className="mt-0.5 font-semibold text-primary">{p.priceFrom}</div>
                      </div>
                      <div className="rounded-md bg-surface-container/60 p-2">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                          <Layers className="h-3 w-3" /> Quy mô
                        </div>
                        <div className="mt-0.5 font-semibold">{p.units}</div>
                      </div>
                      <div className="rounded-md bg-surface-container/60 p-2">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" /> Bàn giao
                        </div>
                        <div className="mt-0.5 font-semibold">{p.handover}</div>
                      </div>
                    </div>

                    <div className="flex gap-2.5 mt-5">
                      <Button
                        variant="outline"
                        onClick={() => onAddToComparison(propertyToCompare)}
                        className={`flex-1 h-10 rounded-md border-border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                          isCompared
                            ? "bg-primary text-primary-foreground border-primary hover:bg-primary/95"
                            : "hover:bg-muted"
                        }`}
                      >
                        <Scale className="h-3.5 w-3.5" />
                        {isCompared ? "Đã thêm" : "So sánh"}
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="flex-1 h-10 rounded-md border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground group/btn text-xs font-semibold"
                      >
                        <Link
                          to="/du-an/$slug"
                          params={{ slug: p.slug || p.name.toLowerCase().replace(/\s+/g, "-") }}
                        >
                          Xem chi tiết
                          <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="pb-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-teal p-8 md:p-12 text-white">
          <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative md:flex items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">Bạn là chủ đầu tư?</h3>
              <p className="mt-2 text-white/85 max-w-xl">
                Đăng dự án lên Da Nang Real Estate để tiếp cận hơn 200.000 khách hàng tiềm năng mỗi
                tháng tại khu vực miền Trung.
              </p>
            </div>
            <Button className="mt-5 md:mt-0 h-12 px-6 bg-orange text-orange-foreground hover:bg-orange/90 rounded-md font-semibold">
              Đăng dự án ngay
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function DuAnPage() {
  const {
    selectedProperties,
    addToComparison,
    removeFromComparison,
    isSelected,
  } = usePropertyComparison();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [district, setDistrict] = useState("all");

  // Projects state
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isMock = typeof window !== "undefined"
    ? !!localStorage.getItem("bds_mock_role") || !import.meta.env.VITE_SUPABASE_URL
    : true;

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      let list: any[] = [];
      if (isMock) {
        const localData = localStorage.getItem("mock_projects");
        list = localData ? JSON.parse(localData) : [];
      } else {
        try {
          const { data, error } = await supabase
            .from("projects")
            .select("*")
            .eq("published", true)
            .order("created_at", { ascending: false });
          if (error) throw error;
          list = data || [];
        } catch (err) {
          console.warn("Failed to fetch projects from Supabase, falling back to mock:", err);
          const localData = localStorage.getItem("mock_projects");
          list = localData ? JSON.parse(localData) : [];
        }
      }
      setDbProjects(list);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  // Helper functions to guess category and district for database projects
  const guessCategory = (name: string, description: string): Category => {
    const text = `${name} ${description || ""}`.toLowerCase();
    if (text.includes("villa") || text.includes("biệt thự")) return "Biệt thự";
    if (text.includes("resort") || text.includes("nghỉ dưỡng")) return "Nghỉ dưỡng";
    if (text.includes("đô thị") || text.includes("plaz") || text.includes("khu đô")) return "Khu đô thị";
    if (text.includes("văn phòng") || text.includes("office") || text.includes("tòa nhà")) return "Văn phòng";
    return "Căn hộ";
  };

  const guessDistrict = (location: string): string => {
    const text = (location || "").toLowerCase();
    if (text.includes("hải châu")) return "Hải Châu";
    if (text.includes("sơn trà")) return "Sơn Trà";
    if (text.includes("ngũ hành sơn")) return "Ngũ Hành Sơn";
    if (text.includes("cẩm lệ")) return "Cẩm Lệ";
    if (text.includes("hòa vang")) return "Hòa Vang";
    if (text.includes("liên chiểu")) return "Liên Chiểu";
    if (text.includes("thanh khê")) return "Thanh Khê";
    return "Đà Nẵng";
  };

  // Map database projects to component project format
  const mappedDbProjects = dbProjects.map((p) => ({
    img: p.image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60",
    name: p.name,
    developer: p.developer || "Chưa rõ CĐT",
    district: guessDistrict(p.location),
    category: guessCategory(p.name, p.description),
    status: (p.status || "Đang mở bán") as Status,
    priceFrom: p.price_from || "Liên hệ",
    units: p.scale || "N/A",
    handover: "N/A",
    slug: p.slug,
    location: p.location,
  }));

  const allProjects = [...mappedDbProjects, ...projects];

  // Filter projects based on search inputs
  const filteredProjects = allProjects.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (category && category !== "all") {
      const catMap: Record<string, string> = {
        apt: "Căn hộ",
        villa: "Biệt thự",
        urban: "Khu đô thị",
        resort: "Nghỉ dưỡng",
        office: "Văn phòng",
      };
      const requiredCat = catMap[category];
      if (requiredCat && p.category !== requiredCat) {
        return false;
      }
    }
    if (district && district !== "all") {
      const distMap: Record<string, string> = {
        hc: "Hải Châu",
        st: "Sơn Trà",
        nhs: "Ngũ Hành Sơn",
        cl: "Cẩm Lệ",
        hv: "Hòa Vang",
      };
      const requiredDist = distMap[district];
      if (requiredDist && !p.district.includes(requiredDist)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProjectsHero
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          district={district}
          setDistrict={setDistrict}
        />
        <ProjectGrid
          projects={filteredProjects}
          loading={loading}
          onAddToComparison={addToComparison}
          isSelected={isSelected}
        />
        <CTASection />
      </main>

      {/* Floating Bottom Comparison Bar widget */}
      <ComparisonBar
        selectedProperties={selectedProperties}
        onRemove={removeFromComparison}
        onCompareNow={() => setIsModalOpen(true)}
      />

      {/* Fullscreen detailed comparison modal matrix */}
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
