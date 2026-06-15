import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

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

  const nav: { label: string; to?: string; href?: string }[] = [
    { label: "Mua bán", to: "/" },
    { label: "Cho thuê", href: "#" },
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
          <Link
            to="/admin"
            className="text-sm font-medium text-foreground/70 hover:text-primary"
          >
            Quản trị
          </Link>
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-10 px-5"
          >
            <Link to="/admin">Đăng tin</Link>
          </Button>
        </div>

        {/* Mobile: Đăng tin + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-9 px-4 text-sm"
          >
            <Link to="/admin">Đăng tin</Link>
          </Button>
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
            <div className="border-t border-border mt-2 pt-2">
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-3 rounded-md text-sm font-medium text-foreground/70 hover:text-primary hover:bg-accent transition-colors"
              >
                Quản trị
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
