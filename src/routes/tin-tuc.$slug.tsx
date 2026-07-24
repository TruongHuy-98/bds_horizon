import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  CalendarDays,
  Eye,
  Share2,
  Bookmark,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Clock,
  Phone,
  MessageCircle,
  Send,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";

import agentAvatar from "@/assets/agent-1.jpg";

export const Route = createFileRoute("/tin-tuc/$slug")({
  component: NewsDetailPage,
  head: ({ params }) => {
    const slugTitle = params.slug.replace(/-/g, " ");
    const capitalize = slugTitle.charAt(0).toUpperCase() + slugTitle.slice(1);
    return {
      meta: [
        { title: `${capitalize} — Tin tức BĐS Đà Nẵng | DaNang Estates` },
        {
          name: "description",
          content: "Cập nhật bài viết chi tiết quy hoạch, hạ tầng, bất động sản tại Đà Nẵng.",
        },
      ],
    };
  },
});

interface Comment {
  id: string;
  name: string;
  content: string;
  date: string;
}

function NewsDetailPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentName, setCommentName] = useState("");
  const [commentContent, setCommentContent] = useState("");

  const isMock = typeof window !== "undefined" 
    ? localStorage.getItem("bds_mock_admin") === "true" || !import.meta.env.VITE_SUPABASE_URL 
    : true;

  const loadData = async () => {
    setLoading(true);
    let postsList: any[] = [];
    let targetPost: any = null;

    if (isMock) {
      const data = localStorage.getItem("mock_news");
      postsList = data ? JSON.parse(data) : [];
      targetPost = postsList.find((p) => p.slug === slug) || null;
    } else {
      try {
        // Fetch specific post
        const { data, error } = await supabase
          .from("news_posts")
          .select("*")
          .eq("slug", slug)
          .eq("published", true)
          .maybeSingle();
        
        if (!error && data) {
          targetPost = data;
        }

        // Fetch related posts (limited to 3)
        const { data: listData } = await supabase
          .from("news_posts")
          .select("*")
          .eq("published", true)
          .neq("slug", slug)
          .limit(3);
        
        postsList = listData || [];
      } catch (err) {
        console.warn("Supabase detail fetch failed, falling back to LocalStorage:", err);
        const data = localStorage.getItem("mock_news");
        postsList = data ? JSON.parse(data) : [];
        targetPost = postsList.find((p) => p.slug === slug) || null;
      }
    }

    setPost(targetPost);
    setRelatedPosts(postsList.filter((p) => p.slug !== slug).slice(0, 3));

    // Load comments
    const savedComments = localStorage.getItem(`comments_${slug}`);
    setComments(savedComments ? JSON.parse(savedComments) : []);
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [slug]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentContent.trim()) {
      toast.error("Vui lòng nhập họ tên và nội dung bình luận!");
      return;
    }

    const newComment: Comment = {
      id: "comment-" + Date.now(),
      name: commentName,
      content: commentContent,
      date: new Date().toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`comments_${slug}`, JSON.stringify(updatedComments));

    setCommentContent("");
    toast.success("Bình luận đã được đăng thành công!");
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

  const getHeadings = () => {
    if (!post?.content) return [];
    const lines = post.content.split("\n");
    return lines
      .filter((line: string) => line.startsWith("## "))
      .map((line: string) => {
        const text = line.replace("## ", "").trim();
        const id = text.toLowerCase()
          .replace(/[^a-z0-9\s]+/g, "")
          .replace(/\s+/g, "-");
        return { text, id };
      });
  };

  const headings = getHeadings();

  const renderContent = () => {
    if (!post?.content) return null;
    const blocks = post.content.split("\n\n");
    return blocks.map((block: string, idx: number) => {
      const trimmed = block.trim();

      if (trimmed.startsWith("## ")) {
        const text = trimmed.replace("## ", "").trim();
        const id = text.toLowerCase()
          .replace(/[^a-z0-9\s]+/g, "")
          .replace(/\s+/g, "-");
        return (
          <h2 key={idx} id={id} className="text-xl font-bold text-primary mt-8 mb-4 border-b pb-2 scroll-mt-20">
            {text}
          </h2>
        );
      }

      if (trimmed.startsWith("- ")) {
        const items = trimmed.split("\n").map((item) => item.replace("- ", "").trim());
        return (
          <ul key={idx} className="list-disc list-inside my-4 pl-4 space-y-1.5 text-foreground/80 leading-relaxed text-sm">
            {items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        );
      }

      if (trimmed.startsWith("|")) {
        const rows = trimmed.split("\n").map((row) =>
          row
            .split("|")
            .map((cell) => cell.trim())
            .filter((cell, i, arr) => i > 0 && i < arr.length - 1)
        );
        const dataRows = rows.filter((r) => r.length > 0 && !r.every((c) => c.startsWith(":") || c.startsWith("-")));
        if (dataRows.length === 0) return null;

        const headers = dataRows[0];
        const body = dataRows.slice(1);

        return (
          <div key={idx} className="my-6 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-xs">
              <thead className="bg-muted text-muted-foreground border-b font-semibold">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="p-3 text-left font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {body.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    {row.map((cell, j) => {
                      const isBold = cell.startsWith("**") && cell.endsWith("**");
                      const cleanCell = cell.replace(/\*\*/g, "");
                      return (
                        <td key={j} className={`p-3 ${isBold ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                          {cleanCell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      return (
        <p key={idx} className="my-4 text-foreground/80 leading-relaxed text-sm text-justify whitespace-pre-line">
          {trimmed}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-muted-foreground">
          <div className="animate-spin size-8 border-t-2 border-b-2 border-primary rounded-full mb-3"></div>
          Đang tải chi tiết bài viết...
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-muted-foreground container-page">
          <h2 className="text-xl font-bold text-foreground">Không tìm thấy bài viết</h2>
          <p className="text-sm mt-1 mb-4">Bài viết này không tồn tại hoặc chưa được xuất bản.</p>
          <Button asChild>
            <Link to="/tin-tuc">Quay lại Trang tin tức</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container-page py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground/80 mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <ChevronRight className="h-3 w-3 opacity-60" />
          <Link to="/tin-tuc" className="hover:text-primary transition-colors">Tin tức</Link>
          <ChevronRight className="h-3 w-3 opacity-60" />
          <span className="text-primary font-bold px-2 py-0.5 rounded bg-primary/10">
            {post.category || "Tin tức"}
          </span>
          <ChevronRight className="h-3 w-3 opacity-60 hidden md:inline" />
          <span className="text-foreground font-semibold truncate hidden md:inline max-w-sm">
            {post.title}
          </span>
        </nav>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left Main Article */}
          <article className="bg-card rounded-2xl border border-border/50 p-6 lg:p-8 shadow-card">
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <Badge className="bg-primary/10 text-primary border-none font-bold py-0.5 px-2.5 rounded-full shadow-inner">
                {post.category || "Tin tức"}
              </Badge>
              <div className="flex items-center gap-1">
                <CalendarDays className="size-3.5" />
                <span>{new Date(post.published_at || post.created_at).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="size-3.5" />
                <span>5 phút đọc</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="size-3.5" />
                <span>450 lượt xem</span>
              </div>
            </div>

            <h1 className="mt-4 text-2xl md:text-3xl font-extrabold leading-tight tracking-tight text-primary">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-border/60 py-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback className="bg-primary text-white font-bold">
                    {(post.author || "N").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-bold text-foreground">{post.author || "Ban biên tập"}</div>
                  <div className="text-[10px] text-muted-foreground font-medium">Chuyên viên phân tích thị trường</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleShare} className="h-9 gap-1.5 rounded-lg border-border text-xs">
                  <Share2 className="size-3.5" /> Chia sẻ
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-border">
                  <Bookmark className="size-3.5" />
                </Button>
              </div>
            </div>

            {post.excerpt && (
              <div className="mt-6 border-l-4 border-teal bg-teal/5 p-4 rounded-r-xl">
                <p className="text-sm italic text-foreground/80 leading-relaxed font-medium">
                  "{post.excerpt}"
                </p>
              </div>
            )}

            {headings.length > 0 && (
              <Card className="mt-6 border-border bg-slate-50/50 p-4 rounded-xl shadow-inner">
                <h3 className="font-bold text-primary text-sm flex items-center gap-2 mb-2">
                  <MessageSquare className="size-4" /> Mục lục bài viết
                </h3>
                <nav className="space-y-2">
                  {headings.map((h: { id: string; text: string }, i: number) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className="block text-xs font-semibold text-foreground/70 hover:text-primary hover:underline transition-colors flex gap-2"
                    >
                      <span className="text-teal font-bold">{i + 1}.</span>
                      <span>{h.text}</span>
                    </a>
                  ))}
                </nav>
              </Card>
            )}

            {post.cover_image && (
              <div className="mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-border/40 shadow-card bg-muted">
                <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="mt-6 pr-1 prose max-w-none text-foreground">
              {renderContent()}
            </div>

            {/* Specialist Profile Contact Card */}
            <div className="mt-12 bg-gradient-to-br from-primary/5 to-teal/5 rounded-2xl border border-border/60 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-md">
                  <AvatarImage src={agentAvatar} alt="Nguyễn Văn Trịnh" className="object-cover" />
                  <AvatarFallback className="bg-primary text-white font-bold">NVT</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h3 className="font-bold text-base text-foreground">Nguyễn Văn Trịnh</h3>
                    <Badge className="bg-orange text-orange-foreground font-semibold text-[10px] py-0 px-2 rounded-full border-none">
                      Chuyên viên BĐS
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground font-semibold mt-0.5">QTC Land — Hơn 8 năm kinh nghiệm tại TP.HCM & Đà Nẵng</div>
                  <p className="mt-2 text-xs text-muted-foreground italic leading-relaxed">
                    "Tôi chuyên tư vấn các dòng sản phẩm bất động sản căn hộ, nhà liền kề, và biệt thự biển. Hãy liên hệ với tôi để nhận được thông tin chính sách tốt nhất và chi tiết bảng giá dự án."
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2.5 justify-center sm:justify-start">
                    <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-xl h-9">
                      <a href="https://zalo.me/0979239395" target="_blank" rel="noreferrer" className="flex items-center gap-1">
                        <MessageCircle className="size-4" /> Chat Zalo (0979239395)
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="border-primary/20 text-primary hover:bg-primary/5 text-xs font-semibold rounded-xl h-9">
                      <a href="tel:0979239395">
                        <Phone className="size-4 mr-1" /> Gọi điện tư vấn
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment Section */}
            <div className="mt-12 border-t pt-8">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-6">
                <MessageSquare className="size-5" /> Bình luận ({comments.length})
              </h3>

              <form onSubmit={handleCommentSubmit} className="space-y-4 mb-8 bg-slate-50/50 p-4 rounded-xl border border-border">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Gửi bình luận mới</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    placeholder="Họ và tên của bạn *"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    required
                    className="bg-white h-10 border-border text-sm"
                  />
                </div>
                <Textarea
                  placeholder="Viết nội dung bình luận của bạn tại đây... *"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  required
                  rows={4}
                  className="bg-white border-border text-sm"
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-lg h-10 px-4 text-xs font-bold flex items-center gap-1.5 ml-auto">
                  <Send className="size-3.5" /> Gửi bình luận
                </Button>
              </form>

              {comments.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground italic">
                  Chưa có bình luận nào. Hãy là người đầu tiên đưa ra nhận xét!
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl border border-border bg-card shadow-sm flex items-start gap-3">
                      <Avatar className="h-9 w-9 shrink-0 border">
                        <AvatarFallback className="bg-slate-200 text-slate-700 font-bold text-xs">
                          {c.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-foreground">{c.name}</span>
                          <span className="text-[10px] text-muted-foreground">{c.date}</span>
                        </div>
                        <p className="mt-1.5 text-xs text-foreground/80 leading-relaxed whitespace-pre-line">
                          {c.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>

          {/* Right Column Sidebar */}
          <aside className="space-y-6">
            <Card className="p-5 border-border bg-gradient-to-br from-primary to-indigo-950 text-white shadow-card rounded-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-center text-teal-400">ĐĂNG KÝ TƯ VẤN BĐS</h3>
              <p className="text-[11px] text-white/80 text-center mt-1.5 leading-relaxed">
                Nhận phân tích quy hoạch phân khu chi tiết, bảng giá và chính sách bán hàng các dự án Đà Nẵng miễn phí hàng tuần.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); toast.success("Đã đăng ký nhận tin thành công!"); }} className="mt-4 space-y-3">
                <Input
                  placeholder="Số điện thoại Zalo"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white focus:text-slate-900 h-10 rounded-lg text-xs"
                />
                <Button type="submit" className="w-full bg-teal text-teal-foreground hover:bg-teal/90 rounded-lg font-bold h-10 text-xs">
                  GỬI YÊU CẦU NGAY
                </Button>
              </form>
            </Card>

            <div className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Biến động giá đất</h3>
                <span className="rounded bg-teal/10 px-2 py-1 text-xs font-semibold text-teal">Q2/2026</span>
              </div>
              <div className="space-y-3">
                {[
                  { area: "Quận Hải Châu", price: "125 - 260tr/m²", change: -0.2 },
                  { area: "Quận Sơn Trà", price: "85 - 190tr/m²", change: 0.8 },
                  { area: "Ngũ Hành Sơn", price: "48 - 130tr/m²", change: 1.5 },
                  { area: "Cẩm Lệ", price: "38 - 85tr/m²", change: -0.5 }
                ].map((p) => (
                  <div key={p.area} className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0 last:pb-0">
                    <span className="text-xs font-semibold text-foreground">{p.area}</span>
                    <div className="text-right">
                      <div className="text-xs font-bold text-foreground">{p.price}</div>
                      <div className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${p.change < 0 ? "text-destructive" : "text-emerald"}`}>
                        {p.change < 0 ? <TrendingDown className="size-3" /> : <TrendingUp className="size-3 text-emerald" />}
                        {p.change > 0 ? "+" : ""}{p.change}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {relatedPosts.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-foreground border-b pb-2">Bài viết liên quan</h3>
                <div className="space-y-3">
                  {relatedPosts.map((n) => (
                    <Link
                      key={n.id}
                      to="/tin-tuc/$slug"
                      params={{ slug: n.slug }}
                      className="group flex gap-3 rounded-lg border border-border/50 bg-card p-2.5 shadow-sm hover:shadow-card transition-shadow"
                    >
                      <img
                        src={n.cover_image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60"}
                        alt={n.title}
                        className="h-[60px] w-[80px] flex-shrink-0 rounded-md object-cover"
                      />
                      <div className="min-w-0">
                        <h4 className="line-clamp-2 text-xs font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                          {n.title}
                        </h4>
                        <div className="mt-1 text-[10px] text-muted-foreground font-semibold">
                          {new Date(n.published_at || n.created_at).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
