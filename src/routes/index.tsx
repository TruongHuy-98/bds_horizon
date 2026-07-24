import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  CalendarDays,
  User,
  Heart,
  Share2,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const [district, setDistrict] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams: Record<string, string> = {};
    if (keyword.trim()) searchParams.keyword = keyword.trim();
    if (category !== "all") searchParams.category = category;
    if (district !== "all") searchParams.district = district;
    if (priceRange !== "all") searchParams.priceRange = priceRange;

    navigate({
      to: "/nha-dat-ban",
      search: searchParams,
    });
  };

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
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-md max-w-5xl md:whitespace-nowrap">
          Tìm kiếm tổ ấm mơ ước tại Đà Nẵng
        </h1>
        <p className="mt-4 text-white/85 text-base md:text-lg max-w-xl">
          Hơn 8.500 bất động sản đã thẩm định, minh bạch pháp lý và quy hoạch.
        </p>
        <form onSubmit={handleSearch} className="mt-8 w-full max-w-5xl glass rounded-xl shadow-card p-3 md:p-4 border border-white/40">
          <div className="flex flex-col md:flex-row gap-2.5 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bất động sản..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-9 h-11 bg-white border-border rounded-md w-full"
              />
            </div>
            <div className="w-full md:w-36 lg:w-40 shrink-0">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-11 bg-white rounded-md w-full">
                  <SelectValue placeholder="Loại nhà đất" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại BĐS</SelectItem>
                  <SelectItem value="apt">Căn hộ</SelectItem>
                  <SelectItem value="villa">Biệt thự</SelectItem>
                  <SelectItem value="land">Đất nền</SelectItem>
                  <SelectItem value="town">Nhà phố</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-36 lg:w-40 shrink-0">
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className="h-11 bg-white rounded-md w-full">
                  <SelectValue placeholder="Quận / Huyện" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả quận/huyện</SelectItem>
                  <SelectItem value="Hải Châu">Hải Châu</SelectItem>
                  <SelectItem value="Sơn Trà">Sơn Trà</SelectItem>
                  <SelectItem value="Ngũ Hành Sơn">Ngũ Hành Sơn</SelectItem>
                  <SelectItem value="Cẩm Lệ">Cẩm Lệ</SelectItem>
                  <SelectItem value="Thanh Khê">Thanh Khê</SelectItem>
                  <SelectItem value="Liên Chiểu">Liên Chiểu</SelectItem>
                  <SelectItem value="Hòa Vang">Hòa Vang</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-36 lg:w-40 shrink-0">
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="h-11 bg-white rounded-md w-full">
                  <SelectValue placeholder="Khoảng giá" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả giá</SelectItem>
                  <SelectItem value="under-2">Dưới 2 tỷ</SelectItem>
                  <SelectItem value="2-5">2 - 5 tỷ</SelectItem>
                  <SelectItem value="5-10">5 - 10 tỷ</SelectItem>
                  <SelectItem value="over-10">Trên 10 tỷ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full md:w-auto shrink-0 bg-teal text-teal-foreground hover:bg-teal/90 h-11 px-6 rounded-md font-medium whitespace-nowrap">
              Tìm kiếm
            </Button>
          </div>
        </form>
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
  const [dbProperties, setDbProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", message: "" });

  const isMock = typeof window !== "undefined"
    ? !!localStorage.getItem("bds_mock_role") || !import.meta.env.VITE_SUPABASE_URL
    : true;

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      let list: any[] = [];
      if (isMock) {
        const localData = localStorage.getItem("mock_properties");
        list = localData ? JSON.parse(localData) : [];
      } else {
        try {
          const { data, error } = await supabase
            .from("properties")
            .select("*")
            .eq("published", true)
            .order("created_at", { ascending: false });
          if (error) throw error;
          list = data || [];
        } catch (err) {
          console.warn("Failed to fetch properties from Supabase, falling back to mock:", err);
          const localData = localStorage.getItem("mock_properties");
          list = localData ? JSON.parse(localData) : [];
        }
      }
      setDbProperties(list);
      setLoading(false);
    };

    fetchProperties();
  }, []);

  // Map database listings to UI format
  const mappedDbProperties = dbProperties.map((p) => ({
    raw: {
      title: p.title,
      description: p.description || "Chưa có mô tả chi tiết cho bất động sản này.",
      price: p.price_label || (p.price ? `${p.price} tỷ` : "Thỏa thuận"),
      area: p.area ? `${p.area}m²` : "N/A",
      beds: p.bedrooms || 0,
      baths: p.bathrooms || 0,
      address: p.address || p.district || "Đà Nẵng",
      district: p.district || "Đà Nẵng",
      images: Array.isArray(p.images) && p.images.length > 0 
        ? p.images 
        : p.image_url 
          ? [p.image_url] 
          : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60"],
      listing_type: p.listing_type === "rent" ? "Cho thuê" : "Mua bán",
      status: p.status === "available" ? "Còn trống" : p.status === "rented" ? "Đã cho thuê" : "Đã bán",
      developer: p.developer || "Đang cập nhật",
    },
    img: p.image_url || (Array.isArray(p.images) && p.images[0]) || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60",
    tag: p.listing_type === "rent" ? "Cho thuê" : "Mua bán",
    tagTone: p.listing_type === "rent" ? ("teal" as const) : ("orange" as const),
    extra: p.status === "available" ? "Còn trống" : p.status === "rented" ? "Đã cho thuê" : "Đã bán",
    title: p.title,
    loc: p.address || p.district || "Đà Nẵng",
    price: p.price_label || (p.price ? `${p.price} tỷ` : "Thỏa thuận"),
    area: p.area ? `${p.area}m²` : "N/A",
    beds: p.bedrooms || 0,
    baths: p.bathrooms || 0,
  }));

  const mappedStaticProperties = properties.map((p) => ({
    ...p,
    raw: {
      title: p.title,
      description: `Bất động sản cao cấp sở hữu vị trí đắc địa tại khu vực ${p.loc}. Không gian thiết kế hiện đại, thông thoáng, tối ưu hóa công năng sử dụng. Gần các tiện ích trường học, bệnh viện, khu mua sắm, an ninh đảm bảo 24/7. Thích hợp cho hộ gia đình sinh sống hoặc đầu tư kinh doanh, cho thuê sinh lời tốt.`,
      price: p.price,
      area: p.area,
      beds: p.beds,
      baths: p.baths,
      address: p.loc,
      district: p.loc.split(",")[0],
      images: [p.img],
      listing_type: p.tag === "Cho thuê" ? "Cho thuê" : "Mua bán",
      status: p.extra || "Còn trống",
      developer: "Đang cập nhật",
    }
  }));

  // Combine dynamic listings with the static ones so the page is never empty
  const allProperties = [...mappedDbProperties, ...mappedStaticProperties];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) {
      toast.error("Vui lòng điền đầy đủ họ tên và số điện thoại.");
      return;
    }
    setIsSubmittingContact(true);
    setTimeout(() => {
      toast.success("Gửi yêu cầu liên hệ thành công! Chúng tôi sẽ gọi lại cho bạn trong vòng 15 phút.");
      setIsSubmittingContact(false);
      setContactForm({ name: "", phone: "", message: "" });
    }, 1000);
  };

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

        {loading ? (
          <div className="py-20 text-center text-muted-foreground">
            <div className="animate-spin size-8 border-t-2 border-b-2 border-primary rounded-full mx-auto mb-3"></div>
            Đang tải danh sách bất động sản...
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProperties.map((p, idx) => (
              <article
                key={idx}
                onClick={() => {
                  setSelectedProperty(p);
                  setActiveImageIndex(0);
                  setContactForm({ name: "", phone: "", message: "" });
                }}
                className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border/60 cursor-pointer"
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
        )}

        <Dialog open={!!selectedProperty} onOpenChange={(open) => { if (!open) setSelectedProperty(null); }}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden border border-border/80 bg-card rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
            <DialogHeader className="p-6 pb-0 border-b border-border/50 shrink-0">
              <div className="flex items-center gap-3">
                {selectedProperty && <Tag tone={selectedProperty.tagTone}>{selectedProperty.tag}</Tag>}
                {selectedProperty?.extra && (
                  <span className="bg-muted text-muted-foreground text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    {selectedProperty.extra}
                  </span>
                )}
              </div>
              <DialogTitle className="text-xl md:text-2xl font-bold mt-2 text-foreground pr-8">
                {selectedProperty?.title}
              </DialogTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground pb-4 mt-1">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>{selectedProperty?.loc}</span>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Image Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted border border-border/40">
                  <img
                    src={selectedProperty?.raw.images[activeImageIndex] || selectedProperty?.img}
                    alt={selectedProperty?.title}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                </div>
                
                {/* Thumbnails grid */}
                {selectedProperty?.raw.images && selectedProperty.raw.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {selectedProperty.raw.images.map((imgUrl: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                          idx === activeImageIndex ? "border-primary shadow-md scale-95" : "border-transparent opacity-75 hover:opacity-100"
                        }`}
                      >
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Specs overview cards */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-surface-container/50 border border-border/40 rounded-xl p-3.5 text-center">
                    <div className="text-xs text-muted-foreground">Giá bán</div>
                    <div className="text-base font-bold text-primary mt-0.5">{selectedProperty?.price}</div>
                  </div>
                  <div className="bg-surface-container/50 border border-border/40 rounded-xl p-3.5 text-center">
                    <div className="text-xs text-muted-foreground">Diện tích</div>
                    <div className="text-base font-bold mt-0.5">{selectedProperty?.area}</div>
                  </div>
                  <div className="bg-surface-container/50 border border-border/40 rounded-xl p-3.5 text-center">
                    <div className="text-xs text-muted-foreground">Phòng ngủ / Tắm</div>
                    <div className="text-sm font-bold mt-1 flex justify-center gap-2 text-muted-foreground">
                      <span className="flex items-center gap-0.5 text-foreground"><Bed className="h-3.5 w-3.5" /> {selectedProperty?.beds}</span>
                      <span>/</span>
                      <span className="flex items-center gap-0.5 text-foreground"><Bath className="h-3.5 w-3.5" /> {selectedProperty?.baths}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Descriptions & Contact Form */}
              <div className="flex flex-col space-y-6">
                <div>
                  <h4 className="font-bold text-sm text-foreground uppercase tracking-wider mb-2">Mô tả chi tiết</h4>
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line border-l-2 border-primary/20 pl-3">
                    {selectedProperty?.raw.description}
                  </div>
                </div>

                <div className="border border-border/50 bg-surface-container/20 rounded-xl p-5">
                  <h4 className="font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-1.5 mb-4">
                    <User className="h-4 w-4 text-primary" /> Liên hệ tư vấn
                  </h4>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="modal-name" className="text-xs font-semibold text-muted-foreground">Họ và tên</label>
                      <Input
                        id="modal-name"
                        required
                        placeholder="Nguyễn Văn A"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="bg-card border-border h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="modal-phone" className="text-xs font-semibold text-muted-foreground">Số điện thoại</label>
                      <Input
                        id="modal-phone"
                        type="tel"
                        required
                        placeholder="0905 xxx xxx"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="bg-card border-border h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="modal-msg" className="text-xs font-semibold text-muted-foreground">Lời nhắn (Không bắt buộc)</label>
                      <textarea
                        id="modal-msg"
                        rows={2}
                        placeholder="Tôi muốn nhận thông tin tư vấn cụ thể..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full bg-card border border-border rounded-md p-2.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmittingContact}
                      className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold h-11 rounded-md mt-2 flex items-center justify-center gap-1.5"
                    >
                      {isSubmittingContact ? "Đang gửi..." : "Gửi yêu cầu gọi lại"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
