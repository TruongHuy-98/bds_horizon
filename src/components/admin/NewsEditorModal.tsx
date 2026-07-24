import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Send,
  Calendar,
  Tag as TagIcon,
  User,
  FolderOpen,
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  FileText,
  Sparkles,
  ArrowLeft,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import RichTextEditor from "./RichTextEditor";
import SeoPreviewBlock from "./SeoPreviewBlock";
import ImageUploader from "./ImageUploader";
import { NewsPostRow } from "@/routes/admin";
import { slugify } from "@/lib/utils";

export interface NewsFormData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  cover_image: string;
  images: string[];
  publishStatus: "public" | "draft" | "scheduled";
  scheduledAt: string;
  tags: string[];
  focusKeyword: string;
  seoTitle: string;
  seoDescription: string;
}

interface NewsEditorModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: NewsFormData) => Promise<void>;
  editingItem: NewsPostRow | null;
  isMock: boolean;
}

export default function NewsEditorModal({
  open,
  onClose,
  onSave,
  editingItem,
  isMock,
}: NewsEditorModalProps) {
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState<NewsFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "Ban Biên Tập",
    category: "Thị trường BĐS",
    cover_image: "",
    images: [],
    publishStatus: "public",
    scheduledAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    tags: ["Đà Nẵng", "Bất động sản"],
    focusKeyword: "",
    seoTitle: "",
    seoDescription: "",
  });

  useEffect(() => {
    if (editingItem) {
      const isPub = editingItem.published ?? true;
      const isSched = !isPub && editingItem.published_at && new Date(editingItem.published_at) > new Date();
      
      // Parse extra fields if stored in metadata or JSON
      let extTags: string[] = ["Đà Nẵng", "Bất động sản"];
      let extKw = "";
      let extSeoTitle = "";
      let extSeoDesc = "";

      if ((editingItem as any).tags && Array.isArray((editingItem as any).tags)) {
        extTags = (editingItem as any).tags;
      }
      if ((editingItem as any).focus_keyword) {
        extKw = (editingItem as any).focus_keyword;
      }
      if ((editingItem as any).seo_title) {
        extSeoTitle = (editingItem as any).seo_title;
      }
      if ((editingItem as any).seo_description) {
        extSeoDesc = (editingItem as any).seo_description;
      }

      setForm({
        id: editingItem.id,
        title: editingItem.title || "",
        slug: editingItem.slug || "",
        excerpt: editingItem.excerpt || "",
        content: editingItem.content || "",
        author: editingItem.author || "Ban Biên Tập",
        category: editingItem.category || "Thị trường BĐS",
        cover_image: editingItem.cover_image || "",
        images: Array.isArray(editingItem.images) ? (editingItem.images as string[]) : editingItem.cover_image ? [editingItem.cover_image] : [],
        publishStatus: isSched ? "scheduled" : isPub ? "public" : "draft",
        scheduledAt: editingItem.published_at
          ? new Date(editingItem.published_at).toISOString().slice(0, 16)
          : new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        tags: extTags,
        focusKeyword: extKw,
        seoTitle: extSeoTitle,
        seoDescription: extSeoDesc,
      });
    } else {
      setForm({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        author: "Ban Biên Tập",
        category: "Thị trường BĐS",
        cover_image: "",
        images: [],
        publishStatus: "public",
        scheduledAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        tags: ["Đà Nẵng", "Bất động sản"],
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

  // Tag Management
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^,|,$/g, "");
      if (trimmed && !form.tags.includes(trimmed)) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
            <Button variant="ghost" size="icon" onClick={onClose} className="size-8 text-slate-500 hover:text-slate-900">
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <FileText className="size-5 text-blue-600" />
                {editingItem ? "Chỉnh sửa bài viết Tin tức" : "Soạn thảo bài viết mới (WordPress Style)"}
              </h2>
              <p className="text-xs text-slate-500">
                Soạn thảo rich text, tối ưu thẻ SEO Google & quản lý xuất bản chuyên nghiệp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-xs font-semibold border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving || !form.title}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-blue-500/10 px-5"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin size-3.5 border-2 border-t-transparent border-white rounded-full"></span>
                  Đang lưu...
                </span>
              ) : editingItem ? (
                <span className="flex items-center gap-1.5">
                  <Save className="size-4" /> Cập nhật bài viết
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
            
            {/* LEFT MAIN EDITOR AREA (8 COLS) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* 1. ARTICLE TITLE & SLUG */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Tiêu đề bài viết <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    required
                    placeholder="Nhập tiêu đề hấp dẫn cho bài viết (VD: Đà Nẵng duyệt quy hoạch phân khu ven sông...)"
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="text-base font-bold border-slate-200 focus-visible:ring-blue-500/30 py-3 h-auto"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                    <span>Đường dẫn xem bài viết (Slug URL):</span>
                    <span className="text-[11px] text-blue-600">/tin-tuc/{form.slug || "slug-bai-viet"}</span>
                  </Label>
                  <Input
                    placeholder="slug-bai-viet"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                    className="text-xs font-mono text-slate-600 bg-slate-50/50 border-slate-200"
                  />
                </div>

                {/* EXCERPT */}
                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Tóm tắt ngắn (Excerpt)
                  </Label>
                  <Textarea
                    placeholder="Viết 2-3 câu ngắn tóm tắt nội dung chính để hiển thị ngoài danh mục tin..."
                    rows={2}
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    className="text-sm border-slate-200 resize-none focus-visible:ring-blue-500/30"
                  />
                </div>
              </div>

              {/* 2. RICH TEXT EDITOR (WYSIWYG) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="size-4 text-blue-600" />
                  NỘI DUNG CHI TIẾT BÀI VIẾT (Rich Text Editor)
                </Label>
                
                <RichTextEditor
                  value={form.content}
                  onChange={(val) => setForm((prev) => ({ ...prev, content: val }))}
                  placeholder="Soạn thảo văn bản, chèn ảnh, video, bảng biểu tại đây..."
                />
              </div>

              {/* 3. SEO CONFIGURATION & PREVIEW BLOCK */}
              <SeoPreviewBlock
                articleTitle={form.title}
                articleSlug={form.slug}
                articleContent={form.content}
                focusKeyword={form.focusKeyword}
                setFocusKeyword={(v) => setForm({ ...form, focusKeyword: v })}
                seoTitle={form.seoTitle}
                setSeoTitle={(v) => setForm({ ...form, seoTitle: v })}
                seoDescription={form.seoDescription}
                setSeoDescription={(v) => setForm({ ...form, seoDescription: v })}
              />

            </div>

            {/* RIGHT SIDEBAR CONTROLS AREA (4 COLS) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* CARD 1: PUBLISHING STATUS & SCHEDULING */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Clock className="size-4 text-blue-600" /> Trạng thái phát hành
                </h3>

                <RadioGroup
                  value={form.publishStatus}
                  onValueChange={(val: any) => setForm({ ...form, publishStatus: val })}
                  className="space-y-3"
                >
                  {/* Public Option */}
                  <div className="flex items-start space-x-3 p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors">
                    <RadioGroupItem value="public" id="st-public" className="mt-0.5" />
                    <div className="space-y-0.5">
                      <Label htmlFor="st-public" className="font-bold text-slate-800 text-xs cursor-pointer">
                        Công khai ngay (Public)
                      </Label>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        Bài viết được xuất bản lập tức trên website cho độc giả xem.
                      </p>
                    </div>
                  </div>

                  {/* Draft Option */}
                  <div className="flex items-start space-x-3 p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors">
                    <RadioGroupItem value="draft" id="st-draft" className="mt-0.5" />
                    <div className="space-y-0.5">
                      <Label htmlFor="st-draft" className="font-bold text-slate-800 text-xs cursor-pointer">
                        Lưu bản nháp (Draft)
                      </Label>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        Lưu trữ để biên tập lại, chưa hiển thị công khai.
                      </p>
                    </div>
                  </div>

                  {/* Scheduled Option */}
                  <div className="flex items-start space-x-3 p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors">
                    <RadioGroupItem value="scheduled" id="st-scheduled" className="mt-0.5" />
                    <div className="space-y-0.5 w-full">
                      <Label htmlFor="st-scheduled" className="font-bold text-slate-800 text-xs cursor-pointer">
                        Hẹn giờ đăng bài (Scheduled)
                      </Label>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        Tự động hiển thị theo lịch cài đặt trước.
                      </p>
                    </div>
                  </div>
                </RadioGroup>

                {/* Datetime picker if scheduled */}
                {form.publishStatus === "scheduled" && (
                  <div className="pt-2 space-y-1.5 animate-in fade-in slide-in-from-top-1">
                    <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Calendar className="size-3.5 text-blue-600" /> Chọn ngày & giờ đăng:
                    </Label>
                    <Input
                      type="datetime-local"
                      value={form.scheduledAt}
                      onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                      className="text-xs border-slate-200"
                    />
                  </div>
                )}
              </div>

              {/* CARD 2: TAGS MANAGEMENT */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                  <TagIcon className="size-4 text-emerald-600" /> Quản lý Thẻ (Tags)
                </h3>

                <div className="space-y-2">
                  <Input
                    placeholder="Gõ tên tag rồi nhấn Enter hoặc dấu phẩy..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="text-xs border-slate-200"
                  />
                  <p className="text-[10px] text-slate-400">VD: Đà Nẵng, Quy hoạch, Hòa Xuân...</p>
                </div>

                {/* TAG PILLS CONTAINER */}
                <div className="flex flex-wrap gap-1.5 pt-1 min-h-[40px]">
                  {form.tags.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">Chưa có tag nào</span>
                  ) : (
                    form.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-medium py-1 px-2.5 rounded-lg flex items-center gap-1.5"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-600 rounded-full p-0.5"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              {/* CARD 3: CATEGORY & AUTHOR */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                  <FolderOpen className="size-4 text-purple-600" /> Chuyên mục & Tác giả
                </h3>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Chuyên mục tin tức</Label>
                  <Input
                    placeholder="Ví dụ: Thị trường BĐS, Quy hoạch..."
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="text-xs border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Tác giả bài viết</Label>
                  <Input
                    placeholder="Ví dụ: Ban Biên Tập, Nguyễn Văn A..."
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="text-xs border-slate-200"
                  />
                </div>
              </div>

              {/* CARD 4: COVER IMAGE & GALLERY */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <ImageIcon className="size-4 text-amber-600" /> Ảnh đại diện & Thư viện ảnh
                </h3>

                <ImageUploader
                  images={form.images}
                  featuredImage={form.cover_image}
                  onChangeImages={(urls) => setForm((prev) => ({ ...prev, images: urls }))}
                  onChangeFeaturedImage={(url) => setForm((prev) => ({ ...prev, cover_image: url }))}
                  isMock={isMock}
                  label="Hình ảnh đại diện"
                />
              </div>

            </div>

          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
