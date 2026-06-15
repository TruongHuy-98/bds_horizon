import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  BadgeCheck,
  Star,
  Phone,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MapPin,
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

import b1 from "@/assets/broker-1.jpg";
import b2 from "@/assets/broker-2.jpg";
import b3 from "@/assets/broker-3.jpg";
import b4 from "@/assets/broker-4.jpg";

export const Route = createFileRoute("/moi-gioi/")({
  component: BrokersPage,
  head: () => ({
    meta: [
      { title: "Danh bạ Môi giới Bất động sản Đà Nẵng" },
      {
        name: "description",
        content:
          "Kết nối với hơn 500 chuyên gia môi giới bất động sản Đà Nẵng đã được xác minh — chuyên sâu khu vực ven biển và đô thị.",
      },
      { property: "og:title", content: "Danh bạ Môi giới Đà Nẵng" },
      {
        property: "og:description",
        content:
          "Tìm chuyên gia môi giới bất động sản uy tín tại Đà Nẵng theo khu vực và chuyên môn.",
      },
    ],
  }),
});

type Broker = {
  img: string;
  name: string;
  years: number;
  specialties: string[];
  district: string;
  rating: number;
  reviews: number;
};

const brokers: Broker[] = [
  {
    img: b1,
    name: "Nguyễn Văn Nam",
    years: 5,
    specialties: ["Chuyên căn hộ cao cấp", "Hải Châu"],
    district: "Hải Châu",
    rating: 4.9,
    reviews: 128,
  },
  {
    img: b2,
    name: "Trần Thị Minh",
    years: 8,
    specialties: ["Biệt thự biển", "Sơn Trà"],
    district: "Sơn Trà",
    rating: 5.0,
    reviews: 245,
  },
  {
    img: b3,
    name: "Lê Hoàng Long",
    years: 3,
    specialties: ["Đất nền dự án", "Ngũ Hành Sơn"],
    district: "Ngũ Hành Sơn",
    rating: 4.7,
    reviews: 89,
  },
  {
    img: b4,
    name: "Phạm Ngọc Lan",
    years: 12,
    specialties: ["Đầu tư quy mô lớn", "Toàn thành phố"],
    district: "Toàn thành phố",
    rating: 5.0,
    reviews: 512,
  },
];

function BrokersHero() {
  return (
    <section className="bg-gradient-to-br from-surface-container/40 to-background pt-16 pb-12">
      <div className="container-page text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-primary tracking-tight">
          Tìm chuyên gia của bạn tại Đà Nẵng
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Kết nối với hơn 500+ môi giới bất động sản được xác minh, chuyên sâu về khu vực ven biển
          và đô thị Đà Nẵng.
        </p>

        <div className="mt-10 bg-card rounded-xl shadow-card border border-border/60 p-3 grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên hoặc khu vực..."
              className="pl-9 h-11 bg-background border-border/60 rounded-md"
            />
          </div>
          <div className="md:col-span-2">
            <Select>
              <SelectTrigger className="h-11 rounded-md">
                <SelectValue placeholder="Chuyên môn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apt">Căn hộ cao cấp</SelectItem>
                <SelectItem value="villa">Biệt thự biển</SelectItem>
                <SelectItem value="land">Đất nền</SelectItem>
                <SelectItem value="invest">Đầu tư</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Select>
              <SelectTrigger className="h-11 rounded-md">
                <SelectValue placeholder="Quận / Huyện" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hc">Hải Châu</SelectItem>
                <SelectItem value="st">Sơn Trà</SelectItem>
                <SelectItem value="nhs">Ngũ Hành Sơn</SelectItem>
                <SelectItem value="cl">Cẩm Lệ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Select>
              <SelectTrigger className="h-11 rounded-md">
                <SelectValue placeholder="Đánh giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 sao</SelectItem>
                <SelectItem value="4">Từ 4 sao</SelectItem>
                <SelectItem value="3">Từ 3 sao</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="md:col-span-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium">
            <SlidersHorizontal className="h-4 w-4 mr-1.5" />
            Lọc
          </Button>
        </div>
      </div>
    </section>
  );
}

function BrokerCard({ b }: { b: Broker }) {
  return (
    <article className="group bg-card rounded-xl overflow-hidden border border-border/60 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={b.img}
          alt={b.name}
          width={1024}
          height={1280}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-primary text-primary-foreground text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
          <BadgeCheck className="h-3.5 w-3.5" /> Đã xác minh
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg">{b.name}</h3>
        <div className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {b.years} năm kinh nghiệm · {b.district}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {b.specialties.map((s) => (
            <span
              key={s}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-teal/10 text-teal"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-sm">
          <Star className="h-4 w-4 fill-orange text-orange" />
          <span className="font-semibold">{b.rating.toFixed(1)}</span>
          <span className="text-muted-foreground text-xs">({b.reviews} đánh giá)</span>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            asChild
            variant="outline"
            className="flex-1 h-10 rounded-md border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Link
              to="/moi-gioi/$slug"
              params={{
                slug: b.name
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .replace(/đ/g, "d")
                  .replace(/\s+/g, "-"),
              }}
            >
              Xem hồ sơ
            </Link>
          </Button>
          <Button
            size="icon"
            className="h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md"
            aria-label={`Gọi ${b.name}`}
          >
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}

function BrokerGrid() {
  return (
    <section className="py-12">
      <div className="container-page">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {brokers.map((b) => (
            <BrokerCard key={b.name} b={b} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button variant="outline" className="rounded-full h-11 px-6 border-border/60 bg-card">
            Tải thêm môi giới
          </Button>
        </div>

        <Pagination />
      </div>
    </section>
  );
}

function Pagination() {
  const [page, setPage] = useState(1);
  const pages = [1, 2, 3, "...", 12] as const;
  return (
    <div className="mt-8 flex items-center justify-center gap-1.5">
      <Button variant="outline" size="icon" className="h-9 w-9 rounded-md" aria-label="Trang trước">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {pages.map((p, i) =>
        typeof p === "number" ? (
          <button
            key={i}
            onClick={() => setPage(p)}
            className={`h-9 min-w-9 px-3 rounded-md text-sm font-medium border transition-colors ${
              page === p
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border/60 hover:border-primary/40"
            }`}
          >
            {p}
          </button>
        ) : (
          <span key={i} className="px-2 text-muted-foreground">
            {p}
          </span>
        ),
      )}
      <Button variant="outline" size="icon" className="h-9 w-9 rounded-md" aria-label="Trang sau">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface-container/30">
      <div className="container-page py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="text-primary font-bold text-base">Da Nang Estates</div>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Giải pháp Bất động sản chuyên nghiệp tại thành phố đáng sống nhất Việt Nam.
          </p>
        </div>
        <div>
          <div className="font-semibold text-primary">Bất động sản</div>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>Biệt thự ven biển</li>
            <li>Căn hộ trung tâm</li>
            <li>Mặt bằng thương mại</li>
            <li>Dự án đất nền</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-primary">Công ty</div>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>Giới thiệu</li>
            <li>Liên hệ</li>
            <li>Điều khoản dịch vụ</li>
            <li>Chính sách bảo mật</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-primary">Hỗ trợ</div>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>Trung tâm trợ giúp</li>
            <li>Tin thị trường</li>
            <li>Hỗ trợ Môi giới</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © 2026 Da Nang Estates. Professional Real Estate Solutions.
      </div>
    </footer>
  );
}

function BrokersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <BrokersHero />
        <BrokerGrid />
      </main>
      <Footer />
    </div>
  );
}
