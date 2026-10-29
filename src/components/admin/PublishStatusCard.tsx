import React from "react";
import { Clock, Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface PublishStatusCardProps {
  publishStatus: "public" | "draft" | "scheduled";
  onChangePublishStatus: (val: "public" | "draft" | "scheduled") => void;
  scheduledAt: string;
  onChangeScheduledAt: (val: string) => void;
  itemTypeLabel?: string;
}

export default function PublishStatusCard({
  publishStatus,
  onChangePublishStatus,
  scheduledAt,
  onChangeScheduledAt,
  itemTypeLabel = "nội dung",
}: PublishStatusCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
      <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
        <Clock className="size-4 text-blue-600" /> Trạng thái phát hành
      </h3>

      <RadioGroup
        value={publishStatus}
        onValueChange={(val: any) => onChangePublishStatus(val)}
        className="space-y-3"
      >
        {/* Public Option */}
        <div
          onClick={() => onChangePublishStatus("public")}
          className={`flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
            publishStatus === "public"
              ? "border-blue-500 bg-blue-50/40 ring-1 ring-blue-500/20"
              : "border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <RadioGroupItem value="public" id="st-public" className="mt-0.5" />
          <div className="space-y-0.5">
            <Label htmlFor="st-public" className="font-bold text-slate-800 text-xs cursor-pointer">
              Công khai ngay (Public)
            </Label>
            <p className="text-[11px] text-slate-500 leading-tight">
              {itemTypeLabel.charAt(0).toUpperCase() + itemTypeLabel.slice(1)} được xuất bản lập tức trên website cho khách xem.
            </p>
          </div>
        </div>

        {/* Draft Option */}
        <div
          onClick={() => onChangePublishStatus("draft")}
          className={`flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
            publishStatus === "draft"
              ? "border-amber-500 bg-amber-50/40 ring-1 ring-amber-500/20"
              : "border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <RadioGroupItem value="draft" id="st-draft" className="mt-0.5" />
          <div className="space-y-0.5">
            <Label htmlFor="st-draft" className="font-bold text-slate-800 text-xs cursor-pointer">
              Lưu bản nháp (Draft)
            </Label>
            <p className="text-[11px] text-slate-500 leading-tight">
              Lưu trữ để biên tập lại, chưa hiển thị công khai trên website.
            </p>
          </div>
        </div>

        {/* Scheduled Option */}
        <div
          onClick={() => onChangePublishStatus("scheduled")}
          className={`flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
            publishStatus === "scheduled"
              ? "border-indigo-500 bg-indigo-50/40 ring-1 ring-indigo-500/20"
              : "border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <RadioGroupItem value="scheduled" id="st-scheduled" className="mt-0.5" />
          <div className="space-y-0.5 w-full">
            <Label htmlFor="st-scheduled" className="font-bold text-slate-800 text-xs cursor-pointer">
              Hẹn giờ đăng (Scheduled)
            </Label>
            <p className="text-[11px] text-slate-500 leading-tight">
              Tự động kích hoạt hiển thị theo ngày giờ cài đặt trước.
            </p>
          </div>
        </div>
      </RadioGroup>

      {/* Datetime picker if scheduled */}
      {publishStatus === "scheduled" && (
        <div className="pt-2 space-y-1.5 animate-in fade-in slide-in-from-top-1">
          <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <Calendar className="size-3.5 text-blue-600" /> Chọn ngày & giờ đăng:
          </Label>
          <Input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => onChangeScheduledAt(e.target.value)}
            className="text-xs border-slate-200 focus-visible:ring-blue-500/30"
          />
        </div>
      )}
    </div>
  );
}
