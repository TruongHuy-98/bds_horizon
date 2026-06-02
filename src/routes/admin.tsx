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
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
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
  type LucideIcon,
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

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
type PublishableItem = {
  id: string;
  published: boolean | null;
};

const navItems: { key: SectionKey; label: string; icon: LucideIcon }[] = [
  { key: "overview", label: "Tổng quan", icon: LayoutDashboard },
  { key: "properties", label: "Tin đăng", icon: Building2 },
  { key: "projects", label: "Dự án", icon: Landmark },
  { key: "news", label: "Tin tức", icon: Newspaper },
];

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [grantingSelf, setGrantingSelf] = useState(false);
  const [section, setSection] = useState<SectionKey>("overview");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const makeMeAdmin = async () => {
    if (!user) return;
    setGrantingSelf(true);
    const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role: "admin" });
    setGrantingSelf(false);
    if (error) {
      toast.error(
        "Không thể tự cấp quyền admin do RLS. Vui lòng vào Cloud → Database → user_roles để thêm dòng admin cho tài khoản này.",
      );
    } else {
      toast.success("Đã cấp quyền admin. Tải lại trang...");
      setTimeout(() => window.location.reload(), 500);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md p-8 space-y-4 text-center">
          <h1 className="text-xl font-bold">Cần quyền Admin</h1>
          <p className="text-sm text-muted-foreground">
            Tài khoản <span className="font-medium">{user.email}</span> chưa có quyền admin. Nhấn
            nút bên dưới để tự cấp (chỉ hoạt động cho admin đầu tiên), hoặc nhờ admin hiện có cấp
            quyền.
          </p>
          <Button onClick={makeMeAdmin} disabled={grantingSelf} className="w-full">
            {grantingSelf ? "Đang xử lý..." : "Tự cấp quyền admin"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
          >
            Đăng xuất
          </Button>
        </Card>
      </div>
    );
  }

  const current = navItems.find((n) => n.key === section)!;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <Sidebar collapsible="icon">
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <div className="size-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold">
                D
              </div>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold leading-tight">Da Nang Realty</span>
                <span className="text-xs text-muted-foreground">Bảng quản trị</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Quản lý nội dung</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        isActive={section === item.key}
                        onClick={() => setSection(item.key)}
                        tooltip={item.label}
                      >
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Khác</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Về trang chính">
                      <Link to="/">
                        <Home className="size-4" />
                        <span>Về trang chính</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t">
            <div className="px-2 py-1.5 text-xs text-muted-foreground truncate group-data-[collapsible=icon]:hidden">
              {user.email}
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Đăng xuất"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate({ to: "/auth" });
                  }}
                >
                  <LogOut className="size-4" />
                  <span>Đăng xuất</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="h-14 flex items-center gap-3 border-b bg-card px-4">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <current.icon className="size-4 text-muted-foreground" />
              <h1 className="font-semibold">{current.label}</h1>
            </div>
            <Badge variant="secondary" className="ml-auto">
              Admin
            </Badge>
          </header>

          <main className="p-6">
            {section === "overview" && <Overview onGo={setSection} />}
            {section === "properties" && <PropertiesManager />}
            {section === "projects" && <ProjectsManager />}
            {section === "news" && <NewsManager />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

/* ---------- Overview ---------- */
function Overview({ onGo }: { onGo: (s: SectionKey) => void }) {
  const [counts, setCounts] = useState({ properties: 0, projects: 0, news: 0 });

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  const cards: { key: SectionKey; label: string; value: number; icon: LucideIcon }[] = [
    { key: "properties", label: "Tin đăng", value: counts.properties, icon: Building2 },
    { key: "projects", label: "Dự án", value: counts.projects, icon: Landmark },
    { key: "news", label: "Tin tức", value: counts.news, icon: Newspaper },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c) => (
        <Card
          key={c.key}
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onGo(c.key)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="text-3xl font-bold mt-1">{c.value}</p>
            </div>
            <c.icon className="size-8 text-primary/70" />
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ---------- Properties ---------- */
function PropertiesManager() {
  const [items, setItems] = useState<PropertyRow[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price_label: "",
    area: "",
    address: "",
    district: "",
    property_type: "Căn hộ",
    image_url: "",
    published: true,
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("properties").insert({
      title: form.title,
      slug: slugify(form.title),
      description: form.description || null,
      price_label: form.price_label || null,
      area: form.area ? Number(form.area) : null,
      address: form.address || null,
      district: form.district || null,
      property_type: form.property_type,
      image_url: form.image_url || null,
      published: form.published,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Đã đăng tin");
    setForm({
      title: "",
      description: "",
      price_label: "",
      area: "",
      address: "",
      district: "",
      property_type: "Căn hộ",
      image_url: "",
      published: true,
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Xoá tin này?")) return;
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Đã xoá");
    load();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Plus className="size-4" /> Đăng tin mới
        </h2>
        <form onSubmit={submit} className="space-y-3">
          <Field label="Tiêu đề">
            <Input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
          <Field label="Mô tả">
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Giá (text)">
              <Input
                placeholder="5.2 tỷ"
                value={form.price_label}
                onChange={(e) => setForm({ ...form, price_label: e.target.value })}
              />
            </Field>
            <Field label="Diện tích (m²)">
              <Input
                type="number"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Địa chỉ">
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Quận/Huyện">
              <Input
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
              />
            </Field>
            <Field label="Loại">
              <Input
                value={form.property_type}
                onChange={(e) => setForm({ ...form, property_type: e.target.value })}
              />
            </Field>
          </div>
          <Field label="URL ảnh đại diện">
            <Input
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            />
          </Field>
          <PublishToggle
            checked={form.published}
            onChange={(v) => setForm({ ...form, published: v })}
          />
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Đang lưu..." : "Đăng tin"}
          </Button>
        </form>
      </Card>

      <ItemsList
        title={`Tin đăng (${items.length})`}
        items={items}
        renderTitle={(it) => it.title}
        renderMeta={(it) =>
          [it.price_label, it.area && `${it.area}m²`, it.district].filter(Boolean).join(" · ")
        }
        onDelete={remove}
        onTogglePublish={async (it) => {
          await supabase.from("properties").update({ published: !it.published }).eq("id", it.id);
          load();
        }}
      />
    </div>
  );
}

/* ---------- Projects ---------- */
function ProjectsManager() {
  const [items, setItems] = useState<ProjectRow[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    developer: "",
    location: "",
    scale: "",
    status: "Đang mở bán",
    price_from: "",
    image_url: "",
    published: true,
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("projects").insert({
      name: form.name,
      slug: slugify(form.name),
      description: form.description || null,
      developer: form.developer || null,
      location: form.location || null,
      scale: form.scale || null,
      status: form.status || null,
      price_from: form.price_from || null,
      image_url: form.image_url || null,
      published: form.published,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Đã đăng dự án");
    setForm({
      name: "",
      description: "",
      developer: "",
      location: "",
      scale: "",
      status: "Đang mở bán",
      price_from: "",
      image_url: "",
      published: true,
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Xoá dự án này?")) return;
    await supabase.from("projects").delete().eq("id", id);
    load();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Plus className="size-4" /> Đăng dự án mới
        </h2>
        <form onSubmit={submit} className="space-y-3">
          <Field label="Tên dự án">
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Mô tả">
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Chủ đầu tư">
              <Input
                value={form.developer}
                onChange={(e) => setForm({ ...form, developer: e.target.value })}
              />
            </Field>
            <Field label="Vị trí">
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Quy mô">
              <Input
                value={form.scale}
                onChange={(e) => setForm({ ...form, scale: e.target.value })}
              />
            </Field>
            <Field label="Trạng thái">
              <Input
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Giá từ">
            <Input
              placeholder="3.5 tỷ"
              value={form.price_from}
              onChange={(e) => setForm({ ...form, price_from: e.target.value })}
            />
          </Field>
          <Field label="URL ảnh">
            <Input
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            />
          </Field>
          <PublishToggle
            checked={form.published}
            onChange={(v) => setForm({ ...form, published: v })}
          />
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Đang lưu..." : "Đăng dự án"}
          </Button>
        </form>
      </Card>

      <ItemsList
        title={`Dự án (${items.length})`}
        items={items}
        renderTitle={(it) => it.name}
        renderMeta={(it) => [it.developer, it.location, it.price_from].filter(Boolean).join(" · ")}
        onDelete={remove}
        onTogglePublish={async (it) => {
          await supabase.from("projects").update({ published: !it.published }).eq("id", it.id);
          load();
        }}
      />
    </div>
  );
}

/* ---------- News ---------- */
function NewsManager() {
  const [items, setItems] = useState<NewsPostRow[]>([]);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    cover_image: "",
    published: true,
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("news_posts")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("news_posts").insert({
      title: form.title,
      slug: slugify(form.title),
      excerpt: form.excerpt || null,
      content: form.content || null,
      author: form.author || null,
      category: form.category || null,
      cover_image: form.cover_image || null,
      published: form.published,
      published_at: form.published ? new Date().toISOString() : null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Đã đăng tin tức");
    setForm({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      category: "",
      cover_image: "",
      published: true,
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Xoá bài này?")) return;
    await supabase.from("news_posts").delete().eq("id", id);
    load();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Plus className="size-4" /> Bài tin tức mới
        </h2>
        <form onSubmit={submit} className="space-y-3">
          <Field label="Tiêu đề">
            <Input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
          <Field label="Tóm tắt">
            <Textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            />
          </Field>
          <Field label="Nội dung">
            <Textarea
              rows={6}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tác giả">
              <Input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />
            </Field>
            <Field label="Chuyên mục">
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </Field>
          </div>
          <Field label="URL ảnh bìa">
            <Input
              value={form.cover_image}
              onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
            />
          </Field>
          <PublishToggle
            checked={form.published}
            onChange={(v) => setForm({ ...form, published: v })}
          />
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Đang lưu..." : "Đăng bài"}
          </Button>
        </form>
      </Card>

      <ItemsList
        title={`Tin tức (${items.length})`}
        items={items}
        renderTitle={(it) => it.title}
        renderMeta={(it) =>
          [it.category, it.author, new Date(it.created_at).toLocaleDateString("vi-VN")]
            .filter(Boolean)
            .join(" · ")
        }
        onDelete={remove}
        onTogglePublish={async (it) => {
          await supabase.from("news_posts").update({ published: !it.published }).eq("id", it.id);
          load();
        }}
      />
    </div>
  );
}

/* ---------- Shared ---------- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function PublishToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <div>
        <div className="text-sm font-medium">Hiển thị công khai</div>
        <div className="text-xs text-muted-foreground">Bỏ chọn để lưu nháp</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function ItemsList<TItem extends PublishableItem>({
  title,
  items,
  renderTitle,
  renderMeta,
  onDelete,
  onTogglePublish,
}: {
  title: string;
  items: TItem[];
  renderTitle: (it: TItem) => string;
  renderMeta: (it: TItem) => string;
  onDelete: (id: string) => void;
  onTogglePublish: (it: TItem) => void;
}) {
  return (
    <Card className="p-6">
      <h2 className="font-semibold mb-4">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">Chưa có dữ liệu</p>
      ) : (
        <ul className="divide-y">
          {items.map((it) => (
            <li key={it.id} className="py-3 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{renderTitle(it)}</div>
                <div className="text-xs text-muted-foreground truncate">{renderMeta(it)}</div>
              </div>
              <Badge
                variant={it.published ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => onTogglePublish(it)}
              >
                {it.published ? "Công khai" : "Nháp"}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(it.id)}
                className="text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
