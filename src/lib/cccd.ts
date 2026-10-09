/**
 * Tiện ích kiểm tra tính hợp lệ của Số Căn cước công dân (CCCD) 12 số
 * theo Thông tư 59/2021/TT-BCA (cấu trúc số định danh cá nhân).
 *
 * Cấu trúc: [PPP][G][YY][NNNNNN]
 *  - PPP : Mã tỉnh/thành phố nơi đăng ký khai sinh (001 - 096)
 *  - G   : Mã giới tính + thế kỷ sinh
 *          0 = Nam, thế kỷ 20 (1900-1999) | 1 = Nữ, thế kỷ 20
 *          2 = Nam, thế kỷ 21 (2000-2099) | 3 = Nữ, thế kỷ 21
 *  - YY  : 2 số cuối năm sinh
 *  - N.. : 6 số ngẫu nhiên
 */

/** Bảng mã tỉnh/thành phố chính thức (001 - 096). */
export const VN_PROVINCE_CODES: Record<string, string> = {
  "001": "Hà Nội",
  "002": "Hà Giang",
  "004": "Cao Bằng",
  "006": "Bắc Kạn",
  "008": "Tuyên Quang",
  "010": "Lào Cai",
  "011": "Điện Biên",
  "012": "Lai Châu",
  "014": "Sơn La",
  "015": "Yên Bái",
  "017": "Hòa Bình",
  "019": "Thái Nguyên",
  "020": "Lạng Sơn",
  "022": "Quảng Ninh",
  "024": "Bắc Giang",
  "025": "Phú Thọ",
  "026": "Vĩnh Phúc",
  "027": "Bắc Ninh",
  "030": "Hải Dương",
  "031": "Hải Phòng",
  "033": "Hưng Yên",
  "034": "Thái Bình",
  "035": "Hà Nam",
  "036": "Nam Định",
  "037": "Ninh Bình",
  "038": "Thanh Hóa",
  "040": "Nghệ An",
  "042": "Hà Tĩnh",
  "044": "Quảng Bình",
  "045": "Quảng Trị",
  "046": "Thừa Thiên Huế",
  "048": "Đà Nẵng",
  "049": "Quảng Nam",
  "051": "Quảng Ngãi",
  "052": "Bình Định",
  "054": "Phú Yên",
  "056": "Khánh Hòa",
  "058": "Ninh Thuận",
  "060": "Bình Thuận",
  "062": "Kon Tum",
  "064": "Gia Lai",
  "066": "Đắk Lắk",
  "067": "Đắk Nông",
  "068": "Lâm Đồng",
  "070": "Bình Phước",
  "072": "Tây Ninh",
  "074": "Bình Dương",
  "075": "Đồng Nai",
  "077": "Bà Rịa - Vũng Tàu",
  "079": "TP. Hồ Chí Minh",
  "080": "Long An",
  "082": "Tiền Giang",
  "083": "Bến Tre",
  "084": "Trà Vinh",
  "086": "Vĩnh Long",
  "087": "Đồng Tháp",
  "089": "An Giang",
  "091": "Kiên Giang",
  "092": "Cần Thơ",
  "093": "Hậu Giang",
  "094": "Sóc Trăng",
  "095": "Bạc Liêu",
  "096": "Cà Mau",
};

export const CCCD_MIN_AGE = 18;

export interface CccdInfo {
  provinceCode: string;
  provinceName: string;
  gender: "Nam" | "Nữ";
  birthYear: number;
  age: number;
}

export interface CccdValidationResult {
  valid: boolean;
  /** Thông báo lỗi tiếng Việt (rỗng nếu hợp lệ hoặc đang nhập dở mà chưa sai). */
  error: string;
  /** Thông tin bóc tách được khi số hợp lệ. */
  info?: CccdInfo;
}

export interface ValidateCccdOptions {
  /**
   * true = đang gõ dở: chỉ kiểm tra phần tiền tố đã nhập, không báo lỗi thiếu độ dài.
   * Dùng cho kiểm tra realtime khi người dùng đang nhập.
   */
  partial?: boolean;
  /** Cho phép CMND cũ 9 số (chỉ kiểm tra là chữ số). */
  allowLegacyCmnd?: boolean;
  /** Mốc thời gian để tính tuổi (mặc định: hiện tại). */
  now?: Date;
}

/**
 * Kiểm tra Số CCCD 12 số.
 * - 3 số đầu thuộc bảng mã tỉnh (001 - 096)
 * - Số thứ 4 là mã giới tính/thế kỷ (0 - 3)
 * - 2 số tiếp theo là năm sinh hợp lệ, đủ 18 tuổi trở lên
 */
export function validateCCCD(
  raw: string,
  { partial = false, allowLegacyCmnd = false, now = new Date() }: ValidateCccdOptions = {},
): CccdValidationResult {
  const value = (raw || "").trim();

  if (!value) return { valid: false, error: "" };

  if (!/^\d+$/.test(value)) {
    return { valid: false, error: "Số CCCD chỉ được chứa chữ số (0-9)." };
  }

  if (allowLegacyCmnd && value.length === 9 && !partial) {
    return { valid: true, error: "" };
  }

  if (value.length > 12) {
    return { valid: false, error: "Số CCCD chỉ gồm đúng 12 chữ số." };
  }

  // 1. Mã tỉnh (3 số đầu)
  if (value.length >= 3) {
    const province = value.slice(0, 3);
    if (!VN_PROVINCE_CODES[province]) {
      return {
        valid: false,
        error: `Mã tỉnh "${province}" (3 số đầu) không thuộc bảng mã tỉnh/thành Việt Nam (001 - 096).`,
      };
    }
  }

  // 2. Mã giới tính / thế kỷ (số thứ 4)
  if (value.length >= 4) {
    const g = Number(value[3]);
    if (g < 0 || g > 3) {
      return {
        valid: false,
        error: `Số thứ 4 ("${value[3]}") phải là mã giới tính - thế kỷ hợp lệ (0 - 3).`,
      };
    }
  }

  // 3. Năm sinh (số thứ 5-6) + độ tuổi >= 18
  if (value.length >= 6) {
    const g = Number(value[3]);
    const yy = Number(value.slice(4, 6));
    const birthYear = (g <= 1 ? 1900 : 2000) + yy;
    const currentYear = now.getFullYear();
    const age = currentYear - birthYear;

    if (birthYear > currentYear) {
      return {
        valid: false,
        error: `Năm sinh ${birthYear} (số thứ 5-6) không hợp lệ - lớn hơn năm hiện tại.`,
      };
    }
    if (age < CCCD_MIN_AGE) {
      return {
        valid: false,
        error: `Năm sinh ${birthYear} (số thứ 5-6) chưa đủ ${CCCD_MIN_AGE} tuổi (hiện ${age} tuổi).`,
      };
    }
  }

  if (value.length < 12) {
    if (partial) return { valid: false, error: "" };
    return {
      valid: false,
      error: allowLegacyCmnd
        ? `Số CCCD chuẩn gồm 12 chữ số (hoặc CMND 9 số) - hiện có ${value.length} số.`
        : `Số CCCD phải gồm đủ 12 chữ số - hiện có ${value.length} số.`,
    };
  }

  const g = Number(value[3]);
  const birthYear = (g <= 1 ? 1900 : 2000) + Number(value.slice(4, 6));
  return {
    valid: true,
    error: "",
    info: {
      provinceCode: value.slice(0, 3),
      provinceName: VN_PROVINCE_CODES[value.slice(0, 3)],
      gender: g % 2 === 0 ? "Nam" : "Nữ",
      birthYear,
      age: now.getFullYear() - birthYear,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Phân tích văn bản OCR                                              */
/* ------------------------------------------------------------------ */

/** Bỏ dấu tiếng Việt, viết hoa, gộp khoảng trắng – giúp so khớp chịu lỗi OCR. */
export function normalizeOcrText(text: string): string {
  return (text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "D")
    .toUpperCase()
    .replace(/[^\S\n]+/g, " ");
}

/**
 * Khoảng cách chỉnh sửa nhỏ nhất giữa `pattern` và một chuỗi con bất kỳ của `text`
 * (thuật toán Sellers – O(n·m)).
 */
function approxSubstringDistance(text: string, pattern: string): number {
  const m = pattern.length;
  let col = new Array<number>(m + 1);
  for (let i = 0; i <= m; i++) col[i] = i;
  let best = col[m];
  for (let j = 1; j <= text.length; j++) {
    const next = new Array<number>(m + 1);
    next[0] = 0; // chuỗi con có thể bắt đầu ở bất kỳ vị trí nào
    for (let i = 1; i <= m; i++) {
      const cost = pattern[i - 1] === text[j - 1] ? 0 : 1;
      next[i] = Math.min(col[i] + 1, next[i - 1] + 1, col[i - 1] + cost);
    }
    col = next;
    if (col[m] < best) best = col[m];
    if (best === 0) break;
  }
  return best;
}

/**
 * Tìm cụm từ trong văn bản OCR với dung sai lỗi nhận dạng (~20% ký tự).
 * So khớp trên chuỗi đã bỏ khoảng trắng để tránh lỗi tách/gộp từ.
 */
export function fuzzyContains(haystack: string, phrase: string, tolerance = 0.2): boolean {
  const h = normalizeOcrText(haystack).replace(/[^A-Z0-9]/g, "");
  const p = normalizeOcrText(phrase).replace(/[^A-Z0-9]/g, "");
  if (!p || !h) return false;
  if (h.includes(p)) return true;
  const maxDist = Math.floor(p.length * tolerance);
  if (maxDist === 0) return false;
  return approxSubstringDistance(h, p) <= maxDist;
}

export const CCCD_FRONT_KEYWORDS = ["CĂN CƯỚC CÔNG DÂN", "IDENTITY CARD"];

export const CCCD_BACK_KEYWORDS = [
  "ĐẶC ĐIỂM NHÂN DẠNG",
  "PERSONAL IDENTIFICATION",
  "NGÓN TRỎ TRÁI",
  "NGÓN TRỎ PHẢI",
  "LEFT INDEX FINGER",
  "RIGHT INDEX FINGER",
  "CỤC TRƯỞNG CỤC CẢNH SÁT",
  "QUẢN LÝ HÀNH CHÍNH VỀ TRẬT TỰ XÃ HỘI",
  "NƠI ĐĂNG KÝ KHAI SINH",
  "PLACE OF BIRTH REGISTRATION",
  "NƠI CƯ TRÚ",
];

export function detectFrontKeyword(text: string): string | null {
  return CCCD_FRONT_KEYWORDS.find((k) => fuzzyContains(text, k)) ?? null;
}

export function detectBackKeywords(text: string): string[] {
  return CCCD_BACK_KEYWORDS.filter((k) => fuzzyContains(text, k));
}

/** Chữ số kiểm tra ICAO 9303 (trọng số 7-3-1). */
function mrzCheckDigit(input: string): number {
  const weights = [7, 3, 1];
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    let v = 0;
    if (c >= "0" && c <= "9") v = c.charCodeAt(0) - 48;
    else if (c >= "A" && c <= "Z") v = c.charCodeAt(0) - 55;
    sum += v * weights[i % 3];
  }
  return sum % 10;
}

export interface MrzResult {
  /** Dòng MRZ thô đã nhận dạng. */
  line: string;
  /** Số CCCD 12 số bóc từ vùng dữ liệu tùy chọn của MRZ (nếu đọc được). */
  cccdNumber?: string;
  /** Chữ số kiểm tra của số giấy tờ có khớp chuẩn ICAO không. */
  checksumOk?: boolean;
}

/**
 * Phát hiện dải mã MRZ mặt sau CCCD gắn chip (định dạng TD1 – 3 dòng × 30 ký tự).
 * Dòng 1: IDVNM + [9 số cuối CCCD] + [check] + [12 số CCCD] + "<<" + [check]
 */
export function detectMrz(text: string): MrzResult | null {
  const lines = normalizeOcrText(text)
    .split("\n")
    .map((l) => l.replace(/\s+/g, "").replace(/[«‹(\[{]/g, "<"));

  for (const line of lines) {
    // OCR hay nhầm "<" thành "K"/"C" nên chỉ dựa vào tiền tố IDVNM
    const idx = line.search(/I[DO0]VNM/);
    if (idx === -1) continue;
    const body = line
      .slice(idx + 5)
      .replace(/O/g, "0")
      .replace(/[IL]/g, "1");
    const m = body.match(/^(\d{9})(\d)(\d{12})/);
    if (m) {
      return {
        line: line.slice(idx),
        cccdNumber: m[3],
        checksumOk: mrzCheckDigit(m[1]) === Number(m[2]),
      };
    }
    return { line: line.slice(idx) };
  }

  // Không có IDVNM nhưng có dòng chứa nhiều ký tự "<" liên tiếp – đặc trưng MRZ
  const fillerLine = lines.find((l) => l.length >= 20 && /<{3,}/.test(l));
  return fillerLine ? { line: fillerLine } : null;
}

/** Tìm tất cả chuỗi 12 chữ số (cho phép khoảng trắng/dấu chấm chen giữa) trong văn bản OCR. */
export function extractCccdCandidates(text: string): string[] {
  const results = new Set<string>();
  const normalized = (text || "").replace(/[Oo](?=\d)|(?<=\d)[Oo]/g, "0");
  const re = /(?<!\d)(?:\d[ .]?){11}\d(?!\d)/g;
  for (const m of normalized.matchAll(re)) {
    results.add(m[0].replace(/\D/g, ""));
  }
  return [...results];
}

/** Chọn số CCCD hợp lệ nhất bóc được từ văn bản OCR (ưu tiên số qua được validateCCCD). */
export function extractCccdNumber(text: string): string | null {
  const candidates = extractCccdCandidates(text);
  if (candidates.length === 0) return null;
  return candidates.find((c) => validateCCCD(c).valid) ?? candidates[0];
}
