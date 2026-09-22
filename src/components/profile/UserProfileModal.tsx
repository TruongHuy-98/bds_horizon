import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  ShieldCheck,
  Building2,
  Award,
  Upload,
  Camera,
  Check,
  Plus,
  X,
  CreditCard,
  FileCheck,
  Copy,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  QrCode,
  Sparkles,
  AlertCircle,
  Save,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { UserAccount } from "@/data/mockUsersData";

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

const VIETNAM_BANKS = [
  "Vietcombank",
  "MB Bank",
  "Techcombank",
  "BIDV",
  "Agribank",
  "VPBank",
  "ACB",
  "TPBank",
  "Sacombank",
  "OCB",
  "VIB",
  "HDBank",
];

export function UserProfileModal() {
  const {
    isProfileModalOpen,
    closeProfileModal,
    profile,
    role,
    updateProfile,
    switchMockRole,
  } = useAuth();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0].url);

  // Broker states
  const [district, setDistrict] = useState("Hải Châu");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [yearsExp, setYearsExp] = useState(3);
  const [idCardNumber, setIdCardNumber] = useState("");
  const [idCardDate, setIdCardDate] = useState("");
  const [idCardPlace, setIdCardPlace] = useState("");
  const [idCardFrontUrl, setIdCardFrontUrl] = useState<string | undefined>();
  const [idCardBackUrl, setIdCardBackUrl] = useState<string | undefined>();
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseIssuer, setLicenseIssuer] = useState("");
  const [licenseIssueDate, setLicenseIssueDate] = useState("");
  const [licenseExpiryDate, setLicenseExpiryDate] = useState("");
  const [licenseImageUrl, setLicenseImageUrl] = useState<string | undefined>();
  const [verificationStatus, setVerificationStatus] = useState<
    "verified" | "pending" | "unverified"
  >("unverified");

  // CTV states
  const [bankName, setBankName] = useState("Vietcombank");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountHolder, setBankAccountHolder] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [taxCode, setTaxCode] = useState("");

  // Admin states
  const [adminTitle, setAdminTitle] = useState("");
  const [adminDepartment, setAdminDepartment] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [saving, setSaving] = useState(false);

  // Refs for file uploads
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const idFrontInputRef = useRef<HTMLInputElement>(null);
  const idBackInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);

  // Populate data when modal opens or profile changes
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setAvatar(profile.avatar || PRESET_AVATARS[0].url);

      // Broker
      setDistrict(profile.district || "Hải Châu");
      setSpecialties(profile.specialties || ["Căn hộ cao cấp", "Hải Châu"]);
      setYearsExp(profile.yearsExp || profile.yearsExperience || 3);
      setIdCardNumber(profile.id_card_number || "");
      setIdCardDate(profile.id_card_date || "2021-07-15");
      setIdCardPlace(profile.id_card_place || "Cục Cảnh sát QLHC về TTXH");
      setIdCardFrontUrl(profile.id_card_front_url);
      setIdCardBackUrl(profile.id_card_back_url);
      setLicenseNumber(profile.license_number || "");
      setLicenseIssuer(profile.license_issuer || "Sở Xây dựng TP. Đà Nẵng");
      setLicenseIssueDate(profile.license_issue_date || "2022-04-15");
      setLicenseExpiryDate(profile.license_expiry_date || "2027-04-15");
      setLicenseImageUrl(profile.license_image_url);
      setVerificationStatus(
        profile.verification_status ||
          (profile.isVerified ? "verified" : "unverified"),
      );

      // CTV
      setBankName(profile.bank_name || "Vietcombank");
      setBankAccountNumber(profile.bank_account_number || "");
      setBankAccountHolder(profile.bank_account_holder || "");
      setReferralCode(
        profile.referral_code ||
          `CTV-${profile.id?.replace("usr-", "").toUpperCase() || "HORIZON-88"}`,
      );
      setTaxCode(profile.tax_code || "");

      // Admin
      setAdminTitle(profile.admin_title || "Quản trị viên Cấp cao");
      setAdminDepartment(
        profile.admin_department || "Ban Điều Hành & Quản Trị Hệ Thống",
      );
      setTwoFactorEnabled(profile.two_factor_enabled ?? true);
    }
  }, [profile, isProfileModalOpen]);

  // Handle avatar file upload
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Ảnh quá lớn. Vui lòng chọn ảnh dưới 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
        toast.success("Đã tải ảnh đại diện lên thành công!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Generic document image upload
  const handleDocFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
    name: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Ảnh quá lớn. Vui lòng chọn ảnh dưới 4MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setter(reader.result);
        toast.success(`Đã tải ảnh ${name} thành công!`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Toggle specialty tag
  const toggleSpecialty = (tag: string) => {
    if (specialties.includes(tag)) {
      setSpecialties(specialties.filter((s) => s !== tag));
    } else {
      setSpecialties([...specialties, tag]);
    }
  };

  const addCustomSpecialty = () => {
    const trimmed = customTag.trim();
    if (trimmed && !specialties.includes(trimmed)) {
      setSpecialties([...specialties, trimmed]);
      setCustomTag("");
    }
  };

  // Auto calculate 5 years license expiry
  const handleIssueDateChange = (newDate: string) => {
    setLicenseIssueDate(newDate);
    if (newDate) {
      try {
        const d = new Date(newDate);
        d.setFullYear(d.getFullYear() + 5);
        setLicenseExpiryDate(d.toISOString().split("T")[0]);
      } catch {
        // ignore
      }
    }
  };

  // Request verification
  const handleRequestVerification = () => {
    setVerificationStatus("pending");
    toast.info("Đã gửi yêu cầu xác minh hồ sơ tới Ban Quản Trị BDS Horizon!");
  };

  // Copy referral link
  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/ref/${referralCode || "HORIZON"}`
      : `https://bdshorizon.vn/ref/${referralCode || "HORIZON"}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Đã sao chép đường link giới thiệu!");
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Đã sao chép mã giới thiệu!");
  };

  // Save changes
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập Họ và tên.");
      return;
    }

    setSaving(true);
    const updatedData: Partial<UserAccount> = {
      name: name.trim(),
      phone: phone.trim(),
      avatar,
      // Broker fields
      district,
      specialties,
      yearsExp,
      id_card_number: idCardNumber,
      id_card_date: idCardDate,
      id_card_place: idCardPlace,
      id_card_front_url: idCardFrontUrl,
      id_card_back_url: idCardBackUrl,
      license_number: licenseNumber,
      license_issuer: licenseIssuer,
      license_issue_date: licenseIssueDate,
      license_expiry_date: licenseExpiryDate,
      license_image_url: licenseImageUrl,
      verification_status: verificationStatus,
      isVerified: verificationStatus === "verified",
      // CTV fields
      bank_name: bankName,
      bank_account_number: bankAccountNumber,
      bank_account_holder: bankAccountHolder.toUpperCase(),
      referral_code: referralCode,
      tax_code: taxCode,
      // Admin fields
      admin_title: adminTitle,
      admin_department: adminDepartment,
      two_factor_enabled: twoFactorEnabled,
    };

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
        setSaving(false);
        return;
      }
      toast.success("Mật khẩu tài khoản đã được cập nhật!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }

    const success = await updateProfile(updatedData);
    setSaving(false);

    if (success) {
      toast.success("Cập nhật hồ sơ cá nhân thành công!");
      closeProfileModal();
    } else {
      toast.error("Không thể lưu thông tin hồ sơ. Vui lòng thử lại!");
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case "admin":
        return {
          title: "Quản trị viên",
          color: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300",
          icon: ShieldCheck,
        };
      case "broker":
        return {
          title: "Môi giới BĐS",
          color: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300",
          icon: Building2,
        };
      case "collaborator":
        return {
          title: "Cộng tác viên",
          color: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300",
          icon: Award,
        };
      default:
        return {
          title: "Thành viên",
          color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300",
          icon: User,
        };
    }
  };

  const roleMeta = getRoleLabel();
  const RoleIcon = roleMeta.icon;

  return (
    <Dialog open={isProfileModalOpen} onOpenChange={(open) => !open && closeProfileModal()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl bg-card border-border shadow-2xl">
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 pb-7 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-foreground shadow-inner">
                <RoleIcon className="size-6 text-teal-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Cập nhật Hồ sơ Cá nhân</span>
                  <Badge variant="outline" className={`text-xs px-2 py-0.5 border ${roleMeta.color}`}>
                    {roleMeta.title}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-300 mt-1">
                  Quản lý thông tin tài khoản và xác minh danh tính trên BDS Horizon
                </DialogDescription>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body with Tabs */}
        <div className="p-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6 bg-muted/60 p-1 rounded-xl">
              <TabsTrigger value="general" className="rounded-lg text-xs font-semibold py-2">
                <User className="size-3.5 mr-1.5 inline-block" />
                Thông tin chung
              </TabsTrigger>

              <TabsTrigger value="role-info" className="rounded-lg text-xs font-semibold py-2">
                <RoleIcon className="size-3.5 mr-1.5 inline-block" />
                {role === "broker"
                  ? "Nghiệp vụ Môi giới"
                  : role === "collaborator"
                  ? "Ngân hàng & Hoa hồng"
                  : role === "admin"
                  ? "Quản trị hệ thống"
                  : "Quyền lợi thành viên"}
              </TabsTrigger>

              <TabsTrigger value="security" className="rounded-lg text-xs font-semibold py-2">
                <Lock className="size-3.5 mr-1.5 inline-block" />
                Bảo mật & 2FA
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: THÔNG TIN CHUNG */}
            <TabsContent value="general" className="space-y-6 focus:outline-none">
              {/* Avatar Section */}
              <div className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Camera className="size-3.5 text-primary" />
                  Ảnh đại diện (Avatar)
                </Label>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Avatar Preview */}
                  <div className="relative group">
                    <Avatar className="size-24 ring-4 ring-primary/20 shadow-md">
                      <AvatarImage src={avatar} alt={name} className="object-cover" />
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xl">
                        {name.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-medium backdrop-blur-xs"
                      title="Tải ảnh mới từ máy tính"
                    >
                      <Camera className="size-5 mb-0.5" />
                      Đổi ảnh
                    </button>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarFileUpload}
                    />
                  </div>

                  {/* Actions & Studio Presets */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => avatarInputRef.current?.click()}
                        className="text-xs font-medium h-8 gap-1.5 border-dashed"
                      >
                        <Upload className="size-3.5" />
                        Tải ảnh từ máy tính (Dưới 3MB)
                      </Button>
                      <span className="text-xs text-muted-foreground">hoặc chọn avatar studio:</span>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                      {PRESET_AVATARS.map((p, idx) => {
                        const isSelected = avatar === p.url;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAvatar(p.url)}
                            className={`relative rounded-full aspect-square overflow-hidden ring-2 transition-all ${
                              isSelected
                                ? "ring-primary ring-offset-2 scale-105"
                                : "ring-transparent opacity-75 hover:opacity-100"
                            }`}
                            title={p.label}
                          >
                            <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                                <Check className="size-3.5 text-white font-bold" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="prof-name" className="text-xs font-semibold">
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="prof-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="h-10 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prof-phone" className="text-xs font-semibold">
                    Số điện thoại liên hệ
                  </Label>
                  <Input
                    id="prof-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="h-10 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prof-email" className="text-xs font-semibold flex items-center justify-between">
                    <span>Địa chỉ Email</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Đã liên kết tài khoản</span>
                  </Label>
                  <Input
                    id="prof-email"
                    value={email}
                    disabled
                    className="h-10 text-sm bg-muted/50 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Vai trò tài khoản</Label>
                  <div className="h-10 flex items-center justify-between px-3 rounded-md border border-input bg-muted/30">
                    <div className="flex items-center gap-2">
                      <RoleIcon className="size-4 text-primary" />
                      <span className="text-sm font-semibold">{roleMeta.title}</span>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${roleMeta.color}`}>
                      Đang hoạt động
                    </Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: ROLE-SPECIFIC INFO */}
            <TabsContent value="role-info" className="space-y-6 focus:outline-none">
              {/* 1. MÔI GIỚI (BROKER) */}
              {role === "broker" && (
                <div className="space-y-6">
                  {/* Verification Status Banner */}
                  <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                        {verificationStatus === "verified" ? (
                          <CheckCircle2 className="size-6 text-emerald-500" />
                        ) : verificationStatus === "pending" ? (
                          <Clock className="size-6 text-amber-500" />
                        ) : (
                          <AlertCircle className="size-6 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">Trạng thái xác minh chứng chỉ</span>
                          {verificationStatus === "verified" ? (
                            <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 text-[10px] px-2">
                              ✓ Đã xác minh (Tích xanh)
                            </Badge>
                          ) : verificationStatus === "pending" ? (
                            <Badge className="bg-amber-500 text-white hover:bg-amber-500 text-[10px] px-2">
                              Đang chờ duyệt
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px] px-2">
                              Chưa xác minh
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {verificationStatus === "verified"
                            ? "Hồ sơ của bạn đã được chứng nhận môi giới chính thức trên BDS Horizon."
                            : "Gửi ảnh CCCD và Chứng chỉ hành nghề để nhận tích xanh uy tín."}
                        </p>
                      </div>
                    </div>

                    {verificationStatus !== "verified" && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleRequestVerification}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 shrink-0"
                      >
                        Gửi yêu cầu duyệt
                      </Button>
                    )}
                  </div>

                  {/* Operational Area & Experience */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Khu vực hoạt động chính</Label>
                      <Select value={district} onValueChange={setDistrict}>
                        <SelectTrigger className="h-10 text-sm">
                          <SelectValue placeholder="Chọn quận/huyện" />
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

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Kinh nghiệm môi giới (Năm)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={40}
                        value={yearsExp}
                        onChange={(e) => setYearsExp(Number(e.target.value) || 0)}
                        className="h-10 text-sm"
                      />
                    </div>
                  </div>

                  {/* Specialties Tags */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold flex items-center justify-between">
                      <span>Lĩnh vực & Phân khúc chuyên môn</span>
                      <span className="text-[10px] text-muted-foreground">Bấm để chọn/bỏ chọn</span>
                    </Label>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_SPECIALTIES.map((tag) => {
                        const isSelected = specialties.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleSpecialty(tag)}
                            className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary font-medium"
                                : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                            }`}
                          >
                            {isSelected && <Check className="size-3 inline-block mr-1" />}
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                    {/* Add Custom Tag */}
                    <div className="flex items-center gap-2 pt-1">
                      <Input
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSpecialty())}
                        placeholder="Thêm phân khúc khác (Enter để thêm)..."
                        className="h-8 text-xs max-w-xs"
                      />
                      <Button type="button" size="sm" variant="outline" onClick={addCustomSpecialty} className="h-8 text-xs">
                        <Plus className="size-3 mr-1" /> Thêm
                      </Button>
                    </div>
                  </div>

                  {/* CCCD & Identification */}
                  <div className="space-y-3 pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <CreditCard className="size-4 text-primary" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Căn cước công dân (CCCD)
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Số CCCD (12 số)</Label>
                        <Input
                          value={idCardNumber}
                          onChange={(e) => setIdCardNumber(e.target.value)}
                          placeholder="048092008765"
                          className="h-9 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Ngày cấp</Label>
                        <Input
                          type="date"
                          value={idCardDate}
                          onChange={(e) => setIdCardDate(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Nơi cấp</Label>
                        <Input
                          value={idCardPlace}
                          onChange={(e) => setIdCardPlace(e.target.value)}
                          placeholder="Cục Cảnh sát QLHC về TTXH"
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>

                    {/* CCCD Photos Frames */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Mặt trước */}
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-medium text-muted-foreground">Ảnh CCCD Mặt trước</Label>
                        <div
                          onClick={() => idFrontInputRef.current?.click()}
                          className="relative h-28 rounded-xl border-2 border-dashed border-border hover:border-primary/60 bg-muted/20 cursor-pointer overflow-hidden flex flex-col items-center justify-center group transition-colors"
                        >
                          {idCardFrontUrl ? (
                            <>
                              <img src={idCardFrontUrl} alt="CCCD Mặt trước" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-1 font-medium">
                                <Camera className="size-4" /> Đổi ảnh
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-2 text-muted-foreground group-hover:text-primary">
                              <Upload className="size-5 mx-auto mb-1" />
                              <span className="text-xs">Tải ảnh mặt trước</span>
                            </div>
                          )}
                          <input
                            ref={idFrontInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleDocFileUpload(e, setIdCardFrontUrl, "CCCD Mặt trước")}
                          />
                        </div>
                      </div>

                      {/* Mặt sau */}
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-medium text-muted-foreground">Ảnh CCCD Mặt sau</Label>
                        <div
                          onClick={() => idBackInputRef.current?.click()}
                          className="relative h-28 rounded-xl border-2 border-dashed border-border hover:border-primary/60 bg-muted/20 cursor-pointer overflow-hidden flex flex-col items-center justify-center group transition-colors"
                        >
                          {idCardBackUrl ? (
                            <>
                              <img src={idCardBackUrl} alt="CCCD Mặt sau" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-1 font-medium">
                                <Camera className="size-4" /> Đổi ảnh
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-2 text-muted-foreground group-hover:text-primary">
                              <Upload className="size-5 mx-auto mb-1" />
                              <span className="text-xs">Tải ảnh mặt sau</span>
                            </div>
                          )}
                          <input
                            ref={idBackInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleDocFileUpload(e, setIdCardBackUrl, "CCCD Mặt sau")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chứng chỉ môi giới BĐS */}
                  <div className="space-y-3 pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <FileCheck className="size-4 text-teal-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Chứng chỉ hành nghề Môi giới BĐS
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Số chứng chỉ</Label>
                        <Input
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          placeholder="ĐN-02849"
                          className="h-9 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Cơ quan cấp</Label>
                        <Input
                          value={licenseIssuer}
                          onChange={(e) => setLicenseIssuer(e.target.value)}
                          placeholder="Sở Xây dựng TP. Đà Nẵng"
                          className="h-9 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Ngày cấp</Label>
                        <Input
                          type="date"
                          value={licenseIssueDate}
                          onChange={(e) => handleIssueDateChange(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground flex items-center justify-between">
                          <span>Ngày hết hạn</span>
                          <span className="text-[10px] text-teal-600 font-medium">(Thời hạn 5 năm)</span>
                        </Label>
                        <Input
                          type="date"
                          value={licenseExpiryDate}
                          onChange={(e) => setLicenseExpiryDate(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>

                    {/* License Image Frame */}
                    <div className="space-y-1.5 pt-1">
                      <Label className="text-[11px] font-medium text-muted-foreground">Ảnh chụp Chứng chỉ hành nghề</Label>
                      <div
                        onClick={() => licenseInputRef.current?.click()}
                        className="relative h-32 rounded-xl border-2 border-dashed border-border hover:border-teal-500/60 bg-muted/20 cursor-pointer overflow-hidden flex flex-col items-center justify-center group transition-colors"
                      >
                        {licenseImageUrl ? (
                          <>
                            <img src={licenseImageUrl} alt="Chứng chỉ BĐS" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-1 font-medium">
                              <Camera className="size-4" /> Đổi ảnh chứng chỉ
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-2 text-muted-foreground group-hover:text-teal-600">
                            <Upload className="size-5 mx-auto mb-1" />
                            <span className="text-xs">Tải ảnh chụp chứng chỉ hành nghề</span>
                          </div>
                        )}
                        <input
                          ref={licenseInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleDocFileUpload(e, setLicenseImageUrl, "Chứng chỉ hành nghề")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. CỘNG TÁC VIÊN (CTV) */}
              {role === "collaborator" && (
                <div className="space-y-6">
                  {/* Referral Code & Link Box */}
                  <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-amber-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                        Chương trình Giới thiệu Khách hàng & Hoa hồng
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Mã giới thiệu cá nhân</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={referralCode}
                            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                            className="h-10 text-sm font-mono font-bold tracking-wider uppercase bg-background"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={copyReferralCode}
                            className="shrink-0 h-10 w-10"
                            title="Sao chép mã"
                          >
                            <Copy className="size-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Đường link giới thiệu trực tiếp</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            readOnly
                            value={referralLink}
                            className="h-10 text-xs text-muted-foreground bg-background truncate"
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={copyReferralLink}
                            className="shrink-0 h-10 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs gap-1"
                          >
                            <Copy className="size-3.5" />
                            Sao chép
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank Account Info */}
                  <div className="space-y-4 pt-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="size-4 text-primary" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Tài khoản Ngân hàng nhận Hoa hồng
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Ngân hàng thụ hưởng</Label>
                        <Select value={bankName} onValueChange={setBankName}>
                          <SelectTrigger className="h-10 text-sm">
                            <SelectValue placeholder="Chọn ngân hàng" />
                          </SelectTrigger>
                          <SelectContent>
                            {VIETNAM_BANKS.map((b) => (
                              <SelectItem key={b} value={b}>
                                {b}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Số tài khoản ngân hàng</Label>
                        <Input
                          value={bankAccountNumber}
                          onChange={(e) => setBankAccountNumber(e.target.value)}
                          placeholder="0071001234567"
                          className="h-10 text-sm font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Chủ tài khoản (In hoa không dấu)</Label>
                        <Input
                          value={bankAccountHolder}
                          onChange={(e) => setBankAccountHolder(e.target.value.toUpperCase())}
                          placeholder="NGUYEN VAN A"
                          className="h-10 text-sm font-bold uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tax & CCCD for CTV */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Mã số thuế cá nhân (MST)</Label>
                      <Input
                        value={taxCode}
                        onChange={(e) => setTaxCode(e.target.value)}
                        placeholder="8392817291"
                        className="h-10 text-sm font-mono"
                      />
                      <p className="text-[10px] text-muted-foreground">
                        Dùng để khấu trừ thuế TNCN khi thanh toán hoa hồng theo quy định.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Số CCCD / Định danh cá nhân</Label>
                      <Input
                        value={idCardNumber}
                        onChange={(e) => setIdCardNumber(e.target.value)}
                        placeholder="048095006789"
                        className="h-10 text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. QUẢN TRỊ VIÊN (ADMIN) */}
              {role === "admin" && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/20 flex items-center gap-3">
                    <ShieldCheck className="size-8 text-purple-600 dark:text-purple-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Đặc quyền Quản trị viên Hệ thống</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Tài khoản có toàn quyền quản lý tin đăng BĐS, duyệt hồ sơ môi giới, quản lý đề thi và người dùng.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Chức danh / Vị trí quản lý</Label>
                      <Input
                        value={adminTitle}
                        onChange={(e) => setAdminTitle(e.target.value)}
                        placeholder="Quản trị viên Cấp cao"
                        className="h-10 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Phòng ban nội bộ</Label>
                      <Input
                        value={adminDepartment}
                        onChange={(e) => setAdminDepartment(e.target.value)}
                        placeholder="Ban Điều Hành & Quản Trị Hệ Thống"
                        className="h-10 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. THÀNH VIÊN (USER) */}
              {role === "user" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-muted/40 space-y-2">
                    <h4 className="text-sm font-bold text-foreground">Bạn đang là Thành viên Tiêu chuẩn</h4>
                    <p className="text-xs text-muted-foreground">
                      Bạn có thể tìm kiếm BĐS, tra cứu quy hoạch và làm bài thi thử chứng chỉ môi giới. Để đăng bài bán nhà đất hoặc hợp tác kinh doanh, hãy nâng cấp tài khoản:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                          <Building2 className="size-4" /> Nhà Môi Giới BĐS
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Đăng tin bán và cho thuê BĐS không giới hạn, xác minh chứng chỉ chuyên nghiệp và tiếp cận hàng ngàn khách hàng.
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          switchMockRole("broker");
                          toast.success("Đã nâng cấp tài khoản xem thử sang Nhà Môi Giới!");
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs"
                      >
                        Chuyển sang Môi giới <ArrowRight className="size-3.5 ml-1" />
                      </Button>
                    </div>

                    <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                          <Award className="size-4" /> Cộng Tác Viên (CTV)
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Nhận mã giới thiệu riêng, chia sẻ dự án BĐS Horizon và nhận hoa hồng hấp dẫn trực tiếp qua tài khoản ngân hàng.
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          switchMockRole("collaborator");
                          toast.success("Đã nâng cấp tài khoản xem thử sang Cộng Tác Viên!");
                        }}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs"
                      >
                        Chuyển sang CTV <ArrowRight className="size-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* TAB 3: BẢO MẬT & 2FA */}
            <TabsContent value="security" className="space-y-6 focus:outline-none">
              {/* Password Change */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="size-4 text-primary" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Đổi mật khẩu tài khoản
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Mật khẩu hiện tại</Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-10 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Mật khẩu mới</Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mật khẩu mới"
                      className="h-10 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Xác nhận mật khẩu mới</Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Xác nhận mật khẩu"
                      className="h-10 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* 2-Factor Authentication (2FA) */}
              <div className="pt-4 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <QrCode className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Xác thực hai yếu tố (2FA)</h4>
                      <p className="text-xs text-muted-foreground">
                        Bảo vệ tài khoản an toàn với Google Authenticator hoặc Authy
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>

                {twoFactorEnabled && (
                  <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50/40 dark:bg-teal-950/20 flex flex-col sm:flex-row items-center gap-4">
                    <div className="size-24 bg-white p-2 rounded-lg border border-teal-200 flex items-center justify-center shadow-xs shrink-0">
                      {/* SVG Mock QR Code */}
                      <svg viewBox="0 0 100 100" className="size-full">
                        <rect width="100" height="100" fill="white" />
                        <path
                          d="M10 10h30v30h-30z M60 10h30v30h-30z M10 60h30v30h-30z M18 18h14v14h-14z M68 18h14v14h-14z M18 68h14v14h-14z M45 10h10v20h-10z M45 45h20v10h-20z M70 45h20v20h-20z M45 70h10v20h-10z M70 80h20v10h-20z"
                          fill="#0F172A"
                        />
                      </svg>
                    </div>

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <p className="text-xs font-semibold text-foreground">
                        Quét mã QR bằng ứng dụng Google Authenticator trên điện thoại của bạn
                      </p>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-xs font-mono bg-background px-2.5 py-1 rounded border font-semibold">
                          HORIZON-ADMIN-2FA-7890
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText("HORIZON-ADMIN-2FA-7890");
                            toast.success("Đã sao chép mã khóa bí mật 2FA!");
                          }}
                          className="h-7 text-xs px-2"
                        >
                          <Copy className="size-3 mr-1" /> Chép mã
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 px-6 bg-muted/40 border-t border-border flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={closeProfileModal}
            disabled={saving}
            className="text-xs h-9"
          >
            Đóng
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-9 px-5 gap-2 shadow-sm"
          >
            {saving ? (
              <>
                <span className="size-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                Cập nhật hồ sơ
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
