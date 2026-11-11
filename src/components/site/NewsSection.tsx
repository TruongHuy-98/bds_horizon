import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, ArrowRight, Newspaper, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  cover_image: string;
  published_at: string;
  created_at: string;
}

// Mock news data — realistic Đà Nẵng real estate content matching 2026 legal & market updates
const MOCK_NEWS: NewsPost[] = [
  {
    id: "1",
    title: "Hướng dẫn chi tiết quy trình sang tên sổ đỏ tại Đà Nẵng mới nhất 2026",
    slug: "quy-trinh-sang-ten-so-do-da-nang-2026",
    excerpt:
      "Toàn bộ hồ sơ, biểu phí, thuế thu nhập cá nhân, lệ phí trước bạ và quy trình 4 bước sang tên Giấy chứng nhận quyền sử dụng đất tại Văn phòng Đăng ký đất đai.",
    category: "Pháp lý",
    cover_image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&auto=format&fit=crop&q=80",
    published_at: "2026-10-05T08:00:00Z",
    created_at: "2026-10-05T08:00:00Z",
  },
  {
    id: "2",
    title: "5 Rủi ro pháp lý cần lưu ý khi mua nhà đất dự án và cách phòng tránh",
    slug: "5-rui-ro-phap-ly-khi-mua-nha-dat-du-an",
    excerpt:
      "Những bẫy pháp lý thường gặp như dự án chưa nghiệm thu, thế chấp ngân hàng và cách kiểm tra quy hoạch trước khi đặt cọc.",
    category: "Pháp lý",
    cover_image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
    published_at: "2026-10-05T07:30:00Z",
    created_at: "2026-10-05T07:30:00Z",
  },
  {
    id: "3",
    title: "Điểm mới Luật Đất đai về bảng giá đất thị trường và điều kiện cấp Giấy chứng nhận",
    slug: "diem-moi-luat-dat-dai-bang-gia-dat-thi-truong",
    excerpt:
      "Quy định bỏ khung giá đất, áp dụng bảng giá đất sát giá thị trường và những tác động trực tiếp đến tiền sử dụng đất tại Đà Nẵng.",
    category: "Pháp lý",
    cover_image:
      "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=600&auto=format&fit=crop&q=80",
    published_at: "2026-10-03T09:00:00Z",
    created_at: "2026-10-03T09:00:00Z",
  },
  {
    id: "4",
    title: "Thị trường Bất động sản Đà Nẵng quý 2/2026 tăng trưởng tích cực",
    slug: "thi-truong-bds-da-nang-quy-2-2026-tang-truong",
    excerpt:
      "Thanh khoản phân khúc căn hộ và đất nền sinh thái ven sông bứt phá với hơn 1.800 giao dịch thành công trong quý vừa qua.",
    category: "Thị trường BĐS",
    cover_image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=80",
    published_at: "2026-06-22T08:00:00Z",
    created_at: "2026-06-22T08:00:00Z",
  },
  {
    id: "5",
    title: "Đà Nẵng công bố bản đồ quy hoạch phân khu đô thị mới đến năm 2030",
    slug: "da-nang-cong-bo-ban-do-quy-hoach-phan-khu-2030",
    excerpt:
      "Chi tiết 12 phân khu chức năng được số hóa đồng bộ, tạo hành lang pháp lý minh bạch cho các nhà đầu tư chiến lược.",
    category: "Quy hoạch & Pháp lý",
    cover_image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80",
    published_at: "2026-06-21T07:00:00Z",
    created_at: "2026-06-21T07:00:00Z",
  },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const d = new Date(dateStr);
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return "Hôm nay";
  if (diffDays === 1) return "Hôm qua";
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return formatDate(dateStr);
}

const CATEGORY_COLORS: Record<string, string> = {
  "Thị trường BĐS": "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  "Thị trường Đà Nẵng": "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  "Tiến độ Hạ tầng": "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  "Quy hoạch & Pháp lý": "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
  "Lời khuyên mua nhà": "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  "Báo cáo thị trường": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  "Pháp lý": "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] ?? "bg-accent text-accent-foreground";
}

export function NewsSection() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      // Try Supabase first, fallback to mock
      const isMock =
        typeof window !== "undefined"
          ? localStorage.getItem("bds_mock_admin") === "true" || !import.meta.env.VITE_SUPABASE_URL
          : true;

      if (isMock) {
        const localData = localStorage.getItem("mock_news");
        const stored: NewsPost[] = localData ? JSON.parse(localData) : [];
        setPosts(stored.length > 0 ? stored : MOCK_NEWS);
      } else {
        try {
          const { data, error } = await supabase
            .from("news_posts")
            .select("*")
            .eq("published", true)
            .order("published_at", { ascending: false })
            .limit(5);
          if (error) throw error;
          setPosts(data && data.length > 0 ? (data as any as NewsPost[]) : MOCK_NEWS);
        } catch {
          setPosts(MOCK_NEWS);
        }
      }
      setLoading(false);
    };

    loadPosts();
  }, []);

  const displayPosts = posts.length > 0 ? posts : MOCK_NEWS;
  const featuredPost = displayPosts[0];
  const listPosts = displayPosts.slice(1, 5);

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-surface-container/40">
        <div className="container-page flex justify-center py-20">
          <div className="animate-spin size-8 border-t-2 border-b-2 border-primary rounded-full" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-surface-container/40">
      <div className="container-page">
        {/* Section header */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/10 text-teal text-xs font-semibold mb-2.5">
              <Newspaper className="h-3.5 w-3.5" />
              Thị trường & Pháp lý
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              Tin tức bất động sản
            </h2>
            <p className="mt-1.5 text-muted-foreground text-xs md:text-sm">
              Cập nhật thị trường, quy hoạch và lời khuyên đầu tư mới nhất.
            </p>
          </div>
          <Link
            to="/tin-tuc"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:gap-2 transition-all whitespace-nowrap shrink-0"
          >
            Xem thêm
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 2-column layout: 7 cols (Left) + 5 cols (Right) with items-stretch for 100% EQUAL height and flush alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT — Featured Article (7 cols) */}
          {featuredPost && (
            <div className="lg:col-span-7 flex flex-col">
              {/* Symmetrical column header so top lines align with the right column */}
              <div className="flex items-center gap-2 mb-2.5">
                <span className="h-3.5 w-1 rounded-full bg-teal block" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Tiêu điểm chuyên sâu
                </span>
              </div>

              <Link
                to="/tin-tuc/$slug"
                params={{ slug: featuredPost.slug }}
                className="group relative flex-1 min-h-[380px] sm:min-h-[440px] rounded-2xl overflow-hidden border border-border/70 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-end p-6 sm:p-8"
              >
                <img
                  src={featuredPost.cover_image}
                  alt={featuredPost.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Multi-stage dark gradient overlay ensuring 100% text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/55 to-black/20" />

                <div className="relative z-10">
                  <span
                    className={`inline-block mb-3 px-2.5 py-1 rounded-md text-xs font-semibold ${getCategoryStyle(
                      featuredPost.category
                    )}`}
                  >
                    {featuredPost.category}
                  </span>
                  <h3 className="text-white font-extrabold text-xl sm:text-2xl leading-snug group-hover:text-amber-200 transition-colors drop-shadow-xs">
                    {featuredPost.title}
                  </h3>
                  <p className="mt-2.5 text-slate-200/90 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="mt-3.5 flex items-center gap-2 text-slate-300/80 text-xs font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatDate(featuredPost.published_at || featuredPost.created_at)}</span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* RIGHT — List of 4 recent articles (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Symmetrical column header aligning with the left column */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="h-3.5 w-1 rounded-full bg-primary block" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Bài viết mới nhất
              </span>
            </div>

            <div className="flex-1 bg-card border border-border/70 rounded-2xl shadow-card overflow-hidden divide-y divide-border/60 flex flex-col justify-between">
              {listPosts.map((post) => (
                <Link
                  key={post.id}
                  to="/tin-tuc/$slug"
                  params={{ slug: post.slug }}
                  className="group flex items-center gap-3.5 p-3.5 sm:p-4 hover:bg-muted/50 transition-colors flex-1"
                >
                  {/* Thumbnail */}
                  <div className="shrink-0 size-16 sm:size-[72px] rounded-xl overflow-hidden bg-muted border border-border/40">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <span
                      className={`inline-block mb-1 px-2 py-0.5 rounded text-[10px] font-semibold ${getCategoryStyle(
                        post.category
                      )}`}
                    >
                      {post.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      <span>{formatDate(post.published_at || post.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
