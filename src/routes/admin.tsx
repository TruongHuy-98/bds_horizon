import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Trash2,
  LogOut,
  Plus,
  Home,
  Building2,
  Landmark,
  Newspaper,
  LayoutDashboard,
  Search,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Calendar,
  Layers,
  MapPin,
  Tag,
  DollarSign,
  Maximize2,
  User,
  Activity,
  ArrowLeft,
  Eye,
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import ImageUploader from "@/components/admin/ImageUploader";
import type { Json } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Quản trị | Da Nang Realty" }] }),
});

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) +
  "-" +
  Math.random().toString(36).slice(2, 6);

type SectionKey = "overview" | "properties" | "projects" | "news";
type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];
type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type NewsPostRow = Database["public"]["Tables"]["news_posts"]["Row"];

/* ---------- Local DB Mock Helper for Offline Mode ---------- */
const LOCAL_DB = {
  getProperties: (): PropertyRow[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("mock_properties");
    if (!data) {
      const seed: any[] = [
        {
          id: "prop-1",
          title: "Căn hộ Luxury Horizon View Sông Hàn",
          slug: "can-ho-luxury-horizon-view-song-han",
          description: "Căn hộ cao cấp với tầm nhìn trực diện Sông Hàn và cầu Rồng. Thiết kế hiện đại tiêu chuẩn 5 sao, full nội thất cao cấp nhập khẩu từ Ý. Tích hợp đầy đủ các tiện ích bể bơi vô cực, gym, khu BBQ.",
          price_label: "4.5 tỷ",
          area: 85,
          address: "Trần Hưng Đạo, Sơn Trà",
          district: "Sơn Trà",
          property_type: "Căn hộ",
          image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60",
          published: true,
          created_at: new Date().toISOString()
        },
        {
          id: "prop-2",
          title: "Biệt thự Đảo Kim Cương Hòa Xuân",
          slug: "biet-thu-dao-kim-cuong-hoa-xuan",
          description: "Biệt thự ven sông đắc địa, khu đô thị sinh thái Hòa Xuân. Gồm 5 phòng ngủ master, hồ bơi tràn bờ riêng, sân vườn rộng thoáng mát thích hợp nghỉ dưỡng gia đình.",
          price_label: "18 tỷ",
          area: 300,
          address: "Đảo Vip, Hòa Xuân, Cẩm Lệ",
          district: "Cẩm Lệ",
          property_type: "Biệt thự",
          image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
          published: true,
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "prop-3",
          title: "Đất nền dự án FPT City Đà Nẵng",
          slug: "dat-nen-du-an-fpt-city-da-nang",
          description: "Lô đất đẹp block V5 trục thông sát sông Cổ Cò, gần trường đại học FPT và trục chính Nam Kỳ Khởi Nghĩa. Hạ tầng hoàn thiện, sổ đỏ trao tay.",
          price_label: "3.2 tỷ",
          area: 108,
          address: "Khu đô thị FPT City, Ngũ Hành Sơn",
          district: "Ngũ Hành Sơn",
          property_type: "Đất nền",
          image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60",
          published: false,
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      localStorage.setItem("mock_properties", JSON.stringify(seed));
      return seed as PropertyRow[];
    }
    return JSON.parse(data);
  },
  saveProperty: (item: Omit<PropertyRow, "id" | "created_at" | "updated_at" | "created_by" | "images" | "tags" | "status" | "bathrooms" | "bedrooms" | "listing_type" | "price"> & { id?: string; updated_at?: string; created_by?: string | null; images?: any; tags?: string[] | null; status?: string | null; bathrooms?: number | null; bedrooms?: number | null; listing_type?: string | null; price?: number | null }): PropertyRow[] => {
    const list = LOCAL_DB.getProperties();
    if (item.id) {
      const index = list.findIndex(p => p.id === item.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...item } as PropertyRow;
      }
    } else {
      const newItem: PropertyRow = {
        ...item,
        id: "prop-" + Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString()
      } as PropertyRow;
      list.unshift(newItem);
    }
    localStorage.setItem("mock_properties", JSON.stringify(list));
    return list;
  },
  deleteProperty: (id: string): PropertyRow[] => {
    const list = LOCAL_DB.getProperties().filter(p => p.id !== id);
    localStorage.setItem("mock_properties", JSON.stringify(list));
    return list;
  },
  togglePublishProperty: (id: string): PropertyRow[] => {
    const list = LOCAL_DB.getProperties();
    const index = list.findIndex(p => p.id === id);
    if (index !== -1) {
      list[index].published = !list[index].published;
    }
    localStorage.setItem("mock_properties", JSON.stringify(list));
    return list;
  },

  // Projects
  getProjects: (): ProjectRow[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("mock_projects");
    if (!data) {
      const seed: any[] = [
        {
          id: "proj-1",
          name: "Sun Cosmo Residence",
          slug: "sun-cosmo-residence",
          description: "Tổ hợp căn hộ cao cấp và nhà phố thương mại nằm ngay chân cầu Trần Thị Lý. View sông Hàn và trung tâm thành phố tuyệt đẹp, kiến trúc kết hợp truyền thống và hiện đại.",
          developer: "Sun Group",
          location: "Ngũ Hành Sơn, Đà Nẵng",
          scale: "3.5 ha, 2 tòa tháp",
          status: "Đang mở bán",
          price_from: "4 tỷ",
          image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60",
          published: true,
          created_at: new Date().toISOString()
        },
        {
          id: "proj-2",
          name: "The Filmore Da Nang",
          slug: "the-filmore-da-nang",
          description: "Căn hộ hạng sang nằm bên bờ sông Hàn. Tiêu chuẩn căn hộ resort thông minh kết hợp phong cách sống nghệ thuật cao cấp với nhiều tiện ích đặc quyền.",
          developer: "Filmore Development",
          location: "Bạch Đằng, Hải Châu",
          scale: "25 tầng, 206 căn hộ",
          status: "Đang bàn giao",
          price_from: "5.5 tỷ",
          image_url: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&auto=format&fit=crop&q=60",
          published: true,
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      localStorage.setItem("mock_projects", JSON.stringify(seed));
      return seed as ProjectRow[];
    }
    return JSON.parse(data);
  },
  saveProject: (item: Omit<ProjectRow, "id" | "created_at" | "updated_at" | "created_by" | "images"> & { id?: string; updated_at?: string; created_by?: string | null; images?: any }): ProjectRow[] => {
    const list = LOCAL_DB.getProjects();
    if (item.id) {
      const index = list.findIndex(p => p.id === item.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...item } as ProjectRow;
      }
    } else {
      const newItem: ProjectRow = {
        ...item,
        id: "proj-" + Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString()
      } as ProjectRow;
      list.unshift(newItem);
    }
    localStorage.setItem("mock_projects", JSON.stringify(list));
    return list;
  },
  deleteProject: (id: string): ProjectRow[] => {
    const list = LOCAL_DB.getProjects().filter(p => p.id !== id);
    localStorage.setItem("mock_projects", JSON.stringify(list));
    return list;
  },
  togglePublishProject: (id: string): ProjectRow[] => {
    const list = LOCAL_DB.getProjects();
    const index = list.findIndex(p => p.id === id);
    if (index !== -1) {
      list[index].published = !list[index].published;
    }
    localStorage.setItem("mock_projects", JSON.stringify(list));
    return list;
  },

  // News
  getNews: (): NewsPostRow[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("mock_news");
    if (!data) {
      const seed: any[] = [
        {
          id: "news-1",
          title: "Thị trường Bất động sản Đà Nẵng quý 2/2026 tăng trưởng tích cực",
          slug: "thi-truong-bat-dong-san-da-nang-quy-2-2026-tang-truong-tich-cuc",
          excerpt: "Báo cáo thị trường cho thấy phân khúc căn hộ và đất nền vùng ven đang ghi nhận giao dịch tăng từ 15-20% so với cùng kỳ.",
          content: "Nền kinh tế phục hồi mạnh mẽ cùng các chính sách hạ lãi suất đã thúc đẩy dòng tiền quay trở lại thị trường bất động sản. Đà Nẵng với vai trò trung tâm du lịch và kinh tế miền Trung đang là điểm sáng thu hút đầu tư lớn nhờ pháp lý hoàn thiện và quy hoạch đồng bộ.",
          author: "Nguyễn Minh Khang",
          category: "Thị trường BĐS",
          cover_image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60",
          published: true,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: "news-2",
          title: "Đà Nẵng công bố bản đồ quy hoạch phân khu đô thị mới đến năm 2030",
          slug: "da-nang-cong-bo-ban-do-quy-hoach-phan-khu-do-thi-moi-den-nam-2030",
          excerpt: "Thông tin chi tiết quy hoạch các quận Sơn Trà, Ngũ Hành Sơn và mở rộng về phía Nam Hòa Xuân.",
          content: "Ủy ban nhân dân thành phố vừa phê duyệt đồ án quy hoạch phân khu mới nhằm kéo giãn mật độ dân cư trung tâm thành phố và mở rộng hành lang phát triển kinh tế phía Nam. Việc này tạo động lực tăng trưởng cực lớn cho khu vực...",
          author: "Phạm Thanh Thảo",
          category: "Quy hoạch & Pháp lý",
          cover_image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
          published: true,
          published_at: new Date(Date.now() - 86400000).toISOString(),
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      localStorage.setItem("mock_news", JSON.stringify(seed));
      return seed as NewsPostRow[];
    }
    return JSON.parse(data);
  },
  saveNews: (item: Omit<NewsPostRow, "id" | "created_at" | "published_at" | "created_by" | "updated_at"> & { id?: string; created_by?: string | null; updated_at?: string }): NewsPostRow[] => {
    const list = LOCAL_DB.getNews();
    if (item.id) {
      const index = list.findIndex(p => p.id === item.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...item } as NewsPostRow;
      }
    } else {
      const newItem: NewsPostRow = {
        ...item,
        id: "news-" + Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString(),
        published_at: item.published ? new Date().toISOString() : null
      } as NewsPostRow;
      list.unshift(newItem);
    }
    localStorage.setItem("mock_news", JSON.stringify(list));
    return list;
  },
  deleteNews: (id: string): NewsPostRow[] => {
    const list = LOCAL_DB.getNews().filter(p => p.id !== id);
    localStorage.setItem("mock_news", JSON.stringify(list));
    return list;
  },
  togglePublishNews: (id: string): NewsPostRow[] => {
    const list = LOCAL_DB.getNews();
    const index = list.findIndex(p => p.id === id);
    if (index !== -1) {
      list[index].published = !list[index].published;
      list[index].published_at = list[index].published ? new Date().toISOString() : null;
    }
    localStorage.setItem("mock_news", JSON.stringify(list));
    return list;
  }
};

const navItems: { key: SectionKey; label: string; icon: any }[] = [
  { key: "overview", label: "Tổng quan", icon: LayoutDashboard },
  { key: "properties", label: "Tin đăng bán/thuê", icon: Building2 },
  { key: "projects", label: "Dự án BĐS", icon: Landmark },
  { key: "news", label: "Tin tức & Sự kiện", icon: Newspaper },
];

function AdminPage() {
  const { user: realUser, role, isAdmin, isBroker, isCollaborator, isGuest, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [grantingSelf, setGrantingSelf] = useState(false);
  const [section, setSection] = useState<SectionKey>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Check if mock mode is enabled in localStorage
  const isMock = typeof window !== "undefined" && !!localStorage.getItem("bds_mock_role");
  const isMockAdmin = isMock && localStorage.getItem("bds_mock_role") === "admin";
  const user = realUser;
  const loading = authLoading;

  useEffect(() => {
    // If not loading, and user is guest/normal customer, direct to auth
    if (!loading && isGuest && !isMock) {
      navigate({ to: "/auth" });
    }
  }, [loading, isGuest, isMock]);

  const makeMeAdmin = async () => {
    if (!realUser) return;
    setGrantingSelf(true);
    const { error } = await supabase.from("user_roles").insert({ user_id: realUser.id, role: "admin" });
    setGrantingSelf(false);
    if (error) {
      toast.error("Không thể tự cấp quyền admin.");
    } else {
      toast.success("Đã cấp quyền admin. Tải lại trang...");
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const handleSignOut = async () => {
    if (isMock) {
      localStorage.removeItem("bds_mock_role");
      localStorage.removeItem("bds_mock_admin");
      toast.success("Đã thoát chế độ Demo");
      navigate({ to: "/auth" });
    } else {
      await supabase.auth.signOut();
      navigate({ to: "/auth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <div className="text-sm text-slate-400 font-medium">Đang xác thực tài khoản...</div>
      </div>
    );
  }

  // Unauthorized page for normal registered users/guests (Khách hàng)
  if (role === "user" || isGuest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B192C] px-4 py-12 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-teal-900/10 blur-[120px] pointer-events-none"></div>

        <Card className="max-w-md w-full p-8 space-y-6 bg-slate-900/80 border-slate-800 backdrop-blur-xl text-white shadow-2xl relative z-10">
          <div className="text-center space-y-2">
            <div className="mx-auto size-14 rounded-2xl bg-red-950 text-red-400 flex items-center justify-center border border-red-800">
              <AlertCircle className="size-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-red-400">
              Không Có Quyền Truy Cập
            </h1>
            <p className="text-sm text-slate-400">
              Giao diện quản trị chỉ dành cho Admin, Nhà Môi Giới hoặc Cộng tác viên. Tài khoản của bạn là Khách hàng.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Button 
              onClick={() => navigate({ to: "/auth" })}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 font-medium transition-all duration-200"
            >
              Chuyển đổi tài khoản khác
            </Button>
            <Button 
              asChild
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium"
            >
              <Link to="/">Quay về Trang chủ</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Filter sidebar navigation items based on Role
  const filteredNavItems = navItems.filter((item) => {
    if (isAdmin) return true;
    if (isBroker && item.key === "properties") return true;
    if (isCollaborator && item.key === "news") return true;
    if (item.key === "overview") return true; // Everyone sees overview
    return false;
  });

  const currentNavKeys = filteredNavItems.map(item => item.key);
  const activeSection = currentNavKeys.includes(section) ? section : currentNavKeys[0] || "overview";
  const currentSection = navItems.find((n) => n.key === activeSection)!;

  // Render role text badge
  const roleLabel = isAdmin ? "Quản trị viên" : isBroker ? "Nhà Môi Giới" : "Cộng tác viên";

  return (
    <div className="h-screen overflow-hidden flex bg-slate-50/50 text-slate-900 relative">
      
      {/* ---------- MOBILE SIDEBAR DRAWER OVERLAY ---------- */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ---------- LEFT SIDEBAR ---------- */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-[#0B192C] text-slate-200 flex flex-col z-50 transition-transform duration-300 ease-in-out border-r border-slate-800/80 shadow-xl
        lg:translate-x-0 lg:static lg:h-full lg:shrink-0
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/60">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-95 transition-opacity">
            <div className="size-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/10">
              H
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wider uppercase bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Horizon Realty</span>
              <span className="text-[10px] text-teal-400 font-semibold tracking-wider uppercase">Bảng Quản Trị</span>
            </div>
          </Link>
          <button className="lg:hidden p-1 text-slate-400 hover:text-white" onClick={() => setMobileOpen(false)}>
            <X className="size-5" />
          </button>
        </div>

        {/* Admin Card */}
        <div className="p-4 mx-4 my-3 bg-slate-800/40 border border-slate-800/50 rounded-xl flex items-center gap-3">
          <div className="size-10 rounded-full bg-gradient-to-tr from-blue-600/30 to-teal-500/20 flex items-center justify-center text-blue-400 font-semibold border border-blue-500/20">
            {role.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate">{isMock ? `Mock ${roleLabel}` : user?.email}</div>
            <div className="text-[10px] text-teal-400 flex items-center gap-1 font-medium mt-0.5">
              <span className="size-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              {isMock ? "Mock Mode (Local)" : roleLabel}
            </div>
          </div>
        </div>

        {/* Sidebar Content (Navigation) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-7">
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">QUẢN LÝ HỆ THỐNG</div>
            <nav className="space-y-1">
              {filteredNavItems.map((item) => {
                const isActive = activeSection === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setSection(item.key);
                      setMobileOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                      ${isActive 
                        ? "bg-blue-600/10 text-blue-400 border-l-4 border-blue-500 pl-2 font-semibold" 
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`size-4.5 transition-colors ${isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`size-3.5 transition-transform duration-200 opacity-0 group-hover:opacity-100 ${isActive ? "opacity-100 text-blue-400 translate-x-0.5" : "text-slate-500"}`} />
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-semibold">TRANG CHỦ</div>
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-all duration-200"
            >
              <Home className="size-4.5 text-slate-400" />
              <span>Quay về Website chính</span>
            </Link>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/60 space-y-2.5">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/20 font-medium py-2 px-3 h-auto"
            onClick={handleSignOut}
          >
            <LogOut className="size-4 mr-3 text-red-400" />
            Đăng xuất
          </Button>
          <div className="text-[10px] text-slate-600 text-center">
            BDS Horizon Admin v1.2
          </div>
        </div>
      </aside>

      {/* ---------- RIGHT CONTENT INSET ---------- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <header className="h-16 flex items-center justify-between border-b bg-white px-6 sticky top-0 z-30 shadow-sm shadow-slate-100">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </button>
            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
              <span className="text-slate-400">Admin</span>
              <ChevronRight className="size-3 text-slate-300" />
              <span className="text-slate-950 font-bold flex items-center gap-2">
                <currentSection.icon className="size-4 text-blue-600" />
                {currentSection.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isMock && (
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border border-amber-200 py-1 px-2.5 text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="size-2 rounded-full bg-amber-500 animate-ping"></span>
                Mock Mode Active ({role.toUpperCase()})
              </Badge>
            )}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Calendar className="size-3.5 text-slate-400" />
              <span>{new Date().toLocaleDateString("vi-VN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                {role.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:inline-block text-xs font-bold text-slate-700">{isMock ? `Mock ${roleLabel}` : user?.email?.split('@')[0]}</span>
            </div>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          {activeSection === "overview" && <Overview onGo={setSection} isMock={isMock} />}
          {activeSection === "properties" && <PropertiesManager isMock={isMock} />}
          {activeSection === "projects" && <ProjectsManager isMock={isMock} />}
          {activeSection === "news" && <NewsManager isMock={isMock} />}
        </main>

      </div>
    </div>
  );
}

/* ---------- 1. OVERVIEW SECTION ---------- */
function Overview({ onGo, isMock }: { onGo: (s: SectionKey) => void; isMock: boolean }) {
  const [counts, setCounts] = useState({ properties: 0, projects: 0, news: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (isMock) {
        setCounts({
          properties: LOCAL_DB.getProperties().length,
          projects: LOCAL_DB.getProjects().length,
          news: LOCAL_DB.getNews().length,
        });
      } else {
        try {
          const [p, pr, n] = await Promise.all([
            supabase.from("properties").select("id", { count: "exact", head: true }),
            supabase.from("projects").select("id", { count: "exact", head: true }),
            supabase.from("news_posts").select("id", { count: "exact", head: true }),
          ]);
          setCounts({
            properties: p.count || 0,
            projects: pr.count || 0,
            news: n.count || 0,
          });
        } catch (e) {
          console.error("Overview error, falling back to mock:", e);
          setCounts({
            properties: LOCAL_DB.getProperties().length,
            projects: LOCAL_DB.getProjects().length,
            news: LOCAL_DB.getNews().length,
          });
        }
      }
      setLoading(false);
    })();
  }, [isMock]);

  const cards: { key: SectionKey; label: string; value: number; icon: any; color: string; desc: string }[] = [
    { 
      key: "properties", 
      label: "Tin đăng bất động sản", 
      value: counts.properties, 
      icon: Building2,
      color: "from-blue-600 to-indigo-500",
      desc: "Tin mua bán, cho thuê nhà đất",
    },
    { 
      key: "projects", 
      label: "Dự án bất động sản", 
      value: counts.projects, 
      icon: Landmark,
      color: "from-teal-500 to-emerald-400",
      desc: "Dự án đô thị, căn hộ quy mô",
    },
    { 
      key: "news", 
      label: "Tin bài tin tức", 
      value: counts.news, 
      icon: Newspaper,
      color: "from-amber-500 to-orange-400",
      desc: "Tin quy hoạch, thị trường BĐS",
    },
  ];

  const recentActivities = [
    { action: "Đăng tin mới", target: "Căn hộ Luxury Horizon View Sông Hàn", time: "Vừa xong", user: "Admin" },
    { action: "Chỉnh sửa dự án", target: "Sun Cosmo Residence", time: "10 phút trước", user: "Admin" },
    { action: "Bật công khai bài viết", target: "Đà Nẵng công bố bản đồ quy hoạch...", time: "1 giờ trước", user: "Admin" },
    { action: "Xóa tin đăng tạm", target: "Đất nền dự án Hòa Xuân giá rẻ", time: "3 giờ trước", user: "Admin" },
  ];

  return (
    <div className="space-y-6">
      {/* Header section card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 sm:p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12 select-none">
          <Activity className="size-72 text-white" />
        </div>
        <div className="relative z-10 space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Xin chào, Chào mừng bạn trở lại!</h2>
          <p className="text-sm text-slate-300 max-w-xl">
            Đây là giao diện điều hành chính của hệ thống cổng thông tin BDS Horizon. Tại đây bạn có thể quản lý, kiểm duyệt toàn bộ tin đăng bất động sản, dự án quy hoạch và tin tức nóng hổi trong ngày.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c) => (
          <Card
            key={c.key}
            className="group p-6 cursor-pointer hover:shadow-lg border-slate-100 hover:border-slate-200/80 transition-all duration-300 bg-white relative overflow-hidden"
            onClick={() => onGo(c.key)}
          >
            {/* Top Indicator bar */}
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{c.label}</p>
                {loading ? (
                  <div className="h-9 w-16 bg-slate-100 animate-pulse rounded-md mt-1"></div>
                ) : (
                  <p className="text-3xl font-bold text-slate-950 tracking-tight mt-1">{c.value}</p>
                )}
              </div>
              <div className={`size-12 rounded-xl bg-gradient-to-tr ${c.color} text-white flex items-center justify-center shadow-lg shadow-blue-500/5 group-hover:scale-110 transition-transform duration-300`}>
                <c.icon className="size-6" />
              </div>
            </div>
            
            <div className="text-xs text-slate-400 font-medium mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
              <span>{c.desc}</span>
              <span className="text-blue-600 hover:underline inline-flex items-center gap-0.5">
                Quản lý <ArrowUpRight className="size-3" />
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Stats Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Recent Activities List */}
        <Card className="lg:col-span-2 p-6 border-slate-100 bg-white space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Activity className="size-5 text-blue-600" />
              Nhật ký hoạt động hệ thống
            </h3>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 font-semibold border-none">
              Thời gian thực
            </Badge>
          </div>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivities.map((act, actIdx) => (
                <li key={actIdx}>
                  <div className="relative pb-8">
                    {actIdx !== recentActivities.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`size-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                          act.action.includes("Đăng") ? "bg-emerald-50 text-emerald-600" :
                          act.action.includes("Chỉnh") ? "bg-blue-50 text-blue-600" :
                          act.action.includes("Xóa") ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600"
                        }`}>
                          <Activity className="size-4" />
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-slate-600">
                            <span className="font-bold text-slate-900">{act.action}</span>:{" "}
                            <span className="text-slate-700 italic">"{act.target}"</span>
                          </p>
                        </div>
                        <div className="text-right text-xs whitespace-nowrap text-slate-400 font-medium">
                          <span>{act.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* System info Card */}
        <Card className="p-6 border-slate-100 bg-white space-y-4">
          <h3 className="font-bold text-slate-900 text-base pb-2 border-b">Thông số Server</h3>
          <div className="space-y-4 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Bộ nhớ máy chủ (RAM)</span>
                <span className="text-slate-800">42% (1.68GB/4.0GB)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full" style={{ width: "42%" }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>CPU Load</span>
                <span className="text-slate-800">12%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full" style={{ width: "12%" }}></div>
              </div>
            </div>

            <div className="pt-2 space-y-2 text-xs text-slate-500 font-medium">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span>Database Client</span>
                <span className="font-bold text-slate-800">Supabase v2.106</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span>Môi trường</span>
                <Badge variant="outline" className="text-[10px] font-bold py-0 h-4 border-slate-200">
                  {isMock ? "LOCAL_MOCK_ENV" : "PRODUCTION"}
                </Badge>
              </div>
              <div className="flex justify-between py-1.5">
                <span>Thời gian hoạt động (Uptime)</span>
                <span className="font-bold text-slate-800">99.99%</span>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}

/* ---------- 2. PROPERTIES MANAGER ---------- */
function PropertiesManager({ isMock }: { isMock: boolean }) {
  const { user, isAdmin } = useAuth();
  const [items, setItems] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("all");
  const [filterType, setFilterType] = useState("all");
  
  // Selected property for editing (if null, then we are in Create mode)
  const [editingItem, setEditingItem] = useState<PropertyRow | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price_label: "",
    area: "",
    address: "",
    district: "",
    property_type: "Căn hộ",
    image_url: "",
    images: [] as string[],
    published: true,
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    if (isMock) {
      const mockRole = localStorage.getItem("bds_mock_role");
      let mockList = LOCAL_DB.getProperties();
      if (mockRole === "broker") {
        mockList = mockList.map((p, idx) => idx < 2 ? { ...p, created_by: "mock-broker-id" } : p);
        mockList = mockList.filter(p => p.created_by === "mock-broker-id");
      }
      setItems(mockList);
    } else {
      try {
        let query = supabase.from("properties").select("*");
        if (!isAdmin) {
          query = query.eq("created_by", user?.id || "");
        }
        const { data, error } = await query.order("created_at", { ascending: false });
        if (error) throw error;
        setItems(data || []);
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to mock storage:", err);
        setItems(LOCAL_DB.getProperties());
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [isMock]);

  // When edit icon is clicked
  const handleStartEdit = (it: PropertyRow) => {
    setEditingItem(it);
    setForm({
      title: it.title,
      description: it.description || "",
      price_label: it.price_label || "",
      area: it.area ? String(it.area) : "",
      address: it.address || "",
      district: it.district || "",
      property_type: it.property_type || "Căn hộ",
      image_url: it.image_url || "",
      images: Array.isArray(it.images) ? (it.images as string[]) : it.image_url ? [it.image_url] : [],
      published: it.published ?? true,
    });
  };

  // When cancel edit button is clicked
  const handleCancelEdit = () => {
    setEditingItem(null);
    setForm({
      title: "",
      description: "",
      price_label: "",
      area: "",
      address: "",
      district: "",
      property_type: "Căn hộ",
      image_url: "",
      images: [] as string[],
      published: true,
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      slug: editingItem ? editingItem.slug : slugify(form.title),
      description: form.description || null,
      price_label: form.price_label || null,
      area: form.area ? Number(form.area) : null,
      address: form.address || null,
      district: form.district || null,
      property_type: form.property_type,
      image_url: form.image_url || null,
      images: form.images as Json,
      published: form.published,
      created_by: editingItem ? editingItem.created_by : (user?.id || null),
    };

    if (isMock) {
      try {
        if (editingItem) {
          LOCAL_DB.saveProperty({ ...payload, id: editingItem.id });
          toast.success("Đã cập nhật tin đăng thành công (Mock DB)");
        } else {
          LOCAL_DB.saveProperty(payload);
          toast.success("Đã đăng tin mới thành công (Mock DB)");
        }
        handleCancelEdit();
        load();
      } catch (err: any) {
        console.error("Local save error:", err);
        toast.error(`Không thể lưu (Mock DB): Dung lượng LocalStorage có thể đã đầy do ảnh Base64 quá lớn! Chi tiết: ${err.message}`);
      } finally {
        setSaving(false);
      }
    } else {
      try {
        let error;
        if (editingItem) {
          const res = await supabase.from("properties").update(payload).eq("id", editingItem.id);
          error = res.error;
        } else {
          const res = await supabase.from("properties").insert(payload);
          error = res.error;
        }
        if (error) throw error;
        toast.success(editingItem ? "Đã lưu thay đổi" : "Đã đăng tin thành công");
        handleCancelEdit();
        load();
      } catch (err: any) {
        toast.error(`Có lỗi xảy ra: ${err.message}`);
      } finally {
        setSaving(false);
      }
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tin đăng này?")) return;
    
    if (isMock) {
      LOCAL_DB.deleteProperty(id);
      toast.success("Đã xóa tin đăng (Mock DB)");
      if (editingItem && editingItem.id === id) handleCancelEdit();
      load();
    } else {
      try {
        const { error } = await supabase.from("properties").delete().eq("id", id);
        if (error) throw error;
        toast.success("Đã xóa tin đăng");
        if (editingItem && editingItem.id === id) handleCancelEdit();
        load();
      } catch (err: any) {
        toast.error(`Không thể xóa: ${err.message}`);
      }
    }
  };

  const togglePublish = async (it: PropertyRow) => {
    if (isMock) {
      LOCAL_DB.togglePublishProperty(it.id);
      toast.success("Đã thay đổi trạng thái hiển thị (Mock DB)");
      load();
    } else {
      try {
        const { error } = await supabase
          .from("properties")
          .update({ published: !it.published })
          .eq("id", it.id);
        if (error) throw error;
        toast.success("Đã cập nhật trạng thái hiển thị");
        load();
      } catch (err: any) {
        toast.error(`Lỗi: ${err.message}`);
      }
    }
  };

  // Filtering items
  const filteredItems = items.filter((it) => {
    const matchesSearch = it.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (it.address && it.address.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDistrict = filterDistrict === "all" || it.district === filterDistrict;
    const matchesType = filterType === "all" || it.property_type === filterType;
    return matchesSearch && matchesDistrict && matchesType;
  });

  const uniqueDistricts = Array.from(new Set(items.map((i) => i.district).filter(Boolean)));
  const uniqueTypes = Array.from(new Set(items.map((i) => i.property_type).filter(Boolean)));

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT COLUMN: LIST VIEW */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="relative w-full flex-1">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm tiêu đề, địa chỉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-50/50 border-slate-200/80 focus-visible:ring-blue-500/30"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="text-xs font-medium bg-white border border-slate-200 rounded-lg p-2 flex-1 sm:flex-initial focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Tất cả Quận/Huyện</option>
              {uniqueDistricts.map((d) => (
                <option key={d} value={d!}>{d}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs font-medium bg-white border border-slate-200 rounded-lg p-2 flex-1 sm:flex-initial focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Tất cả Loại tin</option>
              {uniqueTypes.map((t) => (
                <option key={t} value={t!}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <Card className="border-slate-100 overflow-hidden shadow-sm bg-white">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
            <h3 className="font-bold text-slate-900 text-sm">Danh sách tin đăng ({filteredItems.length})</h3>
            <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-none font-semibold text-xs">
              Mới nhất xếp trước
            </Badge>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <div className="animate-spin size-8 border-t-2 border-b-2 border-blue-600 rounded-full mx-auto"></div>
              <p className="text-xs font-medium">Đang tải danh sách tin...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-16 text-center text-slate-400 bg-slate-50/20">
              <Building2 className="size-12 mx-auto text-slate-300 stroke-[1.5] mb-2" />
              <p className="font-semibold text-slate-800 text-sm">Không tìm thấy tin đăng nào</p>
              <p className="text-xs text-slate-400 mt-0.5">Vui lòng điều chỉnh bộ lọc hoặc thêm tin mới bên phải</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
              {filteredItems.map((it) => (
                <div key={it.id} className="p-4 flex gap-4 hover:bg-slate-50/40 transition-colors group">
                  <div className="size-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/40 relative">
                    {it.image_url ? (
                      <img src={it.image_url} alt={it.title} className="size-full object-cover" />
                    ) : (
                      <div className="size-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <Building2 className="size-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                        {it.title}
                      </h4>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Badge
                          variant={it.published ? "default" : "secondary"}
                          className={`cursor-pointer text-[10px] font-bold py-0.5 px-2 rounded-full border-none shadow-sm ${
                            it.published ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                          onClick={() => togglePublish(it)}
                        >
                          {it.published ? "Công khai" : "Nháp"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-xs text-slate-500 font-medium flex flex-wrap gap-x-2 gap-y-1 mt-1.5">
                      <span className="text-orange-600 font-bold flex items-center gap-0.5">
                        <DollarSign className="size-3" />
                        {it.price_label || "Thỏa thuận"}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-0.5 text-indigo-600 font-semibold">
                        <Maximize2 className="size-3" />
                        {it.area ? `${it.area} m²` : "N/A"}
                      </span>
                      {it.district && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="size-3 text-slate-400" />
                            {it.district}
                          </span>
                        </>
                      )}
                      {it.property_type && (
                        <>
                          <span className="text-slate-300">•</span>
                          <Badge variant="outline" className="text-[10px] py-0 h-4 px-1.5 border-slate-200 bg-slate-50/50">
                            {it.property_type}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartEdit(it)}
                      className="size-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Sửa tin đăng"
                    >
                      <Edit2 className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(it.id)}
                      className="size-8 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Xóa tin đăng"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* RIGHT COLUMN: ACTION FORM */}
      <div className="lg:col-span-5">
        <Card className="p-6 border-slate-100 shadow-sm bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              {editingItem ? (
                <>
                  <Edit2 className="size-4 text-blue-600" /> Cập nhật tin đăng
                </>
              ) : (
                <>
                  <Plus className="size-4 text-blue-600" /> Đăng tin mới
                </>
              )}
            </h3>
            {editingItem && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCancelEdit}
                className="h-7 text-xs hover:bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="size-3 mr-1" /> Tạo mới
              </Button>
            )}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Tiêu đề tin đăng <span className="text-red-500">*</span></Label>
              <Input
                required
                placeholder="Ví dụ: Căn hộ nghỉ dưỡng 2PN view biển Sơn Trà..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border-slate-200/80 focus-visible:ring-blue-500/30"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Mô tả chi tiết</Label>
              <Textarea
                placeholder="Nhập thông tin mô tả chi tiết bất động sản: thiết kế, nội thất, hướng nhà, tiện ích xung quanh, tình trạng pháp lý..."
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border-slate-200/80 focus-visible:ring-blue-500/30 resize-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center gap-0.5">
                  <DollarSign className="size-3 text-slate-400" /> Giá hiển thị
                </Label>
                <Input
                  placeholder="Ví dụ: 3.5 tỷ, Thỏa thuận..."
                  value={form.price_label}
                  onChange={(e) => setForm({ ...form, price_label: e.target.value })}
                  className="border-slate-200/80 focus-visible:ring-blue-500/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center gap-0.5">
                  <Maximize2 className="size-3 text-slate-400" /> Diện tích (m²)
                </Label>
                <Input
                  type="number"
                  placeholder="Ví dụ: 85..."
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="border-slate-200/80 focus-visible:ring-blue-500/30"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center gap-0.5">
                <MapPin className="size-3 text-slate-400" /> Địa chỉ chính xác
              </Label>
              <Input
                placeholder="Số nhà, Tên đường, Phường..."
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="border-slate-200/80 focus-visible:ring-blue-500/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Quận/Huyện</Label>
                <Input
                  placeholder="Ví dụ: Sơn Trà, Ngũ Hành Sơn..."
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  className="border-slate-200/80 focus-visible:ring-blue-500/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Loại bất động sản</Label>
                <Input
                  placeholder="Ví dụ: Căn hộ, Đất nền, Biệt thự..."
                  value={form.property_type}
                  onChange={(e) => setForm({ ...form, property_type: e.target.value })}
                  className="border-slate-200/80 focus-visible:ring-blue-500/30"
                />
              </div>
            </div>

            <ImageUploader
              images={form.images}
              featuredImage={form.image_url}
              onChangeImages={(urls) => setForm(prev => ({ ...prev, images: urls }))}
              onChangeFeaturedImage={(url) => setForm(prev => ({ ...prev, image_url: url }))}
              isMock={isMock}
              label="Hình ảnh bất động sản"
            />

            <div className="flex items-center justify-between rounded-xl border border-slate-200/80 p-3 bg-slate-50/40">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800">Hiển thị công khai</div>
                <div className="text-[10px] text-slate-400 font-medium">Bật để khách truy cập website có thể xem thấy</div>
              </div>
              <Switch 
                checked={form.published} 
                onCheckedChange={(v) => setForm({ ...form, published: v })} 
              />
            </div>

            <Button 
              type="submit" 
              disabled={saving} 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-500/10 transition-all duration-300 py-5 h-auto rounded-xl"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin size-4 border-2 border-t-transparent border-white rounded-full"></span>
                  Đang xử lý...
                </span>
              ) : editingItem ? (
                "Cập nhật thay đổi"
              ) : (
                "Đăng tin ngay"
              )}
            </Button>
          </form>
        </Card>
      </div>

    </div>
  );
}

/* ---------- 3. PROJECTS MANAGER ---------- */
function ProjectsManager({ isMock }: { isMock: boolean }) {
  const [items, setItems] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDeveloper, setFilterDeveloper] = useState("all");
  const [editingItem, setEditingItem] = useState<ProjectRow | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    developer: "",
    location: "",
    scale: "",
    status: "Đang mở bán",
    price_from: "",
    image_url: "",
    images: [] as string[],
    published: true,
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    if (isMock) {
      setItems(LOCAL_DB.getProjects());
    } else {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setItems(data || []);
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to mock storage:", err);
        setItems(LOCAL_DB.getProjects());
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [isMock]);

  const handleStartEdit = (it: ProjectRow) => {
    setEditingItem(it);
    setForm({
      name: it.name,
      description: it.description || "",
      developer: it.developer || "",
      location: it.location || "",
      scale: it.scale || "",
      status: it.status || "Đang mở bán",
      price_from: it.price_from || "",
      image_url: it.image_url || "",
      images: Array.isArray(it.images) ? (it.images as string[]) : it.image_url ? [it.image_url] : [],
      published: it.published ?? true,
    });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setForm({
      name: "",
      description: "",
      developer: "",
      location: "",
      scale: "",
      status: "Đang mở bán",
      price_from: "",
      image_url: "",
      images: [] as string[],
      published: true,
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      slug: editingItem ? editingItem.slug : slugify(form.name),
      description: form.description || null,
      developer: form.developer || null,
      location: form.location || null,
      scale: form.scale || null,
      status: form.status || null,
      price_from: form.price_from || null,
      image_url: form.image_url || null,
      images: form.images as Json,
      published: form.published,
    };

    if (isMock) {
      try {
        if (editingItem) {
          LOCAL_DB.saveProject({ ...payload, id: editingItem.id });
          toast.success("Đã cập nhật dự án thành công (Mock DB)");
        } else {
          LOCAL_DB.saveProject(payload);
          toast.success("Đã thêm dự án mới thành công (Mock DB)");
        }
        handleCancelEdit();
        load();
      } catch (err: any) {
        console.error("Local save error:", err);
        toast.error(`Không thể lưu (Mock DB): Dung lượng LocalStorage có thể đã đầy! Chi tiết: ${err.message}`);
      } finally {
        setSaving(false);
      }
    } else {
      try {
        let error;
        if (editingItem) {
          const res = await supabase.from("projects").update(payload).eq("id", editingItem.id);
          error = res.error;
        } else {
          const res = await supabase.from("projects").insert(payload);
          error = res.error;
        }
        if (error) throw error;
        toast.success(editingItem ? "Đã cập nhật dự án" : "Đã đăng dự án thành công");
        handleCancelEdit();
        load();
      } catch (err: any) {
        toast.error(`Lỗi: ${err.message}`);
      } finally {
        setSaving(false);
      }
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa dự án này?")) return;
    
    if (isMock) {
      LOCAL_DB.deleteProject(id);
      toast.success("Đã xóa dự án (Mock DB)");
      if (editingItem && editingItem.id === id) handleCancelEdit();
      load();
    } else {
      try {
        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) throw error;
        toast.success("Đã xóa dự án thành công");
        if (editingItem && editingItem.id === id) handleCancelEdit();
        load();
      } catch (err: any) {
        toast.error(`Lỗi: ${err.message}`);
      }
    }
  };

  const togglePublish = async (it: ProjectRow) => {
    if (isMock) {
      LOCAL_DB.togglePublishProject(it.id);
      toast.success("Đã thay đổi hiển thị (Mock DB)");
      load();
    } else {
      try {
        const { error } = await supabase
          .from("projects")
          .update({ published: !it.published })
          .eq("id", it.id);
        if (error) throw error;
        toast.success("Đã cập nhật hiển thị");
        load();
      } catch (err: any) {
        toast.error(`Lỗi: ${err.message}`);
      }
    }
  };

  const filteredItems = items.filter((it) => {
    const matchesSearch = it.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (it.developer && it.developer.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDev = filterDeveloper === "all" || it.developer === filterDeveloper;
    return matchesSearch && matchesDev;
  });

  const uniqueDevelopers = Array.from(new Set(items.map((i) => i.developer).filter(Boolean)));

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT COLUMN: LIST VIEW */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="relative w-full flex-1">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm dự án, chủ đầu tư..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-50/50 border-slate-200/80 focus-visible:ring-blue-500/30"
            />
          </div>
          <select
            value={filterDeveloper}
            onChange={(e) => setFilterDeveloper(e.target.value)}
            className="text-xs font-medium bg-white border border-slate-200 rounded-lg p-2 w-full sm:w-auto focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Tất cả Chủ đầu tư</option>
            {uniqueDevelopers.map((d) => (
              <option key={d} value={d!}>{d}</option>
            ))}
          </select>
        </div>

        <Card className="border-slate-100 overflow-hidden shadow-sm bg-white">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
            <h3 className="font-bold text-slate-900 text-sm">Danh sách dự án ({filteredItems.length})</h3>
            <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-none font-semibold text-xs">
              Mới nhất xếp trước
            </Badge>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <div className="animate-spin size-8 border-t-2 border-b-2 border-blue-600 rounded-full mx-auto"></div>
              <p className="text-xs font-medium">Đang tải danh sách dự án...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-16 text-center text-slate-400 bg-slate-50/20">
              <Landmark className="size-12 mx-auto text-slate-300 stroke-[1.5] mb-2" />
              <p className="font-semibold text-slate-800 text-sm">Không tìm thấy dự án nào</p>
              <p className="text-xs text-slate-400 mt-0.5">Vui lòng thay đổi từ khóa hoặc tạo dự án mới</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
              {filteredItems.map((it) => (
                <div key={it.id} className="p-4 flex gap-4 hover:bg-slate-50/40 transition-colors group">
                  <div className="w-20 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/40">
                    {it.image_url ? (
                      <img src={it.image_url} alt={it.name} className="size-full object-cover" />
                    ) : (
                      <div className="size-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <Landmark className="size-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                        {it.name}
                      </h4>
                      <Badge
                        variant={it.published ? "default" : "secondary"}
                        className={`cursor-pointer text-[10px] font-bold py-0.5 px-2 rounded-full border-none shadow-sm ${
                          it.published ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                        onClick={() => togglePublish(it)}
                      >
                        {it.published ? "Hiển thị" : "Nháp"}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-slate-500 font-medium flex flex-wrap gap-x-2.5 gap-y-1 mt-1.5">
                      <span className="text-slate-800 font-bold">{it.developer || "Chưa rõ CĐT"}</span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="size-3 text-slate-400" />
                        {it.location}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-blue-600 font-semibold">Giá từ {it.price_from || "Liên hệ"}</span>
                      {it.status && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold">{it.status}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartEdit(it)}
                      className="size-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(it.id)}
                      className="size-8 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* RIGHT COLUMN: ACTION FORM */}
      <div className="lg:col-span-5">
        <Card className="p-6 border-slate-100 shadow-sm bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              {editingItem ? (
                <>
                  <Edit2 className="size-4 text-blue-600" /> Cập nhật dự án
                </>
              ) : (
                <>
                  <Plus className="size-4 text-blue-600" /> Thêm dự án mới
                </>
              )}
            </h3>
            {editingItem && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCancelEdit}
                className="h-7 text-xs hover:bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="size-3 mr-1" /> Tạo mới
              </Button>
            )}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Tên dự án <span className="text-red-500">*</span></Label>
              <Input
                required
                placeholder="Ví dụ: Sun Cosmo Residence Đà Nẵng..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border-slate-200/80 focus-visible:ring-blue-500/30"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Mô tả tổng quan</Label>
              <Textarea
                placeholder="Nhập thông tin giới thiệu quy mô, tiện ích, vị trí, tiềm năng phát triển của dự án..."
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border-slate-200/80 focus-visible:ring-blue-500/30 resize-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Chủ đầu tư</Label>
                <Input
                  placeholder="Ví dụ: Sun Group, FPT..."
                  value={form.developer}
                  onChange={(e) => setForm({ ...form, developer: e.target.value })}
                  className="border-slate-200/80 focus-visible:ring-blue-500/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Vị trí dự án</Label>
                <Input
                  placeholder="Ví dụ: Ngũ Hành Sơn, Đà Nẵng..."
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="border-slate-200/80 focus-visible:ring-blue-500/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Quy mô diện tích</Label>
                <Input
                  placeholder="Ví dụ: 3.5 ha, 2 blocks..."
                  value={form.scale}
                  onChange={(e) => setForm({ ...form, scale: e.target.value })}
                  className="border-slate-200/80 focus-visible:ring-blue-500/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Trạng thái bán hàng</Label>
                <Input
                  placeholder="Đang mở bán, Sắp mở bán..."
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="border-slate-200/80 focus-visible:ring-blue-500/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center gap-0.5">
                  <DollarSign className="size-3 text-slate-400" /> Giá khởi điểm (từ)
                </Label>
                <Input
                  placeholder="Ví dụ: 3 tỷ, 4.5 tỷ..."
                  value={form.price_from}
                  onChange={(e) => setForm({ ...form, price_from: e.target.value })}
                  className="border-slate-200/80 focus-visible:ring-blue-500/30"
                />
              </div>
            </div>

            <ImageUploader
              images={form.images}
              featuredImage={form.image_url}
              onChangeImages={(urls) => setForm(prev => ({ ...prev, images: urls }))}
              onChangeFeaturedImage={(url) => setForm(prev => ({ ...prev, image_url: url }))}
              isMock={isMock}
              label="Hình ảnh dự án"
            />

            <div className="flex items-center justify-between rounded-xl border border-slate-200/80 p-3 bg-slate-50/40">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800">Hiển thị công khai</div>
                <div className="text-[10px] text-slate-400 font-medium">Bật hiển thị dự án ra trang chủ website</div>
              </div>
              <Switch 
                checked={form.published} 
                onCheckedChange={(v) => setForm({ ...form, published: v })} 
              />
            </div>

            <Button 
              type="submit" 
              disabled={saving} 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-500/10 transition-all duration-300 py-5 h-auto rounded-xl"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin size-4 border-2 border-t-transparent border-white rounded-full"></span>
                  Đang xử lý...
                </span>
              ) : editingItem ? (
                "Cập nhật dự án"
              ) : (
                "Đăng dự án"
              )}
            </Button>
          </form>
        </Card>
      </div>

    </div>
  );
}

/* ---------- 4. NEWS MANAGER ---------- */
function NewsManager({ isMock }: { isMock: boolean }) {
  const { user, isAdmin } = useAuth();
  const [items, setItems] = useState<NewsPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [editingItem, setEditingItem] = useState<NewsPostRow | null>(null);

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    cover_image: "",
    images: [] as string[],
    published: true,
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    if (isMock) {
      const mockRole = localStorage.getItem("bds_mock_role");
      let mockList = LOCAL_DB.getNews();
      if (mockRole === "collaborator") {
        mockList = mockList.map((n, idx) => idx < 1 ? { ...n, created_by: "mock-collaborator-id" } : n);
        mockList = mockList.filter(n => n.created_by === "mock-collaborator-id");
      }
      setItems(mockList);
    } else {
      try {
        let query = supabase.from("news_posts").select("*");
        if (!isAdmin) {
          query = query.eq("created_by", user?.id || "");
        }
        const { data, error } = await query.order("created_at", { ascending: false });
        if (error) throw error;
        setItems(data || []);
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to mock storage:", err);
        setItems(LOCAL_DB.getNews());
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [isMock]);

  const handleStartEdit = (it: NewsPostRow) => {
    setEditingItem(it);
    setForm({
      title: it.title,
      excerpt: it.excerpt || "",
      content: it.content || "",
      author: it.author || "",
      category: it.category || "",
      cover_image: it.cover_image || "",
      images: Array.isArray(it.images) ? (it.images as string[]) : it.cover_image ? [it.cover_image] : [],
      published: it.published ?? true,
    });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setForm({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      category: "",
      cover_image: "",
      images: [] as string[],
      published: true,
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      slug: editingItem ? editingItem.slug : slugify(form.title),
      excerpt: form.excerpt || null,
      content: form.content || null,
      author: form.author || null,
      category: form.category || null,
      cover_image: form.cover_image || null,
      images: form.images as Json,
      published: form.published,
      published_at: form.published ? (editingItem?.published_at || new Date().toISOString()) : null,
      created_by: editingItem ? editingItem.created_by : (user?.id || null),
    };

    if (isMock) {
      try {
        if (editingItem) {
          LOCAL_DB.saveNews({ ...payload, id: editingItem.id });
          toast.success("Đã cập nhật bài viết thành công (Mock DB)");
        } else {
          LOCAL_DB.saveNews(payload);
          toast.success("Đã đăng bài viết mới thành công (Mock DB)");
        }
        handleCancelEdit();
        load();
      } catch (err: any) {
        console.error("Local save error:", err);
        toast.error(`Không thể lưu (Mock DB): Dung lượng LocalStorage có thể đã đầy! Chi tiết: ${err.message}`);
      } finally {
        setSaving(false);
      }
    } else {
      try {
        let error;
        if (editingItem) {
          const res = await supabase.from("news_posts").update(payload).eq("id", editingItem.id);
          error = res.error;
        } else {
          const res = await supabase.from("news_posts").insert(payload);
          error = res.error;
        }
        if (error) throw error;
        toast.success(editingItem ? "Đã lưu bài viết" : "Đã đăng bài tin tức thành công");
        handleCancelEdit();
        load();
      } catch (err: any) {
        toast.error(`Lỗi: ${err.message}`);
      } finally {
        setSaving(false);
      }
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
    
    if (isMock) {
      LOCAL_DB.deleteNews(id);
      toast.success("Đã xóa bài viết (Mock DB)");
      if (editingItem && editingItem.id === id) handleCancelEdit();
      load();
    } else {
      try {
        const { error } = await supabase.from("news_posts").delete().eq("id", id);
        if (error) throw error;
        toast.success("Đã xóa bài viết thành công");
        if (editingItem && editingItem.id === id) handleCancelEdit();
        load();
      } catch (err: any) {
        toast.error(`Lỗi: ${err.message}`);
      }
    }
  };

  const togglePublish = async (it: NewsPostRow) => {
    if (isMock) {
      LOCAL_DB.togglePublishNews(it.id);
      toast.success("Đã thay đổi hiển thị bài viết (Mock DB)");
      load();
    } else {
      try {
        const { error } = await supabase
          .from("news_posts")
          .update({ 
            published: !it.published,
            published_at: !it.published ? new Date().toISOString() : null
          })
          .eq("id", it.id);
        if (error) throw error;
        toast.success("Đã cập nhật hiển thị bài viết");
        load();
      } catch (err: any) {
        toast.error(`Lỗi: ${err.message}`);
      }
    }
  };

  const filteredItems = items.filter((it) => {
    const matchesSearch = it.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (it.excerpt && it.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = filterCategory === "all" || it.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const uniqueCategories = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT COLUMN: LIST VIEW */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="relative w-full flex-1">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-50/50 border-slate-200/80 focus-visible:ring-blue-500/30"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs font-medium bg-white border border-slate-200 rounded-lg p-2 w-full sm:w-auto focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Tất cả Chuyên mục</option>
            {uniqueCategories.map((c) => (
              <option key={c} value={c!}>{c}</option>
            ))}
          </select>
        </div>

        <Card className="border-slate-100 overflow-hidden shadow-sm bg-white">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
            <h3 className="font-bold text-slate-900 text-sm">Danh sách tin bài ({filteredItems.length})</h3>
            <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-none font-semibold text-xs">
              Mới nhất xếp trước
            </Badge>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <div className="animate-spin size-8 border-t-2 border-b-2 border-blue-600 rounded-full mx-auto"></div>
              <p className="text-xs font-medium">Đang tải tin bài...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-16 text-center text-slate-400 bg-slate-50/20">
              <Newspaper className="size-12 mx-auto text-slate-300 stroke-[1.5] mb-2" />
              <p className="font-semibold text-slate-800 text-sm">Không tìm thấy bài viết nào</p>
              <p className="text-xs text-slate-400 mt-0.5">Vui lòng điều chỉnh bộ lọc hoặc thêm tin bài mới</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
              {filteredItems.map((it) => (
                <div key={it.id} className="p-4 flex gap-4 hover:bg-slate-50/40 transition-colors group">
                  <div className="w-20 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/40">
                    {it.cover_image ? (
                      <img src={it.cover_image} alt={it.title} className="size-full object-cover" />
                    ) : (
                      <div className="size-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <Newspaper className="size-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                        {it.title}
                      </h4>
                      <Badge
                        variant={it.published ? "default" : "secondary"}
                        className={`cursor-pointer text-[10px] font-bold py-0.5 px-2 rounded-full border-none shadow-sm ${
                          it.published ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                        onClick={() => togglePublish(it)}
                      >
                        {it.published ? "Công khai" : "Nháp"}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-slate-500 line-clamp-1 mt-1">{it.excerpt}</p>
                    
                    <div className="text-xs text-slate-400 font-medium flex flex-wrap gap-x-2.5 gap-y-1 mt-1.5">
                      <span className="text-slate-600 font-bold">{it.author || "Người viết"}</span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        <Tag className="size-3 text-slate-400" />
                        {it.category || "Chuyên mục"}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3 text-slate-400" />
                        {new Date(it.created_at).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="size-8 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                    >
                      <Link 
                        to="/tin-tuc/$slug" 
                        params={{ slug: it.slug }} 
                        target="_blank"
                      >
                        <Eye className="size-3.5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartEdit(it)}
                      className="size-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(it.id)}
                      className="size-8 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* RIGHT COLUMN: ACTION FORM */}
      <div className="lg:col-span-5">
        <Card className="p-6 border-slate-100 shadow-sm bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              {editingItem ? (
                <>
                  <Edit2 className="size-4 text-blue-600" /> Cập nhật bài viết
                </>
              ) : (
                <>
                  <Plus className="size-4 text-blue-600" /> Bài viết mới
                </>
              )}
            </h3>
            {editingItem && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCancelEdit}
                className="h-7 text-xs hover:bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="size-3 mr-1" /> Tạo mới
              </Button>
            )}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Tiêu đề bài báo <span className="text-red-500">*</span></Label>
              <Input
                required
                placeholder="Ví dụ: Lãi suất mua nhà giảm sốc nhất trong vòng 5 năm..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border-slate-200/80 focus-visible:ring-blue-500/30"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Tóm tắt ngắn (Excerpt)</Label>
              <Textarea
                placeholder="Viết một đoạn tóm tắt ngắn khoảng 2-3 dòng giới thiệu nội dung để hiển thị trên danh mục..."
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="border-slate-200/80 focus-visible:ring-blue-500/30 resize-none text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Nội dung chi tiết</Label>
              <Textarea
                placeholder="Soạn thảo nội dung bài báo chi tiết tại đây..."
                rows={8}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="border-slate-200/80 focus-visible:ring-blue-500/30 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Tác giả</Label>
                <Input
                  placeholder="Ví dụ: Nguyễn Minh Khang..."
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="border-slate-200/80 focus-visible:ring-blue-500/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Chuyên mục tin</Label>
                <Input
                  placeholder="Ví dụ: Thị trường BĐS, Quy hoạch..."
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="border-slate-200/80 focus-visible:ring-blue-500/30"
                />
              </div>
            </div>

            <ImageUploader
              images={form.images}
              featuredImage={form.cover_image}
              onChangeImages={(urls) => setForm(prev => ({ ...prev, images: urls }))}
              onChangeFeaturedImage={(url) => setForm(prev => ({ ...prev, cover_image: url }))}
              isMock={isMock}
              label="Hình ảnh bài viết"
            />

            <div className="flex items-center justify-between rounded-xl border border-slate-200/80 p-3 bg-slate-50/40">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800">Hiển thị công khai</div>
                <div className="text-[10px] text-slate-400 font-medium">Bật để phát hành bài viết ngay lập tức</div>
              </div>
              <Switch 
                checked={form.published} 
                onCheckedChange={(v) => setForm({ ...form, published: v })} 
              />
            </div>

            <Button 
              type="submit" 
              disabled={saving} 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-500/10 transition-all duration-300 py-5 h-auto rounded-xl"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin size-4 border-2 border-t-transparent border-white rounded-full"></span>
                  Đang xử lý...
                </span>
              ) : editingItem ? (
                "Cập nhật bài viết"
              ) : (
                "Đăng bài báo"
              )}
            </Button>
          </form>
        </Card>
      </div>

    </div>
  );
}
