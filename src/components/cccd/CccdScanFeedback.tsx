import { AlertCircle, CheckCircle2, Loader2, ScanLine, ShieldAlert, Wand2 } from "lucide-react";
import { validateCCCD, type ValidateCccdOptions } from "@/lib/cccd";
import type { CccdScanState } from "@/hooks/use-cccd-scan";

/* ------------------------------------------------------------------ */
/*  Thông báo kiểm tra Số CCCD ngay dưới ô input                       */
/* ------------------------------------------------------------------ */

interface CccdNumberHintProps {
  value: string;
  /** Lỗi bắt buộc hiển thị (vd: lỗi khi bấm Lưu). Ưu tiên hơn kiểm tra realtime. */
  forcedError?: string;
  /** true khi ô input đã rời focus – lúc này mới báo lỗi thiếu độ dài. */
  touched?: boolean;
  options?: Omit<ValidateCccdOptions, "partial">;
}

export function CccdNumberHint({ value, forcedError, touched, options }: CccdNumberHintProps) {
  const result = validateCCCD(value, { ...options, partial: !touched });
  const error = forcedError || result.error;

  if (error) {
    return (
      <p
        role="alert"
        className="text-[11px] text-red-600 dark:text-red-400 font-medium flex items-start gap-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-200"
      >
        <AlertCircle className="size-3 shrink-0 mt-[1px]" /> {error}
      </p>
    );
  }
  if (result.valid && result.info) {
    const { provinceName, gender, birthYear, age } = result.info;
    return (
      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-start gap-1 mt-1 animate-in fade-in duration-200">
        <CheckCircle2 className="size-3 shrink-0 mt-[1px]" />
        Hợp lệ · {provinceName} · {gender} · {birthYear} ({age} tuổi)
      </p>
    );
  }
  return null;
}

/** Class viền đỏ cho ô input khi Số CCCD sai. */
export function cccdInputErrorClass(
  value: string,
  touched: boolean,
  forcedError?: string,
  options?: Omit<ValidateCccdOptions, "partial">,
) {
  const hasError = !!forcedError || !!validateCCCD(value, { ...options, partial: !touched }).error;
  return hasError ? "border-red-500 ring-1 ring-red-500 bg-red-50/30 dark:bg-red-950/20" : "";
}

/* ------------------------------------------------------------------ */
/*  Lớp phủ đang quét OCR trên khung xem trước ảnh                     */
/* ------------------------------------------------------------------ */

export function CccdScanOverlay({ state }: { state: CccdScanState }) {
  if (state.status !== "scanning") return null;
  const pct = Math.round(state.progress * 100);
  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-slate-950/70 backdrop-blur-[2px] text-white overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Tia quét chạy dọc */}
      <div className="cccd-scan-beam absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent" />
      <ScanLine className="size-6 text-cyan-300 animate-pulse" />
      <span className="text-[11px] font-semibold tracking-wide">
        {pct > 0 ? `Đang quét OCR... ${pct}%` : "Đang tải bộ nhận dạng..."}
      </span>
      <div className="w-2/3 h-1 rounded-full bg-white/20 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-[width] duration-300"
          style={{ width: `${Math.max(pct, 6)}%` }}
        />
      </div>
      <style>{`
        @keyframes cccd-scan-beam { 0% { top: -2.5rem } 100% { top: 100% } }
        .cccd-scan-beam { animation: cccd-scan-beam 1.6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Trạng thái kết quả quét + so khớp số CCCD                         */
/* ------------------------------------------------------------------ */

interface CccdScanStatusProps {
  state: CccdScanState;
  /** Số CCCD đang nhập trong form – để so khớp với số bóc tách từ ảnh. */
  currentNumber: string;
  onApplyNumber: (num: string) => void;
}

export function CccdScanStatus({ state, currentNumber, onApplyNumber }: CccdScanStatusProps) {
  if (state.status === "idle") return null;

  if (state.status === "scanning") {
    return (
      <p className="text-[11px] text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
        <Loader2 className="size-3 animate-spin" /> {state.message}
      </p>
    );
  }

  if (state.status === "error") {
    return (
      <p
        role="alert"
        className="text-[11px] text-red-600 dark:text-red-400 font-medium flex items-start gap-1 animate-in fade-in slide-in-from-top-1 duration-200"
      >
        <ShieldAlert className="size-3.5 shrink-0 mt-[1px]" /> {state.message}
      </p>
    );
  }

  const extracted = state.cccdNumber;
  const current = (currentNumber || "").trim();
  const matched = !!extracted && extracted === current;
  const mismatched = !!extracted && !!current && extracted !== current;

  return (
    <div className="space-y-1 animate-in fade-in duration-200">
      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-start gap-1">
        <CheckCircle2 className="size-3.5 shrink-0 mt-[1px]" /> {state.message}
      </p>
      {!extracted && (
        <p className="text-[10.5px] text-muted-foreground pl-4">
          Chưa đọc được số CCCD từ ảnh – vui lòng tự kiểm tra lại số đã nhập.
        </p>
      )}
      {matched && (
        <p className="text-[10.5px] text-emerald-700 dark:text-emerald-300 pl-4 font-mono">
          ✓ Số trên ảnh <b>{extracted}</b> khớp với Số CCCD đã nhập
        </p>
      )}
      {mismatched && (
        <div className="ml-4 p-2 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 text-[10.5px] text-amber-800 dark:text-amber-200 space-y-1">
          <div>
            Số trên ảnh <b className="font-mono">{extracted}</b> khác Số CCCD đã nhập{" "}
            <b className="font-mono">{current}</b>.
          </div>
          <button
            type="button"
            onClick={() => onApplyNumber(extracted!)}
            className="inline-flex items-center gap-1 font-semibold text-amber-900 dark:text-amber-100 hover:underline"
          >
            <Wand2 className="size-3" /> Dùng số từ ảnh
          </button>
        </div>
      )}
    </div>
  );
}
