import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ShieldCheck, Terminal, ArrowLeft, Chrome } from "lucide-react";

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
        
        // Add chosen role to user_roles table
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

  const onGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/admin",
    });
    if (result.error) toast.error("Đăng nhập Google thất bại");
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

          <Button variant="outline" className="w-full border-slate-800 bg-slate-950/40 text-slate-200 hover:bg-slate-900 hover:text-white flex items-center justify-center gap-2" onClick={onGoogle}>
            <Chrome className="size-4 text-blue-400" /> Tiếp tục với Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-400">Hoặc</span>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                required
                className="bg-slate-950/60 border-slate-800 focus:border-blue-500 text-slate-100 placeholder:text-slate-600"
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
                className="bg-slate-950/60 border-slate-800 focus:border-blue-500 text-slate-100 placeholder:text-slate-600"
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
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
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
            <Button size="sm" variant="outline" className="text-xs font-semibold bg-slate-900 border-slate-800 hover:bg-slate-800 text-teal-400 border-teal-950/50" onClick={() => handleSetMockRole("admin")}>
              🔑 Vai Admin
            </Button>
            <Button size="sm" variant="outline" className="text-xs font-semibold bg-slate-900 border-slate-800 hover:bg-slate-800 text-blue-400 border-blue-950/50" onClick={() => handleSetMockRole("broker")}>
              💼 Vai Môi giới
            </Button>
            <Button size="sm" variant="outline" className="text-xs font-semibold bg-slate-900 border-slate-800 hover:bg-slate-800 text-amber-400 border-amber-950/50" onClick={() => handleSetMockRole("collaborator")}>
              ✍️ Vai Cộng tác viên
            </Button>
            <Button size="sm" variant="outline" className="text-xs font-semibold bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300 border-slate-950/50" onClick={() => handleSetMockRole("user")}>
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
