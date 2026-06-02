import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

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
  const nav: { label: string; to?: string; href?: string }[] = [
    { label: "Mua bán", to: "/" },
    { label: "Cho thuê", href: "#" },
    { label: "Dự án", to: "/du-an" },
    { label: "Check Quy Hoạch", to: "/check-quy-hoach" },
    { label: "Danh bạ Môi giới", to: "/moi-gioi" },
    { label: "Tin tức", to: "/tin-tuc" },
  ];
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/60">
      <div className="container-page flex h-16 items-center justify-between">
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
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="text-sm font-medium text-foreground/70 hover:text-primary hidden sm:inline"
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
      </div>
    </header>
  );
}
