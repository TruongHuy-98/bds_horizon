import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Search,
  CalendarDays,
  ArrowRight,
  Map as MapIcon,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";

import heroImg from "@/assets/news-hero.jpg";

export const Route = createFileRoute("/tin-tuc/")({
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

function FeaturedHero({ post }: { post?: any }) {
  if (!post) return null;
  return (
    <Link 
      to="/tin-tuc/$slug"
      params={{ slug: post.slug }}
      className="group relative block overflow-hidden rounded-xl shadow-card"
    >
      <img
        src={post.cover_image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60"}
        alt={post.title}
        width={1280}
        height={768}
        className="h-[380px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <span className="mb-3 inline-flex w-fit items-center rounded-md bg-teal px-3 py-1 text-xs font-semibold uppercase tracking-wider">
          {post.category || "Tin tức"}
        </span>
        <h2 className="text-2xl font-bold leading-snug">
          {post.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/85 line-clamp-2">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}

function SideHighlights({ posts }: { posts: any[] }) {
  const highlights = posts.slice(0, 3);
  if (highlights.length === 0) return null;
  return (
    <div className="space-y-4">
      {highlights.map((n) => (
        <Link
          key={n.id}
          to="/tin-tuc/$slug"
          params={{ slug: n.slug }}
          className="group flex gap-4 rounded-lg border border-border bg-card p-3 shadow-card transition-shadow hover:shadow-card-hover"
        >
          <img
            src={n.cover_image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60"}
            alt={n.title}
            width={120}
            height={90}
            loading="lazy"
            className="h-[80px] w-[110px] flex-shrink-0 rounded-md object-cover"
          />
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              {n.category || "Tin tức"}
            </div>
            <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
              {n.title}
            </h3>
            <div className="mt-1 text-xs text-muted-foreground">
              {new Date(n.published_at || n.created_at).toLocaleDateString("vi-VN")}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function LatestNews({ posts }: { posts: any[] }) {
  return (
    <section className="mt-10">
      <div className="mb-5 flex items-center gap-3">
        <span className="block h-5 w-[3px] bg-primary" />
        <h2 className="text-base font-bold uppercase tracking-wider text-foreground">
          Tin mới nhất
        </h2>
      </div>
      {posts.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground border rounded-lg border-dashed p-6">
          Chưa có bài viết nào được đăng tải.
        </div>
      ) : (
        <div className="space-y-5">
          {posts.map((n) => (
            <article
              key={n.id}
              className="grid grid-cols-1 gap-5 rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover sm:grid-cols-[200px_1fr]"
            >
              <Link
                to="/tin-tuc/$slug"
                params={{ slug: n.slug }}
                className="overflow-hidden rounded-lg block h-[150px] sm:h-auto"
              >
                <img
                  src={n.cover_image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60"}
                  alt={n.title}
                  width={400}
                  height={260}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </Link>
              <div className="flex flex-col">
                <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded bg-accent px-2 py-0.5 font-semibold uppercase tracking-wider text-primary">
                    {n.category || "Tin tức"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="size-3.5" /> 
                    {new Date(n.published_at || n.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <Link
                  to="/tin-tuc/$slug"
                  params={{ slug: n.slug }}
                  className="hover:text-primary transition-colors"
                >
                  <h3 className="text-lg font-bold text-foreground line-clamp-2">{n.title}</h3>
                </Link>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{n.excerpt}</p>
                <Link
                  to="/tin-tuc/$slug"
                  params={{ slug: n.slug }}
                  className="mt-3 inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  Đọc chi tiết <ArrowRight className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
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

function MostViewedCard({ posts }: { posts: any[] }) {
  if (posts.length === 0) return null;
  const sorted = [...posts].slice(0, 4);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="mb-4 text-sm font-bold text-foreground">Tin xem nhiều nhất</h3>
      <ol className="space-y-4">
        {sorted.map((t, i) => (
          <li key={t.id} className="flex gap-3">
            <span className="flex-shrink-0 text-sm font-bold text-primary/70 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <Link
              to="/tin-tuc/$slug"
              params={{ slug: t.slug }}
              className="text-sm font-medium leading-snug text-foreground hover:text-primary line-clamp-2"
            >
              {t.title}
            </Link>
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



function NewsPage() {
  const [active, setActive] = useState<Category>("Tất cả");
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if mock database mode is enabled
  const isMock = typeof window !== "undefined" 
    ? localStorage.getItem("bds_mock_admin") === "true" || !import.meta.env.VITE_SUPABASE_URL 
    : true;

  const loadPosts = async () => {
    setLoading(true);
    if (isMock) {
      const localData = localStorage.getItem("mock_news");
      setPosts(localData ? JSON.parse(localData) : []);
    } else {
      try {
        const { data, error } = await supabase
          .from("news_posts")
          .select("*")
          .eq("published", true)
          .order("published_at", { ascending: false });
        
        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to LocalStorage:", err);
        const localData = localStorage.getItem("mock_news");
        setPosts(localData ? JSON.parse(localData) : []);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const filtered = posts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(query.toLowerCase()) || 
                          (p.excerpt && p.excerpt.toLowerCase().includes(query.toLowerCase()));
    const matchesCat = active === "Tất cả" || p.category === active;
    return matchesSearch && matchesCat;
  });

  const featured = filtered[0];
  const listItems = filtered.slice(1);

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

        {loading ? (
          <div className="py-20 text-center text-muted-foreground">
            <div className="animate-spin size-8 border-t-2 border-b-2 border-primary rounded-full mx-auto mb-3"></div>
            Đang tải dữ liệu tin tức...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground border rounded-xl border-dashed p-10">
            Chưa có bài viết nào phù hợp.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            <div>
              <FeaturedHero post={featured} />
              <LatestNews posts={listItems} />
            </div>
            <aside className="space-y-6">
              <SideHighlights posts={posts} />
              <PriceMovementCard />
              <MostViewedCard posts={posts} />
              <PlanningCTA />
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
