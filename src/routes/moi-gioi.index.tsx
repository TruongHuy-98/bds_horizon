import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  BadgeCheck,
  Star,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Users,
  TrendingUp,
  Award,
  ArrowRight,
  SlidersHorizontal,
  X,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { ListPagination } from "@/components/listings/ListPagination";
import { supabase } from "@/integrations/supabase/client";
import { LOCAL_USERS_DB } from "@/data/mockUsersData";

// Assets
import broker1 from "@/assets/broker-1.jpg";
import broker2 from "@/assets/broker-2.jpg";
import broker3 from "@/assets/broker-3.jpg";
import broker4 from "@/assets/broker-4.jpg";

export const Route = createFileRoute("/moi-gioi/")(({
  component: BrokersPage,
  head: () => ({
    meta: [
      { title: "Danh bạ Môi giới Bất động sản Đà Nẵng — Da Nang Real Estate" },
      {
        name: "description",
        content:
          "Kết nối với hơn 500+ chuyên gia môi giới bất động sản Đà Nẵng đã được thẩm định & xác minh danh tính — chuyên sâu khu vực ven biển, trung tâm và đô thị.",
      },
      { property: "og:title", content: "Danh bạ Môi giới Đà Nẵng" },
      {
        property: "og:description",
        content: "Tìm chuyên gia môi giới bất động sản uy tín tại Đà Nẵng theo khu vực và chuyên môn.",
      },
    ],
  }),
}));

type BrokerDisplay = {
  id: string;
  img: string;
  name: string;
  years: number;
  specialties: string[];
  district: string;
  rating: number;
  reviews: number;
  verified: boolean;
  phone: string;
  email: string;
  plan?: string;
};

const brokerImages = [broker1, broker2, broker3, broker4];

function makeSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, "-");
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function BrokersHero({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (v: string) => void;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-teal text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal/25 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary/40 blur-3xl pointer-events-none" />

      <div className="container-page relative py-14 md:py-18 text-center">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold mb-5">
          <ShieldCheck className="h-4 w-4 text-teal-300" />
          Hồ sơ đã thẩm định & xác thực danh tính
        </span>

        <h1 className="text-3xl md:text-5xl font-bold max-w-3xl mx-auto leading-tight">
          Danh bạ Chuyên gia Môi giới{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-blue-200">
            Đà Nẵng
          </span>
        </h1>

        <p className="mt-3.5 text-white/80 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Đội ngũ chuyên gia môi giới am hiểu thị trường bản địa, sở hữu chứng chỉ hành nghề và được đánh giá thực tế từ khách hàng.
        </p>

        {/* Quick Search Input */}
        <div className="mt-8 max-w-lg mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên môi giới, khu vực hoạt động..."
            className="pl-11 pr-10 h-12 bg-white text-slate-800 border-0 rounded-2xl shadow-lg placeholder:text-muted-foreground/60 text-sm focus-visible:ring-2 focus-visible:ring-teal-400"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-slate-800 p-1"
              title="Xóa tìm kiếm"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Trust Badges */}
        <div className="mt-7 flex flex-wrap justify-center items-center gap-6 text-xs md:text-sm text-white/85">
          <div className="flex items-center gap-1.5">
            <BadgeCheck className="h-4 w-4 text-teal-300" />
            <span>500+ Môi giới chính quy</span>
          </div>
          <span className="inline-block w-1 h-1 rounded-full bg-white/40" />
          <div className="flex items-center gap-1.5">
            <Award className="h-4 w-4 text-orange-300" />
            <span>Xác minh chứng chỉ hành nghề</span>
          </div>
          <span className="inline-block w-1 h-1 rounded-full bg-white/40" />
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-amber-300 fill-amber-300" />
            <span>Đánh giá minh bạch từ khách mua</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Filter Bar ──────────────────────────────────────────────────────────────
interface FilterBarProps {
  specialty: string;
  setSpecialty: (v: string) => void;
  district: string;
  setDistrict: (v: string) => void;
  ratingMin: string;
  setRatingMin: (v: string) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (v: boolean) => void;
  resultCount: number;
}

function FilterBar({
  specialty,
  setSpecialty,
  district,
  setDistrict,
  ratingMin,
  setRatingMin,
  verifiedOnly,
  setVerifiedOnly,
  resultCount,
}: FilterBarProps) {
  const hasFilter = specialty !== "all" || district !== "all" || ratingMin !== "all" || verifiedOnly;

  return (
    <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container-page">
        <div className="flex flex-wrap items-center gap-2.5 py-3">
          {/* Verified Toggle */}
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`h-9 px-3.5 rounded-full text-xs md:text-sm font-medium border transition-all flex items-center gap-1.5 ${
              verifiedOnly
                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                : "bg-card text-foreground/80 border-border hover:border-primary/40"
            }`}
          >
            <BadgeCheck className="h-3.5 w-3.5 text-teal" />
            Đã xác minh
          </button>

          {/* Specialty */}
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger className="h-9 rounded-full border-border text-xs md:text-sm w-auto px-3.5 bg-card gap-1">
              <SelectValue placeholder="Chuyên môn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả chuyên môn</SelectItem>
              <SelectItem value="apt">Căn hộ cao cấp</SelectItem>
              <SelectItem value="villa">Biệt thự biển</SelectItem>
              <SelectItem value="land">Đất nền</SelectItem>
              <SelectItem value="invest">Đầu tư</SelectItem>
            </SelectContent>
          </Select>

          {/* District */}
          <Select value={district} onValueChange={setDistrict}>
            <SelectTrigger className="h-9 rounded-full border-border text-xs md:text-sm w-auto px-3.5 bg-card gap-1">
              <SelectValue placeholder="Khu vực" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả khu vực</SelectItem>
              <SelectItem value="Hải Châu">Hải Châu</SelectItem>
              <SelectItem value="Sơn Trà">Sơn Trà</SelectItem>
              <SelectItem value="Ngũ Hành Sơn">Ngũ Hành Sơn</SelectItem>
              <SelectItem value="Cẩm Lệ">Cẩm Lệ</SelectItem>
              <SelectItem value="Hòa Vang">Hòa Vang</SelectItem>
              <SelectItem value="Liên Chiểu">Liên Chiểu</SelectItem>
              <SelectItem value="Thanh Khê">Thanh Khê</SelectItem>
            </SelectContent>
          </Select>

          {/* Rating */}
          <Select value={ratingMin} onValueChange={setRatingMin}>
            <SelectTrigger className="h-9 rounded-full border-border text-xs md:text-sm w-auto px-3.5 bg-card gap-1">
              <SelectValue placeholder="Đánh giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả đánh giá</SelectItem>
              <SelectItem value="5">5.0 sao</SelectItem>
              <SelectItem value="4.5">Từ 4.5 sao</SelectItem>
              <SelectItem value="4">Từ 4.0 sao</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear & Count */}
          <div className="ml-auto flex items-center gap-3">
            {hasFilter && (
              <button
                onClick={() => {
                  setSpecialty("all");
                  setDistrict("all");
                  setRatingMin("all");
                  setVerifiedOnly(false);
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <X className="h-3 w-3" /> Xóa bộ lọc
              </button>
            )}
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Tìm thấy <strong className="text-foreground">{resultCount}</strong> môi giới
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modern Broker Card (Clean, Balanced & High-converting) ──────────────────
function BrokerCard({ b }: { b: BrokerDisplay }) {
  const isVip = b.plan === "vip";

  return (
    <article className="group bg-card rounded-2xl border border-border/70 hover:border-primary/40 shadow-xs hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      {/* Top Banner Accent */}
      <div className={`h-1.5 w-full ${isVip ? "bg-gradient-to-r from-orange via-amber-400 to-teal" : "bg-gradient-to-r from-primary to-teal"}`} />

      <div className="p-5 flex-1 flex flex-col">
        {/* Header: Avatar + Main Info */}
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-18 h-18 rounded-2xl overflow-hidden ring-2 ring-border group-hover:ring-primary/40 transition-all bg-muted shadow-xs">
              <img
                src={b.img}
                alt={b.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            {b.verified && (
              <span
                className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-0.5 rounded-full ring-2 ring-card shadow-xs"
                title="Đã xác minh chứng chỉ và CCCD"
              >
                <BadgeCheck className="h-4 w-4 text-teal-300" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                to="/moi-gioi/$slug"
                params={{ slug: makeSlug(b.name) }}
                className="font-bold text-base text-foreground hover:text-primary transition-colors truncate block"
              >
                {b.name}
              </Link>
              {isVip && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-orange/15 text-orange border border-orange/20">
                  VIP
                </span>
              )}
            </div>

            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
              <span className="truncate">{b.district}</span>
            </div>

            {/* Rating */}
            <div className="mt-1.5 flex items-center gap-1.5">
              <div className="flex items-center text-amber-500">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="ml-1 text-xs font-bold text-foreground">{b.rating.toFixed(1)}</span>
              </div>
              <span className="text-[11px] text-muted-foreground">({b.reviews} phản hồi)</span>
            </div>
          </div>
        </div>

        {/* Experience & Status metrics */}
        <div className="mt-4 grid grid-cols-2 gap-2 bg-surface-container/50 rounded-xl p-2.5 text-center text-xs">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase font-medium">Kinh nghiệm</div>
            <div className="font-bold text-foreground mt-0.5">{b.years} năm</div>
          </div>
          <div className="border-l border-border/60">
            <div className="text-[10px] text-muted-foreground uppercase font-medium">Trạng thái</div>
            <div className="font-bold text-teal mt-0.5 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
              Sẵn sàng tư vấn
            </div>
          </div>
        </div>

        {/* Specialties tags */}
        <div className="mt-3.5 flex flex-wrap gap-1.5 flex-1 items-start">
          {b.specialties.slice(0, 3).map((s) => (
            <span
              key={s}
              className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-teal/10 text-teal border border-teal/15"
            >
              {s}
            </span>
          ))}
          {b.specialties.length > 3 && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-muted text-muted-foreground">
              +{b.specialties.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 pt-0 flex items-center gap-2">
        <Button
          asChild
          variant="outline"
          className="flex-1 h-9 rounded-xl border-border text-xs font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
        >
          <Link to="/moi-gioi/$slug" params={{ slug: makeSlug(b.name) }}>
            Xem hồ sơ
          </Link>
        </Button>
        <a
          href={`tel:${b.phone.replace(/\s/g, "")}`}
          className="h-9 px-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          title={`Gọi ${b.phone}`}
        >
          <Phone className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Gọi ngay</span>
        </a>
      </div>
    </article>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="py-12 md:py-16">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary/95 to-teal p-8 md:p-12 text-white shadow-xl">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-teal/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-16 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

          <div className="relative md:flex items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3.5 border border-white/20">
                <Users className="h-3.5 w-3.5 text-teal-200" />
                Gia nhập mạng lưới môi giới
              </span>
              <h3 className="text-2xl md:text-3xl font-bold leading-snug">
                Bạn là Môi giới Bất động sản tại Đà Nẵng?
              </h3>
              <p className="mt-2.5 text-white/80 text-sm leading-relaxed">
                Đăng ký hồ sơ để tiếp cận hơn 200.000 lượt tìm kiếm khách hàng mỗi tháng, nhận thẩm định chứng chỉ và gia tăng uy tín bán hàng.
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex flex-wrap gap-3 flex-shrink-0">
              <Button className="h-11 px-6 bg-orange text-orange-foreground hover:bg-orange/90 rounded-xl font-semibold text-sm shadow-md">
                Tạo hồ sơ môi giới
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <button
                type="button"
                className="h-11 px-6 rounded-xl border border-white/40 text-white/90 hover:bg-white/15 hover:text-white font-medium text-sm transition-colors"
              >
                Chính sách đối tác
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function BrokersPage() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [district, setDistrict] = useState("all");
  const [ratingMin, setRatingMin] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [brokers, setBrokers] = useState<BrokerDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    const fetchBrokers = async () => {
      setLoading(true);
      // 1. Load local seed first
      const rawUsers = LOCAL_USERS_DB.getUsers();
      const brokerUsers = rawUsers.filter(
        (u) => u.role === "broker" && u.status !== "locked"
      );

      const formatted: BrokerDisplay[] = brokerUsers.map((u, idx) => ({
        id: u.id,
        img: u.avatar || brokerImages[idx % brokerImages.length],
        name: u.name,
        years: u.yearsExperience || u.yearsExp || 5,
        specialties: u.specialties || ["Căn hộ", "Đất nền dự án"],
        district: u.district || "Hải Châu",
        rating: u.rating || 5.0,
        reviews: u.reviewsCount || u.reviews || 85,
        verified: !!u.isVerified,
        phone: u.phone,
        email: u.email,
        plan: u.activePlan,
      }));
      setBrokers(formatted);

      // 2. Try DB Supabase
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "broker");

        if (!error && data && data.length > 0) {
          const dbBrokers: BrokerDisplay[] = data.map((p: any, idx: number) => ({
            id: p.id,
            img: p.avatar || brokerImages[idx % brokerImages.length],
            name: p.name,
            years: p.years_exp || 5,
            specialties:
              Array.isArray(p.specialties) && p.specialties.length > 0
                ? p.specialties
                : ["Môi giới BĐS", "Tư vấn đầu tư"],
            district: p.district || "Đà Nẵng",
            rating: 5.0,
            reviews: 120,
            verified: p.verification_status === "verified",
            phone: p.phone || "0905 123 456",
            email: p.email || "",
            plan: p.active_plan,
          }));
          setBrokers(dbBrokers);
        }
      } catch (err) {
        console.warn("[moi-gioi.index] DB query failed, using local seed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrokers();
  }, []);

  // Filter logic
  const filtered = useMemo(() => {
    return brokers.filter((b) => {
      if (
        search &&
        !b.name.toLowerCase().includes(search.toLowerCase()) &&
        !b.district.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      if (verifiedOnly && !b.verified) return false;
      if (district !== "all" && !b.district.includes(district)) return false;
      if (ratingMin !== "all" && b.rating < parseFloat(ratingMin)) return false;
      if (specialty !== "all") {
        const specMap: Record<string, string> = {
          apt: "Căn hộ",
          villa: "Biệt thự",
          land: "Đất nền",
          invest: "Đầu tư",
        };
        const kw = specMap[specialty];
        if (kw && !b.specialties.some((s) => s.toLowerCase().includes(kw.toLowerCase()))) {
          return false;
        }
      }
      return true;
    });
  }, [brokers, search, verifiedOnly, district, ratingMin, specialty]);

  // Sort VIP & Verified first
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (a.plan === "vip" && b.plan !== "vip") return -1;
      if (b.plan === "vip" && a.plan !== "vip") return 1;
      if (a.verified !== b.verified) return a.verified ? -1 : 1;
      return b.rating - a.rating;
    });
  }, [filtered]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, specialty, district, ratingMin, verifiedOnly]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <BrokersHero search={search} setSearch={setSearch} />
        <FilterBar
          specialty={specialty}
          setSpecialty={setSpecialty}
          district={district}
          setDistrict={setDistrict}
          ratingMin={ratingMin}
          setRatingMin={setRatingMin}
          verifiedOnly={verifiedOnly}
          setVerifiedOnly={setVerifiedOnly}
          resultCount={sorted.length}
        />

        {loading ? (
          <div className="container-page py-20 text-center text-muted-foreground">
            <div className="animate-spin size-8 border-t-2 border-b-2 border-primary rounded-full mx-auto mb-3" />
            <p className="text-sm">Đang tải danh sách chuyên gia môi giới...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="container-page py-20 text-center text-muted-foreground">
            <Users className="size-10 mx-auto mb-3 text-muted-foreground/40" />
            <h3 className="text-base font-semibold text-foreground">Không tìm thấy môi giới phù hợp</h3>
            <p className="text-xs mt-1">Vui lòng thử lại với từ khóa hoặc khu vực khác.</p>
          </div>
        ) : (
          <section className="py-10">
            <div className="container-page">
              {/* Header result count */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">Danh sách Môi giới Bất động sản</h2>
                  <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                    Tất cả môi giới đều được xác thực số điện thoại và địa bàn phụ trách
                  </p>
                </div>
              </div>

              {/* Grid 4 columns desktop, 2 columns tablet, 1 column mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {paginated.map((b) => (
                  <BrokerCard key={b.id} b={b} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10">
                  <ListPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 380, behavior: "smooth" });
                    }}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
