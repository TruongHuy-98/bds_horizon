import { useCallback, useRef, useState } from "react";
import { scanCccdImage, type CccdScanResult, type CccdSide } from "@/lib/cccdOcr";

export type CccdScanStatus = "idle" | "scanning" | "success" | "error";

export interface CccdScanState {
  status: CccdScanStatus;
  progress: number;
  message: string;
  cccdNumber: string | null;
}

const INITIAL: CccdScanState = { status: "idle", progress: 0, message: "", cccdNumber: null };

/**
 * Quản lý trạng thái quét OCR cho một mặt CCCD.
 * Chỉ giữ kết quả của lần quét mới nhất (bỏ qua kết quả cũ nếu người dùng chọn ảnh khác giữa chừng).
 */
export function useCccdScan(side: CccdSide) {
  const [state, setState] = useState<CccdScanState>(INITIAL);
  const runId = useRef(0);

  const scan = useCallback(
    async (file: File): Promise<CccdScanResult | null> => {
      const id = ++runId.current;
      setState({ status: "scanning", progress: 0, message: "Đang quét OCR ảnh...", cccdNumber: null });
      try {
        const result = await scanCccdImage(file, side, (p) => {
          if (id === runId.current) setState((s) => ({ ...s, progress: p }));
        });
        if (id !== runId.current) return null;
        setState({
          status: result.ok ? "success" : "error",
          progress: 1,
          message: result.message,
          cccdNumber: result.ok ? (result.cccdNumber ?? null) : null,
        });
        if (import.meta.env.DEV) console.debug(`[CCCD OCR] ${side}:`, result);
        return result;
      } catch (err) {
        console.error("[CCCD OCR] Lỗi quét ảnh:", err);
        if (id !== runId.current) return null;
        const message =
          "Không thể quét OCR ảnh (lỗi tải bộ nhận dạng hoặc ảnh hỏng). Vui lòng kiểm tra kết nối mạng và chọn lại.";
        setState({ status: "error", progress: 0, message, cccdNumber: null });
        return {
          ok: false,
          side,
          message,
          matchedKeywords: [],
          rawText: "",
        };
      }
    },
    [side],
  );

  const reset = useCallback(() => {
    runId.current++;
    setState(INITIAL);
  }, []);

  return { state, scan, reset, isScanning: state.status === "scanning" };
}
