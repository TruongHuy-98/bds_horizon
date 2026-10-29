import React, { useState } from "react";
import { Tag as TagIcon, X, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export interface TagManagerCardProps {
  tags: string[];
  onChangeTags: (tags: string[]) => void;
  title?: string;
  placeholder?: string;
  hint?: string;
  suggestions?: string[];
}

export default function TagManagerCard({
  tags,
  onChangeTags,
  title = "Quản lý Thẻ (Tags)",
  placeholder = "Gõ tag rồi nhấn Enter hoặc dấu phẩy...",
  hint = "VD: #Sơn Trà, #View biển, #Sông Hàn...",
  suggestions = ["Sơn Trà", "Hải Châu", "Ngũ Hành Sơn", "View biển", "Sông Hàn", "Chính chủ", "Sổ đỏ"],
}: TagManagerCardProps) {
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^#|,/g, "").trim();
      if (trimmed && !tags.includes(trimmed)) {
        onChangeTags([...tags, trimmed]);
        setTagInput("");
      }
    }
  };

  const handleAddSuggestedTag = (suggested: string) => {
    const clean = suggested.replace(/^#/, "").trim();
    if (!tags.includes(clean)) {
      onChangeTags([...tags, clean]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChangeTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
      <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
        <TagIcon className="size-4 text-emerald-600" /> {title}
      </h3>

      <div className="space-y-1.5">
        <Input
          placeholder={placeholder}
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          className="text-xs border-slate-200 focus-visible:ring-emerald-500/30"
        />
        <p className="text-[10px] text-slate-400">{hint}</p>
      </div>

      {/* Suggested Tags */}
      {suggestions && suggestions.length > 0 && (
        <div className="pt-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Gợi ý nhanh:
          </span>
          <div className="flex flex-wrap gap-1">
            {suggestions.map((sug) => {
              const clean = sug.replace(/^#/, "").trim();
              const isAdded = tags.includes(clean);
              return (
                <button
                  key={sug}
                  type="button"
                  disabled={isAdded}
                  onClick={() => handleAddSuggestedTag(clean)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-all flex items-center gap-0.5 ${
                    isAdded
                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 cursor-pointer"
                  }`}
                >
                  {!isAdded && <Plus className="size-2.5" />}
                  #{clean}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Tags list */}
      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 min-h-[40px]">
        {tags.length === 0 ? (
          <span className="text-xs text-slate-400 italic">Chưa gắn thẻ nào</span>
        ) : (
          tags.map((tag) => (
            <Badge
              key={tag}
              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-medium py-1 px-2.5 rounded-lg flex items-center gap-1.5"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-red-600 rounded-full p-0.5 transition-colors cursor-pointer"
                title="Xóa tag"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))
        )}
      </div>
    </div>
  );
}
