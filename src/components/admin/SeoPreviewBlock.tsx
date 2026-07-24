import React, { useState } from "react";
import {
  Search,
  Monitor,
  Smartphone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Info,
  Globe,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SeoPreviewBlockProps {
  articleTitle: string;
  articleSlug: string;
  articleContent: string;
  focusKeyword: string;
  setFocusKeyword: (v: string) => void;
  seoTitle: string;
  setSeoTitle: (v: string) => void;
  seoDescription: string;
  setSeoDescription: (v: string) => void;
}

export default function SeoPreviewBlock({
  articleTitle,
  articleSlug,
  articleContent,
  focusKeyword,
  setFocusKeyword,
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
}: SeoPreviewBlockProps) {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");

  // Effective values fallback to article title/excerpt if empty
  const displayTitle = seoTitle.trim() || articleTitle || "Tiêu đề bài viết SEO chưa nhập...";
  const displayDesc =
    seoDescription.trim() ||
    (articleContent
      ? articleContent.replace(/<[^>]*>/g, " ").substring(0, 150).trim() + "..."
      : "Mô tả bài viết SEO sẽ xuất hiện ở đây khi người dùng tìm kiếm trên Google...");
  const displaySlug = articleSlug || "slug-bai-viet";

  const titleLength = seoTitle.length;
  const descLength = seoDescription.length;

  // Title Progress Score (Optimal: 50-60 chars)
  const getTitleStatus = () => {
    if (titleLength === 0) return { percent: 0, color: "bg-slate-200", label: "Chưa nhập" };
    if (titleLength < 40) return { percent: (titleLength / 60) * 100, color: "bg-amber-500", label: "Hơi ngắn" };
    if (titleLength >= 40 && titleLength <= 65) return { percent: Math.min(100, (titleLength / 60) * 100), color: "bg-emerald-500", label: "Tối ưu chuẩn Google" };
    return { percent: 100, color: "bg-red-500", label: "Quá dài (sẽ bị cắt ...)" };
  };

  // Description Progress Score (Optimal: 120-160 chars)
  const getDescStatus = () => {
    if (descLength === 0) return { percent: 0, color: "bg-slate-200", label: "Chưa nhập" };
    if (descLength < 100) return { percent: (descLength / 160) * 100, color: "bg-amber-500", label: "Hơi ngắn" };
    if (descLength >= 100 && descLength <= 165) return { percent: Math.min(100, (descLength / 160) * 100), color: "bg-emerald-500", label: "Tối ưu chuẩn Google" };
    return { percent: 100, color: "bg-red-500", label: "Quá dài (sẽ bị cắt ...)" };
  };

  const titleStat = getTitleStatus();
  const descStat = getDescStatus();

  // SEO Score Checks
  const kw = focusKeyword.trim().toLowerCase();
  const titleHasKw = kw ? displayTitle.toLowerCase().includes(kw) : false;
  const titleOptimal = titleLength >= 45 && titleLength <= 65;
  const descOptimal = descLength >= 110 && descLength <= 165;
  const hasHeadings = /<h[23][^>]*>/i.test(articleContent);
  const descHasKw = kw ? displayDesc.toLowerCase().includes(kw) : false;

  const checks = [
    { label: "Từ khóa chính xuất hiện trong Tiêu đề SEO", pass: titleHasKw },
    { label: "Tiêu đề SEO đạt độ dài chuẩn (50-60 ký tự)", pass: titleOptimal },
    { label: "Mô tả SEO đạt độ dài chuẩn (120-160 ký tự)", pass: descOptimal },
    { label: "Nội dung bài viết có sử dụng thẻ H2 hoặc H3", pass: hasHeadings },
    { label: "Từ khóa chính xuất hiện trong Thẻ mô tả SEO", pass: descHasKw },
  ];

  const passedCount = checks.filter((c) => c.pass).length;
  const totalCount = checks.length;
  const scorePercent = Math.round((passedCount / totalCount) * 100);

  return (
    <Card className="p-6 border-slate-200/90 bg-white shadow-sm space-y-6 rounded-2xl">
      {/* CARD HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              CẤU HÌNH SEO BÀI VIẾT (Yoast SEO Style)
            </h3>
            <p className="text-xs text-slate-500">Tối ưu thẻ meta và điểm xếp hạng hiển thị trên Google</p>
          </div>
        </div>

        {/* SEO SCORE BADGE */}
        <div className="flex items-center gap-2">
          <Badge
            className={`px-3 py-1 text-xs font-bold rounded-full border-none shadow-xs ${
              scorePercent >= 80
                ? "bg-emerald-100 text-emerald-700"
                : scorePercent >= 50
                ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            Điểm SEO: {scorePercent}/100 {scorePercent >= 80 ? "🔥 Tối Ưu" : scorePercent >= 50 ? "⚠️ Cần Cải Thiện" : "❌ Chưa Đạt"}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: SEO INPUTS */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* 1. Focus Keyword */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                Từ khóa chính (Focus Keyword) <span className="text-red-500">*</span>
              </Label>
              <span className="text-[11px] text-slate-400">Từ khóa trọng tâm bài báo hướng tới</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
              <Input
                placeholder="Ví dụ: thị trường bất động sản đà nẵng"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                className="pl-9 text-sm border-slate-200 focus-visible:ring-emerald-500/30"
              />
            </div>
          </div>

          {/* 2. Meta Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Thẻ Tiêu đề SEO (Meta Title)
              </Label>
              <span className="text-xs font-semibold text-slate-500">
                {titleLength} / 60 ký tự
              </span>
            </div>
            <Input
              placeholder="Nhập tiêu đề hiển thị trên Google..."
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="text-sm border-slate-200 focus-visible:ring-emerald-500/30"
            />
            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${titleStat.color}`}
                  style={{ width: `${Math.min(100, titleStat.percent)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>{titleStat.label}</span>
                <span>Chuẩn: 50-60 ký tự</span>
              </p>
            </div>
          </div>

          {/* 3. Meta Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Thẻ Mô tả SEO (Meta Description)
              </Label>
              <span className="text-xs font-semibold text-slate-500">
                {descLength} / 160 ký tự
              </span>
            </div>
            <Textarea
              placeholder="Nhập 2-3 câu mô tả cuốn hút để người dùng click khi tìm kiếm trên Google..."
              rows={3}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="text-sm border-slate-200 resize-none focus-visible:ring-emerald-500/30"
            />
            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${descStat.color}`}
                  style={{ width: `${Math.min(100, descStat.percent)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>{descStat.label}</span>
                <span>Chuẩn: 120-160 ký tự</span>
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: GOOGLE SNIPPET PREVIEW & CHECKLIST */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* GOOGLE SNIPPET PREVIEW CONTAINER */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Globe className="size-3.5 text-blue-600" /> Google Search Snippet
              </span>
              <div className="flex items-center bg-slate-200 p-0.5 rounded-lg text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setDeviceMode("desktop")}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all ${
                    deviceMode === "desktop" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-500"
                  }`}
                >
                  <Monitor className="size-3" /> Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceMode("mobile")}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all ${
                    deviceMode === "mobile" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-500"
                  }`}
                >
                  <Smartphone className="size-3" /> Mobile
                </button>
              </div>
            </div>

            {/* GOOGLE CARD DESKTOP / MOBILE MOCK */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-1">
              {/* Site Header */}
              <div className="flex items-center gap-2 text-xs text-[#202124] mb-1">
                <div className="size-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[9px]">
                  D
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-medium text-[12px] text-[#202124]">Da Nang Real Estate</span>
                  <span className="text-[11px] text-[#5f6368] truncate max-w-[280px]">
                    https://bds-horizon.vercel.app › tin-tuc › {displaySlug}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h4 className="text-[17px] text-[#1a0dab] font-normal hover:underline cursor-pointer leading-snug line-clamp-2">
                {displayTitle}
              </h4>

              {/* Snippet Description */}
              <p className="text-[13px] text-[#4d5156] leading-normal line-clamp-3 pt-0.5">
                {displayDesc}
              </p>
            </div>
          </div>

          {/* SEO SCORE INDICATOR CHECKLIST */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>ĐÁNH GIÁ TIÊU CHUẨN SEO</span>
              <span className="text-emerald-600">{passedCount}/{totalCount} Đạt</span>
            </h4>
            <div className="space-y-2 pt-1 text-xs">
              {checks.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-600 font-medium">
                  <span className="flex items-center gap-2">
                    {item.pass ? (
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="size-4 text-red-400 shrink-0" />
                    )}
                    {item.label}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] py-0 px-1.5 font-bold ${
                      item.pass
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-red-200 bg-red-50 text-red-600"
                    }`}
                  >
                    {item.pass ? "Đạt" : "Chưa có"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </Card>
  );
}
