import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BadgeCheck,
  Star,
  Phone,
  Mail,
  Search,
  MapPin,
  Heart,
  AlertCircle,
  CreditCard,
  Award,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { LOCAL_USERS_DB } from "@/data/mockUsersData";

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
  district?: string;
  years?: number;
  email?: string;
  idCardNumber?: string;
  idCardPlace?: string;
  licenseNumber?: string;
  licenseIssuer?: string;
  licenseIssueDate?: string;
  licenseExpiryDate?: string;
  licenseImageUrl?: string;
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
    licenseNumber: "ĐN-02849",
    licenseIssuer: "Sở Xây dựng TP. Đà Nẵng",
    licenseIssueDate: "15/04/2022",
    licenseExpiryDate: "15/04/2027",
    idCardNumber: "048092008765",
    idCardPlace: "Cục Cảnh sát QLHC về TTXH",
    licenseImageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80",
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

function Tabs({ active, onChange }: { active: number; onChange: (i: number) => void }) {
  const items = ["Tin đất đang quản lý", "Đánh giá từ khách hàng", "Giới thiệu & Chứng chỉ"];
  return (
    <div className="container-page mt-10 border-b border-border/60">
      <div className="flex flex-wrap gap-8 text-sm">
        {items.map((t, i) => (
          <button
            key={t}
            onClick={() => onChange(i)}
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

function BrokerCertificationSection({ b }: { b: BrokerDetail }) {
  return (
    <section className="py-10">
      <div className="container-page max-w-5xl space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: Chứng chỉ hành nghề BĐS */}
          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Award className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">Chứng chỉ Hành nghề Môi giới BĐS</h3>
                  <p className="text-xs text-muted-foreground">Theo quy chuẩn của Bộ Xây dựng & Luật Kinh doanh BĐS</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                <BadgeCheck className="size-3.5" /> Đã xác thực
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Số chứng chỉ:</span>
                <span className="font-mono font-bold text-foreground">{b.licenseNumber || "ĐN-02849"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Đơn vị cấp:</span>
                <span className="font-semibold text-foreground">{b.licenseIssuer || "Sở Xây dựng TP. Đà Nẵng"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Ngày cấp:</span>
                <span className="text-foreground">{b.licenseIssueDate || "15/04/2022"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Thời hạn hiệu lực:</span>
                <span className="font-semibold text-emerald-600">Đến {b.licenseExpiryDate || "15/04/2027"} (Hợp lệ)</span>
              </div>
            </div>

            {b.licenseImageUrl && (
              <div className="pt-2">
                <span className="text-xs text-muted-foreground mb-2 block font-medium">Bản sao Chứng chỉ hành nghề:</span>
                <div className="aspect-[16/9] rounded-xl overflow-hidden border border-border/60 bg-muted/30">
                  <img src={b.licenseImageUrl} alt="Chứng chỉ hành nghề BĐS" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Xác thực Danh tính (CCCD) */}
          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                    <CreditCard className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">Xác thực Định danh (CCCD)</h3>
                    <p className="text-xs text-muted-foreground">Đối soát căn cước công dân gắn chip chính chủ</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-cyan-200">
                  <ShieldCheck className="size-3.5" /> Định danh cấp độ 2
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground">Tình trạng định danh:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="size-4" /> Đã xác thực căn cước công dân
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground">Nơi cấp:</span>
                  <span className="text-foreground">{b.idCardPlace || "Cục Cảnh sát QLHC về TTXH"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground">Quốc tịch:</span>
                  <span className="text-foreground">Việt Nam</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Mã định danh:</span>
                  <span className="font-mono text-muted-foreground">Đã mã hóa bảo mật (****)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground space-y-1.5">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" /> Cam kết an toàn & Pháp lý
              </div>
              <p>
                Môi giới đã hoàn tất thủ tục xác minh danh tính và được cấp phép hoạt động tư vấn môi giới bất động sản tại địa bàn TP. Đà Nẵng theo đúng quy định pháp luật.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
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
  const [activeTab, setActiveTab] = useState(0);

  // Try static brokerMap first
  let broker: BrokerDetail | undefined = brokerMap[slug];

  // If not found in static map, find in dynamic LOCAL_USERS_DB
  if (!broker && typeof window !== "undefined") {
    const users = LOCAL_USERS_DB.getUsers();
    const foundUser = users.find((u) => {
      const uSlug = u.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return uSlug === slug || u.id === slug;
    });

    if (foundUser) {
      broker = {
        name: foundUser.name,
        img: foundUser.avatar,
        rating: foundUser.rating || 5.0,
        reviews: foundUser.reviewsCount || foundUser.reviews || 80,
        phone: foundUser.phone,
        specialties: foundUser.specialties || [foundUser.district || "Đà Nẵng", "Môi giới BĐS"],
        verified: !!foundUser.isVerified,
        district: foundUser.district,
        years: foundUser.yearsExperience || foundUser.yearsExp || 3,
        email: foundUser.email,
        idCardNumber: foundUser.id_card_number,
        idCardPlace: foundUser.id_card_place,
        licenseNumber: foundUser.license_number,
        licenseIssuer: foundUser.license_issuer,
        licenseIssueDate: foundUser.license_issue_date,
        licenseExpiryDate: foundUser.license_expiry_date,
        licenseImageUrl: foundUser.license_image_url,
      };
    }
  }

  // Fallback to first broker if still not found
  if (!broker) {
    broker = brokerMap["nguyen-van-nam"];
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <BrokerHero b={broker} />
        <Tabs active={activeTab} onChange={setActiveTab} />
        {activeTab === 0 && <Listings />}
        {activeTab === 1 && (
          <div className="container-page py-10 text-center text-muted-foreground text-sm">
            Hiện tại có {broker.reviews} lượt đánh giá từ khách hàng đã giao dịch thành công với {broker.name}.
          </div>
        )}
        {activeTab === 2 && <BrokerCertificationSection b={broker} />}
      </main>
      <Footer />
    </div>
  );
}
