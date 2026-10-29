import React, { useState, useEffect } from "react";
import {
  Save,
  Send,
  Building2,
  DollarSign,
  Maximize2,
  MapPin,
  ArrowLeft,
  Sparkles,
  Bed,
  Bath,
  Compass,
  ShieldCheck,
  Tag as TagIcon,
  Image as ImageIcon,
  Home,
  Check,
  FolderOpen,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import RichTextEditor from "./RichTextEditor";
import SeoPreviewBlock from "./SeoPreviewBlock";
import ImageUploader from "./ImageUploader";
import PublishStatusCard from "./PublishStatusCard";
import TagManagerCard from "./TagManagerCard";
import { PropertyRow } from "@/routes/admin";
import { slugify } from "@/lib/utils";

export interface PropertyFormData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  price_label: string;
  price?: number | null;
  area: string;
  listing_type: "Bán" | "Cho thuê";
  property_type: string;
  district: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
  direction: string;
  legal_status: string;
  image_url: string;
  images: string[];
  publishStatus: "public" | "draft" | "scheduled";
  scheduledAt: string;
  tags: string[];
  focusKeyword: string;
  seoTitle: string;
  seoDescription: string;
  created_by?: string | null;
}

interface PropertyEditorModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: PropertyFormData) => Promise<void>;
  editingItem: PropertyRow | null;
  isMock: boolean;
}

const DISTRICT_OPTIONS = [
  "Hải Châu",
  "Sơn Trà",
  "Ngũ Hành Sơn",
  "Cẩm Lệ",
  "Liên Chiểu",
  "Thanh Khê",
  "Hòa Vang",
  "Hoàng Sa",
];

const PROPERTY_TYPE_OPTIONS = [
  "Căn hộ",
  "Biệt thự",
  "Nhà phố",
  "Đất nền",
  "Đất thổ cư",
  "Shophouse",
  "Mặt bằng kinh doanh",
  "Khách sạn / Homestay",
  "Kho xưởng",
];

const DIRECTION_OPTIONS = [
  "Đông",
  "Tây",
  "Nam",
  "Bắc",
  "Đông Nam",
  "Đông Bắc",
  "Tây Nam",
  "Tây Bắc",
];

const LEGAL_STATUS_OPTIONS = [
  "Sổ hồng / Sổ đỏ riêng",
  "Hợp đồng mua bán (HĐMB)",
  "Đang chờ cấp sổ",
  "Giấy phép xây dựng",
  "Giấy tờ pháp lý hợp lệ khác",
];

export default function PropertyEditorModal({
  open,
  onClose,
  onSave,
  editingItem,
  isMock,
}: PropertyEditorModalProps) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<PropertyFormData>({
    title: "",
    slug: "",
    excerpt: "",
    description: "",
    price_label: "",
    price: null,
    area: "",
    listing_type: "Bán",
    property_type: "Căn hộ",
    district: "Sơn Trà",
    address: "",
    bedrooms: "",
    bathrooms: "",
    direction: "Đông Nam",
    legal_status: "Sổ hồng / Sổ đỏ riêng",
    image_url: "",
    images: [],
    publishStatus: "public",
    scheduledAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    tags: ["Đà Nẵng", "View đẹp", "Sổ đỏ"],
    focusKeyword: "",
    seoTitle: "",
    seoDescription: "",
  });

  useEffect(() => {
    if (editingItem) {
      const isPub = editingItem.published ?? true;
      const anyItem = editingItem as any;

      // Extract extended fields if present
      let extTags: string[] = ["Đà Nẵng", "Bất động sản"];
      if (Array.isArray(editingItem.tags) && editingItem.tags.length > 0) {
        extTags = editingItem.tags as string[];
      } else if (Array.isArray(anyItem.tags)) {
        extTags = anyItem.tags;
      }

      setForm({
        id: editingItem.id,
        title: editingItem.title || "",
        slug: editingItem.slug || "",
        excerpt: anyItem.excerpt || (editingItem.description ? editingItem.description.replace(/<[^>]*>/g, " ").substring(0, 160).trim() : ""),
        description: editingItem.description || "",
        price_label: editingItem.price_label || "",
        price: editingItem.price ?? null,
        area: editingItem.area ? String(editingItem.area) : "",
        listing_type: (editingItem.listing_type as any) === "Cho thuê" ? "Cho thuê" : "Bán",
        property_type: editingItem.property_type || "Căn hộ",
        district: editingItem.district || "Sơn Trà",
        address: editingItem.address || "",
        bedrooms: editingItem.bedrooms ? String(editingItem.bedrooms) : "",
        bathrooms: editingItem.bathrooms ? String(editingItem.bathrooms) : "",
        direction: anyItem.direction || "Đông Nam",
        legal_status: anyItem.legal_status || "Sổ hồng / Sổ đỏ riêng",
        image_url: editingItem.image_url || "",
        images: Array.isArray(editingItem.images)
          ? (editingItem.images as string[])
          : editingItem.image_url
          ? [editingItem.image_url]
          : [],
        publishStatus: isPub ? "public" : "draft",
        scheduledAt: anyItem.scheduled_at
          ? new Date(anyItem.scheduled_at).toISOString().slice(0, 16)
          : new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        tags: extTags,
        focusKeyword: anyItem.focus_keyword || "",
        seoTitle: anyItem.seo_title || editingItem.title || "",
        seoDescription: anyItem.seo_description || anyItem.excerpt || "",
        created_by: editingItem.created_by,
      });
    } else {
      setForm({
        title: "",
        slug: "",
        excerpt: "",
        description: "",
        price_label: "",
        price: null,
        area: "",
        listing_type: "Bán",
        property_type: "Căn hộ",
        district: "Sơn Trà",
        address: "",
        bedrooms: "2",
        bathrooms: "2",
        direction: "Đông Nam",
        legal_status: "Sổ hồng / Sổ đỏ riêng",
        image_url: "",
        images: [],
        publishStatus: "public",
        scheduledAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        tags: ["Đà Nẵng", "View đẹp", "Sổ đỏ"],
        focusKeyword: "",
        seoTitle: "",
        seoDescription: "",
      });
    }
  }, [editingItem, open]);

  // Handle Title change & Auto Slug
  const handleTitleChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug || slugify(val),
      seoTitle: prev.seoTitle || val,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[92vh] flex flex-col p-0 gap-0 bg-slate-50 border-slate-200 overflow-hidden rounded-2xl shadow-2xl">
        {/* MODAL HEADER */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="size-8 text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Building2 className="size-5 text-blue-600" />
                {editingItem
                  ? "Chỉnh sửa tin đăng BĐS (WordPress & Real Estate Style)"
                  : "Soạn thảo tin đăng BĐS mới (WordPress & Real Estate Style)"}
              </h2>
              <p className="text-xs text-slate-500">
                Đăng tải tin mua bán / cho thuê BĐS với đầy đủ thông số kỹ thuật, hình ảnh và tối ưu chuẩn SEO Google
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-xs font-semibold border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving || !form.title.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-blue-500/10 px-5 cursor-pointer"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin size-3.5 border-2 border-t-transparent border-white rounded-full"></span>
                  Đang lưu...
                </span>
              ) : editingItem ? (
                <span className="flex items-center gap-1.5">
                  <Save className="size-4" /> Cập nhật tin đăng
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Send className="size-4" /> Phát hành ngay
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* MODAL BODY: SCROLLABLE WORKSPACE */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT MAIN AREA (8 COLS) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* 1. TITLE, SLUG & EXCERPT */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Tiêu đề tin đăng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    required
                    placeholder="VD: Căn hộ Luxury Horizon View Sông Hàn 2PN full nội thất cao cấp..."
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="text-base font-bold border-slate-200 focus-visible:ring-blue-500/30 py-3 h-auto"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                    <span>Đường dẫn xem BĐS (Slug URL):</span>
                    <span className="text-[11px] text-blue-600 font-mono">
                      /{form.listing_type === "Cho thuê" ? "nha-dat-cho-thue" : "nha-dat-ban"}/{form.slug || "slug-tin-dang"}
                    </span>
                  </Label>
                  <Input
                    placeholder="slug-tin-dang"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                    className="text-xs font-mono text-slate-600 bg-slate-50/50 border-slate-200"
                  />
                </div>

                {/* EXCERPT */}
                <div className="space-y-1.5 pt-1">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Mô tả ngắn (Excerpt)
                  </Label>
                  <Textarea
                    placeholder="Viết 2-3 câu ngắn tóm tắt điểm nổi bật nhất của căn nhà/đất (vị trí đắc địa, tầm view, mức giá tốt...)"
                    rows={2}
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    className="text-sm border-slate-200 resize-none focus-visible:ring-blue-500/30"
                  />
                </div>
              </div>

              {/* 2. REAL ESTATE SPECIFICS CARD */}
              <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-5 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                      <Home className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
                        Thông số Bất động sản chi tiết
                      </h3>
                      <p className="text-[11px] text-slate-500">Các thông số kỹ thuật định danh tài sản hiển thị trên website</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200 font-semibold text-[11px]">
                    BĐS Chuẩn mực
                  </Badge>
                </div>

                {/* HÀNG 1: GIÁ HIỂN THỊ & DIỆN TÍCH */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                      <DollarSign className="size-3.5 text-orange-500" /> Giá hiển thị <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      required
                      placeholder="VD: 4.5 tỷ, Thỏa thuận, 15 triệu/tháng..."
                      value={form.price_label}
                      onChange={(e) => setForm({ ...form, price_label: e.target.value })}
                      className="border-slate-200 focus-visible:ring-blue-500/30 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                      <Maximize2 className="size-3.5 text-indigo-500" /> Diện tích (m²) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      required
                      type="number"
                      placeholder="VD: 85..."
                      value={form.area}
                      onChange={(e) => setForm({ ...form, area: e.target.value })}
                      className="border-slate-200 focus-visible:ring-blue-500/30 font-semibold"
                    />
                  </div>
                </div>

                {/* HÀNG 2: LOẠI GIAO DỊCH & LOẠI BẤT ĐỘNG SẢN */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Loại giao dịch <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, listing_type: "Bán" })}
                        className={`h-9 rounded-lg font-bold text-xs border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          form.listing_type === "Bán"
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {form.listing_type === "Bán" && <Check className="size-3.5" />} Bán nhà/đất
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, listing_type: "Cho thuê" })}
                        className={`h-9 rounded-lg font-bold text-xs border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          form.listing_type === "Cho thuê"
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {form.listing_type === "Cho thuê" && <Check className="size-3.5" />} Cho thuê
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Loại bất động sản <span className="text-red-500">*</span>
                    </Label>
                    <select
                      value={form.property_type}
                      onChange={(e) => setForm({ ...form, property_type: e.target.value })}
                      className="w-full h-9 px-3 text-xs font-medium bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                    >
                      {PROPERTY_TYPE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* HÀNG 3: QUẬN/HUYỆN & ĐỊA CHÍ CHÍNH XÁC / TÊN DỰ ÁN */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                      <MapPin className="size-3.5 text-rose-500" /> Quận / Huyện <span className="text-red-500">*</span>
                    </Label>
                    <select
                      value={form.district}
                      onChange={(e) => setForm({ ...form, district: e.target.value })}
                      className="w-full h-9 px-3 text-xs font-medium bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                    >
                      {DISTRICT_OPTIONS.map((d) => (
                        <option key={d} value={d}>
                          Quận {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Địa chỉ chính xác / Tên dự án <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      required
                      placeholder="Số nhà, Tên đường, Phường hoặc Tên dự án..."
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="border-slate-200 focus-visible:ring-blue-500/30"
                    />
                  </div>
                </div>

                {/* HÀNG 4: TÙY CHỌN NÂNG CAO (PHÒNG NGỦ, TOILET, HƯỚNG, PHÁP LÝ) */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                    Thông số mở rộng (Tùy chọn nâng cao)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                        <Bed className="size-3 text-slate-400" /> Số PN
                      </Label>
                      <Input
                        type="number"
                        placeholder="VD: 2"
                        value={form.bedrooms}
                        onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                        className="h-8 text-xs border-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                        <Bath className="size-3 text-slate-400" /> Số WC
                      </Label>
                      <Input
                        type="number"
                        placeholder="VD: 2"
                        value={form.bathrooms}
                        onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                        className="h-8 text-xs border-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                        <Compass className="size-3 text-slate-400" /> Hướng nhà
                      </Label>
                      <select
                        value={form.direction}
                        onChange={(e) => setForm({ ...form, direction: e.target.value })}
                        className="w-full h-8 px-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        {DIRECTION_OPTIONS.map((dir) => (
                          <option key={dir} value={dir}>
                            {dir}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                        <ShieldCheck className="size-3 text-slate-400" /> Pháp lý
                      </Label>
                      <select
                        value={form.legal_status}
                        onChange={(e) => setForm({ ...form, legal_status: e.target.value })}
                        className="w-full h-8 px-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer truncate"
                      >
                        {LEGAL_STATUS_OPTIONS.map((leg) => (
                          <option key={leg} value={leg}>
                            {leg}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              {/* 3. RICH TEXT EDITOR (WYSIWYG) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="size-4 text-blue-600" />
                  NỘI DUNG CHI TIẾT BẤT ĐỘNG SẢN (Rich Text Editor)
                </Label>
                
                <RichTextEditor
                  value={form.description}
                  onChange={(val) => setForm((prev) => ({ ...prev, description: val }))}
                  placeholder="Mô tả kỹ thiết kế, view ngắm cảnh, tiện ích nội ngoại khu, nội thất bàn giao, chính sách thanh toán..."
                />
              </div>

              {/* 4. SEO CONFIGURATION & PREVIEW BLOCK */}
              <SeoPreviewBlock
                articleTitle={form.title}
                articleSlug={form.slug}
                articleContent={form.description}
                focusKeyword={form.focusKeyword}
                setFocusKeyword={(v) => setForm({ ...form, focusKeyword: v })}
                seoTitle={form.seoTitle}
                setSeoTitle={(v) => setForm({ ...form, seoTitle: v })}
                seoDescription={form.seoDescription}
                setSeoDescription={(v) => setForm({ ...form, seoDescription: v })}
                baseUrlPrefix={form.listing_type === "Cho thuê" ? "nha-dat-cho-thue" : "nha-dat-ban"}
              />

            </div>

            {/* RIGHT SIDEBAR CONTROLS AREA (4 COLS) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* CARD 1: PUBLISHING STATUS */}
              <PublishStatusCard
                publishStatus={form.publishStatus}
                onChangePublishStatus={(val) => setForm({ ...form, publishStatus: val })}
                scheduledAt={form.scheduledAt}
                onChangeScheduledAt={(val) => setForm({ ...form, scheduledAt: val })}
                itemTypeLabel="tin đăng BĐS"
              />

              {/* CARD 2: TARGET PAGE SELECTION (TƯƠNG ĐƯƠNG CHUYÊN MỤC BÊN TIN TỨC) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <FolderOpen className="size-4 text-purple-600" /> Trang hiển thị trên Website *
                  </h3>
                  <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200 font-semibold">
                    Chuyên trang
                  </Badge>
                </div>

                <p className="text-[11px] text-slate-500 leading-tight">
                  Tích chọn chuyên trang mục tiêu mà tin đăng này sẽ xuất hiện trên Website:
                </p>

                <div className="space-y-2.5 pt-1">
                  {/* Option: Trang Nhà đất Bán */}
                  <div
                    onClick={() => setForm({ ...form, listing_type: "Bán" })}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      form.listing_type === "Bán"
                        ? "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500/20"
                        : "border-slate-200/80 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`size-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                      form.listing_type === "Bán" ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 bg-white"
                    }`}>
                      {form.listing_type === "Bán" && <Check className="size-2.5 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Trang "Nhà đất Bán"</span>
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/70 px-1.5 py-0.2 rounded font-mono">
                          /nha-dat-ban
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Chuyên mục Bán nhà phố, đất nền, căn hộ, biệt thự...
                      </p>
                    </div>
                  </div>

                  {/* Option: Trang Nhà đất Cho thuê */}
                  <div
                    onClick={() => setForm({ ...form, listing_type: "Cho thuê" })}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      form.listing_type === "Cho thuê"
                        ? "border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500/20"
                        : "border-slate-200/80 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`size-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                      form.listing_type === "Cho thuê" ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 bg-white"
                    }`}>
                      {form.listing_type === "Cho thuê" && <Check className="size-2.5 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Trang "Nhà đất Cho thuê"</span>
                        <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-100/70 px-1.5 py-0.2 rounded font-mono">
                          /nha-dat-cho-thue
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Chuyên mục Cho thuê căn hộ, mặt bằng, phòng trọ, villa...
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: TAGS MANAGEMENT */}
              <TagManagerCard
                tags={form.tags}
                onChangeTags={(tags) => setForm({ ...form, tags })}
                title="Quản lý Thẻ (Tags)"
                placeholder="Gõ tag BĐS rồi nhấn Enter..."
                hint="VD: #Sơn Trà, #View biển, #Sông Hàn, #Chính chủ..."
                suggestions={["Sơn Trà", "Hải Châu", "View biển", "Sông Hàn", "Chính chủ", "Sổ đỏ", "Hòa Xuân"]}
              />

              {/* CARD 3: PROPERTY IMAGES GALLERY */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <ImageIcon className="size-4 text-amber-600" /> Ảnh đại diện & Thư viện ảnh BĐS
                </h3>

                <ImageUploader
                  images={form.images}
                  featuredImage={form.image_url}
                  onChangeImages={(urls) => setForm((prev) => ({ ...prev, images: urls }))}
                  onChangeFeaturedImage={(url) => setForm((prev) => ({ ...prev, image_url: url }))}
                  isMock={isMock}
                  label="Hình ảnh thực tế BĐS"
                />
              </div>

            </div>

          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
