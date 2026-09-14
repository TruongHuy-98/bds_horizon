import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Save,
  UserCheck,
  Award,
  Calendar,
  Lock,
  Unlock,
  BadgeCheck,
  Building2,
  User,
  Shield,
  Sparkles,
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Upload,
  Image as ImageIcon,
  Check,
  Plus,
  CreditCard,
  FileCheck,
  AlertCircle,
  Clock,
  Eye,
  Trash2,
  FileText,
  FileBadge,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserAccount, BrokerPlanType, UserStatus } from "@/data/mockUsersData";
import { toast } from "sonner";

interface BrokerEditorModalProps {
  open: boolean;
  onClose: () => void;
  broker: UserAccount | null; // If null, mode is "create"
  onSave: (savedBroker: UserAccount) => void;
}

const DISTRICT_OPTIONS = [
  "Hải Châu",
  "Sơn Trà",
  "Ngũ Hành Sơn",
  "Cẩm Lệ",
  "Thanh Khê",
  "Liên Chiểu",
  "Hòa Vang",
  "Toàn thành phố",
];

const PRESET_SPECIALTIES = [
  "Căn hộ cao cấp",
  "Biệt thự biển",
  "Đất nền dự án",
  "Nhà phố trung tâm",
  "BĐS Ven sông",
  "Nghỉ dưỡng 5 sao",
  "FPT City",
  "Nam Hòa Xuân",
  "Đầu tư sinh lời",
  "Cho thuê văn phòng",
];

const PRESET_AVATARS = [
  {
    label: "Nam chuyên nghiệp 1",
    url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80",
  },
  {
    label: "Nữ chuyên nghiệp 1",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
  },
  {
    label: "Nam lịch lãm 2",
    url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
  },
  {
    label: "Nữ thanh lịch 2",
    url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
  },
  {
    label: "Nam năng động 3",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  },
  {
    label: "Nữ phong cách 3",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  },
];

// Presets for Mock ID Card and License images
const PRESET_DOCUMENTS = {
  idCardFront: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
  idCardBack: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800&auto=format&fit=crop&q=80",
  licenseImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80",
};

export function BrokerEditorModal({
  open,
  onClose,
  broker,
  onSave,
}: BrokerEditorModalProps) {
  const isEdit = !!broker;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cccdFrontInputRef = useRef<HTMLInputElement>(null);
  const cccdBackInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);

  // 1. Basic info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0].url);
  const [district, setDistrict] = useState("Hải Châu");
  const [specialties, setSpecialties] = useState<string[]>([
    "Căn hộ cao cấp",
    "Hải Châu",
  ]);
  const [customTag, setCustomTag] = useState("");
  const [yearsExp, setYearsExp] = useState(5);
  const [rating, setRating] = useState(4.9);
  const [reviews, setReviews] = useState(120);
  const [activePlan, setActivePlan] = useState<BrokerPlanType>("pro");
  const [planExpiry, setPlanExpiry] = useState("2026-12-31");
  const [remainingPosts, setRemainingPosts] = useState(20);
  const [status, setStatus] = useState<UserStatus>("active");
  const [saving, setSaving] = useState(false);

  // 2. Section: CCCD / Identity Verification
  const [idCardNumber, setIdCardNumber] = useState("");
  const [idCardDate, setIdCardDate] = useState("2021-08-15");
  const [idCardPlace, setIdCardPlace] = useState("Cục Cảnh sát QLHC về TTXH");
  const [idCardNationality, setIdCardNationality] = useState("Việt Nam");
  const [idCardFrontUrl, setIdCardFrontUrl] = useState("");
  const [idCardBackUrl, setIdCardBackUrl] = useState("");

  // 3. Section: Real Estate Broker License
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseIssuer, setLicenseIssuer] = useState("Sở Xây dựng TP. Đà Nẵng");
  const [licenseIssueDate, setLicenseIssueDate] = useState("2022-04-15");
  const [licenseExpiryDate, setLicenseExpiryDate] = useState("2027-04-15");
  const [licenseImageUrl, setLicenseImageUrl] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<"verified" | "pending" | "unverified">("verified");
  const [isVerified, setIsVerified] = useState(true);

  // Reset or populate fields when modal opens
  useEffect(() => {
    if (broker) {
      setName(broker.name || "");
      setEmail(broker.email || "");
      setPhone(broker.phone || "");
      setAvatar(broker.avatar || PRESET_AVATARS[0].url);
      setDistrict(broker.district || "Hải Châu");
      setSpecialties(
        broker.specialties && broker.specialties.length > 0
          ? broker.specialties
          : ["Môi giới BĐS", broker.district || "Đà Nẵng"]
      );
      setYearsExp(broker.yearsExperience || broker.yearsExp || 3);
      setRating(broker.rating || 5.0);
      setReviews(broker.reviewsCount || broker.reviews || 80);
      setActivePlan(broker.activePlan || "pro");
      setPlanExpiry(broker.planExpiry || "2026-12-31");
      setRemainingPosts(broker.remainingPosts ?? 20);
      setStatus(broker.status || "active");

      // Populate CCCD fields
      setIdCardNumber(broker.id_card_number || "048092008765");
      setIdCardDate(broker.id_card_date || "2021-07-10");
      setIdCardPlace(broker.id_card_place || "Cục Cảnh sát QLHC về TTXH");
      setIdCardNationality(broker.id_card_nationality || "Việt Nam");
      setIdCardFrontUrl(broker.id_card_front_url || PRESET_DOCUMENTS.idCardFront);
      setIdCardBackUrl(broker.id_card_back_url || PRESET_DOCUMENTS.idCardBack);

      // Populate License fields
      setLicenseNumber(broker.license_number || "ĐN-02849");
      setLicenseIssuer(broker.license_issuer || "Sở Xây dựng TP. Đà Nẵng");
      setLicenseIssueDate(broker.license_issue_date || "2022-04-15");
      setLicenseExpiryDate(broker.license_expiry_date || "2027-04-15");
      setLicenseImageUrl(broker.license_image_url || PRESET_DOCUMENTS.licenseImage);

      const vStat = broker.verification_status || (broker.isVerified ? "verified" : "unverified");
      setVerificationStatus(vStat);
      setIsVerified(vStat === "verified");
    } else {
      // Default for new broker creation
      setName("");
      setEmail("");
      setPhone("");
      setAvatar(PRESET_AVATARS[0].url);
      setDistrict("Hải Châu");
      setSpecialties(["Căn hộ cao cấp", "Đất nền dự án"]);
      setYearsExp(3);
      setRating(5.0);
      setReviews(25);
      setActivePlan("pro");
      setPlanExpiry("2026-12-31");
      setRemainingPosts(20);
      setStatus("active");

      // Default CCCD fields
      setIdCardNumber("");
      setIdCardDate("2022-01-15");
      setIdCardPlace("Cục Cảnh sát QLHC về TTXH");
      setIdCardNationality("Việt Nam");
      setIdCardFrontUrl("");
      setIdCardBackUrl("");

      // Default License fields
      setLicenseNumber("");
      setLicenseIssuer("Sở Xây dựng TP. Đà Nẵng");
      setLicenseIssueDate("2022-06-20");
      setLicenseExpiryDate("2027-06-20");
      setLicenseImageUrl("");
      setVerificationStatus("pending");
      setIsVerified(false);
    }
  }, [broker, open]);

  // Handle Plan change helper: update remaining posts default based on tier
  const handlePlanChange = (plan: BrokerPlanType) => {
    setActivePlan(plan);
    if (!broker) {
      if (plan === "free") setRemainingPosts(5);
      else if (plan === "pro") setRemainingPosts(20);
      else if (plan === "vip") setRemainingPosts(999);
    }
  };

  // Auto calculate 5 years for license expiry date
  const handleLicenseIssueDateChange = (dateVal: string) => {
    setLicenseIssueDate(dateVal);
    if (dateVal) {
      try {
        const d = new Date(dateVal);
        d.setFullYear(d.getFullYear() + 5);
        setLicenseExpiryDate(d.toISOString().slice(0, 10));
      } catch {
        // Keep current
      }
    }
  };

  const handleToggleSpecialty = (tag: string) => {
    if (specialties.includes(tag)) {
      setSpecialties(specialties.filter((t) => t !== tag));
    } else {
      setSpecialties([...specialties, tag]);
    }
  };

  const handleAddCustomTag = () => {
    const trimmed = customTag.trim();
    if (trimmed && !specialties.includes(trimmed)) {
      setSpecialties([...specialties, trimmed]);
      setCustomTag("");
    }
  };

// Helper to downscale and compress images to prevent localStorage QuotaExceededError
const compressImageFile = (file: File, maxWidth = 800, quality = 0.75): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Tệp không phải là hình ảnh hợp lệ"));
      return;
    }
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(readerEvent.target?.result as string);
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

  // Generic local file reader helper with automatic downscale/compression
  const handleLocalFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrl: string) => void,
    label: string
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const toastId = toast.loading(`Đang tải ảnh ${label}...`);
    try {
      const compressedDataUrl = await compressImageFile(file, 800, 0.75);
      onSuccess(compressedDataUrl);
      toast.success(`Đã tải và tối ưu ảnh ${label}!`, { id: toastId });
    } catch (err: any) {
      console.warn(`Lỗi nén ảnh ${label}, dùng bản gốc:`, err);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onSuccess(reader.result);
          toast.success(`Đã tải ảnh ${label}!`, { id: toastId });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!name.trim()) {
      toast.error("Vui lòng nhập họ và tên môi giới!");
      return;
    }
    if (!phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại liên hệ!");
      return;
    }
    if (!email.trim()) {
      toast.error("Vui lòng nhập email môi giới!");
      return;
    }

    // Validate CCCD format if entered
    if (idCardNumber && idCardNumber.length !== 12 && idCardNumber.length !== 9) {
      toast.warning("Lưu ý: Số CCCD chuẩn hiện hành gồm 12 chữ số.");
    }

    setSaving(true);

    try {
      const isVerifiedFinal = verificationStatus === "verified";

      const brokerData: UserAccount = {
        id: broker?.id || "usr-broker-" + Math.random().toString(36).substring(2, 9),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        avatar: avatar || PRESET_AVATARS[0].url,
        role: "broker",
        isVerified: isVerifiedFinal,
        verification_status: verificationStatus,
        activePlan,
        planExpiry: activePlan !== "free" ? planExpiry : undefined,
        remainingPosts: Number(remainingPosts) || 0,
        createdAt: broker?.createdAt || new Date().toISOString(),
        status,
        district,
        specialties,
        rating: Number(rating) || 5.0,
        reviews: Number(reviews) || 0,
        reviewsCount: Number(reviews) || 0,
        yearsExp: Number(yearsExp) || 1,
        yearsExperience: Number(yearsExp) || 1,
        // CCCD & Real Estate License fields
        id_card_number: idCardNumber.trim() || undefined,
        id_card_date: idCardDate || undefined,
        id_card_place: idCardPlace.trim() || undefined,
        id_card_nationality: idCardNationality.trim() || "Việt Nam",
        id_card_front_url: idCardFrontUrl || undefined,
        id_card_back_url: idCardBackUrl || undefined,
        license_number: licenseNumber.trim() || undefined,
        license_issuer: licenseIssuer.trim() || undefined,
        license_issue_date: licenseIssueDate || undefined,
        license_expiry_date: licenseExpiryDate || undefined,
        license_image_url: licenseImageUrl || undefined,
      };

      onSave(brokerData);
      toast.success(
        isEdit
          ? `Đã cập nhật thông tin môi giới ${brokerData.name}!`
          : `Thêm mới môi giới ${brokerData.name} thành công!`
      );
      onClose();
    } catch (err: any) {
      console.error("Lỗi khi lưu môi giới:", err);
      toast.error("Không thể lưu: " + (err?.message || "Đã xảy ra lỗi khi lưu thông tin."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[92vh] flex flex-col p-0 gap-0 bg-slate-50 border-slate-200 overflow-hidden rounded-2xl shadow-2xl">
        {/* HEADER (Sticky) */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-xs z-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="size-8 text-slate-500 hover:text-slate-900 rounded-lg"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={avatar}
                  alt={name || "Môi giới"}
                  className="size-11 rounded-full object-cover border-2 border-blue-500/20 shadow-sm"
                />
                {verificationStatus === "verified" ? (
                  <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm" title="Đã xác thực">
                    <BadgeCheck className="size-4 text-blue-600 fill-blue-100" />
                  </span>
                ) : verificationStatus === "pending" ? (
                  <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm" title="Chờ duyệt">
                    <Clock className="size-4 text-amber-500 fill-amber-100" />
                  </span>
                ) : null}
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  {isEdit ? "Cập nhật Thông tin Môi giới" : "Thêm Môi giới Mới"}
                  {activePlan !== "free" && (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 uppercase text-[10px] font-bold">
                      {activePlan.toUpperCase()}
                    </Badge>
                  )}
                  {verificationStatus === "verified" ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold">
                      Đã xác thực
                    </Badge>
                  ) : verificationStatus === "pending" ? (
                    <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-semibold">
                      Chờ duyệt
                    </Badge>
                  ) : null}
                </h2>
                <p className="text-xs text-slate-500">
                  {isEdit
                    ? `Mã ID: ${broker.id} · Cập nhật quyền hạn, CCCD & chứng chỉ hành nghề`
                    : "Tạo tài khoản Nhà Môi Giới BĐS chuyên nghiệp tại Đà Nẵng"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs font-semibold border-slate-200 text-slate-600 hover:bg-slate-100 h-9"
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit()}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/15 px-5 h-9 flex items-center gap-1.5"
            >
              <Save className="size-3.5" />
              {saving ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo Môi giới"}
            </Button>
          </div>
        </div>

        {/* BODY (Scrollable Container) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. THÔNG TIN CÁ NHÂN & LIÊN HỆ */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <User className="size-4 text-blue-600" /> Thông tin Định danh & Liên hệ
              </h3>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-1">
                  <Label className="text-xs font-bold text-slate-700">
                    Họ và tên Môi giới <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="VD: Nguyễn Văn Nam"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-10 text-xs bg-slate-50 border-slate-200 font-semibold"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <Label className="text-xs font-bold text-slate-700">
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    <Input
                      placeholder="VD: 0914 888 999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="pl-8 h-10 text-xs bg-slate-50 border-slate-200 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <Label className="text-xs font-bold text-slate-700">
                    Email liên hệ <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="VD: nam.nguyen@horizon.vn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-8 h-10 text-xs bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Avatar selection & preview */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="size-3.5 text-blue-600" /> Ảnh đại diện (Avatar)
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleLocalFile(e, setAvatar, "đại diện")}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-7 text-[11px] border-slate-200 text-slate-700 flex items-center gap-1"
                    >
                      <Upload className="size-3" /> Tải ảnh từ máy
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={avatar}
                    alt="Preview"
                    className="size-14 rounded-full object-cover border-2 border-slate-200 shadow-sm shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Nhập đường dẫn URL ảnh hoặc chọn mẫu bên dưới..."
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      className="h-9 text-xs bg-slate-50 border-slate-200"
                    />
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">Mẫu nhanh:</span>
                      {PRESET_AVATARS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatar(p.url)}
                          className={`size-7 rounded-full overflow-hidden border-2 transition-all shrink-0 ${
                            avatar === p.url
                              ? "border-blue-600 scale-110 shadow-sm ring-2 ring-blue-200"
                              : "border-transparent opacity-75 hover:opacity-100 hover:scale-105"
                          }`}
                          title={p.label}
                        >
                          <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. SECTION MỚI: XÁC THỰC DANH TÍNH (CCCD / ĐỊNH DANH) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                    <CreditCard className="size-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Xác thực Danh tính (CCCD / Định danh)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Căn cước công dân gắn chip hoặc hộ chiếu phục vụ đối soát pháp lý
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-cyan-50/70 text-cyan-700 border-cyan-200 text-[10px] font-semibold">
                  Định danh cá nhân
                </Badge>
              </div>

              {/* Input grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Số CCCD / CMND */}
                <div className="space-y-1.5 sm:col-span-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-slate-700">
                      Số CCCD / CMND <span className="text-red-500">*</span>
                    </Label>
                    {idCardNumber && (
                      <span
                        className={`text-[10px] font-semibold ${
                          idCardNumber.length === 12 ? "text-emerald-600" : "text-amber-600"
                        }`}
                      >
                        {idCardNumber.length}/12 số
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    <Input
                      placeholder="VD: 048092008765"
                      value={idCardNumber}
                      maxLength={12}
                      onChange={(e) => setIdCardNumber(e.target.value.replace(/\D/g, ""))}
                      className="pl-8 h-10 text-xs bg-slate-50 border-slate-200 font-mono font-semibold"
                    />
                  </div>
                </div>

                {/* Ngày cấp */}
                <div className="space-y-1.5 sm:col-span-1">
                  <Label className="text-xs font-bold text-slate-700">Ngày cấp</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    <Input
                      type="date"
                      value={idCardDate}
                      onChange={(e) => setIdCardDate(e.target.value)}
                      className="pl-8 h-10 text-xs bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>

                {/* Nơi cấp */}
                <div className="space-y-1.5 sm:col-span-1">
                  <Label className="text-xs font-bold text-slate-700">Nơi cấp</Label>
                  <Input
                    placeholder="Cục Cảnh sát QLHC về TTXH"
                    value={idCardPlace}
                    onChange={(e) => setIdCardPlace(e.target.value)}
                    className="h-10 text-xs bg-slate-50 border-slate-200"
                  />
                </div>

                {/* Quốc tịch */}
                <div className="space-y-1.5 sm:col-span-1">
                  <Label className="text-xs font-bold text-slate-700">Quốc tịch</Label>
                  <Input
                    placeholder="Việt Nam"
                    value={idCardNationality}
                    onChange={(e) => setIdCardNationality(e.target.value)}
                    className="h-10 text-xs bg-slate-50 border-slate-200 font-medium"
                  />
                </div>
              </div>

              {/* Upload 2 mặt CCCD song song */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <Label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="size-3.5 text-cyan-600" /> Ảnh chụp 2 mặt Căn cước công dân (Mặt trước & Mặt sau)
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">Hỗ trợ định dạng JPG, PNG, WEBP</span>
                </Label>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Ô 1: Mặt trước CCCD */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <CreditCard className="size-3.5 text-blue-600" /> Ảnh CCCD mặt trước
                      </span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="file"
                          ref={cccdFrontInputRef}
                          onChange={(e) => handleLocalFile(e, setIdCardFrontUrl, "CCCD mặt trước")}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => setIdCardFrontUrl(PRESET_DOCUMENTS.idCardFront)}
                          className="text-[11px] text-blue-600 hover:underline font-medium"
                        >
                          Dùng mẫu
                        </button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => cccdFrontInputRef.current?.click()}
                          className="h-6.5 text-[10px] px-2 border-slate-200 text-slate-700"
                        >
                          <Upload className="size-2.5 mr-1" /> Chọn file
                        </Button>
                      </div>
                    </div>

                    {/* Preview box */}
                    <div className="relative aspect-[16/10] rounded-lg border border-slate-200 bg-white overflow-hidden flex items-center justify-center group">
                      {idCardFrontUrl ? (
                        <>
                          <img
                            src={idCardFrontUrl}
                            alt="CCCD mặt trước"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <a
                              href={idCardFrontUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="size-7 rounded-full bg-white/90 text-slate-800 flex items-center justify-center shadow-xs hover:bg-white"
                              title="Xem ảnh gốc"
                            >
                              <Eye className="size-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => setIdCardFrontUrl("")}
                              className="size-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs hover:bg-red-700"
                              title="Gỡ ảnh"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div
                          onClick={() => cccdFrontInputRef.current?.click()}
                          className="flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-slate-50/80 transition-colors w-full h-full"
                        >
                          <CreditCard className="size-7 text-slate-300 mb-1" />
                          <span className="text-xs font-semibold text-slate-600">Mặt trước CCCD</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">Nhấn để chọn ảnh từ máy tính</span>
                        </div>
                      )}
                    </div>

                    <Input
                      placeholder="Hoặc dán URL ảnh mặt trước..."
                      value={idCardFrontUrl}
                      onChange={(e) => setIdCardFrontUrl(e.target.value)}
                      className="h-7.5 text-[11px] bg-white border-slate-200"
                    />
                  </div>

                  {/* Ô 2: Mặt sau CCCD */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <CreditCard className="size-3.5 text-blue-600" /> Ảnh CCCD mặt sau
                      </span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="file"
                          ref={cccdBackInputRef}
                          onChange={(e) => handleLocalFile(e, setIdCardBackUrl, "CCCD mặt sau")}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => setIdCardBackUrl(PRESET_DOCUMENTS.idCardBack)}
                          className="text-[11px] text-blue-600 hover:underline font-medium"
                        >
                          Dùng mẫu
                        </button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => cccdBackInputRef.current?.click()}
                          className="h-6.5 text-[10px] px-2 border-slate-200 text-slate-700"
                        >
                          <Upload className="size-2.5 mr-1" /> Chọn file
                        </Button>
                      </div>
                    </div>

                    {/* Preview box */}
                    <div className="relative aspect-[16/10] rounded-lg border border-slate-200 bg-white overflow-hidden flex items-center justify-center group">
                      {idCardBackUrl ? (
                        <>
                          <img
                            src={idCardBackUrl}
                            alt="CCCD mặt sau"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <a
                              href={idCardBackUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="size-7 rounded-full bg-white/90 text-slate-800 flex items-center justify-center shadow-xs hover:bg-white"
                              title="Xem ảnh gốc"
                            >
                              <Eye className="size-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => setIdCardBackUrl("")}
                              className="size-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs hover:bg-red-700"
                              title="Gỡ ảnh"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div
                          onClick={() => cccdBackInputRef.current?.click()}
                          className="flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-slate-50/80 transition-colors w-full h-full"
                        >
                          <CreditCard className="size-7 text-slate-300 mb-1" />
                          <span className="text-xs font-semibold text-slate-600">Mặt sau CCCD</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">Nhấn để chọn ảnh từ máy tính</span>
                        </div>
                      )}
                    </div>

                    <Input
                      placeholder="Hoặc dán URL ảnh mặt sau..."
                      value={idCardBackUrl}
                      onChange={(e) => setIdCardBackUrl(e.target.value)}
                      className="h-7.5 text-[11px] bg-white border-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. SECTION MỚI: CHỨNG CHỈ HÀNH NGHỀ MÔI GIỚI BĐS */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Award className="size-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Chứng chỉ Hành nghề Môi giới BĐS
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Chứng chỉ do Sở Xây dựng cấp theo quy định của Luật Kinh doanh BĐS
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-teal-50/70 text-teal-700 border-teal-200 text-[10px] font-semibold">
                  Chuẩn Sở Xây dựng
                </Badge>
              </div>

              {/* Form fields theo chuẩn Sở Xây dựng */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Số chứng chỉ */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">
                    Số chứng chỉ hành nghề <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <FileBadge className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    <Input
                      placeholder="VD: ĐN-02849"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
                      className="pl-8 h-10 text-xs bg-slate-50 border-slate-200 font-mono font-bold text-teal-700"
                    />
                  </div>
                </div>

                {/* Đơn vị cấp */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Đơn vị cấp</Label>
                  <Input
                    placeholder="Sở Xây dựng TP. Đà Nẵng"
                    value={licenseIssuer}
                    onChange={(e) => setLicenseIssuer(e.target.value)}
                    className="h-10 text-xs bg-slate-50 border-slate-200 font-medium"
                  />
                </div>

                {/* Ngày cấp chứng chỉ */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Ngày cấp chứng chỉ</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    <Input
                      type="date"
                      value={licenseIssueDate}
                      onChange={(e) => handleLicenseIssueDateChange(e.target.value)}
                      className="pl-8 h-10 text-xs bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>

                {/* Thời hạn chứng chỉ */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-slate-700">Ngày hết hạn</Label>
                    <span className="text-[10px] text-teal-600 font-semibold">(05 năm)</span>
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    <Input
                      type="date"
                      value={licenseExpiryDate}
                      onChange={(e) => setLicenseExpiryDate(e.target.value)}
                      className="pl-8 h-10 text-xs bg-slate-50 border-slate-200 font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Upload ảnh Chứng chỉ hành nghề */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileCheck className="size-3.5 text-teal-600" /> Ảnh chụp Chứng chỉ hành nghề Môi giới BĐS
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={licenseInputRef}
                      onChange={(e) => handleLocalFile(e, setLicenseImageUrl, "chứng chỉ")}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setLicenseImageUrl(PRESET_DOCUMENTS.licenseImage)}
                      className="text-[11px] text-teal-600 hover:underline font-medium"
                    >
                      Dùng mẫu
                    </button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => licenseInputRef.current?.click()}
                      className="h-7 text-[11px] border-slate-200 text-slate-700 flex items-center gap-1"
                    >
                      <Upload className="size-3" /> Tải ảnh chứng chỉ từ máy
                    </Button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                  <div className="relative aspect-[21/9] sm:aspect-[24/9] rounded-lg border border-slate-200 bg-white overflow-hidden flex items-center justify-center group">
                    {licenseImageUrl ? (
                      <>
                        <img
                          src={licenseImageUrl}
                          alt="Chứng chỉ hành nghề"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <a
                            href={licenseImageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="size-8 rounded-full bg-white/90 text-slate-800 flex items-center justify-center shadow-xs hover:bg-white"
                            title="Xem kích thước đầy đủ"
                          >
                            <Eye className="size-4" />
                          </a>
                          <button
                            type="button"
                            onClick={() => setLicenseImageUrl("")}
                            className="size-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs hover:bg-red-700"
                            title="Gỡ ảnh chứng chỉ"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div
                        onClick={() => licenseInputRef.current?.click()}
                        className="flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-slate-50/80 transition-colors w-full h-full"
                      >
                        <Award className="size-8 text-slate-300 mb-1" />
                        <span className="text-xs font-semibold text-slate-600">
                          Ảnh chụp Giấy chứng nhận / Chứng chỉ hành nghề
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          Nhấn vào đây để tải file ảnh từ máy tính hoặc dán link bên dưới
                        </span>
                      </div>
                    )}
                  </div>

                  <Input
                    placeholder="Hoặc dán URL hình ảnh chứng chỉ hành nghề..."
                    value={licenseImageUrl}
                    onChange={(e) => setLicenseImageUrl(e.target.value)}
                    className="h-8 text-xs bg-white border-slate-200"
                  />
                </div>
              </div>

              {/* TRẠNG THÁI XÁC THỰC (ADMIN VERIFICATION SELECTOR) */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-700">
                    Trạng thái Xác thực Hồ sơ Môi giới
                  </Label>
                  <span className="text-[11px] text-slate-400">
                    Quyết định hiển thị huy hiệu Tick Xanh trên toàn bộ website
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  {/* Verified */}
                  <div
                    onClick={() => {
                      setVerificationStatus("verified");
                      setIsVerified(true);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      verificationStatus === "verified"
                        ? "bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs"
                        : "bg-white border-slate-200/80 hover:bg-slate-50"
                    }`}
                  >
                    <div className="mt-0.5 size-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <BadgeCheck className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-emerald-950">Đã xác thực / Verified</div>
                      <div className="text-[11px] text-emerald-700/80">Cấp Tick Xanh chính chủ, ưu tiên hiển thị</div>
                    </div>
                  </div>

                  {/* Pending */}
                  <div
                    onClick={() => {
                      setVerificationStatus("pending");
                      setIsVerified(false);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      verificationStatus === "pending"
                        ? "bg-amber-50/90 border-amber-300 ring-2 ring-amber-500/20 shadow-xs"
                        : "bg-white border-slate-200/80 hover:bg-slate-50"
                    }`}
                  >
                    <div className="mt-0.5 size-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Clock className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-amber-950">Chờ duyệt hồ sơ</div>
                      <div className="text-[11px] text-amber-700/80">Đã nộp CCCD/Chứng chỉ, chờ kiểm tra</div>
                    </div>
                  </div>

                  {/* Unverified */}
                  <div
                    onClick={() => {
                      setVerificationStatus("unverified");
                      setIsVerified(false);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      verificationStatus === "unverified"
                        ? "bg-slate-100 border-slate-300 ring-2 ring-slate-400/20 shadow-xs"
                        : "bg-white border-slate-200/80 hover:bg-slate-50"
                    }`}
                  >
                    <div className="mt-0.5 size-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                      <AlertCircle className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800">Chưa xác thực</div>
                      <div className="text-[11px] text-slate-500">Chưa nộp hoặc hồ sơ chưa đạt chuẩn</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. KHU VỰC, KINH NGHIỆM & CHUYÊN MÔN */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <MapPin className="size-4 text-teal-600" /> Khu vực & Hồ sơ Năng lực
              </h3>

              <div className="grid sm:grid-cols-3 gap-4">
                {/* Khu vực */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Khu vực hoạt động</Label>
                  <Select value={district} onValueChange={(val) => setDistrict(val)}>
                    <SelectTrigger className="h-10 text-xs bg-slate-50 border-slate-200 font-medium">
                      <SelectValue placeholder="Chọn quận huyện" />
                    </SelectTrigger>
                    <SelectContent>
                      {DISTRICT_OPTIONS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Số năm kinh nghiệm */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Số năm kinh nghiệm</Label>
                  <Input
                    type="number"
                    min={0}
                    max={40}
                    value={yearsExp}
                    onChange={(e) => setYearsExp(Number(e.target.value))}
                    className="h-10 text-xs bg-slate-50 border-slate-200 font-semibold"
                  />
                </div>

                {/* Đánh giá sao */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-slate-700">Đánh giá & Lượt review</Label>
                    <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                      <Star className="size-3 fill-amber-500 text-amber-500" /> {rating} ({reviews})
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      min={1}
                      max={5}
                      placeholder="Sao (1-5)"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="h-10 text-xs bg-slate-50 border-slate-200"
                    />
                    <Input
                      type="number"
                      min={0}
                      placeholder="Lượt review"
                      value={reviews}
                      onChange={(e) => setReviews(Number(e.target.value))}
                      className="h-10 text-xs bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Chuyên môn tags */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <Label className="text-xs font-bold text-slate-700">Chuyên môn BĐS nổi bật</Label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_SPECIALTIES.map((spec) => {
                    const active = specialties.includes(spec);
                    return (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => handleToggleSpecialty(spec)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                          active
                            ? "bg-teal-50 border-teal-300 text-teal-800 font-semibold shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {active && <Check className="inline-block size-3 mr-1 text-teal-600" />}
                        {spec}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Input
                    placeholder="Thêm chuyên môn tùy chỉnh..."
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomTag();
                      }
                    }}
                    className="h-8 text-xs bg-slate-50 border-slate-200 flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddCustomTag}
                    className="h-8 text-xs bg-slate-200 text-slate-800 hover:bg-slate-300"
                  >
                    <Plus className="size-3.5 mr-1" /> Thêm
                  </Button>
                </div>
              </div>
            </div>

            {/* 5. GÓI HỘI VIÊN, TICK XANH & TRẠNG THÁI */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <Award className="size-4 text-purple-600" /> Gói cước Hội viên & Quyền hạn
              </h3>

              <div className="grid sm:grid-cols-3 gap-4">
                {/* Gói cước */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Gói hội viên Môi giới</Label>
                  <Select
                    value={activePlan}
                    onValueChange={(val: BrokerPlanType) => handlePlanChange(val)}
                  >
                    <SelectTrigger className="h-10 text-xs bg-slate-50 border-slate-200 font-semibold">
                      <SelectValue placeholder="Chọn gói cước" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">
                        <span className="text-slate-700">Gói Cơ Bản (Miễn phí)</span>
                      </SelectItem>
                      <SelectItem value="pro">
                        <span className="text-blue-700 font-bold">Gói PRO Broker (500k/tháng)</span>
                      </SelectItem>
                      <SelectItem value="vip">
                        <span className="text-purple-700 font-bold">Gói VIP Broker (1.2tr/tháng)</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Hạn gói cước */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Ngày hết hạn gói</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    <Input
                      type="date"
                      value={planExpiry}
                      onChange={(e) => setPlanExpiry(e.target.value)}
                      disabled={activePlan === "free"}
                      className="pl-8 h-10 text-xs bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>

                {/* Số tin đăng */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Số tin đăng khả dụng</Label>
                  <Input
                    type="number"
                    min={0}
                    value={remainingPosts}
                    onChange={(e) => setRemainingPosts(Number(e.target.value))}
                    className="h-10 text-xs bg-slate-50 border-slate-200 font-bold text-blue-600"
                  />
                </div>
              </div>

              {/* Toggles: Tick Xanh & Status */}
              <div className="pt-3 border-t border-slate-100 grid sm:grid-cols-2 gap-4">
                {/* Tick Xanh */}
                <div className="flex items-center justify-between p-3.5 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                      <BadgeCheck className="size-4 text-blue-600 fill-blue-100" />
                      Xác thực Tick Xanh chính chủ
                    </div>
                    <p className="text-[11px] text-blue-600/80">
                      Hiển thị huy hiệu uy tín trên toàn bộ tin đăng và trang danh bạ
                    </p>
                  </div>
                  <Switch
                    checked={isVerified}
                    onCheckedChange={(checked) => {
                      setIsVerified(checked);
                      setVerificationStatus(checked ? "verified" : "unverified");
                    }}
                  />
                </div>

                {/* Trạng thái hoạt động */}
                <div
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                    status === "active"
                      ? "bg-emerald-50/50 border-emerald-100"
                      : "bg-red-50/50 border-red-100"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div
                      className={`text-xs font-bold flex items-center gap-1.5 ${
                        status === "active" ? "text-emerald-900" : "text-red-900"
                      }`}
                    >
                      {status === "active" ? (
                        <>
                          <UserCheck className="size-4 text-emerald-600" /> Hoạt động bình thường
                        </>
                      ) : (
                        <>
                          <Lock className="size-4 text-red-600" /> Tạm khóa tài khoản
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {status === "active"
                        ? "Môi giới có thể đăng tin và xuất hiện trên website"
                        : "Tài khoản bị vô hiệu hóa quyền đăng tin"}
                    </p>
                  </div>
                  <Switch
                    checked={status === "active"}
                    onCheckedChange={(checked) => setStatus(checked ? "active" : "locked")}
                  />
                </div>
              </div>
            </div>

            {/* STICKY BOTTOM ACTION BAR */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-xs font-semibold border-slate-200 text-slate-600 hover:bg-slate-100 h-10 px-4"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 px-6 h-10 flex items-center gap-2"
              >
                <Save className="size-4" />
                {saving ? "Đang lưu..." : isEdit ? "Lưu thay đổi hồ sơ" : "Hoàn tất tạo Môi giới"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BrokerEditorModal;
