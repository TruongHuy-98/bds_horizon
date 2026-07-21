import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

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
  const { user, role, isGuest } = useAuth();

  const handleLogout = async () => {
    const isMock = typeof window !== "undefined" && !!localStorage.getItem("bds_mock_role");
    if (isMock) {
      localStorage.removeItem("bds_mock_role");
      localStorage.removeItem("bds_mock_admin");
    } else {
      await supabase.auth.signOut();
    }
    window.location.reload();
  };

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
        <div className="hidden md:flex items-center gap-4">
          {!isGuest ? (
            <>
              {role !== "user" ? (
                <Link
                  to="/admin"
                  className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors"
                >
                  Bảng Quản Trị
                </Link>
              ) : (
                <span className="text-xs text-muted-foreground font-medium">
                  {user?.email?.split("@")[0]}
                </span>
              )}
              
              {(role === "admin" || role === "broker") && (
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-10 px-5 font-medium transition-all shadow-sm"
                >
                  <Link to="/admin">Đăng tin</Link>
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-xs text-muted-foreground hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20"
              >
                Đăng xuất
              </Button>
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
          {isGuest ? (
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-9 px-4 text-sm"
            >
              <Link to="/auth">Đăng tin</Link>
            </Button>
          ) : (role === "admin" || role === "broker") ? (
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-9 px-4 text-sm"
            >
              <Link to="/admin">Đăng tin</Link>
            </Button>
          ) : null}
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
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <nav className="container-page py-4 flex flex-col gap-1">
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
                <>
                  {role !== "user" && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-3 rounded-md text-sm font-medium text-foreground/75 hover:text-primary hover:bg-accent transition-colors"
                    >
                      Bảng Quản Trị
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2 px-3 py-3 rounded-md text-sm font-medium text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 text-left transition-colors"
                  >
                    Đăng xuất ({user?.email?.split("@")[0]})
                  </button>
                </>
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
