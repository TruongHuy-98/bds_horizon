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

// Mock news data — realistic Đà Nẵng real estate content
const MOCK_NEWS: NewsPost[] = [
  {
    id: "1",
    title: "Thị trường bất động sản Đà Nẵng phục hồi mạnh trong quý IV/2024, giao dịch tăng 35%",
    slug: "thi-truong-bds-da-nang-phuc-hoi-quy-4-2024",
    excerpt:
      "Sau giai đoạn trầm lắng, thị trường BĐS Đà Nẵng đang trên đà phục hồi ấn tượng với lượng giao dịch tăng mạnh, đặc biệt ở phân khúc căn hộ và đất nền ven biển.",
    category: "Thị trường Đà Nẵng",
    cover_image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&auto=format&fit=crop&q=80",
    published_at: "2024-10-08T08:00:00Z",
    created_at: "2024-10-08T08:00:00Z",
  },
  {
    id: "2",
    title: "Cảng Liên Chiểu chính thức khởi công — BĐS phía Bắc Đà Nẵng bứt phá",
    slug: "cang-lien-chieu-khoi-cong-bds-phia-bac-da-nang",
    excerpt:
      "Siêu dự án Cảng Liên Chiểu 3,4 tỷ USD được khởi công chính thức, mở ra cú hích lớn cho thị trường BĐS khu vực quận Liên Chiểu và Hòa Vang.",
    category: "Tiến độ Hạ tầng",
    cover_image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80",
    published_at: "2024-10-05T07:30:00Z",
    created_at: "2024-10-05T07:30:00Z",
  },
  {
    id: "3",
    title: "Luật Đất đai 2024 có hiệu lực: Những điểm mới quan trọng người mua nhà cần biết",
    slug: "luat-dat-dai-2024-hieu-luc-diem-moi",
    excerpt:
      "Từ 1/8/2024, Luật Đất đai sửa đổi chính thức có hiệu lực với nhiều thay đổi quan trọng về quyền sử dụng đất, bảng giá đất và quy trình chuyển nhượng.",
    category: "Quy hoạch & Pháp lý",
    cover_image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
    published_at: "2024-10-03T09:00:00Z",
    created_at: "2024-10-03T09:00:00Z",
  },
  {
    id: "4",
    title: "Giá đất Ngũ Hành Sơn tăng 20% sau thông tin quy hoạch Khu đô thị biển Đông",
    slug: "gia-dat-ngu-hanh-son-tang-20-phan-tram",
    excerpt:
      "Thông tin quy hoạch Khu đô thị biển Đông tại Ngũ Hành Sơn đã kéo theo làn sóng quan tâm đầu tư, đẩy giá đất nhiều tuyến đường tăng mạnh.",
    category: "Thị trường Đà Nẵng",
    cover_image:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&auto=format&fit=crop&q=80",
    published_at: "2024-10-01T10:00:00Z",
    created_at: "2024-10-01T10:00:00Z",
  },
  {
    id: "5",
    title: "5 lưu ý quan trọng khi mua căn hộ nghỉ dưỡng condotel tại Đà Nẵng",
    slug: "5-luu-y-mua-can-ho-condotel-da-nang",
    excerpt:
      "Condotel vẫn là kênh đầu tư hấp dẫn tại Đà Nẵng, tuy nhiên nhà đầu tư cần nắm rõ các rủi ro pháp lý và tiêu chí chọn dự án uy tín.",
    category: "Lời khuyên mua nhà",
    cover_image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=80",
    published_at: "2024-09-28T08:00:00Z",
    created_at: "2024-09-28T08:00:00Z",
  },
  {
    id: "6",
    title: "Báo cáo thị trường BĐS Đà Nẵng Q3/2024: Căn hộ dẫn đầu giao dịch",
    slug: "bao-cao-thi-truong-bds-da-nang-q3-2024",
    excerpt:
      "Phân khúc căn hộ tiếp tục dẫn đầu về số lượng giao dịch trong quý 3/2024, chiếm 58% tổng giá trị thị trường BĐS thành phố Đà Nẵng.",
    category: "Báo cáo thị trường",
    cover_image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80",
    published_at: "2024-09-25T07:00:00Z",
    created_at: "2024-09-25T07:00:00Z",
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
  "Thị trường Đà Nẵng": "bg-blue-50 text-blue-700",
  "Tiến độ Hạ tầng": "bg-amber-50 text-amber-700",
  "Quy hoạch & Pháp lý": "bg-purple-50 text-purple-700",
  "Lời khuyên mua nhà": "bg-emerald-50 text-emerald-700",
  "Báo cáo thị trường": "bg-slate-50 text-slate-700",
  "Pháp lý": "bg-rose-50 text-rose-700",
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
            .limit(7);
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
  const listPosts = displayPosts.slice(1, 7);

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
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-3">
              <Newspaper className="h-3.5 w-3.5" />
              Thị trường & Pháp lý
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Tin tức bất động sản
            </h2>
            <p className="mt-2 text-muted-foreground text-sm md:text-base">
              Cập nhật thị trường, quy hoạch và lời khuyên đầu tư mới nhất.
            </p>
          </div>
          <Link
            to="/tin-tuc"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all whitespace-nowrap shrink-0"
          >
            Xem thêm
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-6 md:gap-8">
          {/* LEFT — Featured article */}
          {featuredPost && (
            <Link
              to="/tin-tuc/$slug"
              params={{ slug: featuredPost.slug }}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[16/9]">
                <img
                  src={featuredPost.cover_image}
                  alt={featuredPost.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <span
                    className={`inline-block mb-2 px-2.5 py-0.5 rounded-md text-xs font-semibold ${getCategoryStyle(
                      featuredPost.category
                    )}`}
                  >
                    {featuredPost.category}
                  </span>
                  <h3 className="text-white font-bold text-lg md:text-xl leading-snug line-clamp-2 group-hover:text-white/90 transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="mt-2 text-white/75 text-sm line-clamp-2 leading-relaxed hidden sm:block">
                    {featuredPost.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-white/60 text-xs">
                    <Clock className="h-3 w-3" />
                    <span>{timeAgo(featuredPost.published_at || featuredPost.created_at)}</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* RIGHT — List of articles */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-4 w-1 rounded-full bg-primary block" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Bài viết mới nhất
              </span>
            </div>
            <div className="bg-card border border-border/60 rounded-2xl shadow-card overflow-hidden divide-y divide-border/60">
              {listPosts.map((post) => (
                <Link
                  key={post.id}
                  to="/tin-tuc/$slug"
                  params={{ slug: post.slug }}
                  className="group flex items-start gap-3 p-3.5 hover:bg-accent/30 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="shrink-0 w-[72px] h-[54px] rounded-lg overflow-hidden">
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
                      className={`inline-block mb-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${getCategoryStyle(
                        post.category
                      )}`}
                    >
                      {post.category}
                    </span>
                    <h4 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors group-hover:underline underline-offset-2 decoration-primary/40">
                      {post.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      <span>{timeAgo(post.published_at || post.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile "See more" */}
            <div className="mt-4 flex md:hidden">
              <Link
                to="/tin-tuc"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
              >
                Xem thêm tin tức <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
