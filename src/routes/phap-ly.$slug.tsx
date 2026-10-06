import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Scale,
  Calendar,
  Clock,
  UserCheck,
  ChevronRight,
  Share2,
  Bookmark,
  Printer,
  PhoneCall,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ListOrdered,
  ArrowRight,
  ShieldCheck,
  Send,
  Building,
  Award,
  ChevronDown,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DEFAULT_LEGAL_POSTS } from "@/data/mockLegalPosts";

export const Route = createFileRoute("/phap-ly/$slug")({
  component: LegalDetailPage,
  head: () => ({
    meta: [
      { title: "Chi tiết Pháp lý Bất động sản — Horizon Da Nang" },
      {
        name: "description",
        content:
          "Phân tích chuyên sâu văn bản pháp luật, hướng dẫn thủ tục đất đai và cảnh báo rủi ro pháp lý bất động sản.",
      },
    ],
  }),
});

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export default function LegalDetailPage() {
  const { slug } = useParams({ from: "/phap-ly/$slug" });
  const initialPost = DEFAULT_LEGAL_POSTS.find((p) => p.slug === slug) || null;
  const [post, setPost] = useState<any>(initialPost);
  const [relatedPosts, setRelatedPosts] = useState<any[]>(() =>
    DEFAULT_LEGAL_POSTS.filter((p) => p.slug !== slug).slice(0, 3)
  );
  const [loading, setLoading] = useState(!initialPost);
  const [activeHeadingId, setActiveHeadingId] = useState("");
  const [tocOpen, setTocOpen] = useState(true);

  // Form State
  const [consultName, setConsultName] = useState("");
  const [consultPhone, setConsultPhone] = useState("");
  const [consultProject, setConsultProject] = useState("");
  const [consultIssue, setConsultIssue] = useState("");
  const [sendingForm, setSendingForm] = useState(false);

  const isMock =
    typeof window !== "undefined"
      ? localStorage.getItem("bds_mock_admin") === "true" || !import.meta.env.VITE_SUPABASE_URL
      : true;

  const loadData = async () => {
    setLoading(true);
    let allPosts: any[] = [];
    let currentPost: any = null;

    if (isMock) {
      const data = localStorage.getItem("mock_news");
      allPosts = data ? JSON.parse(data) : [];
      currentPost = allPosts.find((p) => p.slug === slug) || null;
    } else {
      try {
        const { data, error } = await supabase
          .from("news_posts")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (!error && data) {
          currentPost = data;
        }

        const { data: listData } = await supabase
          .from("news_posts")
          .select("*")
          .eq("published", true)
          .neq("slug", slug)
          .limit(10);

        allPosts = listData || [];
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to LocalStorage:", err);
        const data = localStorage.getItem("mock_news");
        allPosts = data ? JSON.parse(data) : [];
        currentPost = allPosts.find((p) => p.slug === slug) || null;
      }
    }

    const foundPost = currentPost || DEFAULT_LEGAL_POSTS.find((p) => p.slug === slug) || null;
    setPost(foundPost);

    // Filter related posts in Legal category
    const legalRelated = allPosts.filter(
      (p) =>
        p.slug !== slug &&
        (p.category === "Pháp lý" ||
          p.category === "Quy hoạch & Pháp lý" ||
          p.category_id === "cat-phap-ly")
    );

    const mergedRelated = [
      ...legalRelated,
      ...DEFAULT_LEGAL_POSTS.filter((p) => p.slug !== slug && !legalRelated.some((lr) => lr.slug === p.slug)),
    ];

    setRelatedPosts(mergedRelated.slice(0, 3));
    setLoading(false);
  };


  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // Extract Headings from Markdown or HTML content
  const extractHeadings = (): HeadingItem[] => {
    if (!post?.content) return [];
    const content = post.content;
    const headings: HeadingItem[] = [];

    // Check if markdown
    const lines = content.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("## ")) {
        const text = trimmed.replace("## ", "").trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+/gi, "")
          .replace(/\s+/g, "-");
        headings.push({ id, text, level: 2 });
      } else if (trimmed.startsWith("### ")) {
        const text = trimmed.replace("### ", "").trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+/gi, "")
          .replace(/\s+/g, "-");
        headings.push({ id, text, level: 3 });
      }
    }

    // If no markdown headings, check HTML tags <h2>, <h3>
    if (headings.length === 0 && content.includes("<h")) {
      const regex = /<h([2-3])[^>]*>(.*?)<\/h\1>/gi;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const level = parseInt(match[1], 10);
        const text = match[2].replace(/<[^>]*>/g, "").trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+/gi, "")
          .replace(/\s+/g, "-");
        headings.push({ id, text, level });
      }
    }

    return headings;
  };

  const headings = extractHeadings();

  // Scroll to heading on TOC click
  const scrollToHeading = (id: string) => {
    setActiveHeadingId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép liên kết bài viết vào khay nhớ tạm!");
    }
  };

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName.trim() || !consultPhone.trim()) {
      toast.error("Vui lòng điền Họ tên và Số điện thoại liên hệ!");
      return;
    }

    setSendingForm(true);
    try {
      const existing = JSON.parse(localStorage.getItem("legal_consultation_leads") || "[]");
      existing.unshift({
        id: "lead-" + Date.now(),
        fullName: consultName,
        phone: consultPhone,
        serviceType: `Tư vấn dự án: ${consultProject || "Chung"}`,
        notes: `Từ bài viết [${post?.title}]: ${consultIssue}`,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("legal_consultation_leads", JSON.stringify(existing));

      toast.success(
        "Gửi hồ sơ thẩm định thành công! Luật sư chuyên trách sẽ liên hệ lại với Quý khách trong vòng 15 phút.",
        { duration: 5000 }
      );

      setConsultName("");
      setConsultPhone("");
      setConsultProject("");
      setConsultIssue("");
    } catch {
      toast.error("Đã xảy ra lỗi, vui lòng gọi trực tiếp Hotline 0905.888.999");
    } finally {
      setSendingForm(false);
    }
  };

  // Render content with headings carrying IDs for TOC linking
  const renderFormattedContent = () => {
    if (!post?.content) return null;
    const content = post.content;

    // If content is HTML
    if (content.includes("<p>") || content.includes("<h2") || content.includes("<div>")) {
      return (
        <div
          className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-h2:text-xl prose-h2:font-extrabold prose-h2:text-slate-900 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-2.5 prose-h3:text-lg prose-h3:font-bold prose-h3:text-slate-800 prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    const renderInline = (str: string) => {
      if (str.includes("**")) {
        const parts = str.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={i} className="font-bold text-slate-900">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });
      }
      return str;
    };

    // Markdown content parsing
    const blocks = content.split("\n\n");
    return (
      <div className="space-y-5 text-slate-700 leading-relaxed text-sm sm:text-base">
        {blocks.map((block: string, idx: number) => {
          const trimmed = block.trim();

          if (trimmed.startsWith("## ")) {
            const text = trimmed.replace("## ", "").trim();
            const id = text
              .toLowerCase()
              .replace(/[^a-z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+/gi, "")
              .replace(/\s+/g, "-");
            return (
              <h2
                key={idx}
                id={id}
                className="text-xl sm:text-2xl font-extrabold text-slate-900 pt-6 pb-2.5 border-b border-slate-200/80 scroll-mt-24 flex items-center gap-2"
              >
                <Scale className="size-5 text-blue-600 shrink-0" />
                <span>{text}</span>
              </h2>
            );
          }

          if (trimmed.startsWith("### ")) {
            const text = trimmed.replace("### ", "").trim();
            const id = text
              .toLowerCase()
              .replace(/[^a-z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+/gi, "")
              .replace(/\s+/g, "-");
            return (
              <h3
                key={idx}
                id={id}
                className="text-lg font-bold text-slate-900 pt-4 pb-1 scroll-mt-24 flex items-center gap-2"
              >
                <div className="size-2 rounded-full bg-blue-600"></div>
                <span>{text}</span>
              </h3>
            );
          }

          if (trimmed.startsWith("> ")) {
            const quoteText = trimmed.replace(/^>\s*/gm, "").trim();
            return (
              <div
                key={idx}
                className="my-5 p-4 bg-blue-50/80 border-l-4 border-blue-600 rounded-r-xl text-slate-800 text-sm italic"
              >
                {renderInline(quoteText)}
              </div>
            );
          }

          if (trimmed.startsWith("- ")) {
            const items = trimmed.split("\n").map((item) => item.replace("- ", "").trim());
            return (
              <ul key={idx} className="space-y-2.5 my-4 pl-1">
                {items.map((it, i) => {
                  const colonIndex = it.indexOf(":");
                  if (colonIndex > 0 && colonIndex < 40) {
                    const label = it.slice(0, colonIndex);
                    const desc = it.slice(colonIndex + 1);
                    return (
                      <li key={i} className="flex items-start gap-2.5 text-slate-700">
                        <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-1" />
                        <span>
                          <strong className="font-bold text-slate-900">{label}:</strong>
                          {renderInline(desc)}
                        </span>
                      </li>
                    );
                  }
                  return (
                    <li key={i} className="flex items-start gap-2.5 text-slate-700">
                      <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-1" />
                      <span>{renderInline(it)}</span>
                    </li>
                  );
                })}
              </ul>
            );
          }

          return (
            <p key={idx} className="text-slate-700 leading-relaxed">
              {renderInline(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4">
          <div className="animate-spin size-10 border-t-2 border-b-2 border-blue-600 rounded-full"></div>
          <p className="text-sm font-medium text-slate-500">Đang chuẩn bị nội dung thẩm định pháp lý...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Header />
        <div className="flex-1 container-page py-20 text-center space-y-4">
          <AlertTriangle className="size-14 text-amber-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">Không tìm thấy bài viết pháp lý</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Bài viết bạn đang tìm kiếm có thể đã được gỡ bỏ hoặc chuyển đổi đường dẫn.
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            <Link to="/phap-ly">Quay lại Chuyên mục Pháp lý</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <Header />

      {/* BREADCRUMB */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="container-page py-3">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="size-3 text-slate-400 shrink-0" />
            <Link to="/phap-ly" className="hover:text-blue-600 transition-colors text-blue-600 font-semibold">
              Pháp lý BĐS
            </Link>
            <ChevronRight className="size-3 text-slate-400 shrink-0" />
            <span className="text-slate-800 font-semibold truncate max-w-sm sm:max-w-md">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* ARTICLE HEADER HERO */}
      <header className="bg-white border-b border-slate-200/80 py-8 lg:py-10">
        <div className="container-page max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-blue-600 hover:bg-blue-600 text-white font-semibold text-xs border-none py-1 px-3">
              <Scale className="size-3.5 mr-1" /> Chuyên đề Pháp lý
            </Badge>
            <Badge variant="outline" className="border-slate-200 text-slate-600 text-xs">
              Thẩm định bởi Luật sư
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                <UserCheck className="size-4 text-blue-600" />
                {post.author || "Luật sư Nguyễn Văn Hùng"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5 text-slate-400" />
                {new Date(post.published_at || post.created_at).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5 text-slate-400" />
                7 phút đọc
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="h-8 px-3 text-xs gap-1.5 rounded-lg border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
              >
                <Share2 className="size-3.5" /> Chia sẻ
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="h-8 px-3 text-xs gap-1.5 rounded-lg border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer hidden sm:flex"
              >
                <Printer className="size-3.5" /> In bài viết
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN ARTICLE BODY & SIDEBAR */}
      <main className="container-page py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: MAIN ARTICLE CONTENT (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* EXCERPT CALLOUT BOX */}
            {post.excerpt && (
              <div className="p-5 rounded-2xl bg-blue-50/70 border-l-4 border-blue-600 text-slate-800 text-sm sm:text-base font-medium leading-relaxed shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
                  <ShieldCheck className="size-4 text-blue-600" /> Tóm tắt nội dung trọng tâm
                </div>
                {post.excerpt}
              </div>
            )}

            {/* FEATURED COVER IMAGE */}
            {post.cover_image && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm max-h-[440px]">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* INLINE TABLE OF CONTENTS (TOC) FOR MOBILE & ACCESSIBILITY */}
            {headings.length > 0 && (
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setTocOpen(!tocOpen)}
                >
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <ListOrdered className="size-4 text-blue-600" /> Mục Lục Nội Dung Bài Viết
                  </h3>
                  <ChevronDown
                    className={`size-4 text-slate-400 transition-transform ${
                      tocOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {tocOpen && (
                  <nav className="mt-3.5 pt-3.5 border-t border-slate-200 space-y-2">
                    {headings.map((h, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => scrollToHeading(h.id)}
                        className={`text-left block text-xs hover:text-blue-600 transition-colors w-full cursor-pointer ${
                          h.level === 3 ? "pl-5 text-slate-500" : "font-semibold text-slate-700"
                        } ${activeHeadingId === h.id ? "text-blue-600 font-bold" : ""}`}
                      >
                        {h.text}
                      </button>
                    ))}
                  </nav>
                )}
              </div>
            )}

            {/* FORMATTED ARTICLE CONTENT */}
            <article className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
              {renderFormattedContent()}
            </article>

            {/* BOX CTA: KÊU GỌI TƯ VẤN & HOTLINE */}
            <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-5">
              <div className="absolute right-0 top-0 -mr-10 -mt-10 size-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Scale className="size-3.5" /> Hỗ trợ giải quyết vướng mắc
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                  Bạn Đang Gặp Vướng Mắc Tương Tự Về Trường Hợp Này?
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Đừng để rủi ro pháp lý làm đình trệ giao dịch hoặc phát sinh tranh chấp kéo dài.
                  Luật sư chuyên môn của Horizon sẽ rà soát hồ sơ, đánh giá rủi ro và tư vấn phương án giải quyết tối ưu nhất.
                </p>
              </div>

              <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href="tel:0905888999"
                  className="w-full sm:w-auto h-11 px-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <PhoneCall className="size-4" /> Gọi Trực Tiếp Luật Sư: 0905.888.999
                </a>

                <a
                  href="https://zalo.me"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto h-11 px-5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-white/20 transition-all"
                >
                  <MessageSquare className="size-4 text-sky-400" /> Chat Zalo Tư Vấn Miễn Phí
                </a>
              </div>
            </div>

            {/* FORM ĐĂNG KÝ TƯ VẤN VƯỚNG MẮC DỰ ÁN */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText className="size-5 text-blue-600" /> Đăng Ký Thẩm Định Hồ Sơ & Tư Vấn Vướng Mắc
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Điền thông tin thửa đất hoặc dự án cần thẩm định, luật sư phụ trách sẽ liên hệ hỗ trợ bạn
                </p>
              </div>

              <form onSubmit={handleConsultSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Họ và tên của bạn *</label>
                    <Input
                      required
                      placeholder="Nguyễn Văn A"
                      value={consultName}
                      onChange={(e) => setConsultName(e.target.value)}
                      className="h-10 text-xs border-slate-200 focus-visible:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Số điện thoại liên hệ *</label>
                    <Input
                      required
                      type="tel"
                      placeholder="0905 xxx xxx"
                      value={consultPhone}
                      onChange={(e) => setConsultPhone(e.target.value)}
                      className="h-10 text-xs border-slate-200 focus-visible:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Tên dự án hoặc địa chỉ thửa đất</label>
                  <Input
                    placeholder="Ví dụ: Dự án Căn hộ ven sông Hàn, Thửa đất số 45 Hòa Xuân..."
                    value={consultProject}
                    onChange={(e) => setConsultProject(e.target.value)}
                    className="h-10 text-xs border-slate-200 focus-visible:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Mô tả cụ thể vướng mắc pháp lý</label>
                  <Textarea
                    rows={3}
                    placeholder="Mô tả sự việc: CĐT chậm ra sổ, vướng mắc hợp đồng đặt cọc, tranh chấp ranh giới..."
                    value={consultIssue}
                    onChange={(e) => setConsultIssue(e.target.value)}
                    className="text-xs border-slate-200 focus-visible:ring-blue-500 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sendingForm}
                  className="w-full h-11 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {sendingForm ? (
                    "Đang gửi hồ sơ..."
                  ) : (
                    <>
                      <Send className="size-4" /> Gửi Yêu Cầu Thẩm Định Pháp Lý
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* AUTHOR / LAWYER BIO CARD */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="size-20 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80"
                  alt="Luật sư Nguyễn Văn Hùng"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    {post.author || "ThS. Luật sư Nguyễn Văn Hùng"}
                  </h4>
                  <p className="text-xs font-medium text-blue-600">
                    Cố vấn Pháp lý Bất động sản cấp cao — Đoàn Luật sư TP. Đà Nẵng
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Chuyên trách thẩm định pháp lý dự án quy mô lớn, tháo gỡ điểm nghẽn thủ tục đất đai và bảo vệ quyền lợi hợp pháp của người mua nhà, nhà đầu tư tại thị trường miền Trung.
                </p>
              </div>
            </div>

            {/* RELATED LEGAL ARTICLES */}
            {relatedPosts.length > 0 && (
              <div className="space-y-4 pt-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Scale className="size-4 text-blue-600" /> Bài Viết Cùng Chuyên Mục Pháp Lý
                  </h3>
                  <Link
                    to="/phap-ly"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Xem tất cả <ArrowRight className="size-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {relatedPosts.map((rel) => (
                    <article
                      key={rel.id}
                      className="bg-white rounded-xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col group"
                    >
                      <Link
                        to="/phap-ly/$slug"
                        params={{ slug: rel.slug }}
                        className="block h-36 overflow-hidden relative shrink-0"
                      >
                        <img
                          src={
                            rel.cover_image ||
                            "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=60"
                          }
                          alt={rel.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </Link>
                      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                        <h4 className="font-bold text-xs text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                          <Link to="/phap-ly/$slug" params={{ slug: rel.slug }}>
                            {rel.title}
                          </Link>
                        </h4>
                        <div className="text-[10px] text-slate-400">
                          {new Date(rel.published_at || rel.created_at).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: STICKY SIDEBAR (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* STICKY TABLE OF CONTENTS FOR DESKTOP */}
            {headings.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3 hidden lg:block">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <ListOrdered className="size-4 text-blue-600" /> Mục Lục Bài Viết
                </h3>
                <nav className="space-y-1.5 max-h-80 overflow-y-auto pr-1 text-xs">
                  {headings.map((h, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollToHeading(h.id)}
                      className={`text-left block w-full py-1 px-2 rounded-lg transition-all cursor-pointer ${
                        h.level === 3 ? "pl-4 text-slate-500 text-[11px]" : "font-medium text-slate-700"
                      } ${
                        activeHeadingId === h.id
                          ? "bg-blue-50 text-blue-600 font-bold"
                          : "hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {h.text}
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* SIDEBAR LAWYER CARD */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="size-12 rounded-full overflow-hidden border border-amber-400 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80"
                    alt="Luật sư Nguyễn Văn Hùng"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">ThS. LS Nguyễn Văn Hùng</h4>
                  <p className="text-[10px] text-amber-400">Trưởng ban Pháp lý BĐS Horizon</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <p className="text-[11px] leading-relaxed">
                  Cần giải đáp ngay về nội dung bài viết này? Liên hệ trực tiếp với luật sư phụ trách.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <a
                  href="tel:0905888999"
                  className="w-full h-9 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <PhoneCall className="size-3.5" /> 0905.888.999
                </a>
                <a
                  href="https://zalo.me"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-9 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/10"
                >
                  <MessageSquare className="size-3.5 text-sky-400" /> Nhắn Zalo Luật sư
                </a>
              </div>
            </div>

            {/* QUICK LINK TO LEGAL PORTAL */}
            <div className="p-4 bg-blue-50 border border-blue-200/80 rounded-2xl text-center space-y-2">
              <Scale className="size-6 text-blue-600 mx-auto" />
              <h4 className="font-bold text-xs text-blue-950">Chuyên trang Pháp lý BĐS Đà Nẵng</h4>
              <p className="text-[11px] text-blue-800">
                Xem toàn bộ cẩm nang thủ tục đất đai, quy hoạch và hướng dẫn cấp sổ đỏ mới nhất.
              </p>
              <Button asChild size="sm" className="w-full text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                <Link to="/phap-ly">Truy cập chuyên trang</Link>
              </Button>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
