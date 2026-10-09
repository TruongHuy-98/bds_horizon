/**
 * Dịch vụ OCR ảnh CCCD chạy hoàn toàn trên trình duyệt bằng tesseract.js.
 * - Worker được tạo lười (lazy) và dùng lại giữa các lần quét.
 * - Thư viện được import động để không ảnh hưởng SSR / bundle ban đầu.
 */
import {
  detectBackKeywords,
  detectFrontKeyword,
  detectMrz,
  extractCccdNumber,
  type MrzResult,
} from "@/lib/cccd";

export type CccdSide = "front" | "back";

export interface CccdScanResult {
  ok: boolean;
  side: CccdSide;
  /** Thông báo hiển thị cho người dùng. */
  message: string;
  /** Số CCCD 12 số bóc tách được (nếu có). */
  cccdNumber?: string | null;
  /** Từ khóa nhận diện được. */
  matchedKeywords: string[];
  mrz?: MrzResult | null;
  rawText: string;
}

export const FRONT_INVALID_MESSAGE =
  "Ảnh tải lên không phải là mặt trước CCCD hợp lệ, vui lòng chọn lại";
export const BACK_INVALID_MESSAGE =
  "Ảnh tải lên không phải là mặt sau CCCD hợp lệ (không tìm thấy dải mã MRZ hoặc đặc điểm nhận dạng), vui lòng chọn lại";

type TesseractWorker = {
  recognize: (image: HTMLCanvasElement | File | Blob | string) => Promise<{ data: { text: string } }>;
  terminate: () => Promise<unknown>;
};

let workerPromise: Promise<TesseractWorker> | null = null;
let progressListener: ((p: number) => void) | null = null;
let queue: Promise<unknown> = Promise.resolve();

async function getWorker(): Promise<TesseractWorker> {
  if (typeof window === "undefined") {
    throw new Error("OCR chỉ khả dụng trên trình duyệt");
  }
  if (!workerPromise) {
    workerPromise = (async () => {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker(["vie", "eng"], 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") progressListener?.(m.progress);
        },
      });
      return worker as unknown as TesseractWorker;
    })().catch((err) => {
      workerPromise = null; // cho phép thử lại lần sau
      throw err;
    });
  }
  return workerPromise;
}

/** Khởi động sẵn engine OCR (tải dữ liệu ngôn ngữ) để lần quét đầu nhanh hơn. */
export function preloadCccdOcr() {
  getWorker().catch(() => undefined);
}

/**
 * Tiền xử lý ảnh: phóng/thu về chiều rộng ~1600px, chuyển xám và tăng tương phản
 * giúp tesseract nhận dạng chữ in trên thẻ tốt hơn.
 */
async function preprocessImage(file: File): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Không đọc được file ảnh"));
      el.src = url;
    });
    const targetW = 1600;
    const scale = Math.min(2.5, targetW / img.width);
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return canvas;
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h);
    const px = data.data;
    const contrast = 1.35;
    for (let i = 0; i < px.length; i += 4) {
      const gray = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
      const v = Math.max(0, Math.min(255, (gray - 128) * contrast + 128));
      px[i] = px[i + 1] = px[i + 2] = v;
    }
    ctx.putImageData(data, 0, 0);
    return canvas;
  } finally {
    // Giải phóng URL tạm ngay sau khi xử lý
    URL.revokeObjectURL(url);
  }
}

/** Quét OCR một ảnh CCCD và kiểm tra đúng mặt (trước / sau). */
export async function scanCccdImage(
  file: File,
  side: CccdSide,
  onProgress?: (progress: number) => void,
): Promise<CccdScanResult> {
  const worker = await getWorker();
  const canvas = await preprocessImage(file);

  // Xếp hàng các lượt nhận dạng để tiến trình của mặt trước/mặt sau không lẫn nhau
  const job = queue.then(async () => {
    progressListener = onProgress ?? null;
    try {
      const { data } = await worker.recognize(canvas);
      return data.text || "";
    } finally {
      progressListener = null;
    }
  });
  queue = job.catch(() => "");
  const text = await job;

  if (side === "front") {
    const keyword = detectFrontKeyword(text);
    if (!keyword) {
      return { ok: false, side, message: FRONT_INVALID_MESSAGE, matchedKeywords: [], rawText: text };
    }
    return {
      ok: true,
      side,
      message: `Đã nhận diện mặt trước CCCD ("${keyword}")`,
      matchedKeywords: [keyword],
      cccdNumber: extractCccdNumber(text),
      rawText: text,
    };
  }

  const mrz = detectMrz(text);
  const keywords = detectBackKeywords(text);
  if (!mrz && keywords.length === 0) {
    return { ok: false, side, message: BACK_INVALID_MESSAGE, matchedKeywords: [], mrz, rawText: text };
  }
  return {
    ok: true,
    side,
    message: mrz
      ? `Đã nhận diện mặt sau CCCD (dải mã MRZ${mrz.checksumOk ? " – checksum hợp lệ" : ""})`
      : `Đã nhận diện mặt sau CCCD ("${keywords[0]}")`,
    matchedKeywords: keywords,
    mrz,
    cccdNumber: mrz?.cccdNumber ?? extractCccdNumber(text),
    rawText: text,
  };
}
