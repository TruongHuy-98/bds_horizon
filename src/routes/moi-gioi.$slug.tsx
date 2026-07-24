import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, Star, Phone, Mail, Search, MapPin, Heart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

import heroBg from "@/assets/hero-danang.jpg";
import b1 from "@/assets/broker-1.jpg";
import b2 from "@/assets/broker-2.jpg";
import b3 from "@/assets/broker-3.jpg";
import b4 from "@/assets/broker-4.jpg";

import p1 from "@/assets/property-1.jpg";
import p2 from "@/assets/property-2.jpg";
import p3 from "@/assets/property-3.jpg";
import p4 from "@/assets/property-4.jpg";

export const Route = createFileRoute("/moi-gioi/$slug")({
  component: BrokerDetailPage,
  head: () => ({
    meta: [
      { title: "Hồ sơ Môi giới — DaNang Realty" },
      {
        name: "description",
        content:
          "Xem hồ sơ chi tiết môi giới bất động sản tại Đà Nẵng: tin đăng, đánh giá khách hàng và chứng chỉ chuyên môn.",
      },
    ],
  }),
});

type BrokerDetail = {
  name: string;
  img: string;
  rating: number;
  reviews: number;
  phone: string;
  specialties: string[];
  verified?: boolean;
};

const brokerMap: Record<string, BrokerDetail> = {
  "nguyen-van-nam": {
    name: "Nguyễn Văn Nam",
    img: b1,
    rating: 4.8,
    reviews: 120,
    phone: "0905 xxx xxx",
    specialties: ["Đất nền Nam Hòa Xuân", "Căn hộ Sơn Trà"],
    verified: true,
  },
  "tran-thi-minh": {
    name: "Trần Thị Minh",
    img: b2,
    rating: 5.0,
    reviews: 245,
    phone: "0905 xxx xxx",
    specialties: ["Biệt thự biển", "Sơn Trà"],
    verified: true,
  },
  "le-hoang-long": {
    name: "Lê Hoàng Long",
    img: b3,
    rating: 4.7,
    reviews: 89,
    phone: "0905 xxx xxx",
    specialties: ["Đất nền dự án", "Ngũ Hành Sơn"],
    verified: true,
  },
  "pham-ngoc-lan": {
    name: "Phạm Ngọc Lan",
    img: b4,
    rating: 5.0,
    reviews: 512,
    phone: "0905 xxx xxx",
    specialties: ["Đầu tư quy mô lớn", "Toàn thành phố"],
    verified: false, // Demo màu đỏ Chưa xác thực
  },
  "le-thi-mai-anh": {
    name: "Lê Thị Mai Anh",
    img: b2,
    rating: 4.9,
    reviews: 156,
    phone: "0905 xxx xxx",
    specialties: ["Đất nền Hòa Xuân", "Căn hộ trung tâm"],
    verified: true,
  },
  "tran-hoang-long": {
    name: "Trần Hoàng Long",
    img: b3,
    rating: 4.8,
    reviews: 210,
    phone: "0905 xxx xxx",
    specialties: ["Nhà phố trung tâm", "Hải Châu"],
    verified: true,
  },
};

const listings = [
  {
    img: p1,
    badge: "HOT DEAL",
    badgeClass: "bg-orange text-white",
    price: "3.5 tỷ",
    title: "Đất nền kề sông Hàn, Hòa Xuân",
    area: "100m²",
    location: "Hòa Xuân, Cẩm Lệ",
    tag: "Sổ đỏ chính chủ",
  },
  {
    img: p2,
    badge: "MỚI ĐĂNG",
    badgeClass: "bg-teal text-white",
    price: "4.2 tỷ",
    title: "Căn hộ cao cấp view biển Sơn Trà",
    area: "75m²",
    location: "Phước Mỹ, Sơn Trà",
    tag: "Full nội thất",
  },
  {
    img: p3,
    badge: "",
    badgeClass: "",
    price: "2.8 tỷ",
    title: "Lô đất góc 2 mặt tiền Euro Village",
    area: "120m²",
    location: "Hòa Xuân, Cẩm Lệ",
    tag: "Sổ hồng riêng",
  },
  {
    img: p4,
    badge: "GIÁ TỐT NHẤT",
    badgeClass: "bg-primary text-primary-foreground",
    price: "5.5 tỷ",
    title: "Nhà phố hiện đại 3 tầng Ngũ Hành Sơn",
    area: "90m²",
    location: "Khuê Mỹ, NHS",
    tag: "Sổ đỏ chính chủ",
  },
];

function BrokerHero({ b }: { b: BrokerDetail }) {
  const [showPhone, setShowPhone] = useState(false);
  const isVerified = b.verified ?? true;

  return (
    <section className="relative">
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={heroBg}
          alt="Đà Nẵng skyline"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-background/10" />
      </div>
      <div className="container-page -mt-24 relative z-10">
        <div className="bg-card rounded-2xl shadow-card border border-border/60 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            <div className="relative shrink-0">
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden ring-4 ring-card shadow-md">
                <img src={b.img} alt={b.name} className="h-full w-full object-cover" />
              </div>
              {isVerified ? (
                <span className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-teal text-white grid place-items-center ring-2 ring-card shadow-xs">
                  <BadgeCheck className="h-4 w-4" />
                </span>
              ) : (
                <span className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-red-600 text-white grid place-items-center ring-2 ring-card shadow-xs" title="Chưa xác thực">
                  <AlertCircle className="h-4 w-4" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
                  {b.name}
                </h1>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 bg-teal/15 text-teal text-xs font-semibold px-3 py-1 rounded-full border border-teal/20">
                    <BadgeCheck className="h-3.5 w-3.5" /> Môi giới Xác thực
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 text-xs font-semibold px-3 py-1 rounded-full">
                    <AlertCircle className="h-3.5 w-3.5" /> Chưa xác thực
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 fill-orange text-orange" />
                <span className="font-semibold">{b.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({b.reviews} đánh giá)</span>
                <div className="ml-2 h-0.5 w-16 bg-orange rounded-full" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {b.specialties.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted text-foreground/80"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowPhone((v) => !v)}
                  className="inline-flex items-center gap-2 bg-card border border-border/60 hover:border-primary/40 rounded-full pl-4 pr-1.5 py-1.5 text-sm font-medium shadow-sm"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{showPhone ? b.phone : b.phone.replace(/\d(?=\d{3})/g, "x")}</span>
                  <span className="ml-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full px-3 py-1">
                    {showPhone ? "Ẩn" : "Hiện"}
                  </span>
                </button>
                <Button
                  variant="secondary"
                  className="rounded-full h-10 px-5 bg-muted hover:bg-muted/80"
                >
                  <Mail className="h-4 w-4 mr-2" /> Nhắn tin
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tabs() {
  const items = ["Tin đất đang quản lý", "Đánh giá từ khách hàng", "Giới thiệu & Chứng chỉ"];
  const [active, setActive] = useState(0);
  return (
    <div className="container-page mt-10 border-b border-border/60">
      <div className="flex flex-wrap gap-8 text-sm">
        {items.map((t, i) => (
          <button
            key={t}
            onClick={() => setActive(i)}
            className={`pb-3 -mb-px transition-colors ${
              active === i
                ? "text-primary font-semibold border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function Listings() {
  return (
    <section className="py-10">
      <div className="container-page">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((l) => (
            <article
              key={l.title}
              className="group bg-card rounded-xl overflow-hidden border border-border/60 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={l.img}
                  alt={l.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {l.badge && (
                  <span
                    className={`absolute top-3 left-3 text-[10px] font-bold tracking-wide px-2.5 py-1 rounded ${l.badgeClass}`}
                  >
                    {l.badge}
                  </span>
                )}
                <button
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-card/90 grid place-items-center hover:bg-card"
                  aria-label="Yêu thích"
                >
                  <Heart className="h-4 w-4 text-foreground/70" />
                </button>
              </div>
              <div className="p-4">
                <div className="text-primary font-bold text-lg">{l.price}</div>
                <h3 className="mt-1 font-medium text-sm line-clamp-1">{l.title}</h3>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Search className="h-3 w-3" /> {l.area}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {l.location}
                  </span>
                </div>
                <div className="mt-3 inline-block text-[11px] font-medium px-2.5 py-1 rounded bg-muted text-foreground/70">
                  {l.tag}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button variant="outline" className="rounded-md h-11 px-8 border-border/60 bg-card">
            Xem thêm tin đăng
          </Button>
        </div>
      </div>
    </section>
  );
}



function BrokerDetailPage() {
  const { slug } = Route.useParams();
  const broker = brokerMap[slug] ?? brokerMap["nguyen-van-nam"];
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <BrokerHero b={broker} />
        <Tabs />
        <Listings />
      </main>
      <Footer />
    </div>
  );
}
