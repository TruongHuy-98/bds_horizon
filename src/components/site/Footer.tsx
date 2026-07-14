import { Link } from "@tanstack/react-router";
import { Phone, Mail } from "lucide-react";

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

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container-page py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
            Nền tảng kết nối giao dịch bất động sản chuyên nghiệp nhất tại Đà Nẵng. Chúng tôi cam
            kết mang lại giá trị thực và thông tin minh bạch nhất cho cộng đồng.
          </p>
          <div className="mt-5 flex flex-col gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span>0236 888 9999</span>
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span>hello@danang-realestate.vn</span>
            </span>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm">Dịch vụ</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-primary">
                Mua bán
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Cho thuê
              </a>
            </li>
            <li>
              <Link to="/check-quy-hoach" className="hover:text-primary">
                Check Quy Hoạch
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Hướng dẫn đăng tin
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm">Công ty</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <a href="#" className="hover:text-primary">
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Liên hệ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Điều khoản sử dụng
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Chính sách bảo mật
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-5 text-xs text-muted-foreground">
          © 2026 Da Nang Real Estate. All rights reserved. Coastal living, professional service.
        </div>
      </div>
    </footer>
  );
}
