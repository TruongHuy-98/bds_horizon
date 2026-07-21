import { useState, useRef } from "react";
import { UploadCloud, Trash2, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageUploaderProps {
  images: string[];
  featuredImage: string;
  onChangeImages: (images: string[]) => void;
  onChangeFeaturedImage: (url: string) => void;
  isMock: boolean;
  bucketName?: string;
  label?: string;
}

export default function ImageUploader({
  images = [],
  featuredImage = "",
  onChangeImages,
  onChangeFeaturedImage,
  isMock,
  bucketName = "bds_images",
  label = "Danh sách hình ảnh",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    toast.loading("Đang tải các ảnh lên...", { id: "upload-toast" });

    const newUrls: string[] = [];
    let errorCount = 0;
    let lastError: any = null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        if (isMock) {
          // Convert to Base64 data URL for offline mode mock db storage
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Lỗi khi đọc file bằng FileReader"));
          });
          reader.readAsDataURL(file);
          const base64Url = await base64Promise;
          newUrls.push(base64Url);
        } else {
          // Upload to Supabase Storage
          const fileExt = file.name.split(".").pop();
          const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

          newUrls.push(publicUrl);
        }
      } catch (err: any) {
        console.error("Failed to upload file:", file.name, err);
        errorCount++;
        lastError = err;
      }
    }

    if (newUrls.length > 0) {
      const updatedImages = [...images, ...newUrls];
      onChangeImages(updatedImages);
      // Auto-set featured image if not currently set
      if (!featuredImage || !images.includes(featuredImage)) {
        onChangeFeaturedImage(newUrls[0]);
      }
    }

    if (errorCount === 0) {
      toast.success(`Đã tải lên thành công ${newUrls.length} hình ảnh`, { id: "upload-toast" });
    } else if (newUrls.length > 0) {
      toast.warning(`Tải lên thành công ${newUrls.length} ảnh, thất bại ${errorCount} ảnh: ${lastError?.message || lastError}`, { id: "upload-toast" });
    } else {
      toast.error(`Tải ảnh thất bại: ${lastError?.message || lastError}`, { id: "upload-toast" });
    }

    setUploading(false);
  };

  const handleRemoveImage = (urlToRemove: string) => {
    const updatedImages = images.filter((url) => url !== urlToRemove);
    onChangeImages(updatedImages);

    // If removed image was the featured one, assign a new featured image
    if (featuredImage === urlToRemove) {
      onChangeFeaturedImage(updatedImages[0] || "");
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 p-4 bg-slate-50/50">
      <div>
        <label className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-1">
          {label}
        </label>
        <span className="text-[10px] text-slate-400 font-medium block">
          Chọn ảnh bất kỳ làm ảnh đại diện chính (WordPress Style)
        </span>
      </div>

      {/* Grid of uploaded images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, idx) => {
            const isFeatured = url === featuredImage;
            return (
              <div
                key={idx}
                className={`relative aspect-video rounded-lg overflow-hidden border bg-white shadow-sm transition-all cursor-pointer ${
                  isFeatured ? "ring-2 ring-blue-500 border-transparent" : "border-slate-200 hover:border-slate-300"
                }`}
                onClick={() => onChangeFeaturedImage(url)}
                title="Nhấp để chọn làm ảnh đại diện"
              >
                <img src={url} alt={`Thumbnail ${idx}`} className="size-full object-cover" />
                
                {/* Selection Indicator Badge */}
                <div className="absolute top-2 left-2 z-10">
                  {isFeatured ? (
                    <span className="bg-blue-600 text-white text-[9px] font-bold py-1 px-2 rounded-full flex items-center gap-1 shadow-md">
                      <CheckCircle className="size-3" /> Ảnh đại diện
                    </span>
                  ) : (
                    <span className="bg-black/50 hover:bg-black/75 text-white text-[9px] font-medium py-1 px-2 rounded-full flex items-center gap-1 shadow-md transition-colors">
                      Đặt làm đại diện
                    </span>
                  )}
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent setting as featured image when deleting
                    handleRemoveImage(url);
                  }}
                  className="absolute top-2 right-2 z-10 h-6 w-6 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow"
                  title="Xóa hình ảnh này"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-200 hover:border-blue-500 bg-white rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors"
      >
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
          disabled={uploading}
        />
        {uploading ? (
          <>
            <Loader2 className="size-8 text-blue-500 animate-spin mb-2" />
            <span className="text-xs font-semibold text-slate-600">Đang tải ảnh lên...</span>
          </>
        ) : (
          <>
            <UploadCloud className="size-8 text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
            <span className="text-xs font-semibold text-slate-600">Nhấp để chọn tải ảnh lên</span>
            <span className="text-[10px] text-slate-400 mt-1">Được chọn nhiều file ảnh (.jpg, .png, .webp)</span>
          </>
        )}
      </div>
    </div>
  );
}
