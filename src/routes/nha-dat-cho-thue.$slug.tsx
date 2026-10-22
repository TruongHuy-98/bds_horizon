import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { sampleListings } from "@/data/listingsData";
import {
  MapPin,
  ShieldCheck,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  ChevronRight,
  CalendarDays,
  CheckCircle2,
  Building2,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/nha-dat-cho-thue/$slug")({
  component: RentalDetailPage,
  head: ({ params }) => {
    const property = sampleListings.find(
      (item) => item.slug === params.slug && item.listingType === "rent"
    );
    return {
      meta: [
        {
          title: property
            ? `${property.title} | BDS Cho Thuê Đà Nẵng`
            : "Chi tiết nhà đất cho thuê | BDS Đà Nẵng",
        },
        {
          name: "description",
          content: property
            ? `${property.title}. Giá thuê ${property.priceLabel}, diện tích ${property.area}m² tại ${property.location}.`
            : "Thông tin chi tiết tin đăng nhà đất cho thuê tại Đà Nẵng.",
        },
        {
          property: "og:image",
          content: property?.images?.[0] || "",
        },
      ],
    };
  },
});

function RentalDetailPage() {
  const { slug } = Route.useParams();

  // Find the property by slug
  const property = useMemo(() => {
    return sampleListings.find(
      (item) => item.slug === slug && item.listingType === "rent"
    );
  }, [slug]);

  // Similar properties for rent
  const similarProperties = useMemo(() => {
    if (!property) return [];
    return sampleListings
      .filter(
        (item) =>
          item.listingType === "rent" &&
          item.id !== property.id &&
          (item.district === property.district || item.category === property.category)
      )
      .slice(0, 3);
  }, [property]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", note: "" });

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Không tìm thấy tin đăng cho thuê
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mb-6">
            Tin đăng bất động sản này có thể đã được gỡ xuống hoặc đường dẫn không chính xác.
          </p>
          <Link to="/nha-dat-cho-thue">
            <Button className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Quay lại danh sách Nhà đất cho thuê
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success("Đã sao chép liên kết tin đăng vào bộ nhớ tạm!");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePhoneClick = () => {
    if (!showPhone) {
      setShowPhone(true);
      toast.success(`Đã hiện số điện thoại: ${property.brokerPhone}`);
    } else {
      navigator.clipboard.writeText(property.brokerPhone);
      toast.info(`Đã sao chép số điện thoại: ${property.brokerPhone}`);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại liên hệ");
      return;
    }
    toast.success("Yêu cầu tư vấn của bạn đã được gửi thành công!", {
      description: "Người cho thuê sẽ liên hệ lại trong thời gian sớm nhất.",
    });
    setContactForm({ name: "", phone: "", note: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 pb-16">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-border/60 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
              <Link to="/" className="hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <Link to="/nha-dat-cho-thue" className="hover:text-primary transition-colors">
                Nhà đất cho thuê
              </Link>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <Link
                to="/nha-dat-cho-thue"
                search={{ district: property.district }}
                className="hover:text-primary transition-colors"
              >
                {property.district}
              </Link>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs">
                {property.title}
              </span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content Column (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Media Gallery */}
              <div className="space-y-3">
                <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-muted border border-border/60 shadow-sm">
                  <img
                    src={property.images[activeImageIndex] || property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                    <span className="bg-emerald-600 text-white font-bold text-xs uppercase px-2.5 py-1 rounded shadow-md">
                      Cho thuê
                    </span>
                    {property.isVip && (
                      <span className="bg-amber-500 text-white font-bold text-xs uppercase px-2.5 py-1 rounded shadow-md">
                        VIP
                      </span>
                    )}
                    {property.isHot && (
                      <span className="bg-rose-500 text-white font-bold text-xs uppercase px-2.5 py-1 rounded shadow-md">
                        Hot
                      </span>
                    )}
                    {property.isOwner && (
                      <span className="bg-teal text-teal-foreground font-semibold text-xs px-2.5 py-1 rounded shadow-md flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Chính chủ cho thuê
                      </span>
                    )}
                  </div>

                  {/* Top Right Action Buttons */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                    <button
                      onClick={handleCopyLink}
                      className="h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center transition-colors shadow"
                      title="Sao chép link"
                    >
                      {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => {
                        setIsSaved(!isSaved);
                        toast[isSaved ? "info" : "success"](
                          isSaved ? "Đã xóa khỏi tin yêu thích" : "Đã lưu vào tin yêu thích"
                        );
                      }}
                      className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors shadow backdrop-blur-sm ${
                        isSaved ? "bg-rose-500 text-white" : "bg-black/50 hover:bg-black/70 text-white"
                      }`}
                      title={isSaved ? "Bỏ lưu" : "Lưu tin"}
                    >
                      <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Thumbnails */}
                {property.images.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
                    {property.images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-24 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                          idx === activeImageIndex
                            ? "border-primary shadow-sm scale-[0.98]"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Core Overview */}
              <div className="bg-card border border-border/70 rounded-2xl p-6 shadow-xs space-y-4">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground leading-snug">
                  {property.title}
                </h1>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>{property.location}</span>
                </div>

                {/* Highlight Stats Box */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/50">
                  <div className="bg-muted/40 rounded-xl p-3 border border-border/40">
                    <span className="text-xs text-muted-foreground block">Giá thuê</span>
                    <span className="text-xl font-black text-primary">{property.priceLabel}</span>
                    {property.pricePerM2 && (
                      <span className="text-[11px] text-muted-foreground block font-medium mt-0.5">
                        ~{property.pricePerM2}
                      </span>
                    )}
                  </div>

                  <div className="bg-muted/40 rounded-xl p-3 border border-border/40">
                    <span className="text-xs text-muted-foreground block">Diện tích</span>
                    <span className="text-xl font-black text-foreground">{property.area} m²</span>
                  </div>

                  <div className="bg-muted/40 rounded-xl p-3 border border-border/40">
                    <span className="text-xs text-muted-foreground block">Hướng nhà</span>
                    <span className="text-base font-bold text-foreground">
                      {property.directions || "Đang cập nhật"}
                    </span>
                  </div>

                  <div className="bg-muted/40 rounded-xl p-3 border border-border/40">
                    <span className="text-xs text-muted-foreground block">Mặt tiền</span>
                    <span className="text-base font-bold text-foreground">
                      {property.frontage || "Tiêu chuẩn"}
                    </span>
                  </div>
                </div>

                {/* Property Details Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {property.legal && (
                    <span className="inline-flex items-center gap-1.5 bg-teal/10 text-teal dark:bg-teal/20 text-xs px-3 py-1.5 rounded-lg font-medium">
                      <ShieldCheck className="h-4 w-4" /> Pháp lý: {property.legal}
                    </span>
                  )}
                  {property.bedrooms && (
                    <span className="inline-flex items-center gap-1.5 bg-muted text-foreground text-xs px-3 py-1.5 rounded-lg font-medium">
                      {property.bedrooms} Phòng ngủ
                    </span>
                  )}
                  {property.bathrooms && (
                    <span className="inline-flex items-center gap-1.5 bg-muted text-foreground text-xs px-3 py-1.5 rounded-lg font-medium">
                      {property.bathrooms} Phòng tắm
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground text-xs px-3 py-1.5 rounded-lg">
                    <CalendarDays className="h-4 w-4" /> Đăng: {property.createdAt}
                  </span>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="bg-card border border-border/70 rounded-2xl p-6 shadow-xs space-y-4">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="h-4 w-1 bg-primary rounded-full"></span>
                  Thông tin chi tiết căn hộ / nhà cho thuê
                </h2>
                <div className="text-sm sm:text-base text-foreground/80 leading-relaxed whitespace-pre-line space-y-3">
                  {property.description}
                </div>
              </div>

              {/* Similar Properties */}
              {similarProperties.length > 0 && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-foreground">Bất động sản cho thuê tương tự</h2>
                    <Link to="/nha-dat-cho-thue" className="text-xs font-semibold text-primary hover:underline">
                      Xem tất cả
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {similarProperties.map((sim) => (
                      <Link
                        key={sim.id}
                        to="/nha-dat-cho-thue/$slug"
                        params={{ slug: sim.slug }}
                        className="group bg-card border border-border/70 rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col"
                      >
                        <div className="aspect-[4/3] bg-muted overflow-hidden relative">
                          <img
                            src={sim.images[0]}
                            alt={sim.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[11px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                            {sim.priceLabel}
                          </div>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {sim.title}
                          </h4>
                          <div className="text-[11px] text-muted-foreground mt-2 flex items-center justify-between">
                            <span>{sim.area} m²</span>
                            <span className="truncate max-w-[100px]">{sim.district}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Column (1/3) */}
            <div className="space-y-6">
              
              {/* Sticky Contact Box */}
              <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm sticky top-24 space-y-5">
                <div className="flex items-center gap-3.5 pb-4 border-b border-border/60">
                  <img
                    src={property.brokerAvatar}
                    alt={property.brokerName}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/20 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-xs text-muted-foreground block">Người cho thuê</span>
                    <h3 className="font-bold text-base text-foreground truncate">{property.brokerName}</h3>
                    {property.isOwner ? (
                      <span className="text-[11px] text-teal font-semibold flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="h-3 w-3" /> Chủ nhà trực tiếp
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground mt-0.5 block">
                        Đại diện cho thuê
                      </span>
                    )}
                  </div>
                </div>

                {/* Primary CTA Buttons */}
                <div className="space-y-2.5">
                  <Button
                    onClick={handlePhoneClick}
                    className="w-full h-11 bg-teal hover:bg-teal/90 text-teal-foreground font-bold text-sm rounded-xl gap-2 shadow-xs"
                  >
                    <Phone className="h-4 w-4 fill-current" />
                    <span>{showPhone ? property.brokerPhone : `${property.brokerPhone.slice(0, 4)} *** *** (Bấm để xem)`}</span>
                  </Button>

                  <a
                    href={`https://zalo.me/${property.brokerPhone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      variant="outline"
                      className="w-full h-11 border-primary/30 text-primary hover:bg-primary/5 font-bold text-sm rounded-xl gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat qua Zalo hẹn xem nhà
                    </Button>
                  </a>

                  <Button
                    onClick={handleCopyLink}
                    variant="ghost"
                    className="w-full h-10 text-muted-foreground hover:text-foreground text-xs gap-2"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    Chia sẻ tin đăng này
                  </Button>
                </div>

                {/* Quick Consultation Form */}
                <div className="pt-4 border-t border-border/60">
                  <h4 className="font-bold text-xs text-foreground uppercase tracking-wider mb-3">
                    Hẹn lịch xem phòng / nhà
                  </h4>
                  <form onSubmit={handleContactSubmit} className="space-y-2.5">
                    <Input
                      placeholder="Họ và tên của bạn"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="h-10 text-xs bg-muted/30"
                    />
                    <Input
                      required
                      type="tel"
                      placeholder="Số điện thoại của bạn *"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="h-10 text-xs bg-muted/30"
                    />
                    <Input
                      placeholder="Thời gian bạn có thể xem (Ví dụ: sau 18h)"
                      value={contactForm.note}
                      onChange={(e) => setContactForm({ ...contactForm, note: e.target.value })}
                      className="h-10 text-xs bg-muted/30"
                    />
                    <Button
                      type="submit"
                      className="w-full h-10 font-semibold text-xs rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground shadow-xs mt-1"
                    >
                      Đặt lịch xem ngay
                    </Button>
                  </form>
                </div>

                {/* Safety Tips */}
                <div className="bg-muted/40 rounded-xl p-3.5 border border-border/40 text-[11px] text-muted-foreground space-y-1">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-teal" />
                    Lưu ý khi thuê nhà
                  </div>
                  <p>
                    Kiểm tra kỹ hợp đồng thuê nhà, các điều khoản tiền cọc, điện nước, phụ phí và bàn giao hiện trạng trước khi ký.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
