/**
 * Image compression utility to prevent LocalStorage QuotaExceededError in Mock/Demo mode
 * and optimize uploads for fast rendering.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 - 1.0 (recommended: 0.65 - 0.75)
  mimeType?: "image/jpeg" | "image/webp";
}

/**
 * Compresses an existing Base64 Data URL using an HTML5 Canvas.
 * Reduces raw 3MB-10MB base64 images down to ~40KB-80KB.
 */
export async function compressDataUrl(
  dataUrl: string,
  options: CompressOptions = {}
): Promise<string> {
  const {
    maxWidth = 1000,
    maxHeight = 750,
    quality = 0.65,
    mimeType = "image/jpeg",
  } = options;

  if (!dataUrl || typeof dataUrl !== "string") return dataUrl;
  if (!dataUrl.startsWith("data:image/")) return dataUrl;

  // If already under 40KB, no compression needed
  if (dataUrl.length < 40 * 1024) return dataUrl;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      try {
        const compressed = canvas.toDataURL(mimeType, quality);
        resolve(compressed);
      } catch {
        resolve(dataUrl);
      }
    };

    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Reads a File object and compresses it into a compact Base64 data URL.
 */
export async function compressImageFile(
  file: File,
  options: CompressOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Không thể đọc file ảnh"));
    reader.onload = async (e) => {
      const rawDataUrl = e.target?.result as string;
      try {
        const compressed = await compressDataUrl(rawDataUrl, options);
        resolve(compressed);
      } catch (err) {
        resolve(rawDataUrl);
      }
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses an array of images (handling both Data URLs and web URLs).
 */
export async function compressImagesArray(
  images: string[],
  options: CompressOptions = {}
): Promise<string[]> {
  if (!Array.isArray(images) || images.length === 0) return [];
  return Promise.all(images.map((img) => compressDataUrl(img, options)));
}
