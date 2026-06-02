import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  CalendarDays,
  Eye,
  ArrowRight,
  Map as MapIcon,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/site/Header";

import heroImg from "@/assets/news-hero.jpg";
import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";
import feature1 from "@/assets/news-feature-1.jpg";
import feature2 from "@/assets/news-feature-2.jpg";

export const Route = createFileRoute("/tin-tuc")({
  component: NewsPage,
  head: () => ({
    meta: [
      { title: "Tin tức Bất động sản Đà Nẵng — Da Nang Real Estate" },
      {
        name: "description",
        content:
          "Cập nhật tin tức thị trường, quy hoạch, hạ tầng, pháp lý và lời khuyên mua nhà tại Đà Nẵng. Tổng hợp báo cáo và phân tích chuyên sâu.",
      },
      { property: "og:title", content: "Tin tức Bất động sản Đà Nẵng" },
      {
        property: "og:description",
        content: "Tin tức và phân tích thị trường BĐS Đà Nẵng cập nhật hằng tuần.",
      },
      { property: "og:image", content: heroImg },
    ],
  }),
});

type Category =
  | "Tất cả"
  | "Thị trường Đà Nẵng"
  | "Tiến độ Hạ tầng"
  | "Quy hoạch & Pháp lý"
  | "Lời khuyên mua nhà"
  | "Báo cáo thị trường";

const CATEGORIES: Category[] = [
  "Tất cả",
  "Thị trường Đà Nẵng",
  "Tiến độ Hạ tầng",
  "Quy hoạch & Pháp lý",
  "Lời khuyên mua nhà",
  "Báo cáo thị trường",
];

function CategoryTabs({ active, onChange }: { active: Category; onChange: (c: Category) => void }) {
  return (
    <div className="border-b border-border">
      <div className="container-page flex items-center justify-between gap-6 overflow-x-auto">
        <nav className="flex items-center gap-7 py-4">
          {CATEGORIES.map((c) => {
            const isActive = c === active;
            return (
              <button
                key={c}
                onClick={() => onChange(c)}
                className={`whitespace-nowrap text-sm transition-colors ${
                  isActive
                    ? "font-semibold text-primary border-b-2 border-primary pb-3 -mb-[17px]"
                    : "text-foreground/70 hover:text-primary"
                }`}
              >
                {c}
              </button>
            );
          })}
        </nav>
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground py-4">
          <CalendarDays className="size-4" />
          <span>Thứ Ba, 22 Tháng 10, 2024</span>
        </div>
      </div>
    </div>
  );
}

function FeaturedHero() {
  return (
    <article className="group relative overflow-hidden rounded-xl shadow-card">
      <img
        src={heroImg}
        alt="Đà Nẵng đón sóng đầu tư"
        width={1280}
        height={768}
        className="h-[380px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <span className="mb-3 inline-flex w-fit items-center rounded-md bg-teal px-3 py-1 text-xs font-semibold uppercase tracking-wider">
          Tiêu điểm
        </span>
        <h2 className="text-2xl font-bold leading-snug">
          Đà Nẵng đón sóng đầu tư từ các tập đoàn công nghệ toàn cầu trong Q4/2024
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/85">
          Sự dịch chuyển của dòng vốn FDI vào lĩnh vực công nghệ cao đang tạo ra áp lực tích cực lên
          phân khúc bất động sản cao cấp và nhà ở chuyên gia tại khu vực phía Nam...
        </p>
      </div>
    </article>
  );
}

const sideHighlights = [
  {
    cat: "Quy hoạch",
    title: "Công bố quy hoạch phân khu ven sông Hàn đến năm 2030",
    time: "2 giờ trước",
    img: news1,
  },
  {
    cat: "Thị trường",
    title: "Lãi suất vay mua nhà giảm sâu: Thời điểm vàng để xuống tiền?",
    time: "5 giờ trước",
    img: news2,
  },
  {
    cat: "Hạ tầng",
    title: "Tiến độ hầm chui nút giao phía Tây cầu Rồng tháng 10/2024",
    time: "Hôm qua",
    img: news3,
  },
];

function SideHighlights() {
  return (
    <div className="space-y-4">
      {sideHighlights.map((n) => (
        <a
          key={n.title}
          href="#"
          className="group flex gap-4 rounded-lg border border-border bg-card p-3 shadow-card transition-shadow hover:shadow-card-hover"
        >
          <img
            src={n.img}
            alt={n.title}
            width={120}
            height={90}
            loading="lazy"
            className="h-[80px] w-[110px] flex-shrink-0 rounded-md object-cover"
          />
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              {n.cat}
            </div>
            <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
              {n.title}
            </h3>
            <div className="mt-1 text-xs text-muted-foreground">{n.time}</div>
          </div>
        </a>
      ))}
    </div>
  );
}

const latestNews = [
  {
    cat: "Phân tích",
    date: "22/10/2024",
    views: "1.2k",
    title: "Giải mã sức hút của bất động sản nghỉ dưỡng phía Nam Đà Nẵng",
    desc: "Với đường bờ biển tuyệt đẹp và sự hiện diện của các khu nghỉ dưỡng 5 sao quốc tế, khu vực ven biển Ngũ Hành Sơn đang trở thành tâm điểm của dòng vốn đầu tư dài hạn...",
    img: feature1,
  },
  {
    cat: "Lời khuyên",
    date: "21/10/2024",
    views: "850",
    title: "5 lưu ý pháp lý quan trọng khi mua đất nền dự án tại Đà Nẵng",
    desc: "Kiểm tra quy hoạch 1/500, xác minh tiến độ thực tế và uy tín chủ đầu tư là những bước không thể thiếu để bảo vệ dòng tiền của bạn trong giai đoạn thị trường hiện nay...",
    img: feature2,
  },
];

function LatestNews() {
  return (
    <section className="mt-10">
      <div className="mb-5 flex items-center gap-3">
        <span className="block h-5 w-[3px] bg-primary" />
        <h2 className="text-base font-bold uppercase tracking-wider text-foreground">
          Tin mới nhất
        </h2>
      </div>
      <div className="space-y-5">
        {latestNews.map((n) => (
          <article
            key={n.title}
            className="grid grid-cols-1 gap-5 rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover sm:grid-cols-[200px_1fr]"
          >
            <img
              src={n.img}
              alt={n.title}
              width={400}
              height={260}
              loading="lazy"
              className="h-[150px] w-full rounded-lg object-cover sm:h-full"
            />
            <div className="flex flex-col">
              <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="rounded bg-accent px-2 py-0.5 font-semibold uppercase tracking-wider text-primary">
                  {n.cat}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="size-3.5" /> {n.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="size-3.5" /> {n.views}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground">{n.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{n.desc}</p>
              <a
                href="#"
                className="mt-3 inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Đọc chi tiết <ArrowRight className="size-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <Button
          variant="outline"
          className="rounded-md border-primary text-primary hover:bg-accent"
        >
          XEM THÊM TIN TỨC
        </Button>
      </div>
    </section>
  );
}

const priceMovement = [
  { area: "Quận Hải Châu", price: "120 - 250tr/m²", change: -0.5 },
  { area: "Quận Sơn Trà", price: "80 - 180tr/m²", change: -1.2 },
  { area: "Ngũ Hành Sơn", price: "45 - 120tr/m²", change: -2.5 },
];

function PriceMovementCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Biến động giá đất</h3>
        <span className="rounded bg-teal/10 px-2 py-1 text-xs font-semibold text-teal">
          T10/2024
        </span>
      </div>
      <div className="space-y-3">
        {priceMovement.map((p) => (
          <div
            key={p.area}
            className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0 last:pb-0"
          >
            <span className="text-sm text-foreground">{p.area}</span>
            <div className="text-right">
              <div className="text-sm font-semibold text-foreground">{p.price}</div>
              <div className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
                {p.change < 0 ? (
                  <TrendingDown className="size-3" />
                ) : (
                  <TrendingUp className="size-3" />
                )}
                {p.change > 0 ? "+" : ""}
                {p.change}%
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs italic text-muted-foreground">
        * Dữ liệu tổng hợp từ các giao dịch thực tế trên sàn.
      </p>
    </div>
  );
}

const mostViewed = [
  "Cập nhật tiến độ dự án căn hộ Sun Cosmo Residence tháng 10",
  "Đà Nẵng phê duyệt dự án nghỉ dưỡng 2000 tỷ tại Hòa Vang",
  "Làn sóng chuyển nhượng khách sạn ven biển tăng mạnh",
  "Bản đồ quy hoạch giao thông Đà Nẵng mới nhất 2024",
];

function MostViewedCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="mb-4 text-sm font-bold text-foreground">Tin xem nhiều nhất</h3>
      <ol className="space-y-4">
        {mostViewed.map((t, i) => (
          <li key={t} className="flex gap-3">
            <span className="flex-shrink-0 text-sm font-bold text-primary/70 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <a
              href="#"
              className="text-sm font-medium leading-snug text-foreground hover:text-primary"
            >
              {t}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

function PlanningCTA() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-primary p-6 text-center text-primary-foreground shadow-card">
      <div
        aria-hidden
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative">
        <MapIcon className="mx-auto size-8 opacity-90" />
        <h3 className="mt-3 text-sm font-bold uppercase tracking-wider">Tra cứu quy hoạch ngay</h3>
        <p className="mt-2 text-xs text-white/80">
          Kiểm tra thông tin quy hoạch từng thửa đất tại Đà Nẵng hoàn toàn miễn phí.
        </p>
        <Button asChild className="mt-4 rounded-full bg-teal text-teal-foreground hover:bg-teal/90">
          <Link to="/check-quy-hoach">XEM BẢN ĐỒ</Link>
        </Button>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface-container">
      <div className="container-page grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
        <div>
          <div className="text-sm font-bold text-primary">DaNang Estates</div>
          <p className="mt-3 text-xs text-muted-foreground">
            Nền tảng bất động sản hàng đầu khu vực miền Trung, kết nối nhà đầu tư với những cơ hội
            tiềm năng nhất.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Dịch vụ</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li>Mua bán nhà đất</li>
            <li>Thuê &amp; Cho thuê</li>
            <li>Tư vấn đầu tư</li>
            <li>Thẩm định giá</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Hỗ trợ</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li>Về chúng tôi</li>
            <li>Điều khoản sử dụng</li>
            <li>Chính sách bảo mật</li>
            <li>Liên hệ quảng cáo</li>
            <li>Sitemap</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Đăng ký bản tin</h4>
          <p className="mb-3 text-xs text-muted-foreground">
            Nhận báo cáo thị trường Đà Nẵng hàng tuần qua email.
          </p>
          <form className="flex gap-2">
            <Input placeholder="Email của bạn" className="h-9 text-sm" />
            <Button className="h-9 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
              Gửi
            </Button>
          </form>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © 2024 DaNang Estates. Toàn bộ thông tin được bảo mật và kiểm chứng.
      </div>
    </footer>
  );
}

function NewsPage() {
  const [active, setActive] = useState<Category>("Tất cả");
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CategoryTabs active={active} onChange={setActive} />

      <main className="container-page py-8">
        {/* search bar (optional, subtle) */}
        <div className="mb-6 flex items-center justify-end">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm tin tức..."
              className="h-9 pl-9 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <FeaturedHero />
            <LatestNews />
          </div>
          <aside className="space-y-6">
            <SideHighlights />
            <PriceMovementCard />
            <MostViewedCard />
            <PlanningCTA />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
