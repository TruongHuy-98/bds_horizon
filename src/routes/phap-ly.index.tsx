import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Scale,
  ShieldCheck,
  PhoneCall,
  MessageSquare,
  Clock,
  Calendar,
  FileCheck2,
  ChevronRight,
  Search,
  BookOpen,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Send,
  Building,
  HelpCircle,
  FileText,
  AlertCircle,
  Award,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fetchCategories, CategoryItem } from "@/lib/categories";
import { DEFAULT_LEGAL_POSTS } from "@/data/mockLegalPosts";

export const Route = createFileRoute("/phap-ly/")({
  component: LegalCategoryPage,
  head: () => ({
    meta: [
      { title: "Chuyên mục Pháp lý Bất động sản Đà Nẵng — Tư vấn Luật Đất đai & Dự án" },
      {
        name: "description",
        content:
          "Hỗ trợ tư vấn pháp lý nhà đất, thủ tục cấp đổi sổ đỏ, thẩm định pháp lý dự án và giải quyết tranh chấp đất đai tại Đà Nẵng. Đội ngũ luật sư uy tín.",
      },
      { property: "og:title", content: "Chuyên mục Pháp lý Bất động sản — Horizon Da Nang" },
      {
        property: "og:description",
        content: "Cập nhật văn bản pháp luật, thủ tục sang tên sổ đỏ và tư vấn vướng mắc dự án BĐS.",
      },
    ],
  }),
});

interface ConsultationFormData {
  fullName: string;
  phone: string;
  serviceType: string;
  notes: string;
}

export default function LegalCategoryPage() {
  const [posts, setPosts] = useState<any[]>(DEFAULT_LEGAL_POSTS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubTab, setSelectedSubTab] = useState("all");

  // Form State
  const [formData, setFormData] = useState<ConsultationFormData>({
    fullName: "",
    phone: "",
    serviceType: "Thủ tục Sổ đỏ & Sang tên",
    notes: "",
  });
  const [submittingForm, setSubmittingForm] = useState(false);

  const isMock =
    typeof window !== "undefined"
      ? localStorage.getItem("bds_mock_admin") === "true" || !import.meta.env.VITE_SUPABASE_URL
      : true;

  const loadPosts = async () => {
    setLoading(true);
    let allNews: any[] = [];

    if (isMock) {
      const localData = localStorage.getItem("mock_news");
      allNews = localData ? JSON.parse(localData) : [];
    } else {
      try {
        const { data, error } = await supabase
          .from("news_posts")
          .select("*")
          .eq("published", true)
          .order("published_at", { ascending: false });

        if (error) throw error;
        allNews = data || [];
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to LocalStorage:", err);
        const localData = localStorage.getItem("mock_news");
        allNews = localData ? JSON.parse(localData) : [];
      }
    }

    // Filter only Legal posts: category is 'Pháp lý' or slug contains 'phap-ly' or 'so-do' or tags include 'Pháp lý'
    const legalPosts = allNews.filter(
      (p) =>
        p.category === "Pháp lý" ||
        p.category === "Quy hoạch & Pháp lý" ||
        p.category_id === "cat-phap-ly" ||
        (Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase().includes("pháp lý")))
    );

    // If no specific legal posts found in mock, fallback to first few posts with legal labeling
    if (legalPosts.length === 0 && allNews.length > 0) {
      setPosts(allNews.slice(0, 4));
    } else {
      setPosts(legalPosts);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      toast.error("Vui lòng điền Họ tên và Số điện thoại liên hệ!");
      return;
    }

    setSubmittingForm(true);
    try {
      // Save lead to local storage
      const existingLeads = JSON.parse(localStorage.getItem("legal_consultation_leads") || "[]");
      const newLead = {
        id: "lead-" + Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      existingLeads.unshift(newLead);
      localStorage.setItem("legal_consultation_leads", JSON.stringify(existingLeads));

      // Friendly success notification
      toast.success(
        "Đăng ký tư vấn thành công! Luật sư chuyên trách sẽ liên hệ lại với Quý khách trong vòng 15 phút.",
        { duration: 5000 }
      );

      setFormData({
        fullName: "",
        phone: "",
        serviceType: "Thủ tục Sổ đỏ & Sang tên",
        notes: "",
      });
    } catch {
      toast.error("Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng liên hệ Hotline 0905.888.999!");
    } finally {
      setSubmittingForm(false);
    }
  };

  // Filter posts by search and sub-tab
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesTab = true;
    if (selectedSubTab === "so-do") {
      matchesTab = p.title.toLowerCase().includes("sổ") || p.excerpt?.toLowerCase().includes("sổ");
    } else if (selectedSubTab === "du-an") {
      matchesTab = p.title.toLowerCase().includes("dự án") || p.excerpt?.toLowerCase().includes("dự án");
    } else if (selectedSubTab === "luat-dat-dai") {
      matchesTab = p.title.toLowerCase().includes("luật") || p.title.toLowerCase().includes("giá đất");
    }

    return matchesSearch && matchesTab;
  });

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  // Legal Services list for sidebar
  const legalServices = [
    {
      title: "Thẩm định pháp lý dự án BĐS",
      desc: "Kiểm tra GPXD, 1/500, điều kiện bán hàng của CĐT",
      badge: "Phổ biến",
    },
    {
      title: "Thủ tục cấp đổi & Sang tên sổ đỏ",
      desc: "Hồ sơ công chứng, nộp thuế và nhận kết quả nhanh",
      badge: "Nhanh chóng",
    },
    {
      title: "Hòa giải & Tranh chấp đất đai",
      desc: "Tranh chấp ranh giới, lối đi chung, tài sản thừa kế",
      badge: "Luật sư 1-1",
    },
    {
      title: "Chuyển mục đích sử dụng đất",
      desc: "Chuyển đất nông nghiệp, vườn ao lên đất thổ cư ở",
      badge: "Đúng luật",
    },
    {
      title: "Rà soát Hợp đồng mua bán & Đặt cọc",
      desc: "Phòng ngừa điều khoản phạt và rủi ro mất cọc",
      badge: "Bảo đảm",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <Header />

      {/* 1. HERO BANNER & CONSULTATION FORM */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white overflow-hidden py-12 lg:py-16">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container-page relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                <Scale className="size-4" /> Chuyên trang Pháp lý Bất động sản
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Tư Vấn & Thẩm Định <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                  Pháp Lý Bất Động Sản
                </span>{" "}
                Đà Nẵng
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                Giải quyết triệt để các vướng mắc về cấp sổ đỏ, thẩm định tính pháp lý dự án căn hộ,
                tranh chấp thừa kế đất đai và bảo đảm an toàn giao dịch 100% cùng đội ngũ Luật sư uy tín.
              </p>

              {/* Trust Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                  <div className="text-xl sm:text-2xl font-black text-amber-400">15+</div>
                  <div className="text-[11px] text-slate-300 font-medium">Năm kinh nghiệm</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                  <div className="text-xl sm:text-2xl font-black text-sky-400">1.200+</div>
                  <div className="text-[11px] text-slate-300 font-medium">Hồ sơ hoàn thành</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">100%</div>
                  <div className="text-[11px] text-slate-300 font-medium">Bảo mật thông tin</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                  <div className="text-xl sm:text-2xl font-black text-purple-400">24/7</div>
                  <div className="text-[11px] text-slate-300 font-medium">Luật sư hỗ trợ</div>
                </div>
              </div>
            </div>

            {/* Right Consultation Form */}
            <div className="lg:col-span-5">
              <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-7 border border-slate-100">
                <div className="border-b border-slate-100 pb-4 mb-4">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                    <Sparkles className="size-3.5" /> Tư vấn miễn phí
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Nhận Tư Vấn Luật Sư Nhanh
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Để lại thông tin, luật sư chuyên môn sẽ gọi lại trong 15 phút
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Họ và tên Quý khách *</label>
                    <Input
                      required
                      placeholder="Ví dụ: Nguyễn Văn An"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="h-9 text-xs border-slate-200 focus-visible:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Số điện thoại liên hệ *</label>
                    <Input
                      required
                      type="tel"
                      placeholder="Ví dụ: 0905 123 456"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-9 text-xs border-slate-200 focus-visible:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Vấn đề cần tư vấn</label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="Thủ tục Sổ đỏ & Sang tên">Thủ tục Sổ đỏ & Sang tên</option>
                      <option value="Thẩm định pháp lý dự án BĐS">Thẩm định pháp lý dự án BĐS</option>
                      <option value="Tranh chấp ranh giới & Đất đai">Tranh chấp ranh giới & Đất đai</option>
                      <option value="Thừa kế & Tặng cho nhà đất">Thừa kế & Tặng cho nhà đất</option>
                      <option value="Chuyển mục đích sử dụng đất">Chuyển mục đích sử dụng đất</option>
                      <option value="Rà soát Hợp đồng mua bán / Đặt cọc">Rà soát Hợp đồng mua bán / Đặt cọc</option>
                      <option value="Khác">Vấn đề pháp lý khác</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Ghi chú vướng mắc ngắn gọn</label>
                    <Textarea
                      rows={2}
                      placeholder="Mô tả sơ lược tình trạng pháp lý hoặc địa chỉ thửa đất..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="text-xs resize-none border-slate-200 focus-visible:ring-blue-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submittingForm}
                    className="w-full h-10 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    {submittingForm ? (
                      "Đang gửi yêu cầu..."
                    ) : (
                      <>
                        <Send className="size-3.5" /> Gửi Yêu Cầu Tư Vấn Ngay
                      </>
                    )}
                  </Button>

                  <p className="text-[10px] text-center text-slate-400">
                    * Cam kết bảo mật thông tin hồ sơ theo Quy tắc đạo đức nghề nghiệp Luật sư.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SUB-FILTER BAR & SEARCH */}
      <section className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-xs">
        <div className="container-page py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Sub tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: "all", label: "Tất cả bài viết" },
              { id: "so-do", label: "Thủ tục Sổ đỏ" },
              { id: "du-an", label: "Pháp lý Dự án" },
              { id: "luat-dat-dai", label: "Luật Đất Đai mới" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSubTab(tab.id)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  selectedSubTab === tab.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm bài viết pháp lý..."
              className="h-8 pl-8 text-xs bg-slate-50 border-slate-200 focus-visible:ring-blue-500 rounded-full"
            />
          </div>
        </div>
      </section>

      {/* 3. MAIN ARTICLES CONTENT & SIDEBAR */}
      <main className="container-page py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: ARTICLES LIST (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {loading ? (
              <div className="py-24 text-center text-slate-400 space-y-3">
                <div className="animate-spin size-8 border-t-2 border-b-2 border-blue-600 rounded-full mx-auto"></div>
                <p className="text-xs font-medium">Đang tải danh sách bài viết pháp lý...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="py-20 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200 p-8 space-y-3">
                <FileText className="size-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">Chưa tìm thấy bài viết pháp lý phù hợp</h4>
                <p className="text-xs text-slate-400">
                  Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để hiển thị toàn bộ bài viết.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedSubTab("all");
                  }}
                  className="text-xs"
                >
                  Xem tất cả
                </Button>
              </div>
            ) : (
              <>
                {/* FEATURED ARTICLE HERO CARD */}
                {featuredPost && (
                  <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-md transition-all group">
                    <Link
                      to="/phap-ly/$slug"
                      params={{ slug: featuredPost.slug }}
                      className="block grid grid-cols-1 md:grid-cols-12"
                    >
                      <div className="md:col-span-6 h-64 md:h-auto overflow-hidden relative">
                        <img
                          src={
                            featuredPost.cover_image ||
                            "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=60"
                          }
                          alt={featuredPost.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-blue-600 hover:bg-blue-600 text-white font-semibold text-xs border-none shadow-sm flex items-center gap-1">
                            <Scale className="size-3" /> Tiêu điểm Pháp lý
                          </Badge>
                        </div>
                      </div>

                      <div className="md:col-span-6 p-6 sm:p-7 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                            <span className="flex items-center gap-1 text-blue-600 font-semibold">
                              <Scale className="size-3" /> {featuredPost.category || "Pháp lý"}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="size-3" />
                              {new Date(featuredPost.published_at || featuredPost.created_at).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>

                          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {featuredPost.title}
                          </h2>

                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                            {featuredPost.excerpt}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                          <span className="flex items-center gap-1.5 text-slate-700">
                            <UserCheck className="size-3.5 text-blue-600" />
                            {featuredPost.author || "Luật sư Nguyễn Văn Hùng"}
                          </span>
                          <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Đọc bài viết <ArrowRight className="size-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* GRID OF REMAINING LEGAL ARTICLES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {remainingPosts.map((post) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col group"
                    >
                      <Link
                        to="/phap-ly/$slug"
                        params={{ slug: post.slug }}
                        className="block h-48 overflow-hidden relative shrink-0"
                      >
                        <img
                          src={
                            post.cover_image ||
                            "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=60"
                          }
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-slate-900/80 backdrop-blur-md text-white font-medium text-[11px] border-none">
                            {post.category || "Pháp lý"}
                          </Badge>
                        </div>
                      </Link>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <Calendar className="size-3" />
                            <span>
                              {new Date(post.published_at || post.created_at).toLocaleDateString("vi-VN")}
                            </span>
                          </div>

                          <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                            <Link to="/phap-ly/$slug" params={{ slug: post.slug }}>
                              {post.title}
                            </Link>
                          </h3>

                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-600 font-medium text-[11px] truncate max-w-[140px]">
                            {post.author || "Luật sư tư vấn"}
                          </span>
                          <Link
                            to="/phap-ly/$slug"
                            params={{ slug: post.slug }}
                            className="font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[11px]"
                          >
                            Xem chi tiết <ChevronRight className="size-3" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* RIGHT: SIDEBAR (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* SIDEBAR CARD 1: DANH MỤC DỊCH VỤ PHÁP LÝ */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileCheck2 className="size-4 text-blue-600" /> Dịch Vụ Pháp Lý Trọng Tâm
              </h3>

              <div className="space-y-2.5">
                {legalServices.map((srv, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-xs text-slate-800 group-hover:text-blue-600 transition-colors">
                        {srv.title}
                      </h4>
                      <Badge className="bg-blue-100 text-blue-700 text-[10px] font-semibold border-none py-0.5 px-1.5">
                        {srv.badge}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">{srv.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SIDEBAR CARD 2: BÀI VIẾT PHÁP LÝ XEM NHIỀU */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <BookOpen className="size-4 text-amber-600" /> Bài Viết Xem Nhiều
              </h3>

              <div className="space-y-3.5">
                {posts.slice(0, 4).map((item, idx) => (
                  <Link
                    key={item.id}
                    to="/phap-ly/$slug"
                    params={{ slug: item.slug }}
                    className="flex items-start gap-3 group"
                  >
                    <span
                      className={`size-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        idx === 0
                          ? "bg-amber-500 text-white"
                          : idx === 1
                          ? "bg-slate-700 text-white"
                          : idx === 2
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="space-y-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 block">
                        {new Date(item.published_at || item.created_at).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* SIDEBAR CARD 3: THÔNG TIN CHUYÊN GIA / LUẬT SƯ */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md space-y-5">
              <div className="flex items-center gap-3.5 border-b border-white/10 pb-4">
                <div className="size-14 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80"
                    alt="Luật sư Nguyễn Văn Hùng"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    ThS. Luật sư Nguyễn Văn Hùng
                  </h4>
                  <p className="text-[11px] text-amber-400 font-medium">Trưởng ban Pháp lý BĐS Horizon</p>
                  <p className="text-[10px] text-slate-300">Đoàn Luật sư TP. Đà Nẵng</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Award className="size-4 text-amber-400 shrink-0" />
                  <span>15+ năm tranh tụng & tư vấn dự án</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
                  <span>Chuyên sâu Luật Đất đai, Nhà ở & Kinh doanh BĐS</span>
                </div>
              </div>

              <div className="pt-1 space-y-2.5">
                <a
                  href="tel:0905888999"
                  className="w-full h-9 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <PhoneCall className="size-3.5" /> Hotline: 0905.888.999
                </a>
                <a
                  href="https://zalo.me"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-9 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/15"
                >
                  <MessageSquare className="size-3.5 text-sky-400" /> Nhắn tin Zalo trực tiếp
                </a>
              </div>
            </div>

            {/* SIDEBAR CARD 4: HOTLINE KHẨN CẤP */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center gap-3.5">
              <div className="size-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <PhoneCall className="size-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                  Đường dây nóng hỗ trợ khẩn cấp
                </span>
                <span className="text-sm font-extrabold text-amber-700 block">1900 6868 (Phím 2)</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
