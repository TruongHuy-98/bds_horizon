import React, { useState, useEffect } from "react";
import {
  Save,
  Send,
  Building2,
  DollarSign,
  Layers,
  MapPin,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Calendar,
  Briefcase,
  FolderOpen,
  Tag as TagIcon,
  Eye,
  Info,
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
import { ProjectRow } from "@/routes/admin";
import { slugify } from "@/lib/utils";

export interface ProjectFormData {
  id?: string;
  name: string;
  slug: string;
  excerpt: string;
  description: string;
  developer: string;
  status: string;
  price_from: string;
  scale: string;
  district: string;
  location: string;
  categories: string[];
  legal_status: string;
  handover: string;
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

interface ProjectEditorModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ProjectFormData) => Promise<void>;
  editingItem: ProjectRow | null;
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

const PROJECT_STATUS_OPTIONS = [
  "Đang mở bán",
  "Sắp mở bán",
  "Đang nhận booking",
  "Đã bàn giao",
  "Đang hoàn thiện",
];

const DEVELOPER_SUGGESTIONS = [
  "Sun Group",
  "VinaCapital",
  "Filmore Development",
  "Đất Xanh Miền Trung",
  "FPT City",
  "CapitaLand",
  "Masterise Homes",
  "Ecopark",
  "Novaland",
  "HUD",
];

const CATEGORY_OPTIONS = [
  "Căn hộ cao cấp",
  "Shophouse / Nhà phố",
  "Biệt thự đảo / Ven sông",
  "Nghỉ dưỡng / Resort",
  "Đất nền khu đô thị",
  "Tòa nhà văn phòng",
];

const LEGAL_STATUS_OPTIONS = [
  "Sổ hồng lâu dài",
  "Sở hữu 50 năm",
  "Đã phê duyệt quy hoạch 1/500",
  "Đầy đủ giấy phép xây dựng & pháp lý",
  "Đang hoàn thiện pháp lý",
];

export default function ProjectEditorModal({
  open,
  onClose,
  onSave,
  editingItem,
  isMock,
}: ProjectEditorModalProps) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<ProjectFormData>({
    name: "",
    slug: "",
    excerpt: "",
    description: "",
    developer: "Sun Group",
    status: "Đang mở bán",
    price_from: "",
    scale: "",
    district: "Hải Châu",
    location: "",
    categories: ["Căn hộ cao cấp"],
    legal_status: "Sổ hồng lâu dài",
    handover: "Q4/2026",
    image_url: "",
    images: [],
    publishStatus: "public",
    scheduledAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    tags: ["Đà Nẵng", "Dự án mới", "SunGroup"],
    focusKeyword: "",
    seoTitle: "",
    seoDescription: "",
  });

  useEffect(() => {
    if (editingItem) {
      const isPub = editingItem.published ?? true;
      const anyItem = editingItem as any;

      // Extract extended fields if present
      let extTags: string[] = ["Đà Nẵng", "Dự án mới"];
      if (Array.isArray(anyItem.tags) && anyItem.tags.length > 0) {
        extTags = anyItem.tags;
      }

      let extCategories: string[] = ["Căn hộ cao cấp"];
      if (Array.isArray(anyItem.categories) && anyItem.categories.length > 0) {
        extCategories = anyItem.categories;
      } else if (anyItem.category) {
        extCategories = [anyItem.category];
      }

      // Guess district from location if not explicitly stored
      let dist = anyItem.district || "Hải Châu";
      if (!anyItem.district && editingItem.location) {
        const foundDist = DISTRICT_OPTIONS.find((d) =>
          editingItem.location!.toLowerCase().includes(d.toLowerCase())
        );
        if (foundDist) dist = foundDist;
      }

      setForm({
        id: editingItem.id,
        name: editingItem.name || "",
        slug: editingItem.slug || "",
        excerpt:
          anyItem.excerpt ||
          (editingItem.description
            ? editingItem.description.replace(/<[^>]*>/g, " ").substring(0, 160).trim()
            : ""),
        description: editingItem.description || "",
        developer: editingItem.developer || "",
        status: editingItem.status || "Đang mở bán",
        price_from: editingItem.price_from || "",
        scale: editingItem.scale || "",
        district: dist,
        location: editingItem.location || "",
        categories: extCategories,
        legal_status: anyItem.legal_status || "Sổ hồng lâu dài",
        handover: anyItem.handover || "Q4/2026",
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
        seoTitle: anyItem.seo_title || editingItem.name || "",
        seoDescription: anyItem.seo_description || anyItem.excerpt || "",
        created_by: editingItem.created_by,
      });
    } else {
      setForm({
        name: "",
        slug: "",
        excerpt: "",
        description: "",
        developer: "Sun Group",
        status: "Đang mở bán",
        price_from: "",
        scale: "",
        district: "Hải Châu",
        location: "",
        categories: ["Căn hộ cao cấp"],
        legal_status: "Sổ hồng lâu dài",
        handover: "Q4/2026",
        image_url: "",
        images: [],
        publishStatus: "public",
        scheduledAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        tags: ["Đà Nẵng", "Dự án mới", "SunGroup"],
        focusKeyword: "",
        seoTitle: "",
        seoDescription: "",
      });
    }
  }, [editingItem, open]);

  // Handle Project Name change & Auto Slug
  const handleNameChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug || slugify(val),
      seoTitle: prev.seoTitle || val,
    }));
  };

  const toggleCategory = (cat: string) => {
    setForm((prev) => {
      const exists = prev.categories.includes(cat);
      if (exists) {
        if (prev.categories.length === 1) return prev; // keep at least 1
        return { ...prev, categories: prev.categories.filter((c) => c !== cat) };
      } else {
        return { ...prev, categories: [...prev.categories, cat] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
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
                  ? "Chỉnh sửa Dự án BĐS (WordPress Style)"
                  : "Soạn thảo Dự án Bất động sản mới (WordPress Style)"}
              </h2>
              <p className="text-xs text-slate-500">
                Đăng tải và quản lý dự án quy mô lớn, cập nhật tiến độ, mặt bằng và tối ưu SEO Google
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
              disabled={saving || !form.name.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-blue-500/10 px-5 cursor-pointer"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin size-3.5 border-2 border-t-transparent border-white rounded-full"></span>
                  Đang lưu...
                </span>
              ) : editingItem ? (
                <span className="flex items-center gap-1.5">
                  <Save className="size-4" /> Cập nhật dự án
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
                    Tên dự án <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    required
                    placeholder="VD: Sun Cosmo Residence Đà Nẵng, The Filmore Da Nang..."
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="text-base font-bold border-slate-200 focus-visible:ring-blue-500/30 py-3 h-auto"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                    <span>Đường dẫn xem dự án (Slug URL):</span>
                    <span className="text-[11px] text-blue-600 font-mono">
                      /du-an/{form.slug || "slug-du-an"}
                    </span>
                  </Label>
                  <Input
                    placeholder="slug-du-an"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                    className="text-xs font-mono text-slate-600 bg-slate-50/50 border-slate-200"
                  />
                </div>

                {/* EXCERPT */}
                <div className="space-y-1.5 pt-1">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Tóm tắt ngắn (Excerpt)
                  </Label>
                  <Textarea
                    placeholder="2-3 câu giới thiệu nhanh về vị trí và điểm nhấn của dự án để hiển thị ngoài danh mục/thẻ preview..."
                    rows={2}
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    className="text-xs border-slate-200 focus-visible:ring-blue-500/30 resize-none leading-relaxed"
                  />
                  <div className="text-[10px] text-slate-400 text-right">
                    {form.excerpt.length} / 200 ký tự khuyến nghị
                  </div>
                </div>
              </div>

              {/* 2. PROJECT SPECIFICATIONS CARD */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="size-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Briefcase className="size-4" />
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        THÔNG SỐ & THÔNG TIN DỰ ÁN
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Cấu hình quy mô, chủ đầu tư, bảng giá và phân loại phát triển
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-blue-700 bg-blue-50 border-blue-200">
                    Dự án tiêu chuẩn
                  </Badge>
                </div>

                {/* ROW 1: DEVELOPER & SALES STATUS */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">
                      Chủ đầu tư <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      required
                      placeholder="VD: Sun Group, Filmore, FPT..."
                      value={form.developer}
                      onChange={(e) => setForm({ ...form, developer: e.target.value })}
                      className="border-slate-200 text-xs"
                    />
                    <div className="flex flex-wrap gap-1 mt-1">
                      {DEVELOPER_SUGGESTIONS.slice(0, 5).map((dev) => (
                        <button
                          key={dev}
                          type="button"
                          onClick={() => setForm({ ...form, developer: dev })}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition-colors"
                        >
                          +{dev}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">
                      Trạng thái bán hàng
                    </Label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {PROJECT_STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ROW 2: PRICE & SCALE */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <DollarSign className="size-3.5 text-slate-400" /> Giá khởi điểm (Từ)
                    </Label>
                    <Input
                      placeholder="VD: 55 tr/m², 3.5 tỷ/căn, 28 tỷ..."
                      value={form.price_from}
                      onChange={(e) => setForm({ ...form, price_from: e.target.value })}
                      className="border-slate-200 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Layers className="size-3.5 text-slate-400" /> Quy mô diện tích / Mật độ
                    </Label>
                    <Input
                      placeholder="VD: 3.5 ha, 2 block 30 tầng, 1.250 căn..."
                      value={form.scale}
                      onChange={(e) => setForm({ ...form, scale: e.target.value })}
                      className="border-slate-200 text-xs"
                    />
                  </div>
                </div>

                {/* ROW 3: DISTRICT & LOCATION */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">
                      Quận / Huyện
                    </Label>
                    <select
                      value={form.district}
                      onChange={(e) => setForm({ ...form, district: e.target.value })}
                      className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {DISTRICT_OPTIONS.map((d) => (
                        <option key={d} value={d}>
                          Quận {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <MapPin className="size-3.5 text-slate-400" /> Vị trí / Địa chỉ chi tiết dự án
                    </Label>
                    <Input
                      placeholder="VD: Mặt tiền đường Trần Hưng Đạo, P. An Hải Tây, Sơn Trà..."
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="border-slate-200 text-xs"
                    />
                  </div>
                </div>

                {/* ROW 4: CATEGORY / TYPE (MULTI-SELECT CHECKBOXES) */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">
                    Loại hình phát triển
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_OPTIONS.map((cat) => {
                      const selected = form.categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                            selected
                              ? "bg-blue-50 border-blue-400 text-blue-700 font-bold shadow-xs"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`size-2 rounded-full ${
                              selected ? "bg-blue-600" : "bg-slate-300"
                            }`}
                          />
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ROW 5: LEGAL & HANDOVER */}
                <div className="grid sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <ShieldCheck className="size-3.5 text-slate-400" /> Pháp lý dự án
                    </Label>
                    <select
                      value={form.legal_status}
                      onChange={(e) => setForm({ ...form, legal_status: e.target.value })}
                      className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {LEGAL_STATUS_OPTIONS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Calendar className="size-3.5 text-slate-400" /> Năm bàn giao dự kiến
                    </Label>
                    <Input
                      placeholder="VD: Q4/2026, Q2/2027, Đã bàn giao..."
                      value={form.handover}
                      onChange={(e) => setForm({ ...form, handover: e.target.value })}
                      className="border-slate-200 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 3. RICH TEXT EDITOR (WYSIWYG Visual / HTML) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Sparkles className="size-4 text-blue-600" /> Nội dung giới thiệu dự án chi tiết
                  </Label>
                  <span className="text-[11px] text-slate-400">Hỗ trợ chèn ảnh, bảng biểu, video, định dạng H1-H4</span>
                </div>
                <RichTextEditor
                  content={form.description}
                  onChange={(html) => setForm({ ...form, description: html })}
                  placeholder="Nhập bài viết giới thiệu dự án, quy hoạch, mặt bằng, tiện ích và chính sách thanh toán chi tiết..."
                />
              </div>

              {/* 4. SEO CONFIGURATION (YOAST STYLE) */}
              <SeoPreviewBlock
                title={form.seoTitle || form.name}
                slug={form.slug}
                description={form.seoDescription || form.excerpt}
                focusKeyword={form.focusKeyword}
                onChangeTitle={(v) => setForm({ ...form, seoTitle: v })}
                onChangeSlug={(v) => setForm({ ...form, slug: slugify(v) })}
                onChangeDescription={(v) => setForm({ ...form, seoDescription: v })}
                onChangeFocusKeyword={(v) => setForm({ ...form, focusKeyword: v })}
                contentHtml={form.description}
                baseUrlPrefix="/du-an/"
              />
            </div>

            {/* RIGHT SIDEBAR (4 COLS) */}
            <div className="lg:col-span-4 space-y-6">
              {/* PUBLISH STATUS */}
              <PublishStatusCard
                status={form.publishStatus}
                scheduledAt={form.scheduledAt}
                onChangeStatus={(status) => setForm({ ...form, publishStatus: status })}
                onChangeScheduledAt={(scheduledAt) => setForm({ ...form, scheduledAt })}
              />

              {/* TAGS */}
              <TagManagerCard
                tags={form.tags}
                onChangeTags={(tags) => setForm({ ...form, tags })}
                suggestions={[
                  "SunGroup",
                  "VinaCapital",
                  "Căn_hộ_Sông_Hàn",
                  "Sơn_Trà",
                  "Hải_Châu",
                  "Biệt_thự_biển",
                  "Khu_đô_thị_sinh_thái",
                  "View_biển_Mỹ_Khê",
                  "Pháp_lý_lâu_dài",
                ]}
              />

              {/* IMAGES & SA BÀN */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="size-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FolderOpen className="size-3.5" />
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">Thư viện hình ảnh & Sa bàn</h4>
                    <p className="text-[10px] text-slate-400">Ảnh thực tế, phối cảnh 3D và mặt bằng quy hoạch</p>
                  </div>
                </div>
                <ImageUploader
                  images={form.images}
                  featuredImage={form.image_url}
                  onChangeImages={(urls) => setForm((prev) => ({ ...prev, images: urls }))}
                  onChangeFeaturedImage={(url) => setForm((prev) => ({ ...prev, image_url: url }))}
                  isMock={isMock}
                  label="Tải ảnh phối cảnh dự án"
                />
              </div>

              {/* QUICK INFO CARD */}
              <div className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200 text-xs space-y-2.5">
                <div className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Info className="size-3.5 text-blue-600" /> Tóm tắt thông tin
                </div>
                <div className="space-y-1.5 text-slate-600 text-[11px]">
                  <div className="flex justify-between">
                    <span>Đường dẫn hiển thị:</span>
                    <span className="font-mono text-blue-600 truncate max-w-[150px]">
                      /du-an/{form.slug || "..."}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chủ đầu tư:</span>
                    <span className="font-semibold text-slate-800">{form.developer || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trạng thái:</span>
                    <span className="font-semibold text-emerald-600">{form.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Số lượng ảnh:</span>
                    <span className="font-semibold">{form.images.length} ảnh</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
