import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  MapPin,
  Building2,
  CalendarDays,
  Layers,
  ArrowRight,
  TrendingUp,
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

import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";
import p5 from "@/assets/project-5.jpg";
import p6 from "@/assets/project-6.jpg";

export const Route = createFileRoute("/du-an")({
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

function ProjectsHero() {
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
              placeholder="Tìm dự án theo tên..."
              className="pl-9 h-11 bg-white border-border rounded-md"
            />
          </div>
          <Select>
            <SelectTrigger className="h-11 bg-white rounded-md">
              <SelectValue placeholder="Loại dự án" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apt">Căn hộ</SelectItem>
              <SelectItem value="villa">Biệt thự</SelectItem>
              <SelectItem value="urban">Khu đô thị</SelectItem>
              <SelectItem value="resort">Nghỉ dưỡng</SelectItem>
              <SelectItem value="office">Văn phòng</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="h-11 bg-white rounded-md">
              <SelectValue placeholder="Quận / Huyện" />
            </SelectTrigger>
            <SelectContent>
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

function ProjectGrid() {
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

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p) => (
            <article
              key={p.name}
              className="group bg-card rounded-xl overflow-hidden border border-border/60 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
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
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm ${statusTone[p.status]}`}
                  >
                    {p.status}
                  </span>
                  <span className="bg-white/95 text-foreground text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    {p.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs text-muted-foreground">{p.developer}</div>
                <h3 className="mt-1 font-semibold text-lg leading-snug line-clamp-1">{p.name}</h3>
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

                <Button
                  asChild
                  variant="outline"
                  className="mt-5 w-full h-10 rounded-md border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground group/btn"
                >
                  <Link
                    to="/du-an/$slug"
                    params={{ slug: p.name.toLowerCase().replace(/\s+/g, "-") }}
                  >
                    Xem chi tiết
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
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
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProjectsHero />
        <ProjectGrid />
        <CTASection />
      </main>
    </div>
  );
}
