import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ShieldCheck, ArrowLeft, Chrome } from "lucide-react";
import { PRIVACY_POLICY_VERSION, logConsent } from "@/lib/consent";

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
  const [googleLoading, setGoogleLoading] = useState(false);
  // Hai ô đồng ý tách riêng, không tích sẵn (Điều 9 Luật 91/2025/QH15)
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeData, setAgreeData] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && (!agreeTerms || !agreeData)) {
      toast.error("Vui lòng đọc và đồng ý điều khoản sử dụng và Chính sách bảo vệ dữ liệu cá nhân.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const consentAt = new Date().toISOString();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
            data: {
              terms_accepted_at: consentAt,
              privacy_consent_at: consentAt,
              privacy_policy_version: PRIVACY_POLICY_VERSION,
            },
          },
        });
        if (error) throw error;

        if (data.user) {
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert({ user_id: data.user.id, role: selectedRole });
          if (roleError) console.warn("Failed to assign role immediately:", roleError);
          void logConsent("account_signup", true, data.user.id);
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
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/admin`,
        },
      });
      if (error) {
        toast.error(error.message || "Đăng nhập Google thất bại");
        setGoogleLoading(false);
      }
    } catch (err: any) {
      toast.error(err?.message || "Đăng nhập Google thất bại");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B192C] px-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-900/10 blur-[130px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-5 relative z-10">
        {/* Back link */}
        <div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="size-4" />
            Về trang chủ
          </Link>
        </div>

        {/* Logo & heading */}
        <div className="text-center space-y-2 pb-1">
          <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 mx-auto mb-1">
            <ShieldCheck className="size-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">BDS Horizon</h1>
          <p className="text-sm text-slate-400">
            {mode === "signin" ? "Đăng nhập vào tài khoản của bạn" : "Tạo tài khoản mới"}
          </p>
        </div>

        <Card className="p-6 bg-slate-900/80 border-slate-800/80 backdrop-blur shadow-xl space-y-5">
          {/* Google Sign-In — Primary CTA */}
          <Button
            type="button"
            onClick={onGoogle}
            disabled={googleLoading}
            className="w-full h-11 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm flex items-center gap-3 shadow-md transition-all duration-150"
          >
            {googleLoading ? (
              <span className="size-5 border-2 border-slate-400/40 border-t-slate-600 rounded-full animate-spin" />
            ) : (
              <Chrome className="size-5 text-blue-500 flex-shrink-0" />
            )}
            {googleLoading ? "Đang chuyển hướng..." : "Tiếp tục với Google"}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-500">hoặc dùng email</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Email / Password form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-300 text-xs font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-slate-950/60 border-slate-700/80 text-white placeholder:text-slate-600 focus:border-blue-500/60 h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-300 text-xs font-medium">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-slate-950/60 border-slate-700/80 text-white placeholder:text-slate-600 focus:border-blue-500/60 h-10"
              />
            </div>

            {/* Role selector (signup only) */}
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-xs font-medium">Vai trò</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["user", "broker", "collaborator"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRole(r)}
                      className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                        selectedRole === r
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {r === "user" ? "Khách hàng" : r === "broker" ? "Môi giới" : "Cộng tác viên"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Consent checkboxes (signup only) */}
            {mode === "signup" && (
              <div className="space-y-2.5 text-[11px] text-slate-400 leading-relaxed pt-1">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 accent-blue-500"
                  />
                  <span>
                    Tôi đã đọc và đồng ý với{" "}
                    <Link to="/dieu-khoan-su-dung" target="_blank" className="text-blue-400 underline">
                      Điều khoản sử dụng & Quy chế hoạt động
                    </Link>
                    .
                  </span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeData}
                    onChange={(e) => setAgreeData(e.target.checked)}
                    className="mt-0.5 accent-blue-500"
                  />
                  <span>
                    Tôi đồng ý cho BDS Horizon xử lý email và thông tin hồ sơ của tôi để tạo, quản lý tài
                    khoản và đăng tin, theo{" "}
                    <Link to="/chinh-sach-bao-mat" target="_blank" className="text-blue-400 underline">
                      Chính sách bảo vệ dữ liệu cá nhân
                    </Link>
                    . Tôi có thể rút lại sự đồng ý bất kỳ lúc nào.
                  </span>
                </label>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md shadow-blue-500/10 mt-2"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : mode === "signin" ? "Đăng nhập" : "Đăng ký tài khoản"}
            </Button>
          </form>

          <div className="text-center pt-1">
            <button
              type="button"
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            >
              {mode === "signin" ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Đăng nhập"}
            </button>
          </div>
        </Card>

        <p className="text-center text-[11px] text-slate-600 leading-relaxed px-4">
          Bằng cách đăng nhập, bạn đồng ý với{" "}
          <Link to="/dieu-khoan-su-dung" className="underline hover:text-slate-400">Điều khoản</Link>
          {" "}và{" "}
          <Link to="/chinh-sach-bao-mat" className="underline hover:text-slate-400">Chính sách bảo mật</Link>
          {" "}của BDS Horizon.
        </p>
      </div>
    </div>
  );
}
