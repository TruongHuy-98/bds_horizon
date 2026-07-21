import { useState } from "react";
import { Heart, MapPin, Phone, CalendarDays, Compass, MoveHorizontal, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingItem } from "@/data/listingsData";
import { toast } from "sonner";

interface PropertyListingCardProps {
  item: ListingItem;
  onSelect?: (item: ListingItem) => void;
}

export function PropertyListingCard({ item, onSelect }: PropertyListingCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showPhone) {
      setShowPhone(true);
      toast.success(`Đã hiện số điện thoại người đăng: ${item.brokerPhone}`);
    } else {
      navigator.clipboard.writeText(item.brokerPhone);
      toast.info(`Đã sao chép số điện thoại: ${item.brokerPhone}`);
    }
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    if (!isSaved) {
      toast.success("Đã lưu tin đăng vào danh sách yêu thích.");
    } else {
      toast.info("Đã xóa tin khỏi danh sách yêu thích.");
    }
  };

  return (
    <article
      onClick={() => onSelect && onSelect(item)}
      className="group bg-card rounded-xl border border-border/70 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row cursor-pointer"
    >
      {/* Thumbnail Image Container */}
      <div className="relative sm:w-64 md:w-72 shrink-0 aspect-[4/3] sm:aspect-auto overflow-hidden bg-muted">
        <img
          src={item.images[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60"}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          {item.isVip && (
            <span className="bg-amber-500 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              VIP
            </span>
          )}
          {item.isHot && (
            <span className="bg-rose-500 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              Hot
            </span>
          )}
          {item.isOwner && (
            <span className="bg-teal text-teal-foreground font-semibold text-[10px] px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Chính chủ
            </span>
          )}
        </div>

        {/* Save button floating over image */}
        <button
          onClick={handleToggleSave}
          className={`absolute top-2.5 right-2.5 h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
            isSaved
              ? "bg-rose-500 text-white"
              : "bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
          }`}
          title={isSaved ? "Bỏ lưu" : "Lưu tin"}
        >
          <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="font-bold text-base md:text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            {item.title}
          </h3>

          {/* Key Metrics: Price & Area */}
          <div className="mt-2.5 flex flex-wrap items-baseline gap-3">
            <span className="text-xl font-extrabold text-primary">{item.priceLabel}</span>
            {item.pricePerM2 && (
              <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {item.pricePerM2}
              </span>
            )}
            <span className="text-sm font-semibold text-foreground">
              • {item.area} m²
            </span>
          </div>

          {/* Location */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          {/* Directions & Frontage Tags */}
          {(item.directions || item.frontage || item.legal) && (
            <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {item.directions && (
                <span className="flex items-center gap-1 bg-surface-container/60 px-2 py-0.5 rounded">
                  <Compass className="h-3 w-3 text-muted-foreground" /> Hướng: {item.directions}
                </span>
              )}
              {item.frontage && (
                <span className="flex items-center gap-1 bg-surface-container/60 px-2 py-0.5 rounded">
                  <MoveHorizontal className="h-3 w-3 text-muted-foreground" /> Mặt tiền: {item.frontage}
                </span>
              )}
              {item.legal && (
                <span className="flex items-center gap-1 bg-teal/10 text-teal dark:bg-teal/20 px-2 py-0.5 rounded font-medium">
                  <ShieldCheck className="h-3 w-3" /> {item.legal}
                </span>
              )}
            </div>
          )}

          {/* Description summary */}
          <p className="mt-2.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Footer: Broker Info & Action Button */}
        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={item.brokerAvatar}
              alt={item.brokerName}
              className="h-8 w-8 rounded-full object-cover ring-1 ring-border shrink-0"
            />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-foreground truncate">{item.brokerName}</div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                <CalendarDays className="h-3 w-3" /> {item.createdAt}
              </div>
            </div>
          </div>

          <Button
            onClick={handlePhoneClick}
            size="sm"
            className="bg-teal hover:bg-teal/90 text-teal-foreground font-semibold h-9 px-3 text-xs rounded-md shrink-0 flex items-center gap-1.5 shadow-xs"
          >
            <Phone className="h-3.5 w-3.5 fill-current" />
            <span>{showPhone ? item.brokerPhone : `${item.brokerPhone.slice(0, 4)} *** ***`}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
