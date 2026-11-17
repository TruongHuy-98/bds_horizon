import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Send,
  MessageSquare,
  Building2,
  FileSearch,
  Handshake,
  ExternalLink,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { ContactConsentCheckbox } from "@/components/site/ContactConsentCheckbox";
import { COMPANY_INFO } from "@/lib/companyInfo";
import { toast } from "sonner";

export const Route = createFileRoute("/lien-he")({
  component: LienHePage,
  head: () => ({
    meta: [
      { title: "Liên hệ — BDS Horizon Da Nang Real Estate" },
      {
        name: "description",
        content:
          "Liên hệ BDS Horizon để được tư vấn bất động sản, ký gửi nhà đất, tra cứu quy hoạch và hợp tác dự án tại Đà Nẵng. Hỗ trợ 24/7.",
      },
    ],
  }),
});

type ContactType = "buy-rent" | "consign" | "planning" | "partner";

const contactTypes: { id: ContactType; label: string; icon: any; desc: string }[] = [
  {
    id: "buy-rent",
    label: "Mua / Thuê BĐS",
    icon: Building2,
    desc: "Tìm nhà phố, đất nền, căn hộ phù hợp",
  },
  {
    id: "consign",
    label: "Ký gửi nhà đất",
    icon: MessageSquare,
    desc: "Đăng bán / cho thuê nhanh chóng",
  },
  {
    id: "planning",
    label: "Tra cứu quy hoạch",
    icon: FileSearch,
    desc: "Hỗ trợ đọc bản đồ & pháp lý thửa đất",
  },
  {
    id: "partner",
    label: "Hợp tác đối tác",
    icon: Handshake,
    desc: "Dành cho Môi giới & Chủ đầu tư",
  },
];

const danangDistricts = [
  "Quận Hải Châu",
  "Quận Sơn Trà",
  "Quận Ngũ Hành Sơn",
  "Quận Thanh Khê",
  "Quận Liên Chiểu",
  "Quận Cẩm Lệ",
  "Huyện Hòa Vang",
  "Khu vực khác",
];

const faqs = [
  {
    q: "BDS Horizon có thu phí người mua khi đi xem nhà đất không?",
    a: "Hoàn toàn miễn phí. Người mua và người thuê được chuyên viên hỗ trợ tư vấn, dẫn đi xem thực tế và hỗ trợ thủ tục pháp lý mà không phải trả bất kỳ khoản phí môi giới nào.",
  },
  {
    q: "Quy trình ký gửi nhà đất tại Đà Nẵng diễn ra như thế nào?",
    a: "Sau khi bạn gửi thông tin, chuyên viên thẩm định của chúng tôi sẽ liên hệ trong 30 phút để xác thực sổ đỏ, khảo sát thực tế, định giá thị trường và chụp ảnh quay phim chuyên nghiệp để niêm yết lên hệ thống.",
  },
  {
    q: "Tôi có thể nhờ kiểm tra quy hoạch trước khi xuống cọc không?",
    a: "Có. Đội ngũ chuyên môn của BDS Horizon kết nối trực tiếp dữ liệu quy hoạch Sở Xây dựng Đà Nẵng, hỗ trợ kiểm tra quy hoạch phân khu, lộ giới giao thông và tranh chấp pháp lý hoàn toàn miễn phí cho khách hàng.",
  },
];

function LienHePage() {
  const [selectedType, setSelectedType] = useState<ContactType>("buy-rent");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    district: danangDistricts[0],
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending lead
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Gửi yêu cầu thành công!", {
        description: "Chuyên viên tư vấn sẽ liên hệ lại với bạn trong vòng 15-30 phút.",
      });
    }, 900);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pb-16 md:pb-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/[0.04] via-accent/30 to-background border-b border-border/50 py-12 md:py-16">
          <div className="container-page text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Phản hồi cam kết trong 15–30 phút
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
              Kết nối cùng chuyên gia <br />
              <span className="text-primary">Bất động sản Đà Nẵng</span>
            </h1>
            <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              Dù bạn đang tìm mua tổ ấm lý tưởng, ký gửi nhà đất giá tốt, hay cần kiểm tra quy hoạch chính xác,
              chúng tôi luôn sẵn sàng đồng hành cùng bạn.
            </p>
          </div>
        </section>

        {/* Main Bento Grid Container */}
        <section className="container-page -mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Direct Info & Trust Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Office Info Card */}
              <Card className="border-border shadow-sm hover:shadow-md transition-shadow bg-card overflow-hidden">
                <div className="h-2 bg-primary w-full" />
                <CardContent className="p-6 space-y-6">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      Trụ sở chính
                    </span>
                    <h2 className="text-xl font-bold mt-1 text-foreground">
                      BDS Horizon Đà Nẵng
                    </h2>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-semibold block text-foreground">Địa chỉ văn phòng</span>
                        <span className="text-muted-foreground text-xs leading-relaxed">
                          {COMPANY_INFO.address} (Tòa nhà Horizon sông Hàn)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0 mt-0.5">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-semibold block text-foreground">Hotline tư vấn 24/7</span>
                        <a
                          href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, "")}`}
                          className="text-primary font-bold hover:underline text-base"
                        >
                          {COMPANY_INFO.phone}
                        </a>
                        <span className="text-[11px] text-muted-foreground block">
                          (Hỗ trợ cả Zalo / WhatsApp)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 shrink-0 mt-0.5">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-semibold block text-foreground">Email tiếp nhận</span>
                        <a
                          href={`mailto:${COMPANY_INFO.email}`}
                          className="text-foreground hover:text-primary transition-colors text-xs"
                        >
                          {COMPANY_INFO.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 shrink-0 mt-0.5">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-semibold block text-foreground">Thời gian làm việc</span>
                        <div className="text-xs text-muted-foreground space-y-0.5 mt-0.5">
                          <div>Thứ 2 – Thứ 7: 08:00 – 18:30</div>
                          <div>Chủ nhật: 08:30 – 12:00 (Trực hotline)</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Direct Action Buttons */}
                  <div className="pt-2 grid grid-cols-2 gap-3 border-t border-border/60">
                    <Button
                      asChild
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-10"
                    >
                      <a href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, "")}`}>
                        <Phone className="h-3.5 w-3.5 mr-1.5" /> Gọi ngay
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-border hover:bg-accent text-foreground font-semibold text-xs h-10"
                    >
                      <a
                        href="https://maps.google.com/?q=22+Bạch+Đằng,+Hải+Châu,+Đà+Nẵng"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5 text-primary" /> Chỉ đường
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Guarantees Box */}
              <div className="bg-gradient-to-br from-primary/5 via-accent/40 to-transparent border border-primary/20 rounded-xl p-5 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" /> Cam kết dịch vụ
                </span>
                <ul className="space-y-2.5 text-xs text-foreground/90">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span><strong>100% Bất động sản</strong> xác minh sổ đỏ & pháp lý rõ ràng.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span><strong>Miễn phí kiểm tra quy hoạch</strong> phân khu Đà Nẵng 2030-2050.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span><strong>Bảo mật thông tin</strong> cá nhân theo quy định pháp luật Việt Nam.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Interactive Consultation Form (7 cols) */}
            <div className="lg:col-span-7">
              <Card className="border-border shadow-md bg-card overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  {isSuccess ? (
                    <div className="py-12 text-center space-y-4 animate-fade-in">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full grid place-items-center mx-auto shadow-inner">
                        <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">
                        Cảm ơn bạn đã liên hệ!
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                        Yêu cầu của bạn đã được chuyển tới chuyên viên tư vấn phụ trách khu vực{" "}
                        <strong className="text-foreground">{formData.district}</strong>. Chúng tôi sẽ gọi lại cho bạn qua số điện thoại{" "}
                        <strong className="text-primary">{formData.phone}</strong> trong ít phút.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsSuccess(false);
                          setFormData({
                            fullName: "",
                            phone: "",
                            email: "",
                            district: danangDistricts[0],
                            message: "",
                          });
                        }}
                        className="mt-4"
                      >
                        Gửi yêu cầu khác
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-foreground">
                          Gửi yêu cầu tư vấn
                        </h2>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">
                          Vui lòng chọn nhu cầu và để lại thông tin để nhận phản hồi nhanh nhất.
                        </p>
                      </div>

                      {/* Pill tabs: Need classification */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground block">
                          Bạn đang quan tâm đến nội dung nào?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {contactTypes.map((type) => {
                            const Icon = type.icon;
                            const isSelected = selectedType === type.id;
                            return (
                              <button
                                key={type.id}
                                type="button"
                                onClick={() => setSelectedType(type.id)}
                                className={`p-3 rounded-xl border text-left flex flex-col items-start gap-1.5 transition-all ${
                                  isSelected
                                    ? "bg-primary text-white border-primary shadow-sm"
                                    : "bg-muted/40 hover:bg-muted/80 border-border text-foreground/80"
                                }`}
                              >
                                <Icon className={`h-4 w-4 ${isSelected ? "text-white" : "text-primary"}`} />
                                <span className="text-xs font-bold leading-tight">{type.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Inputs grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">
                            Họ và tên <span className="text-rose-500">*</span>
                          </label>
                          <Input
                            required
                            placeholder="Ví dụ: Nguyễn Văn An"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="h-11 bg-background"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">
                            Số điện thoại <span className="text-rose-500">*</span>
                          </label>
                          <Input
                            required
                            type="tel"
                            placeholder="Ví dụ: 0905 123 456"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="h-11 bg-background"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">
                            Email (tùy chọn)
                          </label>
                          <Input
                            type="email"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="h-11 bg-background"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">
                            Khu vực quan tâm
                          </label>
                          <select
                            value={formData.district}
                            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                            className="w-full h-11 px-3 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            {danangDistricts.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          Nội dung yêu cầu chi tiết
                        </label>
                        <Textarea
                          rows={4}
                          placeholder="Ví dụ: Tôi cần tìm nhà phố 3 tầng khu vực Hải Châu tầm giá 5-7 tỷ, hoặc cần hỗ trợ kiểm tra thửa đất số..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="bg-background resize-none text-sm"
                        />
                      </div>

                      {/* Legal compliance consent checkbox */}
                      <div className="pt-1">
                        <ContactConsentCheckbox />
                      </div>

                      {/* Submit CTA */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Đang gửi thông tin...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>Gửi yêu cầu tư vấn ngay</span>
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Office Location Interactive Map section */}
        <section className="container-page mt-16 md:mt-20">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Vị trí trụ sở
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mt-1">
                  Đến thăm văn phòng BDS Horizon
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                  Tọa lạc tại trung tâm hành chính TP. Đà Nẵng, thuận tiện cho việc gặp gỡ và ký kết hợp đồng.
                </p>
              </div>

              <Button
                asChild
                variant="outline"
                className="shrink-0 font-semibold text-xs h-10 border-border hover:bg-accent"
              >
                <a
                  href="https://maps.google.com/?q=22+Bạch+Đằng,+Hải+Châu,+Đà+Nẵng"
                  target="_blank"
                  rel="noreferrer"
                >
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" /> Mở trên Google Maps ↗
                </a>
              </Button>
            </div>

            {/* Embedded Responsive Google Map Iframe */}
            <div className="w-full h-[360px] md:h-[420px] rounded-xl overflow-hidden border border-border/80 shadow-inner relative bg-muted">
              <iframe
                title="BDS Horizon Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.856983792376!2d108.22247787593256!3d16.072927239343336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31421831826f49e7%3A0xb3c306c52a0a2df2!2zMjIgQuG6oWNoIMSQ4bqxbmcsIFRo4bqhY2ggVGhhbmcsIEjhuqNpIENow6J1LCDEkMOgIE7hurVuZw!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container-page mt-16 md:mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center justify-center gap-1.5">
              <HelpCircle className="h-4 w-4" /> Giải đáp thắc mắc
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-1">
              Câu hỏi thường gặp
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Những thông tin khách hàng thường quan tâm khi liên hệ với chúng tôi.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl px-5 py-1 bg-card shadow-sm"
              >
                <AccordionTrigger className="text-sm md:text-base font-semibold text-foreground text-left hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs md:text-sm text-muted-foreground leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      <Footer />
    </div>
  );
}

