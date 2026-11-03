import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { COMPANY_INFO } from "@/lib/companyInfo";
import { PRIVACY_POLICY_VERSION, resetAnalyticsConsent } from "@/lib/consent";

export const Route = createFileRoute("/chinh-sach-bao-mat")({
  component: PrivacyPolicyPage,
  head: () => ({
    meta: [
      { title: "Chính sách bảo vệ dữ liệu cá nhân | BDS Horizon" },
      {
        name: "description",
        content:
          "Chính sách thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân của người dùng BDS Horizon.",
      },
    ],
  }),
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 container-page py-10 md:py-14">
        <article className="max-w-3xl mx-auto space-y-8">
          <header className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">Chính sách bảo vệ dữ liệu cá nhân</h1>
            <p className="text-xs text-muted-foreground">
              Phiên bản {PRIVACY_POLICY_VERSION}. Áp dụng theo Luật Bảo vệ dữ liệu cá nhân số
              91/2025/QH15 và Nghị định 356/2025/NĐ-CP.
            </p>
          </header>

          <Section title="1. Bên kiểm soát và xử lý dữ liệu">
            <p>
              {COMPANY_INFO.legalName} ({COMPANY_INFO.brandName}), mã số thuế {COMPANY_INFO.taxCode},
              địa chỉ {COMPANY_INFO.address}, email {COMPANY_INFO.email}, điện thoại {COMPANY_INFO.phone}.
            </p>
          </Section>

          <Section title="2. Dữ liệu chúng tôi thu thập">
            <p>
              <strong className="text-foreground">Dữ liệu cá nhân cơ bản:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Tài khoản: email, mật khẩu (được mã hóa), vai trò thành viên.</li>
              <li>Hồ sơ: họ tên, số điện thoại, ảnh đại diện, khu vực hoạt động, kinh nghiệm.</li>
              <li>Yêu cầu tư vấn: họ tên, số điện thoại, ghi chú bạn gửi cho chúng tôi hoặc môi giới.</li>
              <li>
                Thống kê truy cập (chỉ khi bạn đồng ý): trang đã xem, thời điểm, loại thiết bị, trình
                duyệt.
              </li>
            </ul>
            <p>
              <strong className="text-foreground">
                Dữ liệu cần bảo vệ tăng cường (chỉ với Nhà môi giới / Cộng tác viên, khi tự nguyện cung
                cấp):
              </strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Số, ngày cấp, nơi cấp và ảnh hai mặt Căn cước công dân (CCCD), dùng để xác minh danh tính
                người đăng tin.
              </li>
              <li>Chứng chỉ hành nghề môi giới bất động sản.</li>
              <li>Tài khoản ngân hàng và mã số thuế cá nhân, dùng để chi trả và khấu trừ thuế hoa hồng.</li>
            </ul>
            <p>
              Ảnh CCCD được nhận dạng ký tự (OCR) <strong>ngay trên trình duyệt của bạn</strong>; quá
              trình quét không gửi ảnh cho bên thứ ba nào.
            </p>
          </Section>

          <Section title="3. Mục đích xử lý">
            <ul className="list-disc pl-5 space-y-1">
              <li>Tạo và quản lý tài khoản, cho phép đăng và quản lý tin bất động sản.</li>
              <li>
                Xác minh danh tính người đăng tin nhằm hạn chế tin giả, lừa đảo, theo yêu cầu định danh
                người bán trên nền tảng.
              </li>
              <li>Chuyển yêu cầu tư vấn của bạn đến môi giới phụ trách tin đăng.</li>
              <li>Chi trả hoa hồng và thực hiện nghĩa vụ thuế.</li>
              <li>Thống kê, cải thiện chất lượng website (chỉ khi bạn đồng ý).</li>
            </ul>
            <p>
              Chúng tôi <strong>không mua bán dữ liệu cá nhân</strong> và không sử dụng dữ liệu cho mục
              đích quảng cáo khi chưa có sự đồng ý riêng của bạn.
            </p>
          </Section>

          <Section title="4. Cơ sở xử lý và sự đồng ý">
            <p>
              Chúng tôi xin sự đồng ý riêng cho từng mục đích: (a) khi đăng ký tài khoản, (b) khi cung cấp
              CCCD để xác minh, (c) khi gửi yêu cầu tư vấn, (d) khi cho phép thống kê truy cập. Im lặng
              hoặc không thao tác không được coi là đồng ý. Thời điểm và phiên bản chính sách bạn đồng ý
              được lưu lại để kiểm chứng.
            </p>
            <p>
              Bạn có thể rút lại sự đồng ý bất kỳ lúc nào. Với thống kê truy cập:{" "}
              <button
                type="button"
                onClick={resetAnalyticsConsent}
                className="text-primary underline underline-offset-2"
              >
                thay đổi lựa chọn cookie
              </button>
              . Việc rút lại không ảnh hưởng đến tính hợp pháp của các xử lý đã thực hiện trước đó.
            </p>
          </Section>

          <Section title="5. Chia sẻ dữ liệu và bên thứ ba">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong className="text-foreground">Supabase</strong> (lưu trữ cơ sở dữ liệu, xác thực
                tài khoản) và <strong className="text-foreground">Vercel</strong> (lưu trữ website): máy
                chủ có thể đặt ngoài lãnh thổ Việt Nam.
              </li>
              <li>
                <strong className="text-foreground">Google</strong>: nếu bạn chọn đăng nhập bằng Google.
              </li>
              <li>Môi giới phụ trách tin đăng: nhận họ tên, số điện thoại trong yêu cầu tư vấn của bạn.</li>
              <li>Cơ quan nhà nước có thẩm quyền: khi có yêu cầu hợp lệ theo quy định pháp luật.</li>
            </ul>
            <p>
              Số CCCD, ảnh CCCD, tài khoản ngân hàng và mã số thuế <strong>không được hiển thị công
              khai</strong>; chỉ bạn và quản trị viên được phân quyền mới truy cập được.
            </p>
          </Section>

          <Section title="6. Thời gian lưu trữ">
            <ul className="list-disc pl-5 space-y-1">
              <li>Dữ liệu tài khoản và hồ sơ: trong thời gian tài khoản còn hoạt động.</li>
              <li>
                Ảnh và thông tin CCCD: đến khi hoàn tất xác minh và trong thời gian bạn còn đăng tin; xóa
                khi bạn yêu cầu hoặc khi tài khoản bị xóa.
              </li>
              <li>Thống kê truy cập: tối đa 12 tháng, sau đó tự động xóa.</li>
              <li>Yêu cầu tư vấn: tối đa 12 tháng kể từ ngày gửi.</li>
            </ul>
          </Section>

          <Section title="7. Quyền của bạn">
            <p>Theo Điều 4 Luật 91/2025/QH15, bạn có quyền:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Được biết về việc xử lý dữ liệu; xem, chỉnh sửa, yêu cầu cung cấp dữ liệu của mình.</li>
              <li>Đồng ý, rút lại sự đồng ý; yêu cầu xóa, hạn chế xử lý, phản đối xử lý dữ liệu.</li>
              <li>Khiếu nại, tố cáo, khởi kiện và yêu cầu bồi thường thiệt hại theo quy định.</li>
            </ul>
            <p>
              Gửi yêu cầu tới <strong className="text-foreground">{COMPANY_INFO.privacyEmail}</strong>.
              Chúng tôi xác nhận đã nhận yêu cầu trong 02 ngày làm việc, và xử lý: xem/chỉnh sửa/cung cấp
              dữ liệu trong 10 ngày; rút đồng ý, hạn chế hoặc phản đối xử lý trong 15 ngày; xóa dữ liệu
              trong 20 ngày (theo Nghị định 356/2025/NĐ-CP).
            </p>
          </Section>

          <Section title="8. Biện pháp bảo vệ">
            <p>
              Kết nối được mã hóa HTTPS; mật khẩu được băm; phân quyền truy cập theo vai trò ở tầng cơ sở
              dữ liệu (Row Level Security). Khi xảy ra sự cố lộ lọt dữ liệu, chúng tôi thông báo cho cơ
              quan chuyên trách trong vòng 72 giờ và thông báo cho người bị ảnh hưởng theo quy định.
            </p>
          </Section>

          <Section title="9. Trẻ em">
            <p>
              Dịch vụ không dành cho người dưới 16 tuổi. Nếu phát hiện dữ liệu của trẻ em được cung cấp
              khi chưa có sự đồng ý của người đại diện theo pháp luật, chúng tôi sẽ xóa dữ liệu đó.
            </p>
          </Section>

          <Section title="10. Thay đổi chính sách">
            <p>
              Khi chính sách thay đổi đáng kể, chúng tôi cập nhật phiên bản ở đầu trang và xin lại sự đồng
              ý nếu cần.
            </p>
          </Section>
        </article>
      </main>
      <Footer />
    </div>
  );
}

