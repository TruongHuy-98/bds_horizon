import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ShieldCheck, ArrowLeft, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { PRIVACY_POLICY_VERSION, logConsent } from "@/lib/consent";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Đăng nhập | BDS Horizon" }] }),
});

function GoogleIcon() {
  return (
    <svg className="size-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  // Hai ô đồng ý tách riêng, không tích sẵn (Điều 9 Luật 91/2025/QH15)
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeData, setAgreeData] = useState(false);

  const switchMode = (nextMode: "signin" | "signup") => {
    setMode(nextMode);
    setConfirmPassword("");
    setShowPassword(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "signup") {
      if (!fullName.trim()) {
        toast.error("Vui lòng nhập họ và tên của bạn.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Mật khẩu xác nhận không khớp.");
        return;
      }
      if (!agreeTerms || !agreeData) {
        toast.error("Vui lòng đọc và đồng ý điều khoản sử dụng và Chính sách bảo vệ dữ liệu cá nhân.");
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const consentAt = new Date().toISOString();
        const trimmedName = fullName.trim();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
            data: {
              full_name: trimmedName,
              terms_accepted_at: consentAt,
              privacy_consent_at: consentAt,
              privacy_policy_version: PRIVACY_POLICY_VERSION,
            },
          },
        });
        if (error) throw error;

        if (data.user) {
          // Mặc định luôn là 'user'; chỉ Admin mới có quyền phân vai trò khác
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert({ user_id: data.user.id, role: "user" });
          if (roleError) console.warn("Failed to assign default role:", roleError);
          void logConsent("account_signup", true, data.user.id);
        }

        toast.success("Đăng ký thành công! Hãy kiểm tra email để xác nhận tài khoản.");
        switchMode("signin");
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B192C] px-4 py-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/15 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-900/15 blur-[130px] pointer-events-none" />

      <div className="w-full max-w-md space-y-5 relative z-10">
        <div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="size-4" />
            Về trang chủ
          </Link>
        </div>

        {/* Logo & heading */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 mx-auto mb-1 shadow-lg shadow-blue-900/20">
            <ShieldCheck className="size-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">BDS Horizon</h1>
          <p className="text-sm text-slate-400">
            {mode === "signin" ? "Đăng nhập để tiếp tục" : "Tạo tài khoản thành viên mới"}
          </p>
        </div>

        <Card className="p-6 bg-slate-900/85 border-slate-800/80 backdrop-blur-xl shadow-2xl space-y-5">
          {/* Mode Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === "signin"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Đăng ký
            </button>
          </div>

          {/* Google Sign-In — Primary CTA */}
          <Button
            type="button"
            onClick={onGoogle}
            disabled={googleLoading}
            className="w-full h-11 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm flex items-center justify-center gap-3 shadow-md transition-all duration-150 cursor-pointer"
          >
            {googleLoading ? (
              <span className="size-5 border-2 border-slate-400/40 border-t-slate-600 rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
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
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-slate-300 text-xs font-medium">
                  Họ và tên
                </Label>
                <div className="relative">
                  <User className="size-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    required
                    className="pl-9 bg-slate-950/60 border-slate-700/80 text-white placeholder:text-slate-600 focus:border-blue-500/60 h-10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-300 text-xs font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="size-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="pl-9 bg-slate-950/60 border-slate-700/80 text-white placeholder:text-slate-600 focus:border-blue-500/60 h-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-300 text-xs font-medium">
                Mật khẩu
              </Label>
              <div className="relative">
                <Lock className="size-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  minLength={6}
                  className="pl-9 pr-10 bg-slate-950/60 border-slate-700/80 text-white placeholder:text-slate-600 focus:border-blue-500/60 h-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-slate-300 text-xs font-medium">
                  Xác nhận mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="size-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    required
                    minLength={6}
                    className="pl-9 bg-slate-950/60 border-slate-700/80 text-white placeholder:text-slate-600 focus:border-blue-500/60 h-10"
                  />
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
              className="w-full h-10 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-500/15 mt-1 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : mode === "signin" ? "Đăng nhập" : "Tạo tài khoản"}
            </Button>
          </form>
        </Card>

        <p className="text-center text-[11px] text-slate-500 leading-relaxed px-4">
          Bằng cách tiếp tục, bạn đồng ý với{" "}
          <Link to="/dieu-khoan-su-dung" className="underline hover:text-slate-300">
            Điều khoản
          </Link>{" "}
          và{" "}
          <Link to="/chinh-sach-bao-mat" className="underline hover:text-slate-300">
            Chính sách bảo mật
          </Link>{" "}
          của BDS Horizon.
        </p>
      </div>
    </div>
  );
}
