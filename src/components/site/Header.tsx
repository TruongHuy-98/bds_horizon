import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, User, ShieldCheck, Building2, Award, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { HeaderProfileDropdown } from "@/components/profile/HeaderProfileDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
        <path d="M16 4L28 26H4L16 4Z" fill="var(--primary)" />
        <path d="M16 12L24 26H8L16 12Z" fill="var(--teal)" opacity="0.85" />
      </svg>
      <div className="leading-tight">
        <div className="text-sm font-bold tracking-tight text-primary">DA NANG</div>
        <div className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground">
          REAL ESTATE
        </div>
      </div>
    </Link>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, role, isGuest, profile, openProfileModal, switchMockRole, logout } = useAuth();

  const nav: { label: string; to?: string; href?: string }[] = [
    { label: "Nhà đất bán", to: "/nha-dat-ban" },
    { label: "Nhà đất cho thuê", to: "/nha-dat-cho-thue" },
    { label: "Dự án", to: "/du-an" },
    { label: "Check Quy Hoạch", to: "/check-quy-hoach" },
    { label: "Luyện thi", to: "/on-thi" },
    { label: "Danh bạ Môi giới", to: "/moi-gioi" },
    { label: "Tin tức", to: "/tin-tuc" },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/60">
      <div className="container-page flex h-16 items-center justify-between">
        {/* Logo + Desktop Nav */}
        <div className="flex items-center gap-10">
          <Logo />
          <nav className="hidden md:flex items-center gap-7">
            {nav.map((n) =>
              n.to ? (
                <Link
                  key={n.label}
                  to={n.to}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                  activeProps={{
                    className: "text-sm font-medium text-primary border-b-2 border-primary pb-1",
                  }}
                  activeOptions={{ exact: true }}
                >
                  {n.label}
                </Link>
              ) : (
                <a
                  key={n.label}
                  href={n.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  {n.label}
                </a>
              ),
            )}
          </nav>
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {!isGuest ? (
            <>
              {role !== "user" && (
                <Link
                  to="/admin"
                  className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors"
                >
                  Bảng Quản Trị
                </Link>
              )}

              {(role === "admin" || role === "broker") && (
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-9 px-4 font-medium transition-all shadow-sm text-xs"
                >
                  <Link to="/admin">Đăng tin</Link>
                </Button>
              )}

              <HeaderProfileDropdown align="end" />
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors"
              >
                Đăng nhập
              </Link>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-10 px-5 font-medium transition-all shadow-sm"
              >
                <Link to="/auth">Đăng tin</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile: Actions + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {!isGuest ? (
            <HeaderProfileDropdown align="end" showNameOnMobile={false} />
          ) : (
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-8 px-3 text-xs"
            >
              <Link to="/auth">Đăng nhập</Link>
            </Button>
          )}

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="h-9 w-9 flex items-center justify-center rounded-md border border-border bg-card hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md max-h-[85vh] overflow-y-auto">
          <nav className="container-page py-4 flex flex-col gap-1">
            {/* If logged in on mobile, show rich user card */}
            {!isGuest && (
              <div className="p-3 mb-2 rounded-xl bg-muted/50 border border-border/80 flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10 ring-2 ring-primary/20">
                    <AvatarImage src={profile?.avatar} alt={profile?.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                      {profile?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-foreground truncate">
                      {profile?.name || user?.email?.split("@")[0]}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {profile?.email || user?.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setMobileOpen(false);
                      openProfileModal();
                    }}
                    className="flex-1 text-xs h-8 gap-1.5"
                  >
                    <User className="size-3.5" /> Hồ sơ cá nhân
                  </Button>
                  {role !== "user" && (
                    <Button
                      asChild
                      size="sm"
                      className="flex-1 text-xs h-8 bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Link to="/admin">Bảng Quản Trị</Link>
                    </Button>
                  )}
                </div>

                {/* Quick Role Switcher on Mobile */}
                <div className="pt-2 border-t border-border/50">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Sparkles className="size-3 text-amber-500" />
                    Đổi vai trò xem thử
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => switchMockRole("admin")}
                      className={`text-[11px] py-1 px-2 rounded-md border text-left flex items-center justify-between ${
                        role === "admin"
                          ? "bg-purple-100 text-purple-900 border-purple-300 font-semibold"
                          : "bg-background text-muted-foreground border-border"
                      }`}
                    >
                      <span>Admin</span>
                      {role === "admin" && "✓"}
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMockRole("broker")}
                      className={`text-[11px] py-1 px-2 rounded-md border text-left flex items-center justify-between ${
                        role === "broker"
                          ? "bg-blue-100 text-blue-900 border-blue-300 font-semibold"
                          : "bg-background text-muted-foreground border-border"
                      }`}
                    >
                      <span>Môi giới</span>
                      {role === "broker" && "✓"}
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMockRole("collaborator")}
                      className={`text-[11px] py-1 px-2 rounded-md border text-left flex items-center justify-between ${
                        role === "collaborator"
                          ? "bg-amber-100 text-amber-900 border-amber-300 font-semibold"
                          : "bg-background text-muted-foreground border-border"
                      }`}
                    >
                      <span>CTV</span>
                      {role === "collaborator" && "✓"}
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMockRole("user")}
                      className={`text-[11px] py-1 px-2 rounded-md border text-left flex items-center justify-between ${
                        role === "user"
                          ? "bg-slate-200 text-slate-900 border-slate-400 font-semibold"
                          : "bg-background text-muted-foreground border-border"
                      }`}
                    >
                      <span>Thành viên</span>
                      {role === "user" && "✓"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {nav.map((n) =>
              n.to ? (
                <Link
                  key={n.label}
                  to={n.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-3 rounded-md text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent transition-colors"
                  activeProps={{
                    className:
                      "flex items-center gap-2 px-3 py-3 rounded-md text-sm font-semibold text-primary bg-primary/5",
                  }}
                  activeOptions={{ exact: true }}
                >
                  {n.label}
                </Link>
              ) : (
                <a
                  key={n.label}
                  href={n.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-3 rounded-md text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent transition-colors"
                >
                  {n.label}
                </a>
              ),
            )}

            <div className="border-t border-border mt-2 pt-2 flex flex-col gap-1">
              {!isGuest ? (
                <button
                  onClick={async () => {
                    setMobileOpen(false);
                    await logout();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-3 rounded-md text-sm font-medium text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 text-left transition-colors"
                >
                  <LogOut className="size-4" />
                  Đăng xuất tài khoản
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-3 rounded-md text-sm font-medium text-foreground/75 hover:text-primary hover:bg-accent transition-colors"
                >
                  Đăng nhập / Đăng ký
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
