import { createFileRoute, Link } from "@tanstack/react-router";
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
      { title: `${params.slug} — Chi tiết dự án | Da Nang Real Estate` },
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
  { icon: Wine, label: "Sảnh Lounge", sub: "" },
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
  const projectName = "The Landmark Đà Nẵng";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20">
        {/* Breadcrumb */}
        <div className="container-page pt-6">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Trang chủ
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/du-an" className="hover:text-primary">
              Dự án
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium truncate">{slug}</span>
          </nav>
        </div>

        {/* Gallery + Summary */}
        <section className="container-page mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-card bg-muted">
              <img src={hero} alt={projectName} className="h-full w-full object-cover" />
              <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                1 / 18
              </span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[hero, int1, int2, amenity].map((src, i) => (
                <button key={i} className="relative aspect-[4/3] overflow-hidden rounded-md group">
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                  {i === 3 && (
                    <div className="absolute inset-0 bg-black/55 grid place-items-center text-white font-semibold">
                      +14
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <aside className="bg-card rounded-xl shadow-card border border-border/60 p-6 self-start">
            <Badge className="bg-teal text-teal-foreground hover:bg-teal/90">Sắp mở bán</Badge>
            <h1 className="mt-3 text-3xl font-bold leading-tight">{projectName}</h1>
            <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> Sơn Trà, Hải Châu, Đà Nẵng
            </div>

            <dl className="mt-5 space-y-3 text-sm">
              <Row k="Chủ đầu tư" v="Cosmos Group" />
              <Row k="Quy mô" v="3 tháp, 35 tầng" />
              <Row k="Diện tích" v="1.2 ha" />
              <Row k="Loại hình" v="Căn hộ, Penthouse" />
              <Row k="Trạng thái" v="Đang thi công" />
            </dl>

            <Button className="w-full mt-6 h-11 bg-primary hover:bg-primary/90 text-primary-foreground">
              Đăng ký nhận bảng giá
            </Button>
            <Button
              variant="outline"
              className="w-full mt-2 h-11 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Liên hệ Môi giới
            </Button>
          </aside>
        </section>

        {/* Location & Map */}
        <section className="container-page mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Vị trí & Quy hoạch</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tâm điểm kết nối giữa sông Hàn và biển Mỹ Khê.
              </p>
            </div>
            <a
              href="#"
              className="text-sm text-primary font-medium hover:underline whitespace-nowrap"
            >
              Xem trên Google Maps →
            </a>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl overflow-hidden border border-border/60 shadow-card bg-card">
              <div className="relative aspect-[4/3]">
                <img
                  src={planMap}
                  alt="Bản đồ vị trí"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-3 bottom-3 right-3 flex flex-wrap gap-2 text-xs">
                  <span className="bg-white/95 px-2 py-1 rounded shadow">
                    📍 5 phút tới Cầu Rồng
                  </span>
                  <span className="bg-white/95 px-2 py-1 rounded shadow">
                    🏖 10 phút tới biển Mỹ Khê
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-border/60 shadow-card bg-gradient-to-br from-teal/15 to-primary/10 p-6 flex flex-col">
              <div className="text-center text-sm font-semibold text-foreground">
                Quy hoạch 1/500
              </div>
              <div className="text-center text-xs text-muted-foreground">
                Sơ đồ tổ chức không gian tổng thể
              </div>
              <div className="mt-4 flex-1 grid place-items-center">
                <img
                  src={masterplan}
                  alt="Mặt bằng tổng thể"
                  loading="lazy"
                  className="max-h-72 object-contain drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section className="container-page mt-16 text-center">
          <h2 className="text-2xl font-bold">Tiện ích Đặc quyền</h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl mx-auto">
            Tận hưởng cuộc sống thượng lưu với hệ sinh thái tiện ích chuẩn quốc tế ngay trong khuôn
            viên dự án.
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
            {amenities.map((a) => (
              <div
                key={a.label}
                className="bg-card rounded-xl border border-border/60 p-5 hover:shadow-card-hover transition-shadow"
              >
                <div className="mx-auto h-12 w-12 rounded-full bg-accent grid place-items-center text-primary">
                  <a.icon className="h-5 w-5" />
                </div>
                <div className="mt-3 font-semibold text-sm">{a.label}</div>
                {a.sub && <div className="text-xs text-muted-foreground mt-0.5">{a.sub}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* Floorplan */}
        <section className="container-page mt-16">
          <div className="rounded-2xl bg-primary text-primary-foreground p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold">Mặt bằng Điển hình</h2>
              <p className="mt-3 text-white/85 text-sm leading-relaxed">
                Mỗi căn hộ đều tối ưu hóa ánh sáng tự nhiên và thông gió, mỗi căn đều bố trí hài hòa
                công năng thoáng và sang trọng. Thiết kế nội thất cao cấp.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="bg-white text-primary hover:bg-white/90">
                  <Download className="h-4 w-4 mr-2" /> Tải Layout (PDF)
                </Button>
                <Button
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white hover:text-primary"
                >
                  <Eye className="h-4 w-4 mr-2" /> Xem 360 Tour
                </Button>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-xl">
              <img
                src={floorplan}
                alt="Mặt bằng điển hình"
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </section>

        {/* Price + Payment Schedule */}
        <section className="container-page mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold">Bảng giá Dự kiến</h2>
            <div className="mt-4 bg-card rounded-xl border border-border/60 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface-container/70 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="text-left p-3 font-semibold">Loại căn hộ</th>
                    <th className="text-left p-3 font-semibold">Diện tích</th>
                    <th className="text-right p-3 font-semibold">Giá từ (VNĐ)</th>
                  </tr>
                </thead>
                <tbody>
                  {priceRows.map((r) => (
                    <tr key={r.type} className="border-t border-border/60">
                      <td className="p-3 font-medium">{r.type}</td>
                      <td className="p-3 text-muted-foreground">{r.area}</td>
                      <td className="p-3 text-right font-semibold text-primary">{r.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              * Giá chưa bao gồm VAT, KPBT và phụ phí dịch vụ.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold">Lộ trình Thanh toán</h2>
            <ol className="mt-4 space-y-3">
              {schedule.map((s, i) => (
                <li
                  key={i}
                  className="bg-card rounded-lg border border-border/60 p-4 flex gap-3 items-start"
                >
                  <div
                    className={`h-9 w-9 shrink-0 rounded-full grid place-items-center text-xs font-bold ${
                      s.done ? "bg-teal text-teal-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s.done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{s.pct}</div>
                    <div className="text-xs text-muted-foreground whitespace-pre-line mt-0.5">
                      {s.note}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Progress */}
        <section className="container-page mt-16">
          <h2 className="text-2xl font-bold">Tiến độ Thi công</h2>
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-2 gap-3">
              <img
                src={prog1}
                alt="Tiến độ 1"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover rounded-lg"
              />
              <img
                src={prog2}
                alt="Tiến độ 2"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover rounded-lg"
              />
              <img
                src={prog3}
                alt="Tiến độ 3"
                loading="lazy"
                className="col-span-2 aspect-[16/7] w-full object-cover rounded-lg"
              />
              <p className="col-span-2 text-xs text-muted-foreground">
                Cập nhật mới nhất: Công trình đang hoàn thiện phần móng cọc và bắt đầu xây dựng tầng
                hầm. Kiểm tra theo dõi tiến độ bê tông phục vụ thi công thân.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Cột mốc Thời gian</h3>
              <ol className="mt-4 relative border-l-2 border-border pl-5 space-y-6">
                <Milestone
                  date="Q4/T6 2026"
                  title="Khởi công xây dựng"
                  desc="Lễ động thổ thành công với sự tham gia của lãnh đạo thành phố."
                />
                <Milestone
                  date="Q4/T6 2024"
                  title="Cất nóc dự kiến"
                  desc="Hoàn thiện phần thô 35 tầng của các tháp."
                />
                <Milestone
                  date="Q4/T6 2027"
                  title="Bàn giao căn hộ"
                  desc="Cam kết bàn giao và đưa dân vào sinh sống."
                />
              </ol>
            </div>
          </div>
        </section>

        {/* Agents */}
        <section className="container-page mt-16">
          <h2 className="text-2xl font-bold">Môi giới Chuyên nghiệp</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Đội ngũ tư vấn tận tâm giúp quý khách tìm được tổ ấm phù hợp nhất tại The Landmark.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {agents.map((a) => (
              <div
                key={a.name}
                className="bg-card rounded-xl border border-border/60 p-5 shadow-card"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={a.img}
                    alt={a.name}
                    loading="lazy"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-sm">{a.name}</div>
                    <div className="text-xs text-muted-foreground">⭐ 4.9 ({a.deals} reviews)</div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  "{a.note}"
                </p>
                <div className="mt-4 flex gap-2">
                  <Button className="flex-1 h-9 bg-primary hover:bg-primary/90">
                    <Phone className="h-3.5 w-3.5 mr-1.5" /> Liên hệ ngay
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card/60 py-10">
        <div className="container-page grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div className="col-span-2">
            <div className="font-bold text-primary flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Da Nang Coastal Realty
            </div>
            <p className="mt-2 text-muted-foreground text-xs leading-relaxed max-w-sm">
              Sàn giao dịch BĐS đáng tin cậy hàng đầu tại Đà Nẵng. Chúng tôi mang đến những giải
              pháp đầu tư minh bạch và chuyên nghiệp.
            </p>
          </div>
          <div>
            <div className="font-semibold">Khám phá</div>
            <ul className="mt-2 space-y-1 text-muted-foreground text-xs">
              <li>Dự án mới</li>
              <li>Căn hộ ven sông</li>
              <li>Biệt thự biển</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">Liên hệ</div>
            <ul className="mt-2 space-y-1 text-muted-foreground text-xs">
              <li>Hotline: 1900 6868</li>
              <li>Email: info@danangrealty.com</li>
              <li>22 Bạch Đằng, Hải Châu, Đà Nẵng</li>
            </ul>
          </div>
        </div>
        <div className="container-page mt-8 text-xs text-muted-foreground">
          © 2026 Da Nang Coastal Realty.
        </div>
      </footer>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border/60 pb-2 last:border-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-semibold text-right">{v}</dd>
    </div>
  );
}

function Milestone({ date, title, desc }: { date: string; title: string; desc: string }) {
  return (
    <li className="relative">
      <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
      <div className="text-[11px] text-muted-foreground uppercase tracking-wide">{date}</div>
      <div className="font-semibold text-sm mt-0.5">{title}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
    </li>
  );
}
