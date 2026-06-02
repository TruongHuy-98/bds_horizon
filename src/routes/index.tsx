import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  MapPin,
  Map as MapIcon,
  RefreshCw,
  ArrowRight,
  Bed,
  Bath,
  Square,
  Star,
  ShieldCheck,
  Phone,
  Mail,
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

import heroImg from "@/assets/hero-danang.jpg";
import planMap from "@/assets/planning-map.jpg";
import p1 from "@/assets/property-1.jpg";
import p2 from "@/assets/property-2.jpg";
import p3 from "@/assets/property-3.jpg";
import p4 from "@/assets/property-4.jpg";
import a1 from "@/assets/agent-1.jpg";
import a2 from "@/assets/agent-2.jpg";
import a3 from "@/assets/agent-3.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Da Nang Real Estate — Tìm tổ ấm mơ ước tại Đà Nẵng" },
      {
        name: "description",
        content:
          "Nền tảng bất động sản Đà Nẵng minh bạch: mua bán, cho thuê, tra cứu quy hoạch 2030 và kết nối nhà môi giới uy tín.",
      },
    ],
  }),
});

const properties = [
  {
    img: p1,
    tag: "Hot Deal",
    tagTone: "orange" as const,
    extra: "Sổ đỏ chính chủ",
    title: "Biệt thự ven biển Mỹ Khê",
    loc: "Sơn Trà, Đà Nẵng",
    price: "12 tỷ",
    area: "250m²",
    beds: 4,
    baths: 3,
  },
  {
    img: p2,
    tag: "View Sông",
    tagTone: "teal" as const,
    title: "Căn hộ cao cấp Azura",
    loc: "Hải Châu, Đà Nẵng",
    price: "3.5 tỷ",
    area: "85m²",
    beds: 2,
    baths: 2,
  },
  {
    img: p3,
    tag: "Giảm giá sâu",
    tagTone: "orange" as const,
    title: "Nhà phố liền kề Hòa Xuân",
    loc: "Cẩm Lệ, Đà Nẵng",
    price: "5.2 tỷ",
    area: "100m²",
    beds: 3,
    baths: 3,
  },
  {
    img: p4,
    tag: "Sổ hồng",
    tagTone: "teal" as const,
    title: "Đất nền ven biển Mỹ An",
    loc: "Ngũ Hành Sơn, Đà Nẵng",
    price: "8.8 tỷ",
    area: "120m²",
    beds: 0,
    baths: 0,
  },
];

const agents = [
  {
    img: a1,
    name: "Nguyễn Văn Nam",
    role: "Chuyên căn hộ cao cấp",
    listings: 45,
    years: 8,
    rating: 5,
  },
  {
    img: a2,
    name: "Lê Thị Mai Anh",
    role: "Chuyên đất nền Hòa Xuân",
    listings: 32,
    years: 5,
    rating: 5,
  },
  {
    img: a3,
    name: "Trần Hoàng Long",
    role: "Chuyên nhà phố trung tâm",
    listings: 68,
    years: 12,
    rating: 5,
  },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
        <path d="M16 4L28 26H4L16 4Z" fill="var(--primary)" />
        <path d="M16 12L24 26H8L16 12Z" fill="var(--teal)" opacity="0.85" />
      </svg>
      <div className="leading-tight">
        <div className="text-sm font-bold tracking-tight text-primary">DA NANG</div>
        <div className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground">
          REAL ESTATE
        </div>
      </div>
    </Link>
  );
}

function Hero() {
  return (
    <section className="relative h-[520px] md:h-[560px] w-full overflow-hidden">
      <img
        src={heroImg}
        alt="Đà Nẵng skyline lúc hoàng hôn"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/40 to-primary/60" />
      <div className="relative container-page h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-md max-w-3xl">
          Tìm kiếm tổ ấm mơ ước tại Đà Nẵng
        </h1>
        <p className="mt-4 text-white/85 text-base md:text-lg max-w-xl">
          Hơn 8.500 bất động sản đã thẩm định, minh bạch pháp lý và quy hoạch.
        </p>
        <div className="mt-8 w-full max-w-5xl glass rounded-xl shadow-card p-4 md:p-5 border border-white/40">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bất động sản..."
                className="pl-9 h-11 bg-white border-border rounded-md"
              />
            </div>
            <Select>
              <SelectTrigger className="h-11 bg-white rounded-md">
                <SelectValue placeholder="Loại nhà đất" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apt">Căn hộ</SelectItem>
                <SelectItem value="villa">Biệt thự</SelectItem>
                <SelectItem value="land">Đất nền</SelectItem>
                <SelectItem value="town">Nhà phố</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="h-11 bg-white rounded-md">
                <SelectValue placeholder="Quận / Huyện" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hai-chau">Hải Châu</SelectItem>
                <SelectItem value="son-tra">Sơn Trà</SelectItem>
                <SelectItem value="ngu-hanh-son">Ngũ Hành Sơn</SelectItem>
                <SelectItem value="cam-le">Cẩm Lệ</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="h-11 bg-white rounded-md">
                <SelectValue placeholder="Khoảng giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Dưới 2 tỷ</SelectItem>
                <SelectItem value="2">2 - 5 tỷ</SelectItem>
                <SelectItem value="3">5 - 10 tỷ</SelectItem>
                <SelectItem value="4">Trên 10 tỷ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-3 flex justify-center">
            <Button className="bg-teal text-teal-foreground hover:bg-teal/90 h-11 px-10 rounded-md font-medium">
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlanningCheck() {
  return (
    <section className="bg-surface-container/60 py-16 md:py-20">
      <div className="container-page grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            Thông tin minh bạch
          </span>
          <h2 className="mt-4 text-2xl md:text-3xl font-bold text-foreground">
            Kiểm tra Quy hoạch Đà Nẵng 2030
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Hệ thống tra cứu thông tin quy hoạch sử dụng đất hiện đại nhất. Chúng tôi cung cấp dữ
            liệu chính xác về các phân khu chức năng, hạ tầng giao thông và các dự án trọng điểm tại
            Đà Nẵng đến năm 2030. Giúp nhà đầu tư đưa ra quyết định an toàn và hiệu quả.
          </p>
          <ul className="mt-6 space-y-4">
            <li className="flex gap-3">
              <MapIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">Bản đồ phân khu chi tiết</div>
                <div className="text-sm text-muted-foreground">
                  Xem chi tiết từng lô đất và mục đích sử dụng.
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <RefreshCw className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">Cập nhật thời gian thực</div>
                <div className="text-sm text-muted-foreground">
                  Dữ liệu được đồng bộ liên tục từ cơ sở quy hoạch.
                </div>
              </div>
            </li>
          </ul>
          <Button
            asChild
            className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-11 px-6 group"
          >
            <Link to="/check-quy-hoach">
              Check Quy Hoạch Ngay
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-br from-primary/10 to-teal/10 rounded-3xl blur-2xl" />
          <img
            src={planMap}
            alt="Bản đồ quy hoạch Đà Nẵng 2030"
            width={1280}
            height={960}
            loading="lazy"
            className="relative rounded-2xl shadow-card-hover w-full"
          />
        </div>
      </div>
    </section>
  );
}

function Tag({ tone, children }: { tone: "orange" | "teal"; children: React.ReactNode }) {
  const cls =
    tone === "orange" ? "bg-orange text-orange-foreground" : "bg-teal text-teal-foreground";
  return (
    <span className={`${cls} text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm`}>
      {children}
    </span>
  );
}

function FeaturedProperties() {
  return (
    <section className="py-16 md:py-20">
      <div className="container-page">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Bất động sản nổi bật tại Đà Nẵng</h2>
            <p className="mt-2 text-muted-foreground">
              Các sản phẩm đã qua kiểm định pháp lý nghiêm ngặt.
            </p>
          </div>
          <a
            href="#"
            className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
          >
            Xem tất cả <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((p) => (
            <article
              key={p.title}
              className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border/60"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Tag tone={p.tagTone}>{p.tag}</Tag>
                  {p.extra && (
                    <span className="bg-white/95 text-foreground text-[11px] font-semibold px-2.5 py-1 rounded-full">
                      {p.extra}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-base leading-snug line-clamp-1">{p.title}</h3>
                <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {p.loc}
                </div>
                <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
                  <div className="text-primary font-bold text-lg">{p.price}</div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {p.beds > 0 && (
                      <span className="flex items-center gap-1">
                        <Bed className="h-3.5 w-3.5" />
                        {p.beds}
                      </span>
                    )}
                    {p.baths > 0 && (
                      <span className="flex items-center gap-1">
                        <Bath className="h-3.5 w-3.5" />
                        {p.baths}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Square className="h-3.5 w-3.5" />
                      {p.area}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TopAgents() {
  return (
    <section className="bg-surface-container/60 py-16 md:py-20">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold">Nhà môi giới hàng đầu</h2>
          <p className="mt-2 text-muted-foreground">
            Kết nối với những chuyên gia bất động sản có tâm và có tầm tại khu vực Đà Nẵng.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {agents.map((a) => {
            const slug = a.name
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/đ/g, "d")
              .replace(/\s+/g, "-");
            return (
              <Link
                key={a.name}
                to="/moi-gioi/$slug"
                params={{ slug }}
                className="bg-card rounded-xl p-5 shadow-card border border-border/60 flex items-center gap-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
              >
                <div className="relative shrink-0">
                  <img
                    src={a.img}
                    alt={a.name}
                    width={72}
                    height={72}
                    loading="lazy"
                    className="h-18 w-18 size-[72px] rounded-full object-cover ring-2 ring-white"
                  />
                  <span className="absolute bottom-0 right-0 h-4 w-4 bg-teal border-2 border-white rounded-full" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.role}</div>
                  <div className="mt-1 flex items-center gap-0.5 text-orange">
                    {Array.from({ length: a.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    {a.listings} tin đăng • {a.years} năm kinh nghiệm
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container-page py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
            Nền tảng kết nối giao dịch bất động sản chuyên nghiệp nhất tại Đà Nẵng. Chúng tôi cam
            kết mang lại giá trị thực và thông tin minh bạch nhất cho cộng đồng.
          </p>
          <div className="mt-5 flex flex-col gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span>0236 888 9999</span>
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span>hello@danang-realestate.vn</span>
            </span>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm">Dịch vụ</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <a href="#" className="hover:text-primary">
                Mua bán
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Cho thuê
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Check Quy Hoạch
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Hướng dẫn đăng tin
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm">Công ty</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <a href="#" className="hover:text-primary">
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Liên hệ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Điều khoản sử dụng
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Chính sách bảo mật
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-5 text-xs text-muted-foreground">
          © 2026 Da Nang Real Estate. All rights reserved. Coastal living, professional service.
        </div>
      </div>
    </footer>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <PlanningCheck />
        <FeaturedProperties />
        <TopAgents />
      </main>
      <Footer />
    </div>
  );
}
