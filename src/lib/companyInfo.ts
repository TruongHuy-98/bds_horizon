/**
 * Thông tin pháp lý của chủ sở hữu website.
 * Bắt buộc công bố theo Điều 11 Luật Thương mại điện tử 122/2025/QH15.
 *
 * ⚠️ CẦN CẬP NHẬT: các trường đánh dấu TODO đang là giá trị giữ chỗ.
 * Điền đúng thông tin trên Giấy chứng nhận đăng ký doanh nghiệp trước khi chạy chính thức.
 */
export const COMPANY_INFO = {
  brandName: "BDS Horizon – Da Nang Real Estate",
  legalName: "[TODO: Tên doanh nghiệp theo Giấy CNĐKDN]",
  taxCode: "[TODO: Mã số thuế]",
  businessRegistration: "[TODO: Số Giấy CNĐKDN, ngày cấp, nơi cấp]",
  representative: "[TODO: Người đại diện theo pháp luật]",
  address: "22 Bạch Đằng, Hải Châu, TP. Đà Nẵng",
  phone: "0236 888 9999",
  email: "hello@danang-realestate.vn",
  /** Email/kênh tiếp nhận yêu cầu về dữ liệu cá nhân (xem, sửa, xóa, rút đồng ý) */
  privacyEmail: "hello@danang-realestate.vn",
  /** Link xác nhận thông báo/đăng ký với Bộ Công Thương (online.gov.vn). Để trống nếu chưa có. */
  moitRegistrationUrl: "",
} as const;

