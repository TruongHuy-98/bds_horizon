import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

interface DistrictCard {
  name: string;
  slug: string;
  listings: number;
  img: string;
  description: string;
  isLarge?: boolean;
}

const districts: DistrictCard[] = [
  {
    name: "Quận Sơn Trà",
    slug: "son-tra",
    listings: 2120,
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&auto=format&fit=crop&q=80",
    description: "Bán đảo Sơn Trà · Bãi biển Mỹ Khê",
    isLarge: true,
  },
  {
    name: "Quận Hải Châu",
    slug: "hai-chau",
    listings: 1850,
    img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&auto=format&fit=crop&q=80",
    description: "Cầu Rồng · Trung tâm thành phố",
  },
  {
    name: "Quận Ngũ Hành Sơn",
    slug: "ngu-hanh-son",
    listings: 1430,
    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=80",
    description: "Resort · Bãi Non Nước · Nam Hòa Xuân",
  },
  {
    name: "Quận Cẩm Lệ & Hòa Vang",
    slug: "cam-le",
    listings: 980,
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80",
    description: "Khu đô thị sinh thái · Ven sông",
  },
  {
    name: "Quận Thanh Khê & Liên Chiểu",
    slug: "thanh-khe",
    listings: 820,
    img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80",
    description: "Trục biển Nguyễn Tất Thành · Cảng Liên Chiểu",
  },
];

function DistrictCardItem({ district }: { district: DistrictCard }) {
  return (
    <Link
      to="/nha-dat-ban"
      search={{ district: district.name } as any}
      className="group relative block overflow-hidden rounded-xl h-full"
    >
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={district.img}
          alt={district.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      {/* Content */}
      <div className="relative flex h-full flex-col justify-end p-4 md:p-5">
        <div className="flex items-center gap-1.5 text-white/70 text-xs mb-1">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="line-clamp-1">{district.description}</span>
        </div>
        <h3 className="font-bold text-white text-base md:text-lg leading-tight">
          {district.name}
        </h3>
        <div className="mt-1.5 inline-flex items-center gap-1 text-xs">
          <span className="font-bold text-emerald-400">
            {district.listings.toLocaleString("vi-VN")}
          </span>
          <span className="text-white/75">tin đăng</span>
        </div>
      </div>
    </Link>
  );
}

export function DistrictSection() {
  const [largeCard, ...smallCards] = districts;

  return (
    <section className="py-16 md:py-20 bg-surface-container/40">
      <div className="container-page">
        {/* Section header */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-3">
              <MapPin className="h-3.5 w-3.5" />
              Khu vực trọng điểm
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Bất động sản theo khu vực Đà Nẵng
            </h2>
            <p className="mt-2 text-muted-foreground text-sm md:text-base">
              Khám phá thị trường BĐS tại từng quận/huyện của thành phố đáng sống.
            </p>
          </div>
          <Link
            to="/nha-dat-ban"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all whitespace-nowrap shrink-0"
          >
            Xem tất cả
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Asymmetric grid: 1 large left (col-span-3) + 2x2 right (col-span-2) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
          {/* Large card — 3 of 5 columns */}
          <div className="md:col-span-3 h-[300px] md:h-[460px]">
            <DistrictCardItem district={largeCard} />
          </div>

          {/* Small cards — 2x2 grid */}
          <div className="md:col-span-2 grid grid-cols-2 gap-3 md:gap-4 h-[320px] md:h-[460px]">
            {smallCards.map((d) => (
              <div key={d.slug}>
                <DistrictCardItem district={d} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
