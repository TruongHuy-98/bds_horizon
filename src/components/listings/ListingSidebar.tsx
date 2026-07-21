import { Link } from "@tanstack/react-router";
import { MapPin, PlusCircle, TrendingUp, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sampleListings, ListingItem } from "@/data/listingsData";

interface ListingSidebarProps {
  onSelectDistrict?: (district: string) => void;
  onSelectProperty?: (item: ListingItem) => void;
}

export function ListingSidebar({ onSelectDistrict, onSelectProperty }: ListingSidebarProps) {
  const districts = [
    { name: "Hải Châu", count: 120 },
    { name: "Sơn Trà", count: 95 },
    { name: "Ngũ Hành Sơn", count: 110 },
    { name: "Cẩm Lệ", count: 85 },
    { name: "Thanh Khê", count: 70 },
    { name: "Liên Chiểu", count: 65 },
    { name: "Hòa Vang", count: 40 },
  ];

  const featuredListings = sampleListings.filter((i) => i.isVip || i.isHot).slice(0, 4);

  return (
    <aside className="space-y-6">
      {/* CTA Box for Brokers */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-teal/10 rounded-xl p-5 border border-primary/20 text-center shadow-xs">
        <h4 className="font-bold text-foreground text-base mb-1.5 flex items-center justify-center gap-1.5">
          <PlusCircle className="h-5 w-5 text-primary" /> Bạn là Môi giới?
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          Đăng tin miễn phí tiếp cận hàng nghìn khách hàng tiềm năng tại Đà Nẵng ngay hôm nay.
        </p>
        <Button asChild className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold h-10 rounded-md">
          <Link to="/admin">Đăng tin bán đất ngay</Link>
        </Button>
      </div>

      {/* District Links */}
      <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs">
        <h4 className="font-bold text-sm text-foreground uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-border/60 pb-3">
          <MapPin className="h-4 w-4 text-primary" /> Khám phá theo Khu vực
        </h4>
        <ul className="space-y-2 text-sm">
          {districts.map((d) => (
            <li key={d.name}>
              <button
                onClick={() => onSelectDistrict && onSelectDistrict(d.name)}
                className="w-full flex items-center justify-between py-1.5 px-2 rounded-md text-foreground/80 hover:text-primary hover:bg-surface-container/60 transition-colors text-left"
              >
                <span>Bán đất {d.name}</span>
                <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {d.count}+
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Featured / Popular Listings */}
      <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs">
        <h4 className="font-bold text-sm text-foreground uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-border/60 pb-3">
          <Flame className="h-4 w-4 text-rose-500" /> Tin nổi bật xem nhiều
        </h4>
        <div className="space-y-3.5">
          {featuredListings.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectProperty && onSelectProperty(item)}
              className="flex gap-3 items-center group cursor-pointer"
            >
              <img
                src={item.images[0]}
                alt={item.title}
                className="h-14 w-16 rounded-lg object-cover shrink-0 border border-border/40 group-hover:opacity-90 transition-opacity"
              />
              <div className="min-w-0">
                <h5 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h5>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xs font-bold text-primary">{item.priceLabel}</span>
                  <span className="text-[11px] text-muted-foreground">{item.area} m²</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
