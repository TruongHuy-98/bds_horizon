import { Link } from "@tanstack/react-router";

/**
 * Ô đồng ý xử lý dữ liệu cho form liên hệ/yêu cầu tư vấn.
 * Dùng thuộc tính `required` để trình duyệt chặn gửi form khi chưa tích (không tích sẵn).
 * Căn cứ: Điều 9 Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15.
 */
export function ContactConsentCheckbox({ className = "" }: { className?: string }) {
  return (
    <label
      className={`flex items-start gap-2 text-[10.5px] leading-snug text-muted-foreground cursor-pointer ${className}`}
    >
      <input type="checkbox" required name="contact_consent" className="mt-0.5 accent-primary shrink-0" />
      <span>
        Tôi đồng ý để BDS Horizon và môi giới phụ trách sử dụng họ tên, số điện thoại trên để liên hệ tư
        vấn về bất động sản này, theo{" "}
        <Link to="/chinh-sach-bao-mat" target="_blank" className="text-primary underline">
          Chính sách bảo mật
        </Link>
        .
      </span>
    </label>
  );
}

