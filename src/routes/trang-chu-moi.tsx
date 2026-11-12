import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useRef, useEffect } from "react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { NewsSection } from "@/components/site/NewsSection";
import {
  Search,
  MapPin,
  Map as MapIcon,
  ShieldCheck,
  Building2,
  ArrowRight,
  Bed,
  Bath,
  Square,
  Star,
  CheckCircle2,
  Sparkles,
  Phone,
  Layers,
  CalendarDays,
  TrendingUp,
  Tag as TagIcon,
  Heart,
  ChevronRight,
  ChevronLeft,
  Compass,
  PhoneCall,
  Mail,
  UserCheck,
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
import { getLocalAndSampleListings, fetchPropertiesFromDb } from "@/lib/listingsService";
import { ListingItem } from "@/data/listingsData";
import { toast } from "sonner";
import heroCapitalSquare from "@/assets/hero-danang.png";
import planMap from "@/assets/planning-map.jpg";
import b1 from "@/assets/broker-1.jpg";
import b2 from "@/assets/broker-2.jpg";
import b3 from "@/assets/broker-3.jpg";
import b4 from "@/assets/broker-4.jpg";
import proj1 from "@/assets/project-1.jpg";
import proj2 from "@/assets/project-2.jpg";
import proj3 from "@/assets/project-3.jpg";
import proj4 from "@/assets/project-4.jpg";
import proj5 from "@/assets/project-5.jpg";
import proj6 from "@/assets/project-6.jpg";

export const Route = createFileRoute("/trang-chu-moi")({
  component: TrangChuMoiPage,
  head: () => ({
    meta: [
      { title: "Trang chủ mới (Chuẩn UI/UX evondevKit) — Da Nang Real Estate" },
      {
        name: "description",
        content:
          "Bản mẫu thiết kế Trang chủ Bất động sản Đà Nẵng theo chuẩn UI/UX evondevKit: Hero banner hoành tráng, slider 4 cột dự án, showcase môi giới chuyên nghiệp.",
      },
    ],
  }),
});

// Districts for the Bento Grid
const BENTO_DISTRICTS = [
  {
    name: "Quận Sơn Trà",
    subtitle: "Biển Mỹ Khê & Bán đảo Sơn Trà",
    tag: "Nghỉ dưỡng & Du lịch",
    listingsCount: "2.120",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&auto=format&fit=crop&q=80",
    colSpan: "col-span-1 md:col-span-2 row-span-2",
    badgeTone: "teal",
  },
  {
    name: "Quận Hải Châu",
    subtitle: "Trung tâm thương mại & Cầu Rồng",
    tag: "Đô thị trung tâm",
    listingsCount: "1.850",
    img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&auto=format&fit=crop&q=80",
    colSpan: "col-span-1 md:col-span-1 row-span-1",
    badgeTone: "primary",
  },
  {
    name: "Quận Ngũ Hành Sơn",
    subtitle: "Khu đô thị Nam Hòa Xuân & Biển Non Nước",
    tag: "Khu đô thị mới",
    listingsCount: "1.430",
    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=80",
    colSpan: "col-span-1 md:col-span-1 row-span-1",
    badgeTone: "orange",
  },
  {
    name: "Cẩm Lệ & Hòa Vang",
    subtitle: "Sinh thái ven sông & Vành đai Tây",
    tag: "Đất nền thổ cư",
    listingsCount: "980",
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80",
    colSpan: "col-span-1 md:col-span-1 row-span-1",
    badgeTone: "neutral",
  },
  {
    name: "Thanh Khê & Liên Chiểu",
    subtitle: "Vịnh Đà Nẵng & Cảng biển Liên Chiểu",
    tag: "Hạ tầng bứt phá",
    listingsCount: "820",
    img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80",
    colSpan: "col-span-1 md:col-span-1 row-span-1",
    badgeTone: "neutral",
  },
];

// Highlighted featured projects for the 4-column slider (Ảnh 2)
const FEATURED_PROJECTS = [
  {
    id: "sun-ponte-residence",
    title: "Sun Ponte Residence",
    developer: "Sun Group",
    district: "Sơn Trà",
    priceFrom: "5.5 tỷ",
    status: "Đang mở bán",
    statusTone: "teal",
    handover: "Q3/2026",
    units: "495 căn",
    img: proj1,
  },
  {
    id: "the-filmore-da-nang",
    title: "The Filmore Da Nang",
    developer: "Filmore Development",
    district: "Hải Châu",
    priceFrom: "7.2 tỷ",
    status: "Đang bàn giao",
    statusTone: "muted",
    handover: "Hiện hữu",
    units: "206 căn",
    img: proj2,
  },
  {
    id: "vinhomes-danang-bay",
    title: "Vinhomes Golden Bay",
    developer: "Vingroup",
    district: "Liên Chiểu",
    priceFrom: "3.2 tỷ",
    status: "Sắp mở bán",
    statusTone: "orange",
    handover: "Q4/2026",
    units: "1.200 căn",
    img: proj3,
  },
  {
    id: "peninsula-da-nang",
    title: "The Peninsula Da Nang",
    developer: "Athena Luxury",
    district: "Sơn Trà",
    priceFrom: "4.8 tỷ",
    status: "Đang mở bán",
    statusTone: "teal",
    handover: "Q2/2026",
    units: "941 căn",
    img: proj4,
  },
  {
    id: "regal-complex-da-nang",
    title: "Regal Complex Da Nang",
    developer: "Đất Xanh Miền Trung",
    district: "Ngũ Hành Sơn",
    priceFrom: "6.5 tỷ",
    status: "Sắp mở bán",
    statusTone: "orange",
    handover: "Q1/2027",
    units: "680 căn",
    img: proj5,
  },
  {
    id: "danang-landmark-tower",
    title: "Danang Landmark Tower",
    developer: "Cosmos Housing",
    district: "Hải Châu",
    priceFrom: "8.1 tỷ",
    status: "Đang mở bán",
    statusTone: "teal",
    handover: "Q4/2026",
    units: "446 căn",
    img: proj6,
  },
  {
    id: "shizen-nami-da-nang",
    title: "Shizen Nami Da Nang",
    developer: "Gotec Land",
    district: "Liên Chiểu",
    priceFrom: "3.9 tỷ",
    status: "Đang mở bán",
    statusTone: "teal",
    handover: "Q3/2026",
    units: "487 căn",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "fpt-plaza-3",
    title: "FPT Plaza 3",
    developer: "FPT City Đà Nẵng",
    district: "Ngũ Hành Sơn",
    priceFrom: "2.1 tỷ",
    status: "Đang bàn giao",
    statusTone: "muted",
    handover: "Hiện hữu",
    units: "863 căn",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
  },
];

// Top verified local brokers with credential bullet points (Ảnh 3 theo bố cục Ảnh 4)
const TOP_AGENTS = [
  {
    id: "nguyen-van-nam",
    honorific: "ThS. Quản trị & Đầu tư BĐS",
    name: "Nguyễn Văn Nam",
    role: "Chuyên gia căn hộ cao cấp & Biệt thự biển",
    district: "Hải Châu & Sơn Trà",
    phone: "0905 123 456",
    email: "nam.nguyen@danangrealty.vn",
    experience: "8 năm kinh nghiệm",
    listings: 45,
    rating: 5,
    reviews: 38,
    img: b1,
    bullets: [
      "Hơn 8 năm kinh nghiệm phân phối và định giá căn hộ cao cấp ven sông Hàn.",
      "Tốt nghiệp Thạc sĩ Quản trị Kinh doanh – Trường Đại học Kinh tế, Đại học Đà Nẵng.",
      "Chứng chỉ hành nghề Môi giới Bất động sản và Định giá do Sở Xây Dựng Đà Nẵng cấp.",
      "Đã chốt thành công hơn 180+ giao dịch căn hộ nghỉ dưỡng và nhà phố trung tâm.",
      "Cam kết tư vấn chuẩn quy hoạch, hỗ trợ thủ tục công chứng sang tên sổ đỏ trọn gói.",
    ],
  },
  {
    id: "le-thi-mai-anh",
    honorific: "Chuyên viên Thẩm định Địa chính",
    name: "Lê Thị Mai Anh",
    role: "Chuyên gia đất nền sinh thái Nam Hòa Xuân",
    district: "Cẩm Lệ & Ngũ Hành Sơn",
    phone: "0905 888 999",
    email: "maianh.le@danangrealty.vn",
    experience: "5 năm kinh nghiệm",
    listings: 32,
    rating: 5,
    reviews: 29,
    img: b2,
    bullets: [
      "Hơn 5 năm chuyên sâu phân khúc đất nền sinh thái ven sông Hòa Xuân và Nam Hòa Xuân.",
      "Cử nhân Luật Kinh tế – Đại học Luật Hà Nội, am hiểu sâu sắc quy chuẩn pháp lý BĐS.",
      "Chứng chỉ hành nghề Môi giới Bất động sản đạt chuẩn Hiệp hội BĐS Việt Nam (VNREA).",
      "Hỗ trợ kiểm tra quy hoạch phân khu chi tiết, lộ giới quy hoạch giao thông trước đặt cọc.",
      "Chuyên xử lý hồ sơ tách thửa, cấp đổi sổ hồng nhanh chóng và an toàn tuyệt đối.",
    ],
  },
  {
    id: "tran-hoang-long",
    honorific: "Giám đốc Khối Khách hàng VIP",
    name: "Trần Hoàng Long",
    role: "Trưởng phòng BĐS Nghỉ dưỡng & Khách sạn",
    district: "Sơn Trà & Ngũ Hành Sơn",
    phone: "0905 678 910",
    email: "long.tran@danangrealty.vn",
    experience: "12 năm kinh nghiệm",
    listings: 68,
    rating: 5,
    reviews: 54,
    img: b3,
    bullets: [
      "Hơn 12 năm dẫn đầu thị trường BĐS nghỉ dưỡng, khách sạn ven biển Võ Nguyên Giáp.",
      "Tốt nghiệp Cử nhân Tài chính – Bất động sản, cố vấn chiến lược cho nhiều nhà đầu tư lớn.",
      "Chứng chỉ Chuyên gia Định giá Bất động sản và Quản lý sàn giao dịch cấp Quốc gia.",
      "Đã kết nối thành công hơn 65 thương vụ chuyển nhượng khách sạn, toà nhà văn phòng.",
      "Bảo mật thông tin giao dịch tuyệt đối, hỗ trợ đàm phán giá tốt nhất cho khách hàng.",
    ],
  },
  {
    id: "pham-quynh-nga",
    honorific: "Chuyên viên Tư vấn Nhà phố",
    name: "Phạm Quỳnh Nga",
    role: "Chuyên viên cao cấp BĐS Nhà phố Trung tâm",
    district: "Hải Châu & Thanh Khê",
    phone: "0905 333 444",
    email: "quynhnga.pham@danangrealty.vn",
    experience: "7 năm kinh nghiệm",
    listings: 41,
    rating: 5,
    reviews: 35,
    img: b4,
    bullets: [
      "Hơn 7 năm kinh nghiệm giao dịch nhà phố mặt tiền kinh doanh các tuyến đường huyết mạch.",
      "Tốt nghiệp Đại học Ngoại ngữ Đà Nẵng, thành thạo tiếng Anh và tiếng Hàn trong giao dịch BĐS.",
      "Chứng chỉ Môi giới Bất động sản chuyên nghiệp, đạt danh hiệu Môi giới Xuất sắc 3 năm liền.",
      "Giỏ hàng hơn 150+ căn nhà phố chính chủ gửi bán độc quyền, pháp lý chuẩn chỉnh.",
      "Hỗ trợ vay ngân hàng liên kết (Vietcombank, BIDV, MB) với lãi suất ưu đãi duyệt hồ sơ 48h.",
    ],
  },
];

export default function TrangChuMoiPage() {
  const navigate = useNavigate();

  // Search state
  const [searchTab, setSearchTab] = useState<"sale" | "rent" | "project">("sale");
  const [keyword, setKeyword] = useState("");
  const [district, setDistrict] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  // Property filter category
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  // Active broker index for showcase (Ảnh 3 theo bố cục Ảnh 4)
  const [activeAgentIndex, setActiveAgentIndex] = useState(0);
  const activeAgent = TOP_AGENTS[activeAgentIndex];

  // Ref for the 4-column project slider (Ảnh 2)
  const projectSliderRef = useRef<HTMLDivElement>(null);

  // Lead contact form
  const [quickPhone, setQuickPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load listings from database (with instant seed fallback)
  const [allListings, setAllListings] = useState<ListingItem[]>(() =>
    getLocalAndSampleListings(searchTab === "rent" ? "rent" : "sale")
  );

  useEffect(() => {
    // 1. Tải tức thì từ cache
    setAllListings(getLocalAndSampleListings(searchTab === "rent" ? "rent" : "sale"));

    // 2. Nạp dữ liệu sống từ Supabase Database
    fetchPropertiesFromDb(searchTab === "rent" ? "rent" : "sale").then((items) => {
      if (items && items.length > 0) {
        setAllListings(items);
      }
    });
  }, [searchTab]);

  const filteredProperties = useMemo(() => {
    if (activeCategory === "all") return allListings.slice(0, 8);
    return allListings.filter((i) => i.category === activeCategory).slice(0, 8);
  }, [allListings, activeCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query: Record<string, string> = {};
    if (keyword.trim()) query.keyword = keyword.trim();
    if (district !== "all") query.district = district;
    if (propertyType !== "all") query.category = propertyType;
    if (priceRange !== "all") query.priceRange = priceRange;

    const targetRoute =
      searchTab === "project"
        ? "/du-an"
        : searchTab === "rent"
          ? "/nha-dat-cho-thue"
          : "/nha-dat-ban";

    navigate({
      to: targetRoute,
      search: query,
    });
  };

  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !savedIds[id];
    setSavedIds((prev) => ({ ...prev, [id]: next }));
    if (next) {
      toast.success("Đã lưu tin bất động sản vào danh sách yêu thích");
    } else {
      toast.info("Đã bỏ lưu tin");
    }
  };

  const handlePrevAgent = () => {
    setActiveAgentIndex((prev) => (prev === 0 ? TOP_AGENTS.length - 1 : prev - 1));
  };

  const handleNextAgent = () => {
    setActiveAgentIndex((prev) => (prev === TOP_AGENTS.length - 1 ? 0 : prev + 1));
  };

  const scrollProjectLeft = () => {
    if (projectSliderRef.current) {
      projectSliderRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const scrollProjectRight = () => {
    if (projectSliderRef.current) {
      projectSliderRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  const handleQuickLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPhone.trim()) {
      toast.error("Vui lòng nhập số điện thoại để nhận tư vấn");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Đã gửi yêu cầu! Chuyên viên tư vấn Đà Nẵng sẽ liên hệ lại trong 15 phút.");
      setIsSubmitting(false);
      setQuickPhone("");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Top Banner: Comparison Switcher */}
      <div className="bg-primary/95 text-primary-foreground text-xs py-2 px-4 shadow-xs">
        <div className="container-page flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              Bản demo evondevKit
            </span>
            <span>
              Đã cập nhật: <b>Hero banner nền thật</b>, <b>Slider dự án 4 cột</b>, và <b>Showcase môi giới</b>.
            </span>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 font-semibold underline hover:text-white/80 transition-colors"
          >
            ← Quay lại trang chủ hiện tại
          </Link>
        </div>
      </div>

      <Header />

      <main className="flex-1">
        {/* =========================================================
            1. HERO SECTION: Grand Background Banner (Capital Square & Sông Hàn)
        ========================================================= */}
        <section className="relative isolate w-full pt-10 pb-12 md:pt-12 md:pb-14 overflow-hidden text-white bg-slate-950 border-b border-border/50">
          {/* Background Image Banner: Toàn cảnh hoàng hôn Sông Hàn & Capital Square Đà Nẵng */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src={heroCapitalSquare}
              alt="Toàn cảnh Capital Square và Sông Hàn Đà Nẵng lúc hoàng hôn"
              className="w-full h-full object-cover object-[center_35%] scale-100 transition-transform duration-1000"
            />
            {/* Lớp phủ gradient tinh tế: giữ trọn ánh hoàng hôn vàng rực, mặt nước lung linh và ánh đèn đô thị */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/30 to-slate-950/85" />
            <div className="absolute inset-0 bg-radial-[ellipse_at_top] from-primary/20 via-transparent to-black/30" />
          </div>

          <div className="container-page relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/60 text-white text-xs font-semibold mb-3 border border-white/25 backdrop-blur-md shadow-xs">
                <ShieldCheck className="size-3.5 text-teal-300" />
                Cổng Bất Động Sản & Quy Hoạch Minh Bạch Đà Nẵng
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">
                Tìm tổ ấm mơ ước & Thẩm định pháp lý an toàn
              </h1>
              <p className="mt-3 text-sm sm:text-base text-white/95 leading-relaxed max-w-2xl mx-auto drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
                Hơn 8.500 bất động sản chính chủ, cập nhật liên tục với bản đồ quy hoạch số 2030 chính xác từng phân khu.
              </p>
            </div>

            {/* Centralized Search Box Floating on Banner */}
            <div className="max-w-4xl mx-auto bg-card text-foreground rounded-2xl border border-white/25 shadow-2xl p-4 sm:p-5 backdrop-blur-md">
              {/* Tab Switcher: Sale / Rent / Project */}
              <div className="flex items-center gap-1.5 pb-4 border-b border-border/60">
                <button
                  type="button"
                  onClick={() => setSearchTab("sale")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${searchTab === "sale"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  Mua bán nhà đất
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTab("rent")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${searchTab === "rent"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  Nhà đất cho thuê
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTab("project")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${searchTab === "project"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  Dự án nổi bật
                </button>
              </div>

              {/* Input Filters Grid */}
              <form onSubmit={handleSearchSubmit} className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
                {/* Keyword search input */}
                <div className="lg:col-span-4 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Nhập tên đường, dự án, khu vực..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="pl-9 h-11 bg-background border-border rounded-xl text-xs sm:text-sm placeholder:text-muted-foreground/70"
                  />
                </div>

                {/* District selector */}
                <div className="lg:col-span-3">
                  <Select value={district} onValueChange={setDistrict}>
                    <SelectTrigger className="h-11 bg-background border-border rounded-xl text-xs sm:text-sm">
                      <SelectValue placeholder="Quận / Huyện" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toàn TP. Đà Nẵng</SelectItem>
                      <SelectItem value="Hải Châu">Quận Hải Châu</SelectItem>
                      <SelectItem value="Sơn Trà">Quận Sơn Trà</SelectItem>
                      <SelectItem value="Ngũ Hành Sơn">Quận Ngũ Hành Sơn</SelectItem>
                      <SelectItem value="Cẩm Lệ">Quận Cẩm Lệ</SelectItem>
                      <SelectItem value="Thanh Khê">Quận Thanh Khê</SelectItem>
                      <SelectItem value="Liên Chiểu">Quận Liên Chiểu</SelectItem>
                      <SelectItem value="Hòa Vang">Huyện Hòa Vang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category selector */}
                <div className="lg:col-span-3">
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="h-11 bg-background border-border rounded-xl text-xs sm:text-sm">
                      <SelectValue placeholder="Loại hình BĐS" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả loại hình</SelectItem>
                      <SelectItem value="apartment">Căn hộ / Chung cư</SelectItem>
                      <SelectItem value="house">Nhà phố liền kề</SelectItem>
                      <SelectItem value="land">Đất nền thổ cư</SelectItem>
                      <SelectItem value="villa">Biệt thự nghỉ dưỡng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit button */}
                <div className="lg:col-span-2">
                  <Button
                    type="submit"
                    className="w-full h-11 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-xs gap-1.5 cursor-pointer"
                  >
                    <Search className="size-4" />
                    Tìm kiếm
                  </Button>
                </div>
              </form>

              {/* Shortcut Tags */}
              <div className="mt-3.5 pt-3 border-t border-border/50 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Gợi ý tìm nhanh:</span>
                <button
                  type="button"
                  onClick={() => {
                    setDistrict("Sơn Trà");
                    setPropertyType("apartment");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-muted text-foreground transition-colors cursor-pointer"
                >
                  Căn hộ view biển Sơn Trà
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDistrict("Cẩm Lệ");
                    setPropertyType("land");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-muted text-foreground transition-colors cursor-pointer"
                >
                  Đất nền sinh thái Hòa Xuân
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDistrict("Hải Châu");
                    setPropertyType("house");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-muted text-foreground transition-colors cursor-pointer"
                >
                  Nhà phố trung tâm Hải Châu
                </button>
              </div>
            </div>

            {/* Value Trust Bar directly on Banner with Translucent Cards */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
              <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center shadow-lg">
                <div className="text-xl md:text-2xl font-extrabold text-amber-300">8.500+</div>
                <div className="text-xs text-white/90 mt-0.5 font-medium">BĐS thẩm định minh bạch</div>
              </div>
              <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center shadow-lg">
                <div className="text-xl md:text-2xl font-extrabold text-teal-300">100%</div>
                <div className="text-xs text-white/90 mt-0.5 font-medium">Có bản đồ quy hoạch 2030</div>
              </div>
              <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center shadow-lg">
                <div className="text-xl md:text-2xl font-extrabold text-orange-300">450+</div>
                <div className="text-xs text-white/90 mt-0.5 font-medium">Môi giới xác thực uy tín</div>
              </div>
              <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center shadow-lg">
                <div className="text-xl md:text-2xl font-extrabold text-white">15 phút</div>
                <div className="text-xs text-white/90 mt-0.5 font-medium">Kết nối chuyên viên hỗ trợ</div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            2. BENTO GRID: Khám phá BĐS theo 5 phân khu trọng điểm
        ========================================================= */}
        <section className="py-10 md:py-12 bg-surface-container/40">
          <div className="container-page">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Khu vực trọng điểm
                </span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mt-1">
                  Bất động sản theo từng phân khu Đà Nẵng
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Khám phá dữ liệu giá bán, tiềm năng phát triển và giỏ hàng theo từng quận huyện.
                </p>
              </div>
              <Link
                to="/nha-dat-ban"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:gap-2 transition-all shrink-0"
              >
                Xem tất cả khu vực <ArrowRight className="size-4" />
              </Link>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {BENTO_DISTRICTS.map((item, idx) => (
                <Link
                  key={item.name}
                  to="/nha-dat-ban"
                  search={{ district: item.name.replace("Quận ", "") } as any}
                  className={`group relative overflow-hidden rounded-2xl border border-border/60 shadow-xs hover:shadow-card-hover transition-all duration-300 ${idx === 0
                      ? "md:col-span-2 md:row-span-2 min-h-[320px] md:min-h-[440px]"
                      : "min-h-[210px]"
                    }`}
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* High contrast gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Top Tag */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="bg-white/90 text-foreground font-semibold text-[10px] px-2.5 py-1 rounded-full backdrop-blur-xs">
                      {item.tag}
                    </span>
                  </div>

                  {/* Content Footer */}
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white">
                    <div className="text-xs text-white/80 line-clamp-1 mb-1">
                      {item.subtitle}
                    </div>
                    <div className="flex items-end justify-between gap-2">
                      <h3 className="text-lg md:text-xl font-bold leading-tight group-hover:text-amber-300 transition-colors">
                        {item.name}
                      </h3>
                      <div className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 shrink-0">
                        <span>{item.listingsCount}</span>
                        <span className="text-white/70 font-normal">tin</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            3. PLANNING CHECK FEATURE: Khối Tra cứu quy hoạch 2030
        ========================================================= */}
        <section className="py-10 md:py-12 bg-background">
          <div className="container-page">
            <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center">
              {/* Left Column: Information & Actions */}
              <div className="lg:col-span-6 space-y-3.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/10 text-teal text-xs font-semibold">
                  <MapIcon className="size-3.5" />
                  Dữ liệu số hoá địa chính 2030
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                  Tra cứu Bản đồ Quy hoạch Đà Nẵng 2030
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Trước khi đặt cọc bất động sản, hãy tra cứu kỹ quy hoạch phân khu, lộ giới giao thông và mục đích sử dụng đất để bảo vệ dòng vốn đầu tư an toàn 100%.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-surface-container/60 border border-border/50">
                    <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-teal" /> Phân khu chi tiết
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Đất ở đô thị, đất thương mại dịch vụ, công viên cây xanh.
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container/60 border border-border/50">
                    <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-teal" /> Dự án giao thông
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Cập nhật Cảng Liên Chiểu, đường vành đai và cầu mới.
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Button
                    asChild
                    className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold h-11 px-6 rounded-xl gap-2 shadow-xs"
                  >
                    <Link to="/check-quy-hoach">
                      Tra cứu quy hoạch ngay
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-border text-foreground hover:bg-muted h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold"
                  >
                    <Link to="/phap-ly">
                      Xem cẩm nang pháp lý
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Column: Interactive Map Preview Card */}
              <div className="lg:col-span-6 relative">
                <Link
                  to="/check-quy-hoach"
                  className="group relative block rounded-2xl overflow-hidden border border-border/70 shadow-card-hover"
                  title="Nhấn để mở bản đồ quy hoạch trực tuyến"
                >
                  <img
                    src={planMap}
                    alt="Bản đồ quy hoạch Đà Nẵng 2030"
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 mb-1">
                      <span className="size-2 rounded-full bg-teal animate-ping" />
                      Dữ liệu số hoá đồng bộ Sở Xây Dựng
                    </div>
                    <div className="text-base font-bold">
                      Nhấn để tra cứu thửa đất trên bản đồ số trực quan
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            4. CURATED LISTINGS: Bất động sản mới nhất theo chuẩn evondevKit
        ========================================================= */}
        <section className="py-10 md:py-12 bg-surface-container/30">
          <div className="container-page">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Sản phẩm tuyển chọn
                </span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mt-1">
                  Bất động sản chính chủ mới nhất
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Thông tin giá niêm yết, đơn giá m² và pháp lý minh bạch.
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { key: "all", label: "Tất cả" },
                  { key: "apartment", label: "Căn hộ" },
                  { key: "house", label: "Nhà phố" },
                  { key: "land", label: "Đất nền" },
                  { key: "villa", label: "Biệt thự" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveCategory(tab.key)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${activeCategory === tab.key
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-card text-muted-foreground border border-border/80 hover:text-foreground hover:bg-muted"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Cards Grid (4 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredProperties.map((item) => (
                <article
                  key={item.id}
                  className="group bg-card rounded-2xl border border-border/70 overflow-hidden shadow-xs hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      <Link
                        to={item.listingType === "rent" ? "/nha-dat-cho-thue/$slug" : "/nha-dat-ban/$slug"}
                        params={{ slug: item.slug }}
                        className="block w-full h-full"
                      >
                        <img
                          src={item.images[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60"}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </Link>

                      {/* Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 pointer-events-none">
                        {item.isVip && (
                          <span className="bg-amber-500 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow-xs">
                            VIP
                          </span>
                        )}
                        {item.isOwner && (
                          <span className="bg-teal text-teal-foreground font-semibold text-[10px] px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                            <CheckCircle2 className="size-3" /> Chính chủ
                          </span>
                        )}
                      </div>

                      {/* Save Button */}
                      <button
                        onClick={(e) => handleToggleSave(item.id, e)}
                        className={`absolute top-2.5 right-2.5 size-8 rounded-full flex items-center justify-center transition-all shadow-xs backdrop-blur-xs cursor-pointer ${savedIds[item.id]
                            ? "bg-rose-500 text-white"
                            : "bg-black/40 hover:bg-black/60 text-white"
                          }`}
                        title="Lưu tin"
                      >
                        <Heart className={`size-4 ${savedIds[item.id] ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 pb-2">
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-1 line-clamp-1">
                        <MapPin className="size-3.5 text-primary shrink-0" />
                        <span className="truncate">{item.district}, Đà Nẵng</span>
                      </div>

                      <Link
                        to={item.listingType === "rent" ? "/nha-dat-cho-thue/$slug" : "/nha-dat-ban/$slug"}
                        params={{ slug: item.slug }}
                        className="block group-hover:text-primary transition-colors"
                      >
                        <h3 className="font-bold text-sm text-foreground leading-snug line-clamp-2 h-10">
                          {item.title}
                        </h3>
                      </Link>
                    </div>
                  </div>

                  {/* Card Bottom: Price & Metrics (Aligned perfectly) */}
                  <div className="px-4 pb-4 pt-1">
                    <div className="pt-3 border-t border-border/60 flex items-end justify-between min-h-[44px]">
                      <div>
                        <div className="text-base font-extrabold text-primary leading-none">
                          {item.priceLabel}
                        </div>
                        {item.pricePerM2 && (
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {item.pricePerM2}
                          </div>
                        )}
                      </div>

                      {/* Specs */}
                      <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                        {item.bedrooms && item.bedrooms > 0 ? (
                          <span className="flex items-center gap-1" title={`${item.bedrooms} phòng ngủ`}>
                            <Bed className="size-3.5" />
                            {item.bedrooms}
                          </span>
                        ) : null}
                        <span className="flex items-center gap-1" title={`Diện tích: ${item.area}m²`}>
                          <Square className="size-3.5" />
                          {item.area}m²
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* View More Link */}
            <div className="text-center mt-6 md:mt-8">
              <Button
                asChild
                variant="outline"
                className="bg-card border-border hover:bg-muted font-semibold px-6 h-11 rounded-xl text-xs sm:text-sm"
              >
                <Link to="/nha-dat-ban">
                  Xem thêm {allListings.length} tin bất động sản khác <ChevronRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* =========================================================
            5. PROJECTS SPOTLIGHT: Slider 4 columns (Ảnh 2)
        ========================================================= */}
        <section className="py-10 md:py-12 bg-background overflow-hidden">
          <div className="container-page">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold text-teal uppercase tracking-wider">
                  Quy mô & Đẳng cấp
                </span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mt-1">
                  Dự án Bất động sản nổi bật 2026
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Được phát triển bởi các chủ đầu tư danh tiếng, thẩm định tiến độ thực tế.
                </p>
              </div>

              {/* Slider 4-column Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={scrollProjectLeft}
                  className="size-9 rounded-xl border border-border bg-card hover:bg-muted text-foreground flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  title="Dự án trước"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={scrollProjectRight}
                  className="size-9 rounded-xl border border-border bg-card hover:bg-muted text-foreground flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  title="Dự án tiếp theo"
                >
                  <ChevronRight className="size-4" />
                </button>
                <Link
                  to="/du-an"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:gap-2 transition-all ml-2"
                >
                  Xem toàn bộ <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            {/* 4-column Slider Container (4 visible cards on desktop, swipeable) */}
            <div
              ref={projectSliderRef}
              className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth pb-4 pt-1 snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {FEATURED_PROJECTS.map((proj) => (
                <article
                  key={proj.id}
                  className="w-[82vw] sm:w-[46vw] md:w-[31vw] lg:w-[calc(25%-15px)] shrink-0 snap-start group bg-card rounded-2xl border border-border/70 overflow-hidden shadow-xs hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      <img
                        src={proj.img}
                        alt={proj.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold text-white shadow-xs ${proj.statusTone === "teal"
                            ? "bg-teal/95"
                            : proj.statusTone === "orange"
                              ? "bg-orange/95"
                              : "bg-slate-700/90"
                          }`}>
                          {proj.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 pb-2">
                      <div className="text-xs text-muted-foreground">{proj.developer}</div>
                      <Link to="/du-an" className="block group-hover:text-primary transition-colors">
                        <h3 className="font-bold text-base text-foreground mt-1 line-clamp-1">
                          {proj.title}
                        </h3>
                      </Link>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3.5 text-primary shrink-0" />
                        <span>Quận {proj.district}, Đà Nẵng</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <div className="mt-3 pt-3 border-t border-border/60 grid grid-cols-3 gap-1.5 text-center">
                      <div className="p-2 rounded-lg bg-surface-container/60">
                        <div className="text-[10px] text-muted-foreground uppercase">Giá từ</div>
                        <div className="text-xs font-bold text-primary mt-0.5">{proj.priceFrom}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-surface-container/60">
                        <div className="text-[10px] text-muted-foreground uppercase">Quy mô</div>
                        <div className="text-xs font-semibold text-foreground mt-0.5">{proj.units}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-surface-container/60">
                        <div className="text-[10px] text-muted-foreground uppercase">Bàn giao</div>
                        <div className="text-xs font-semibold text-foreground mt-0.5">{proj.handover}</div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            6. TOP VERIFIED BROKERS: Bố cục đặc biệt theo Ảnh 4 (Ảnh 3)
        ========================================================= */}
        <section className="py-10 md:py-12 bg-surface-container/40">
          <div className="container-page">
            <div className="max-w-2xl mx-auto text-center mb-6 md:mb-8">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                ĐỘI NGŨ CHUYÊN NGHIỆP
              </span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mt-1">
                Nhà môi giới hàng đầu tại Đà Nẵng
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Các chuyên viên am hiểu từng ngõ ngách thị trường, có chứng chỉ hành nghề và được khách hàng đánh giá cao.
              </p>
            </div>

            {/* Top Showcase: Big photo left + Detailed credentials right (Ảnh 4) */}
            <div className="bg-card border border-border/70 rounded-3xl p-5 md:p-7 shadow-card grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center max-w-5xl mx-auto">
              {/* Left Column: Big portrait photo */}
              <div className="md:col-span-5 relative">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted border border-border/50 shadow-md">
                  <img
                    src={activeAgent.img}
                    alt={activeAgent.name}
                    className="w-full h-full object-cover object-top transition-all duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-teal text-teal-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                      <ShieldCheck className="size-3.5" /> Môi giới xác thực
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Credentials & Bullet points (Ảnh 4) */}
              <div className="md:col-span-7 flex flex-col justify-between h-full py-1">
                <div>
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {activeAgent.honorific}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-foreground mt-1">
                    {activeAgent.name}
                  </h3>
                  <div className="text-xs sm:text-sm text-teal font-semibold mt-1">
                    {activeAgent.role} · {activeAgent.district}
                  </div>

                  {/* Rating row */}
                  <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-0.5 text-orange">
                      {Array.from({ length: activeAgent.rating }).map((_, i) => (
                        <Star key={i} className="size-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-foreground">5.0</span>
                    <span className="text-xs text-muted-foreground">({activeAgent.reviews} đánh giá)</span>
                    <span className="text-muted-foreground/40">•</span>
                    <span className="text-xs font-semibold text-foreground">{activeAgent.experience}</span>
                    <span className="text-muted-foreground/40">•</span>
                    <span className="text-xs text-muted-foreground">{activeAgent.listings} tin đăng</span>
                  </div>

                  {/* Bullet points with dashes (Ảnh 4) */}
                  <ul className="mt-5 space-y-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {activeAgent.bullets.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary font-bold shrink-0">–</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Navigation arrows (Ảnh 4) + Call button */}
                <div className="mt-6 pt-4 border-t border-border/50 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevAgent}
                      className="size-10 rounded-xl border border-border hover:border-primary bg-card hover:bg-primary hover:text-white text-foreground flex items-center justify-center transition-all cursor-pointer shadow-xs"
                      title="Môi giới trước"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextAgent}
                      className="size-10 rounded-xl border border-border hover:border-primary bg-card hover:bg-primary hover:text-white text-foreground flex items-center justify-center transition-all cursor-pointer shadow-xs"
                      title="Môi giới tiếp theo"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                    <span className="text-xs text-muted-foreground ml-2">
                      {activeAgentIndex + 1} / {TOP_AGENTS.length}
                    </span>
                  </div>

                  <Button
                    asChild
                    className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl text-xs sm:text-sm h-10 px-5 gap-1.5"
                  >
                    <a href={`tel:${activeAgent.phone}`}>
                      <Phone className="size-3.5" />
                      Gọi {activeAgent.phone}
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom Row of Thumbnails (Ảnh 4) */}
            <div className="mt-6 max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {TOP_AGENTS.map((agent, idx) => {
                const isActive = idx === activeAgentIndex;
                return (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => setActiveAgentIndex(idx)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${isActive
                        ? "bg-card border-primary ring-2 ring-primary/20 shadow-md scale-[1.02]"
                        : "bg-card/70 border-border/70 hover:border-primary/50 hover:bg-card"
                      }`}
                  >
                    <img
                      src={agent.img}
                      alt={agent.name}
                      className="size-14 sm:size-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs sm:text-sm text-foreground truncate">
                        {agent.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {agent.district}
                      </div>
                      <div className="text-[10px] text-primary font-semibold mt-1">
                        {agent.listings} tin đăng
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Centered CTA Button (Ảnh 4: "Tìm hiểu thêm →") */}
            <div className="text-center mt-6 md:mt-8">
              <Button
                asChild
                className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-8 h-12 rounded-xl text-sm shadow-md gap-2 cursor-pointer"
              >
                <Link to="/moi-gioi">
                  Xem danh bạ toàn bộ môi giới
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* =========================================================
            7. REAL ESTATE & LEGAL NEWS (Khối Tin tức BĐS chuẩn EvondevKit)
        ========================================================= */}
        <NewsSection className="py-10 md:py-12 bg-background" />

        {/* =========================================================
            8. QUICK CONSULTATION LEAD BANNER
        ========================================================= */}
        <section className="py-10 md:py-12 bg-surface-container/30">
          <div className="container-page">
            <div className="bg-gradient-to-r from-primary via-primary to-teal rounded-3xl p-6 md:p-10 text-white shadow-card flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
              <div className="max-w-xl text-center lg:text-left">
                <span className="bg-white/15 text-white font-semibold text-xs px-3 py-1 rounded-full backdrop-blur-xs">
                  Tư vấn trực tiếp 24/7
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold mt-3">
                  Bạn cần tìm bất động sản theo yêu cầu riêng?
                </h2>
                <p className="mt-2 text-sm text-white/85 leading-relaxed">
                  Để lại số điện thoại, đội ngũ chuyên viên Đà Nẵng sẽ lọc giỏ hàng độc quyền phù hợp ngân sách và gửi cho bạn trong 15 phút.
                </p>
              </div>

              {/* Quick Input Form */}
              <form onSubmit={handleQuickLeadSubmit} className="w-full max-w-md bg-white rounded-2xl p-2 sm:p-2.5 shadow-lg flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    required
                    placeholder="Nhập số điện thoại của bạn..."
                    value={quickPhone}
                    onChange={(e) => setQuickPhone(e.target.value)}
                    className="pl-10 h-11 border-none shadow-none text-slate-800 placeholder:text-muted-foreground text-xs sm:text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold h-11 px-6 rounded-xl text-xs sm:text-sm shrink-0 whitespace-nowrap cursor-pointer"
                >
                  {isSubmitting ? "Đang gửi..." : "Nhận tư vấn"}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
