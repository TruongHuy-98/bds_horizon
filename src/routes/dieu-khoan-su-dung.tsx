import { createFileRoute, Link } from "@tanstack/react-router";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { COMPANY_INFO } from "@/lib/companyInfo";

export const Route = createFileRoute("/dieu-khoan-su-dung")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Điều khoản sử dụng & Quy chế hoạt động | BDS Horizon" },
      {
        name: "description",
        content:
          "Quy chế hoạt động, điều khoản sử dụng, quy định đăng tin và cơ chế giải quyết khiếu nại của BDS Horizon.",
      },
    ],
  }),
});

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-3 scroll-mt-24">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 container-page py-10 md:py-14">
        <article className="max-w-3xl mx-auto space-y-8">
          <header className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">Điều khoản sử dụng & Quy chế hoạt động</h1>
            <p className="text-xs text-muted-foreground">
              Căn cứ Luật Thương mại điện tử số 122/2025/QH15, Luật Bảo vệ quyền lợi người tiêu dùng số
              19/2023/QH15 và Luật Kinh doanh bất động sản hiện hành.
            </p>
          </header>

          <Section title="1. Thông tin chủ sở hữu nền tảng">
            <ul className="list-disc pl-5 space-y-1">
              <li>Tên doanh nghiệp: {COMPANY_INFO.legalName}</li>
              <li>Mã số thuế: {COMPANY_INFO.taxCode}</li>
              <li>Giấy chứng nhận đăng ký doanh nghiệp: {COMPANY_INFO.businessRegistration}</li>
              <li>Người đại diện: {COMPANY_INFO.representative}</li>
              <li>Địa chỉ: {COMPANY_INFO.address}</li>
              <li>
                Điện thoại: {COMPANY_INFO.phone}. Email: {COMPANY_INFO.email}
              </li>
            </ul>
          </Section>

          <Section title="2. Phạm vi dịch vụ">
            <p>
              BDS Horizon là nền tảng trung gian kết nối người có nhu cầu mua, bán, thuê bất động sản với
              nhà môi giới. Nền tảng cung cấp: đăng và tìm kiếm tin bất động sản, danh bạ môi giới, tra cứu
              quy hoạch, tin tức – pháp lý và ôn thi chứng chỉ môi giới. BDS Horizon{" "}
              <strong>không phải là bên mua, bán hay cho thuê</strong> trong các giao dịch giữa người dùng
              và không nhận tiền đặt cọc thay các bên.
            </p>
          </Section>

          <Section title="3. Tài khoản thành viên">
            <ul className="list-disc pl-5 space-y-1">
              <li>Thành viên chịu trách nhiệm bảo mật mật khẩu và mọi hoạt động dưới tài khoản của mình.</li>
              <li>
                Nhà môi giới phải cung cấp thông tin định danh (CCCD) và chứng chỉ hành nghề hợp lệ để được
                xác minh trước khi tin đăng hiển thị nhãn “Đã xác minh”.
              </li>
              <li>
                Thành viên có thể yêu cầu xóa tài khoản bất kỳ lúc nào qua {COMPANY_INFO.privacyEmail}.
              </li>
            </ul>
          </Section>

          <Section title="4. Quy định đăng tin">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Thông tin tin đăng (vị trí, diện tích, giá, pháp lý, hình ảnh) phải trung thực, đúng hiện
                trạng; không đăng bất động sản không đủ điều kiện đưa vào kinh doanh theo quy định.
              </li>
              <li>Giá hiển thị phải là giá thực, nêu rõ đã/chưa gồm thuế, phí nếu có.</li>
              <li>
                Không đăng nội dung vi phạm pháp luật, xúc phạm, lừa đảo; không dùng hình ảnh vi phạm quyền
                tác giả.
              </li>
              <li>
                Tin quảng cáo dự án hoặc tin được trả phí ưu tiên hiển thị được gắn nhãn phân biệt với tin
                thông thường.
              </li>
              <li>
                BDS Horizon có quyền ẩn, gỡ tin vi phạm. Nội dung vi phạm theo yêu cầu của cơ quan có thẩm
                quyền được gỡ trong vòng 24 giờ (trường hợp khẩn cấp: 06 giờ) theo Luật An ninh mạng
                116/2025/QH15.
              </li>
            </ul>
          </Section>

          <Section title="5. Trách nhiệm các bên">
            <p>
              Người đăng tin chịu trách nhiệm về tính chính xác của tin đăng và nghĩa vụ của mình trong
              giao dịch. BDS Horizon chịu trách nhiệm định danh người đăng tin, lưu hồ sơ người bán, cung
              cấp cho cơ quan quản lý khi có yêu cầu và phối hợp xử lý khi có khiếu nại. Người dùng nên
              kiểm tra thực địa, giấy chứng nhận và hồ sơ pháp lý trước khi đặt cọc.
            </p>
          </Section>

          <Section id="khieu-nai" title="6. Tiếp nhận và giải quyết khiếu nại, tranh chấp">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Gửi khiếu nại qua email {COMPANY_INFO.email} hoặc hotline {COMPANY_INFO.phone}, kèm đường
                dẫn tin đăng và mô tả sự việc.
              </li>
              <li>Chúng tôi phản hồi tiếp nhận trong 02 ngày làm việc và xử lý trong tối đa 15 ngày.</li>
              <li>
                Tranh chấp được ưu tiên giải quyết bằng thương lượng, hòa giải; nếu không thành, các bên có
                quyền đưa ra Tòa án có thẩm quyền theo pháp luật Việt Nam.
              </li>
            </ul>
          </Section>

          <Section title="7. Bảo vệ dữ liệu cá nhân">
            <p>
              Việc thu thập và xử lý dữ liệu cá nhân được thực hiện theo{" "}
              <Link to="/chinh-sach-bao-mat" className="text-primary underline underline-offset-2">
                Chính sách bảo vệ dữ liệu cá nhân
              </Link>
              .
            </p>
          </Section>

          <Section title="8. Hiệu lực">
            <p>
              Quy chế có hiệu lực kể từ ngày công bố. Khi sửa đổi, BDS Horizon thông báo trên website ít
              nhất 05 ngày trước khi áp dụng.
            </p>
          </Section>
        </article>
      </main>
      <Footer />
    </div>
  );
}

