import { useState, useRef } from "react";
import { UploadCloud, Trash2, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

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

    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        if (isMock) {
          // Convert to Base64 data URL for offline mode mock db storage
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
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
      } catch (err) {
        console.error("Failed to upload file:", file.name, err);
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
                className={`relative aspect-video rounded-lg overflow-hidden group border bg-white shadow-sm transition-all ${
                  isFeatured ? "ring-2 ring-blue-500 border-transparent scale-95" : "border-slate-200"
                }`}
              >
                <img src={url} alt={`Thumbnail ${idx}`} className="size-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  {!isFeatured && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => onChangeFeaturedImage(url)}
                      className="h-7 text-[10px] px-2 font-bold bg-white text-slate-700 hover:bg-slate-100"
                    >
                      Chọn làm bìa
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => handleRemoveImage(url)}
                    className="h-7 w-7 rounded-md bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>

                {isFeatured && (
                  <span className="absolute bottom-1.5 left-1.5 bg-blue-600 text-white text-[9px] font-bold py-0.5 px-2 rounded-full flex items-center gap-1 shadow-md">
                    <CheckCircle className="size-3" /> Ảnh đại diện
                  </span>
                )}
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
