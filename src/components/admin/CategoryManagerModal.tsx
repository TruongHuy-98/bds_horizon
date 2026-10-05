import React, { useState, useEffect } from "react";
import {
  FolderOpen,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Search,
  X,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import {
  CategoryItem,
  fetchCategories,
  createCategory,
  deleteMockCategory,
} from "@/lib/categories";
import { supabase } from "@/integrations/supabase/client";

interface CategoryManagerModalProps {
  open: boolean;
  onClose: () => void;
  isMock: boolean;
  onCategoriesUpdated?: () => void;
}

export default function CategoryManagerModal({
  open,
  onClose,
  isMock,
  onCategoriesUpdated,
}: CategoryManagerModalProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Create Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");
  const [creating, setCreating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchCategories(isMock);
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open, isMock]);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(slugify(val));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên chuyên mục!");
      return;
    }

    try {
      setCreating(true);
      await createCategory(
        {
          name: name.trim(),
          slug: slug.trim() || slugify(name),
          description: desc.trim() || undefined,
        },
        isMock
      );
      toast.success(`Đã thêm chuyên mục "${name.trim()}" thành công!`);
      setName("");
      setSlug("");
      setDesc("");
      await loadData();
      if (onCategoriesUpdated) onCategoriesUpdated();
    } catch (err: any) {
      toast.error(`Lỗi: ${err.message || err}`);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (cat: CategoryItem) => {
    if (cat.slug === "phap-ly") {
      toast.error("Chuyên mục Pháp lý là danh mục mặc định của hệ thống, không thể xóa!");
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa chuyên mục "${cat.name}"?`)) return;

    try {
      if (isMock) {
        deleteMockCategory(cat.id);
      } else {
        const { error } = await supabase.from("categories").delete().eq("id", cat.id);
        if (error) throw error;
      }
      toast.success("Đã xóa chuyên mục thành công!");
      await loadData();
      if (onCategoriesUpdated) onCategoriesUpdated();
    } catch (err: any) {
      toast.error(`Không thể xóa: ${err.message || err}`);
    }
  };

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6 overflow-hidden rounded-2xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <FolderOpen className="size-5 text-purple-600" /> Quản lý Danh mục & Chuyên mục
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Cấu hình danh mục bài viết tin tức và hệ thống chuyên trang pháp lý bất động sản.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-2 pr-1">
          {/* CREATE NEW CATEGORY FORM */}
          <form
            onSubmit={handleCreate}
            className="p-4 bg-purple-50/70 rounded-xl border border-purple-200/80 space-y-3"
          >
            <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="size-3.5 text-purple-700" /> Thêm Chuyên mục Mới
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Tên chuyên mục *</Label>
                <Input
                  placeholder="Ví dụ: Pháp lý Dự án, Sổ đỏ..."
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="h-8 text-xs bg-white border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Slug đường dẫn *</Label>
                <div className="flex items-center text-xs font-mono bg-white px-2 py-1 h-8 rounded-md border border-slate-200">
                  <span className="text-slate-400">/</span>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="phap-ly-du-an"
                    className="w-full text-xs font-mono outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Mô tả tóm tắt</Label>
              <Input
                placeholder="Giới thiệu nội dung bài viết thuộc chuyên mục này..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="h-8 text-xs bg-white border-slate-200"
              />
            </div>

            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                disabled={creating || !name.trim()}
                className="h-8 px-4 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-sm"
              >
                {creating ? "Đang lưu..." : "Tạo chuyên mục"}
              </Button>
            </div>
          </form>

          {/* LIST OF CATEGORIES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Danh sách chuyên mục ({filtered.length})
              </h4>
              <div className="relative w-48">
                <Search className="absolute left-2.5 top-2 size-3.5 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Lọc danh mục..."
                  className="h-7 pl-8 text-xs"
                />
              </div>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Đang tải danh mục...</div>
            ) : filtered.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed">
                Không tìm thấy chuyên mục nào phù hợp
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden bg-white">
                {filtered.map((cat) => {
                  const isLegal = cat.slug === "phap-ly";
                  return (
                    <div
                      key={cat.id}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{cat.name}</span>
                          <code className="text-[11px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-mono">
                            /{cat.slug}
                          </code>
                          {isLegal && (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none text-[10px] font-semibold py-0.5 px-2">
                              Hệ thống & Chuyên trang
                            </Badge>
                          )}
                        </div>
                        {cat.description && (
                          <p className="text-xs text-slate-500 line-clamp-1">{cat.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isLegal && (
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <a href="/phap-ly" target="_blank" rel="noreferrer">
                              <ExternalLink className="size-3.5 mr-1" /> Xem trang
                            </a>
                          </Button>
                        )}
                        {!isLegal && (
                          <button
                            type="button"
                            onClick={() => handleDelete(cat)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa chuyên mục"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
