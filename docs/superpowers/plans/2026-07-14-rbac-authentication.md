# Role-Based Authentication and Authorization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a comprehensive role-based access control (RBAC) system for BDS Horizon. This restricts "Quản trị" and "Đăng tin" features to authorized users (Admins, Brokers, Collaborators) and hides/displays UI sections according to user roles (Guest, Broker, Admin, Collaborator), while designing a premium authentication screen and mock-auth support for offline development.

**Architecture:** 
1. Expand the Supabase `app_role` enum type to support `'broker'` and `'collaborator'` roles, and add database policies.
2. Refactor `useAuth` hook to query `user_roles` and return current role status (`isAdmin`, `isBroker`, `isCollaborator`, `isGuest`).
3. Redesign the `/auth` route to have a modern, high-end theme with role selection for signup, plus a Quick-Demo panel to toggle between mock roles (Admin, Broker, Collaborator, Guest) instantly.
4. Restrict `admin.tsx` features based on role, filtering sidebar items, data displays, and default views depending on permission levels.

**Tech Stack:** React, Tailwind CSS, TanStack Router, Supabase JS, Lucide icons, Sonner toast.

---

## Proposed Changes

### Database & Types

#### [NEW] [20260714000000_add_rbac_roles.sql](file:///d:/A%20Dự%20án%20PLCT/gccdpl-main/Bds_horizon/supabase/migrations/20260714000000_add_rbac_roles.sql)
Add `'broker'` and `'collaborator'` to the `app_role` enum, configure insertion policy so users can choose their role on signup, and configure RLS policies for `properties` and `news_posts` to support broker/collaborator access.

```sql
-- Disable transactions if needed, but since PostgreSQL supports ALTER TYPE ADD VALUE in migrations:
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'broker';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'collaborator';

-- Add policy to user_roles to allow new signups to assign their own role (excluding admin)
CREATE POLICY "Users insert own role on registration" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND role IN ('user', 'broker', 'collaborator'));

-- Update properties policies to allow Brokers to insert/update their own properties
DROP POLICY IF EXISTS "Anyone reads published properties" ON public.properties;
CREATE POLICY "Anyone reads published properties" ON public.properties
  FOR SELECT USING (published = true OR public.has_role(auth.uid(), 'admin') OR (public.has_role(auth.uid(), 'broker') AND created_by = auth.uid()));

DROP POLICY IF EXISTS "Admins insert properties" ON public.properties;
CREATE POLICY "Admins insert properties" ON public.properties
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'broker'));

DROP POLICY IF EXISTS "Admins update properties" ON public.properties;
CREATE POLICY "Admins update properties" ON public.properties
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR (public.has_role(auth.uid(), 'broker') AND created_by = auth.uid()));

DROP POLICY IF EXISTS "Admins delete properties" ON public.properties;
CREATE POLICY "Admins delete properties" ON public.properties
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR (public.has_role(auth.uid(), 'broker') AND created_by = auth.uid()));

-- Update news_posts policies to allow Collaborators to insert/update their own news
DROP POLICY IF EXISTS "Anyone reads published news" ON public.news_posts;
CREATE POLICY "Anyone reads published news" ON public.news_posts
  FOR SELECT USING (published = true OR public.has_role(auth.uid(), 'admin') OR (public.has_role(auth.uid(), 'collaborator') AND created_by = auth.uid()));

DROP POLICY IF EXISTS "Admins insert news" ON public.news_posts;
CREATE POLICY "Admins insert news" ON public.news_posts
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'collaborator'));

DROP POLICY IF EXISTS "Admins update news" ON public.news_posts;
CREATE POLICY "Admins update news" ON public.news_posts
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR (public.has_role(auth.uid(), 'collaborator') AND created_by = auth.uid()));

DROP POLICY IF EXISTS "Admins delete news" ON public.news_posts;
CREATE POLICY "Admins delete news" ON public.news_posts
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR (public.has_role(auth.uid(), 'collaborator') AND created_by = auth.uid()));
```

#### [MODIFY] [types.ts](file:///d:/A%20Dự%20án%20PLCT/gccdpl-main/Bds_horizon/src/integrations/supabase/types.ts)
Update typescript typings to reflect new enum values of `app_role`.

```diff
     Enums: {
-      app_role: "admin" | "moderator" | "user";
+      app_role: "admin" | "moderator" | "user" | "broker" | "collaborator";
     };
```

---

### Task 1: Refactor `useAuth` hook for role support

**Files:**
- Modify: [use-auth.ts](file:///d:/A%20Dự%20án%20PLCT/gccdpl-main/Bds_horizon/src/hooks/use-auth.ts)

- [ ] **Step 1: Update use-auth.ts to fetch role and handle mock role**
Replace contents with logic to load role from Supabase or fallback to `localStorage.getItem("bds_mock_role")`.

```typescript
import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "admin" | "broker" | "collaborator" | "user" | "guest";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("guest");
  const [loading, setLoading] = useState(true);

  // Check if mock role is set in local storage
  const getMockRole = (): UserRole | null => {
    if (typeof window !== "undefined") {
      const val = localStorage.getItem("bds_mock_role");
      if (val) return val as UserRole;
    }
    return null;
  };

  useEffect(() => {
    const mockRole = getMockRole();
    if (mockRole) {
      // Mock Authentication Mode
      setRole(mockRole);
      if (mockRole === "guest") {
        setUser(null);
        setSession(null);
      } else {
        const mockEmail = `mock-${mockRole}@horizon.vn`;
        const mockUserId = `mock-${mockRole}-id`;
        setUser({
          id: mockUserId,
          email: mockEmail,
          aud: "authenticated",
          created_at: new Date().toISOString(),
        } as User);
        setSession({
          access_token: "mock-token",
          user: { id: mockUserId, email: mockEmail } as User,
        } as Session);
      }
      setLoading(false);
      return;
    }

    // Real Supabase Authentication Mode
    const fetchUserRole = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setRole(data.role as UserRole);
        } else {
          setRole("user"); // Registered user (default)
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
        setRole("user");
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setTimeout(() => fetchUserRole(s.user.id), 0);
      } else {
        setRole("guest");
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
      if (data.session?.user) {
        fetchUserRole(data.session.user.id);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const isAdmin = role === "admin";
  const isBroker = role === "broker";
  const isCollaborator = role === "collaborator";
  const isGuest = role === "guest" || !user;

  return { 
    session, 
    user, 
    role, 
    isAdmin, 
    isBroker, 
    isCollaborator, 
    isGuest, 
    loading 
  };
}
```

---

### Task 2: Redesign the Login & Registration Screen

**Files:**
- Modify: [auth.tsx](file:///d:/A%20Dự%20án%20PLCT/gccdpl-main/Bds_horizon/src/routes/auth.tsx)

- [ ] **Step 1: Redesign /auth layout with Premium theme & Role signup selection**
Incorporate responsive glassmorphism styles, tabs for Sign In/Sign Up, select role box for Sign Up, and a modern "Quick Demo / Mock Panel" to switch mock roles instantly.

```tsx
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ShieldCheck, LogIn, UserPlus, KeyRound, Building2, Terminal, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Đăng nhập | BDS Horizon" }] }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"user" | "broker" | "collaborator">("user");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        // Register in Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        
        // Add chosen role to user_roles
        if (data.user) {
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert({ user_id: data.user.id, role: selectedRole });
          if (roleError) console.warn("Failed to assign role immediately:", roleError);
        }

        toast.success("Đăng ký thành công! Hãy kiểm tra email để xác nhận tài khoản.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Đăng nhập thành công!");
        navigate({ to: "/admin" });
      }
    } catch (err: any) {
      toast.error(err.message || "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  // Switch to Mock Role demo mode
  const handleSetMockRole = (role: string) => {
    if (role === "clear") {
      localStorage.removeItem("bds_mock_role");
      localStorage.removeItem("bds_mock_admin");
      toast.info("Đã thoát chế độ Mock Demo");
    } else {
      localStorage.setItem("bds_mock_role", role);
      // Synchronize old bds_mock_admin toggle for safety
      if (role === "admin") {
        localStorage.setItem("bds_mock_admin", "true");
      } else {
        localStorage.removeItem("bds_mock_admin");
      }
      toast.success(`Đã kích hoạt chế độ Demo với vai trò: ${role.toUpperCase()}`);
    }
    setTimeout(() => {
      window.location.href = "/admin";
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B192C] px-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-900/10 blur-[130px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 z-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="size-3" /> Quay về Trang chủ
        </Link>

        <Card className="p-8 space-y-6 bg-slate-900/80 border-slate-800 backdrop-blur-xl text-white shadow-2xl">
          <div className="text-center space-y-2">
            <div className="mx-auto size-12 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/10">
              <ShieldCheck className="size-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {mode === "signin" ? "Đăng nhập Cổng thành viên" : "Đăng ký thành viên"}
            </h1>
            <p className="text-xs text-slate-400">
              {mode === "signin" 
                ? "Quản lý tin đăng, dự án, tin tức của bạn" 
                : "Chọn vai trò phù hợp để đăng tin của bạn"}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                required
                className="bg-slate-950/60 border-slate-800 focus:border-blue-500 text-slate-100"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-300">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                className="bg-slate-950/60 border-slate-800 focus:border-blue-500 text-slate-100"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {mode === "signup" && (
              <div className="space-y-1.5 pt-1">
                <Label htmlFor="role" className="text-xs font-semibold text-slate-300">Chọn vai trò thành viên</Label>
                <select
                  id="role"
                  className="w-full rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 outline-none"
                  value={selectedRole}
                  onChange={(e: any) => setSelectedRole(e.target.value)}
                >
                  <option value="user">Khách hàng (Xem tin & Tìm kiếm)</option>
                  <option value="broker">Nhà Môi Giới (Đăng tin BĐS bán/thuê)</option>
                  <option value="collaborator">Cộng tác viên (Viết bài & Tin tức)</option>
                </select>
              </div>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md shadow-blue-500/10 mt-2" disabled={loading}>
              {loading ? "Đang xử lý..." : mode === "signin" ? "Đăng nhập" : "Đăng ký tài khoản"}
            </Button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              className="text-xs text-slate-400 hover:text-white transition-colors"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            >
              {mode === "signin" ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Đăng nhập"}
            </button>
          </div>
        </Card>

        {/* Quick Demo Mode Panel */}
        <Card className="p-5 bg-slate-950/70 border-slate-800/80 backdrop-blur text-slate-300 space-y-3.5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800/50 pb-2">
            <Terminal className="size-4 text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Khu vực thử nghiệm (Demo Bypass)</span>
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed">
            Nhấn các nút bên dưới để đổi vai trò thử nghiệm giao diện lập tức không cần đăng ký tài khoản Supabase thật:
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button size="sm" variant="outline" className="text-xs font-semibold bg-slate-900 border-slate-800 hover:bg-slate-800 text-teal-400" onClick={() => handleSetMockRole("admin")}>
              🔑 Vai Admin
            </Button>
            <Button size="sm" variant="outline" className="text-xs font-semibold bg-slate-900 border-slate-800 hover:bg-slate-800 text-blue-400" onClick={() => handleSetMockRole("broker")}>
              💼 Vai Môi giới
            </Button>
            <Button size="sm" variant="outline" className="text-xs font-semibold bg-slate-900 border-slate-800 hover:bg-slate-800 text-amber-400" onClick={() => handleSetMockRole("collaborator")}>
              ✍️ Vai Cộng tác viên
            </Button>
            <Button size="sm" variant="outline" className="text-xs font-semibold bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300" onClick={() => handleSetMockRole("user")}>
              👤 Vai Khách hàng
            </Button>
          </div>
          <Button size="sm" variant="ghost" className="w-full text-[10px] text-slate-500 hover:text-slate-300 pt-1" onClick={() => handleSetMockRole("clear")}>
            Xóa lưu trữ chế độ Demo (Sử dụng DB Thật)
          </Button>
        </Card>
      </div>
    </div>
  );
}
```

---

### Task 3: Restrict and Filter Dashboard based on Role

**Files:**
- Modify: [admin.tsx](file:///d:/A%20Dự%20án%20PLCT/gccdpl-main/Bds_horizon/src/routes/admin.tsx)

- [ ] **Step 1: Check user roles, filter tabs, handle access denied**
Refactor the route file to fetch role data from `useAuth()`, conditionally display sidebar items depending on role flags, prevent normal guests (`'user'`) from accessing `/admin`, and filter properties/news queries so brokers/collaborators only see their own listings.

```typescript
// Replace appropriate lines in admin.tsx around the return rendering:

function AdminPage() {
  const { user: realUser, role, isAdmin, isBroker, isCollaborator, isGuest, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [grantingSelf, setGrantingSelf] = useState(false);
  const [section, setSection] = useState<SectionKey>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sync isMockAdmin with isMockRole === "admin"
  const isMock = typeof window !== "undefined" && !!localStorage.getItem("bds_mock_role");
  const isMockAdmin = isMock && localStorage.getItem("bds_mock_role") === "admin";
  const user = realUser;
  const loading = authLoading;

  useEffect(() => {
    // If not loading, and user is guest/normal customer, direct to auth or show unauthorized
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
      toast.success("Đã cấp quyền admin.");
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
    if (item.key === "overview") return true; // Everyone sees overview (customized)
    return false;
  });

  // Ensure selected section is permitted for the active role
  const currentNavKeys = filteredNavItems.map(item => item.key);
  const activeSection = currentNavKeys.includes(section) ? section : currentNavKeys[0] || "overview";
  const currentSection = navItems.find((n) => n.key === activeSection)!;

  // Render role text badge
  const roleLabel = isAdmin ? "Quản trị viên" : isBroker ? "Nhà Môi Giới" : "Cộng tác viên";

  return (
    <div className="h-screen overflow-hidden flex bg-slate-50/50 text-slate-900 relative">
      ...
```

- [ ] **Step 2: Update sidebar list rendering, workspace layout, and data loaders**
Ensure the sidebar navigation loops over `filteredNavItems` instead of `navItems`, set Section to `activeSection`, render the correct role text badge, and apply filter criteria inside `PropertiesManager` and `NewsManager`.

```typescript
// Inside PropertiesManager load function in admin.tsx:
  const load = async () => {
    setLoading(true);
    if (isMock) {
      // In mock mode, if broker, filter mock list to show only theirs
      const mockRole = localStorage.getItem("bds_mock_role");
      let mockList = LOCAL_DB.getProperties();
      if (mockRole === "broker") {
        // Tag prop-1 & prop-2 for mock broker
        mockList = mockList.map((p, idx) => idx < 2 ? { ...p, created_by: "mock-broker-id" } : p);
        mockList = mockList.filter(p => p.created_by === "mock-broker-id");
      }
      setItems(mockList);
    } else {
      try {
        let query = supabase.from("properties").select("*");
        // Non-admin users only view their own properties
        if (!isAdmin) {
          query = query.eq("created_by", user?.id);
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
```

```typescript
// Inside NewsManager load function in admin.tsx:
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
        // Non-admin users only view their own news posts
        if (!isAdmin) {
          query = query.eq("created_by", user?.id);
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
```

---

### Task 4: Enhance Site Header to reflect Auth State

**Files:**
- Modify: [Header.tsx](file:///d:/A%20Dự%20án%20PLCT/gccdpl-main/Bds_horizon/src/components/site/Header.tsx)

- [ ] **Step 1: Check auth state in site header and update links dynamically**
Import `useAuth` hook into Header, and show appropriate actions (Login vs dashboard routing link depending on user identity).

```tsx
// Around lines 23-35 of Header.tsx:
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, role, isGuest } = useAuth();

  const nav: { label: string; to?: string; href?: string }[] = [
    { label: "Mua bán", to: "/" },
    { label: "Cho thuê", href: "#" },
    { label: "Dự án", to: "/du-an" },
    { label: "Check Quy Hoạch", to: "/check-quy-hoach" },
    { label: "Luyện thi", to: "/on-thi" },
    { label: "Danh bạ Môi giới", to: "/moi-gioi" },
    { label: "Tin tức", to: "/tin-tuc" },
  ];

  // Update Right actions block:
  // If Guest (not logged in): show "Đăng nhập"
  // If Logged in: show "Bảng điều khiển" (goes to /admin if admin, broker, or collaborator)
```

---

## Verification Plan

### Automated Tests
- Build verification to ensure no typescript compiler faults: `npm run build`

### Manual Verification
1. Open http://localhost:3000/auth.
2. Click "🔑 Vai Admin" inside Quick Demo panel -> Verify redirection to `/admin` dashboard, all sidebar tabs (Overview, Properties, Projects, News) visible.
3. Logout and return to `/auth`.
4. Click "💼 Vai Môi giới" -> Verify redirection to `/admin`, only "Overview" and "Tin đăng bán/thuê" tabs visible.
5. Logout and return to `/auth`.
6. Click "✍️ Vai Cộng tác viên" -> Verify redirection to `/admin`, only "Overview" and "Tin tức & Sự kiện" tabs visible.
7. Logout and return to `/auth`.
8. Click "👤 Vai Khách hàng" -> Verify redirection to `/admin`, displays the "Không Có Quyền Truy Cập" card.
