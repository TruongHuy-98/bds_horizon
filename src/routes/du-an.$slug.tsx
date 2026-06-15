import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  MapPin,
  Download,
  Eye,
  Waves,
  Trees,
  Baby,
  Dumbbell,
  Wine,
  Phone,
  MessageCircle,
  Building2,
  CheckCircle2,
  Circle,
  ChevronRight,
  Star,
  Share2,
  Heart,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/site/Header";

import hero from "@/assets/detail-hero.jpg";
import int1 from "@/assets/detail-interior-1.jpg";
import int2 from "@/assets/detail-interior-2.jpg";
import amenity from "@/assets/detail-amenity.jpg";
import floorplan from "@/assets/detail-floorplan.jpg";
import masterplan from "@/assets/detail-masterplan.jpg";
import prog1 from "@/assets/detail-progress-1.jpg";
import prog2 from "@/assets/detail-progress-2.jpg";
import prog3 from "@/assets/detail-progress-3.jpg";
import planMap from "@/assets/planning-map.jpg";
import agent1 from "@/assets/agent-1.jpg";
import agent2 from "@/assets/agent-2.jpg";
import agent3 from "@/assets/agent-3.jpg";

export const Route = createFileRoute("/du-an/$slug")({
  component: ProjectDetailPage,
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.toUpperCase().replace(/-/g, " ")} — Chi tiết dự án | Da Nang Real Estate` },
      {
        name: "description",
        content:
          "Thông tin chi tiết dự án: vị trí, tiện ích, mặt bằng, tiến độ thi công và bảng giá dự kiến tại Đà Nẵng.",
      },
      { property: "og:image", content: hero },
    ],
  }),
});

const amenities = [
  { icon: Waves, label: "Hồ bơi vô cực", sub: "Tầng R" },
  { icon: Trees, label: "Công viên trung tâm", sub: "1.200 m²" },
  { icon: Baby, label: "Kids Club", sub: "Khu vui chơi trẻ em" },
  { icon: Dumbbell, label: "Gym & Spa", sub: "Tầng 5" },
  { icon: Wine, label: "Sảnh Lounge", sub: "Thượng lưu" },
];

const priceRows = [
  { type: "Căn hộ 1 Phòng ngủ", area: "54 – 60 m²", price: "3.2 – 3.8 Tỷ" },
  { type: "Căn hộ 2 Phòng ngủ", area: "70 – 85 m²", price: "4.5 – 6.0 Tỷ" },
  { type: "Căn hộ 3 Phòng ngủ", area: "115 – 131 m²", price: "7.5 – 9.2 Tỷ" },
  { type: "Penthouse & Duplex", area: "250+ m²", price: "Liên hệ" },
];

const schedule = [
  { pct: "Đặt chỗ (Booking)", note: "100.000.000 VNĐ / căn hộ", done: true },
  { pct: "10%", note: "Đặt cọc (Hợp đồng cọc)\nSau 7 ngày kể từ ký Booking", done: true },
  { pct: "20%", note: "Ký hợp đồng mua bán\nDự kiến Q1/2026", done: true },
  { pct: "Thanh toán theo tiến độ", note: "Chia làm 12 đợt từ Q1 – 2026 đến khi đủ", done: false },
  { pct: "5%", note: "Bàn giao căn hộ\nThanh toán 25% + 2% Phí bảo trì", done: false },
];

const agents = [
  {
    name: "Nguyễn Minh Quân",
    img: agent1,
    deals: "152",
    note: "Hơn 8 năm kinh nghiệm trong phân khúc bất động sản cao cấp tại Đà Nẵng.",
  },
  {
    name: "Trần Thu Hà",
    img: agent2,
    deals: "98",
    note: "Chuyên gia về các dự án ven biển, tận tâm và am hiểu pháp lý các dự án Sun Group, Vin.",
  },
  {
    name: "Lê Anh Tuấn",
    img: agent3,
    deals: "176",
    note: "Tư vấn chuyên sâu sản phẩm The Landmark — phân tích đầu tư cho khách quốc tế.",
  },
];

function ProjectDetailPage() {
  const { slug } = Route.useParams();
  const projectName = "The Landmark Da Nang";
  const [activeSection, setActiveSection] = useState("gallery");

  const sections = [
    { id: "gallery", label: "Overview" },
    { id: "map", label: "Vị trí & Quy hoạch" },
    { id: "amenities", label: "Tiện ích" },
    { id: "floorplan", label: "Mặt bằng" },
    { id: "pricing", label: "Bảng giá" },
    { id: "progress", label: "Tiến độ" },
    { id: "broker", label: "Môi giới" },
  ];

  useEffect(() => {
    const handleScrollEvent = () => {
      const scrollPos = window.scrollY + 120;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= scrollPos && el.offsetTop + el.offsetHeight > scrollPos) {
          setActiveSection(section.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScrollEvent);
    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = el.offsetTop - 100;
      window.scrollTo({ top: offset, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Header />

      {/* In-page sticky navigation subheader */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-border/50 shadow-sm hidden md:block">
        <div className="container-page flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-sm font-bold text-primary tracking-tight">
              Da Nang Coastal Estates
            </span>
            <div className="h-4 w-px bg-border/60" />
            <nav className="flex items-center gap-6">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`text-xs font-semibold uppercase tracking-wider transition-colors py-4 border-b-2 ${
                    activeSection === s.id
                      ? "text-primary border-primary"
                      : "text-muted-foreground/80 border-transparent hover:text-primary"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </div>
          <div>
            <Button
              onClick={() => scrollToSection("pricing")}
              className="bg-orange hover:bg-orange/90 text-orange-foreground text-xs font-bold px-5 h-9 rounded-md transition-all shadow-sm"
            >
              Nhận bảng giá
            </Button>
          </div>
        </div>
      </div>

      <main className="pb-24">
        {/* Breadcrumb */}
        <div className="container-page pt-6">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
            <Link to="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="h-3 w-3 opacity-60" />
            <Link to="/du-an" className="hover:text-primary transition-colors">
              Dự án
            </Link>
            <ChevronRight className="h-3 w-3 opacity-60" />
            <span className="text-foreground font-semibold truncate uppercase">
              {slug.replace(/-/g, " ")}
            </span>
          </nav>
        </div>

        {/* Gallery + Summary */}
        <section id="gallery" className="container-page mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8 scroll-mt-24">
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-card bg-muted group border border-border/40">
              <img
                src={hero}
                alt={projectName}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full shadow-lg">
                1 / 18 ảnh
              </span>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-white/90 shadow backdrop-blur-sm hover:bg-white text-muted-foreground hover:text-foreground">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-white/90 shadow backdrop-blur-sm hover:bg-white text-muted-foreground hover:text-red-500">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[hero, int1, int2, amenity].map((src, i) => (
                <button
                  key={i}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl group border border-border/40 hover:border-primary/50 transition-colors shadow-sm"
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  {i === 3 && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] grid place-items-center text-white text-sm font-bold tracking-wide">
                      +14 Ảnh
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <aside className="bg-card rounded-2xl shadow-card border border-border/50 p-6 lg:p-7 flex flex-col justify-between self-start">
            <div>
              <div className="flex items-center justify-between">
                <Badge className="bg-accent/40 text-primary hover:bg-accent/50 border border-primary/10 px-3 py-1 font-semibold text-xs rounded-full">
                  Sắp mở bán
                </Badge>
                <div className="flex items-center gap-1 text-xs text-orange font-bold">
                  <Sparkles className="h-3.5 w-3.5 fill-orange" />
                  Nổi bật
                </div>
              </div>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight leading-tight text-primary">
                {projectName}
              </h1>
              <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <MapPin className="h-4 w-4 text-teal shrink-0" /> Sơn Trà, Hải Châu, Đà Nẵng
              </div>

              <div className="h-px bg-border/60 my-6" />

              <dl className="space-y-4 text-sm">
                <Row k="Chủ đầu tư" v="Cosmos Group" />
                <Row k="Quy mô" v="2 tháp, 39 tầng" />
                <Row k="Diện tích" v="1.2 ha" />
                <Row k="Loại hình" v="Căn hộ, Penthouse" />
                <Row k="Trạng thái" v="Đang thi công" />
              </dl>
            </div>

            <div className="mt-8 space-y-3">
              <Button
                onClick={() => scrollToSection("pricing")}
                className="w-full h-12 bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl transition-all shadow-md shadow-primary/10 hover:shadow-lg"
              >
                Đăng ký nhận bảng giá
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollToSection("broker")}
                className="w-full h-12 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30 font-semibold rounded-xl transition-all"
              >
                Liên hệ Môi giới
              </Button>
            </div>
          </aside>
        </section>

        {/* Location & Map */}
        <section id="map" className="container-page mt-20 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/50 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-primary">Vị trí & Quy hoạch</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tâm điểm kết nối giữa sông Hàn và biển Mỹ Khê.
              </p>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-teal hover:text-teal/80 hover:underline inline-flex items-center gap-1 whitespace-nowrap uppercase tracking-wider"
            >
              Xem trên Google Maps <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl overflow-hidden border border-border/50 shadow-card bg-card aspect-[4/3] relative group">
              <img
                src={planMap}
                alt="Bản đồ vị trí"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              />
              <div className="absolute left-4 bottom-4 right-4 flex flex-wrap gap-2">
                <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-primary shadow-lg border border-border/30">
                  📍 5 phút tới Cầu Rồng
                </span>
                <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-primary shadow-lg border border-border/30">
                  🏖 10 phút tới biển Mỹ Khê
                </span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-border/50 shadow-card bg-gradient-to-br from-teal/5 to-primary/5 p-6 lg:p-8 flex flex-col justify-between">
              <div className="text-center">
                <div className="text-sm font-bold text-primary tracking-wide uppercase">
                  Quy hoạch 1/500
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Sơ đồ tổ chức không gian kiến trúc cảnh quan
                </div>
              </div>
              <div className="mt-6 flex-1 grid place-items-center">
                <img
                  src={masterplan}
                  alt="Mặt bằng tổng thể"
                  loading="lazy"
                  className="max-h-64 md:max-h-72 object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section id="amenities" className="container-page mt-20 text-center scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-primary">Tiện ích Đặc quyền</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
            Tận hưởng cuộc sống thượng lưu với hệ sinh thái tiện ích chuẩn quốc tế ngay trong khuôn
            viên dự án.
          </p>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {amenities.map((a) => (
              <div
                key={a.label}
                className="bg-card rounded-2xl border border-border/50 p-6 hover:shadow-card-hover hover:border-primary/20 transition-all group flex flex-col items-center"
              >
                <div className="h-14 w-14 rounded-full bg-accent/40 text-primary grid place-items-center group-hover:scale-110 transition-transform shadow-inner">
                  <a.icon className="h-6 w-6 stroke-[1.75]" />
                </div>
                <div className="mt-4 font-bold text-sm text-foreground">{a.label}</div>
                {a.sub && (
                  <div className="text-xs text-muted-foreground mt-1 font-medium bg-muted/65 px-2.5 py-0.5 rounded-full">
                    {a.sub}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Floorplan */}
        <section id="floorplan" className="container-page mt-20 scroll-mt-24">
          <div className="rounded-3xl bg-primary text-primary-foreground p-8 lg:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center shadow-xl shadow-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight">Mặt bằng Điển hình</h2>
              <p className="text-white/80 text-sm leading-relaxed max-w-md">
                Mỗi căn hộ đều tối ưu hóa ánh sáng tự nhiên và thông gió, mỗi căn đều bố trí hài hòa
                công năng thoáng và sang trọng. Thiết kế nội thất cao cấp mang đến trải nghiệm sống trọn vẹn nhất.
              </p>
              <div className="flex flex-wrap gap-3.5 pt-2">
                <Button className="bg-white text-primary hover:bg-white/90 font-semibold h-11 px-5 rounded-xl shadow transition-all hover:scale-[1.02]">
                  <Download className="h-4 w-4 mr-2" /> Tải Layout (PDF)
                </Button>
                <Button
                  className="border border-white/30 bg-transparent text-white hover:bg-white hover:text-primary font-semibold h-11 px-5 rounded-xl transition-all hover:scale-[1.02] shadow-sm"
                >
                  <Eye className="h-4 w-4 mr-2" /> Xem 360 Tour
                </Button>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-2xl relative z-10 transition-transform duration-500 hover:scale-[1.02]">
              <img
                src={floorplan}
                alt="Mặt bằng điển hình"
                loading="lazy"
                className="w-full max-h-80 object-contain mx-auto"
              />
            </div>
          </div>
        </section>

        {/* Price + Payment Schedule */}
        <section id="pricing" className="container-page mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 scroll-mt-24">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Bảng giá Dự kiến</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              * Mức giá mang tính chất tham khảo tại thời điểm hiện tại và chưa bao gồm VAT.
            </p>
            <div className="mt-6 bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-muted/70 text-[11px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border/50">
                  <tr>
                    <th className="text-left p-4 font-bold">Loại căn hộ</th>
                    <th className="text-left p-4 font-bold">Diện tích</th>
                    <th className="text-right p-4 font-bold">Giá từ (VNĐ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {priceRows.map((r) => (
                    <tr key={r.type} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-bold text-foreground">{r.type}</td>
                      <td className="p-4 text-muted-foreground font-medium">{r.area}</td>
                      <td className="p-4 text-right font-extrabold text-primary">{r.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Lộ trình Thanh toán</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Chính sách bán hàng và hỗ trợ tài chính hấp dẫn từ ngân hàng bảo lãnh.
            </p>
            <ol className="mt-6 space-y-4">
              {schedule.map((s, i) => (
                <li
                  key={i}
                  className="bg-card rounded-2xl border border-border/50 p-4 lg:p-5 flex gap-4 items-start shadow-sm hover:border-primary/20 transition-all"
                >
                  <div
                    className={`h-10 w-10 shrink-0 rounded-full grid place-items-center text-xs font-bold transition-colors shadow-sm ${
                      s.done
                        ? "bg-teal/10 text-teal border border-teal/20"
                        : "bg-muted text-muted-foreground border border-border/50"
                    }`}
                  >
                    {s.done ? (
                      <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
                    ) : (
                      <span className="text-[11px]">{s.pct}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-foreground leading-snug">{s.done ? s.pct : "Tiến độ đợt " + (i + 1)}</div>
                    <div className="text-xs text-muted-foreground whitespace-pre-line mt-1 leading-relaxed">
                      {s.note}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Progress */}
        <section id="progress" className="container-page mt-20 scroll-mt-24">
          <div className="border-b border-border/50 pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-primary">Tiến độ Thi công</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Hình ảnh thực tế tại công trường dự án The Landmark.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src={prog1}
                  alt="Tiến độ 1"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover rounded-2xl border border-border/30 shadow-sm transition-transform duration-500 hover:scale-[1.01]"
                />
                <img
                  src={prog2}
                  alt="Tiến độ 2"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover rounded-2xl border border-border/30 shadow-sm transition-transform duration-500 hover:scale-[1.01]"
                />
              </div>
              <img
                src={prog3}
                alt="Tiến độ 3"
                loading="lazy"
                className="w-full aspect-[16/7] object-cover rounded-2xl border border-border/30 shadow-sm transition-transform duration-500 hover:scale-[1.005]"
              />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cập nhật mới nhất: Công trình đang hoàn thiện phần móng cọc và bắt đầu xây dựng tầng
                hầm. Đội ngũ kỹ sư luôn giám sát chặt chẽ chất lượng bê tông cốt thép phục vụ thi công thân tháp.
              </p>
            </div>
            <div className="bg-card rounded-2xl border border-border/50 p-6 lg:p-7 shadow-sm">
              <h3 className="font-bold text-sm text-primary tracking-wide uppercase">Cột mốc Thời gian</h3>
              <ol className="mt-6 relative border-l-2 border-border/70 pl-6 space-y-8">
                <Milestone
                  date="Q4/T6 2023"
                  title="Khởi công xây dựng"
                  desc="Lễ động thổ thành công với sự tham gia của lãnh đạo thành phố."
                />
                <Milestone
                  date="Q4/T6 2024"
                  title="Cất nóc dự kiến"
                  desc="Hoàn thiện phần thô 39 tầng của các tháp."
                />
                <Milestone
                  date="Q4/T6 2027"
                  title="Bàn giao căn hộ"
                  desc="Cam kết bàn giao và đưa dân vào sinh sống ổn định."
                />
              </ol>
            </div>
          </div>
        </section>

        {/* Agents */}
        <section id="broker" className="container-page mt-20 scroll-mt-24">
          <div className="border-b border-border/50 pb-4 text-center md:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-primary">Môi giới Chuyên nghiệp</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Đội ngũ tư vấn tận tâm giúp quý khách tìm được tổ ấm phù hợp nhất tại The Landmark.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {agents.map((a) => (
              <div
                key={a.name}
                className="bg-card rounded-2xl border border-border/50 p-6 shadow-card hover:shadow-card-hover hover:border-primary/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full overflow-hidden border border-primary/10 shadow-sm shrink-0">
                      <img
                        src={a.img}
                        alt={a.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">{a.name}</div>
                      <div className="text-xs text-orange font-bold flex items-center gap-1 mt-0.5">
                        <Star className="h-3.5 w-3.5 fill-orange" /> 4.9 ({a.deals} reviews)
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground leading-relaxed italic">
                    "{a.note}"
                  </p>
                </div>
                <div className="mt-6 flex gap-2.5">
                  <Button className="flex-1 h-10 bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl text-xs transition-all">
                    <Phone className="h-3.5 w-3.5 mr-1.5" /> Liên hệ ngay
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10 border-primary/20 text-primary hover:bg-primary/5 rounded-xl">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-muted/30 py-16">
        <div className="container-page grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
          <div className="md:col-span-2 space-y-4">
            <div className="font-extrabold text-primary flex items-center gap-2 text-base">
              <Building2 className="h-5 w-5 text-teal" /> Da Nang Coastal Estates
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
              Sàn giao dịch BĐS đáng tin cậy hàng đầu tại Đà Nẵng. Chúng tôi mang đến những giải
              pháp đầu tư minh bạch, chính sách bán hàng tối ưu và uy tín hàng đầu.
            </p>
          </div>
          <div className="space-y-4">
            <div className="font-bold text-foreground">Khám phá</div>
            <ul className="space-y-2 text-muted-foreground text-xs font-medium">
              <li>
                <Link to="/du-an" className="hover:text-primary transition-colors">Dự án mới</Link>
              </li>
              <li>
                <Link to="/du-an" className="hover:text-primary transition-colors">Căn hộ ven sông</Link>
              </li>
              <li>
                <Link to="/du-an" className="hover:text-primary transition-colors">Biệt thự biển</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="font-bold text-foreground">Liên hệ</div>
            <ul className="space-y-2 text-muted-foreground text-xs font-medium leading-relaxed">
              <li>Hotline: 1900 6868</li>
              <li>Email: info@danangrealty.com</li>
              <li>Địa chỉ: 22 Bạch Đằng, Hải Châu, Đà Nẵng</li>
            </ul>
          </div>
        </div>
        <div className="container-page mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/80 font-medium">
          <div>
            © 2026 Da Nang Coastal Estates. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
      <dt className="text-muted-foreground/90 font-medium">{k}</dt>
      <dd className="font-bold text-foreground text-right">{v}</dd>
    </div>
  );
}

function Milestone({ date, title, desc }: { date: string; title: string; desc: string }) {
  return (
    <li className="relative">
      <span className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-background shadow-sm" />
      <div className="text-[10px] font-bold text-teal uppercase tracking-wider">{date}</div>
      <div className="font-bold text-sm text-foreground mt-1">{title}</div>
      <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</div>
    </li>
  );
}
