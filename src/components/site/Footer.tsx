import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin } from "lucide-react";

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
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container-page py-12 md:py-14 grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-10">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
            Nền tảng kết nối giao dịch bất động sản chuyên nghiệp nhất tại Đà Nẵng. Chúng tôi cam
            kết mang lại giá trị thực và thông tin minh bạch nhất cho cộng đồng.
          </p>
          <div className="mt-5 flex flex-col gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span>22 Bạch Đằng, Hải Châu, TP. Đà Nẵng</span>
            </span>
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <span>0236 888 9999</span>
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span>hello@danang-realestate.vn</span>
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-foreground">Bất động sản</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/nha-dat-ban" className="hover:text-primary transition-colors">
                Nhà đất bán
              </Link>
            </li>
            <li>
              <Link to="/nha-dat-cho-thue" className="hover:text-primary transition-colors">
                Nhà đất cho thuê
              </Link>
            </li>
            <li>
              <Link to="/du-an" className="hover:text-primary transition-colors">
                Dự án nổi bật
              </Link>
            </li>
            <li>
              <Link to="/check-quy-hoach" className="hover:text-primary transition-colors">
                Tra cứu Quy hoạch
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-foreground">Khám phá & Tiện ích</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/tin-tuc" className="hover:text-primary transition-colors">
                Tin tức thị trường
              </Link>
            </li>
            <li>
              <Link to="/moi-gioi" className="hover:text-primary transition-colors">
                Danh bạ môi giới
              </Link>
            </li>
            <li>
              <Link to="/on-thi" className="hover:text-primary transition-colors">
                Ôn thi môi giới BĐS
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-foreground">Về chúng tôi</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Liên hệ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Điều khoản sử dụng
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Chính sách bảo mật
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/80">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© 2026 Da Nang Real Estate. All rights reserved. Coastal living, professional service.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Quy chế hoạt động</a>
            <a href="#" className="hover:text-primary transition-colors">Bảo mật thông tin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

