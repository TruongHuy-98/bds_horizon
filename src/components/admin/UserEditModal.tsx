import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  UserCheck,
  ShieldAlert,
  Award,
  Calendar,
  PlusCircle,
  Lock,
  Unlock,
  BadgeCheck,
  Building2,
  User,
  Users,
  Shield,
  Sparkles,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { UserAccount, UserRole, BrokerPlanType, UserStatus } from "@/data/mockUsersData";
import { toast } from "sonner";

interface UserEditModalProps {
  open: boolean;
  onClose: () => void;
  user: UserAccount | null;
  onSave: (updatedUser: UserAccount) => void;
}

export function UserEditModal({ open, onClose, user, onSave }: UserEditModalProps) {
  const [saving, setSaving] = useState(false);

  const [role, setRole] = useState<UserRole>("user");
  const [isVerified, setIsVerified] = useState(false);
  const [remainingPosts, setRemainingPosts] = useState(5);
  const [addedPostsInput, setAddedPostsInput] = useState<string>("");
  const [activePlan, setActivePlan] = useState<BrokerPlanType>("free");
  const [planExpiry, setPlanExpiry] = useState<string>("");
  const [status, setStatus] = useState<UserStatus>("active");
  const [lockReason, setLockReason] = useState("");
  const [district, setDistrict] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) {
      setRole(user.role);
      setIsVerified(user.isVerified);
      setRemainingPosts(user.remainingPosts ?? 0);
      setAddedPostsInput("");
      setActivePlan(user.activePlan || "free");
      setPlanExpiry(user.planExpiry || "2026-12-31");
      setStatus(user.status || "active");
      setLockReason(user.lockReason || "");
      setDistrict(user.district || "");
      setPhone(user.phone || "");
    }
  }, [user, open]);

  if (!user) return null;

  const handleAddPostsQuick = (count: number) => {
    setRemainingPosts((prev) => prev + count);
    toast.success(`Đã cộng thêm +${count} tin đăng cho ${user.name}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let finalPosts = remainingPosts;
    if (addedPostsInput.trim() !== "") {
      const added = parseInt(addedPostsInput, 10);
      if (!isNaN(added)) {
        finalPosts += added;
      }
    }

    const updated: UserAccount = {
      ...user,
      role,
      isVerified,
      remainingPosts: finalPosts,
      activePlan,
      planExpiry: activePlan !== "free" ? planExpiry : undefined,
      status,
      lockReason: status === "locked" ? lockReason : undefined,
      district: role === "broker" ? district : user.district,
      phone,
    };

    setTimeout(() => {
      onSave(updated);
      setSaving(false);
      onClose();
      toast.success(`Cập nhật tài khoản ${user.name} thành công!`);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] flex flex-col p-0 gap-0 bg-slate-50 border-slate-200 overflow-hidden rounded-2xl shadow-2xl">
        
        {/* MODAL HEADER */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="size-8 text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="size-10 rounded-full object-cover border-2 border-slate-200 shadow-sm"
              />
              <div>
                <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  {user.name}
                  {isVerified && (
                    <BadgeCheck className="size-4 text-blue-600 fill-blue-100" />
                  )}
                </h2>
                <p className="text-xs text-slate-500">{user.email} · ID: {user.id}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-xs font-semibold border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/10 px-5"
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. THAY ĐỔI VAI TRÒ & XÁC THỰC MÔI GIỚI */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <Shield className="size-4 text-blue-600" /> Phân quyền & Vai trò Hệ thống
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Select Role */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">
                    Vai trò tài khoản (Role)
                  </Label>
                  <Select
                    value={role}
                    onValueChange={(val: UserRole) => setRole(val)}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200 text-sm font-medium">
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <span className="flex items-center gap-2 font-semibold text-purple-700">
                          👑 Admin (Quản trị viên)
                        </span>
                      </SelectItem>
                      <SelectItem value="broker">
                        <span className="flex items-center gap-2 font-semibold text-blue-700">
                          💎 Môi giới (Broker BĐS)
                        </span>
                      </SelectItem>
                      <SelectItem value="collaborator">
                        <span className="flex items-center gap-2 font-semibold text-amber-700">
                          🟧 Cộng tác viên (CTV Tin tức)
                        </span>
                      </SelectItem>
                      <SelectItem value="user">
                        <span className="flex items-center gap-2 text-slate-700">
                          👤 Khách hàng thông thường
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">Số điện thoại liên hệ</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-slate-50 border-slate-200 text-sm"
                  />
                </div>
              </div>

              {/* Blue Tick Identity Verification Toggle */}
              <div className="p-4 bg-gradient-to-r from-blue-50/80 to-teal-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-950">
                    <BadgeCheck className="size-4 text-blue-600 fill-blue-100" />
                    Xác minh danh tính (Blue Tick Verified)
                  </div>
                  <p className="text-xs text-slate-600">
                    Bật để hiển thị Huy hiệu xác minh trên trang Danh bạ Môi giới public (/moi-gioi)
                  </p>
                </div>
                <Switch
                  checked={isVerified}
                  onCheckedChange={setIsVerified}
                />
              </div>
            </div>

            {/* 2. QUẢN LÝ GÓI CƯỚC & SỐ DƯ TIN ĐĂNG */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <Award className="size-4 text-emerald-600" /> Quản lý Gói cước & Số dư tin đăng
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Member Plan */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">Gói thành viên Môi giới</Label>
                  <Select
                    value={activePlan}
                    onValueChange={(val: BrokerPlanType) => setActivePlan(val)}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200 text-sm font-medium">
                      <SelectValue placeholder="Chọn gói" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Gói Miễn Phí (Basic)</SelectItem>
                      <SelectItem value="pro">Gói Chuyên Nghiệp (PRO - 20 tin/tháng)</SelectItem>
                      <SelectItem value="vip">Gói VIP Broker (Không giới hạn)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Plan Expiry */}
                {activePlan !== "free" && (
                  <div className="space-y-2 animate-in fade-in">
                    <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-blue-600" /> Ngày hết hạn gói
                    </Label>
                    <Input
                      type="date"
                      value={planExpiry}
                      onChange={(e) => setPlanExpiry(e.target.value)}
                      className="bg-slate-50 border-slate-200 text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Remaining Posts & Quick Addition */}
              <div className="pt-2 space-y-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-700">
                    Số tin đăng còn lại trong tài khoản:
                  </Label>
                  <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {remainingPosts} tin
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Nhập số tin muốn cộng thêm (+10, +50)..."
                    value={addedPostsInput}
                    onChange={(e) => setAddedPostsInput(e.target.value)}
                    className="bg-slate-50 border-slate-200 text-xs flex-1"
                  />
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddPostsQuick(10)}
                      className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 font-semibold"
                    >
                      +10 tin
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddPostsQuick(50)}
                      className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 font-semibold"
                    >
                      +50 tin
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. TRẠNG THÁI KHÓA / KÍCH HOẠT TÀI KHOẢN */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <Lock className="size-4 text-red-600" /> Trạng thái Hoạt động & Khóa tài khoản
              </h3>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800">
                    {status === "active" ? "Tài khoản đang Hoạt động" : "Tài khoản ĐANG BỊ KHÓA"}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {status === "active"
                      ? "Người dùng có thể đăng nhập và đăng bài bình thường"
                      : "Người dùng bị ngắt quyền truy cập và đăng bài trên toàn hệ thống"}
                  </p>
                </div>

                <Button
                  type="button"
                  variant={status === "active" ? "destructive" : "default"}
                  size="sm"
                  onClick={() => setStatus(status === "active" ? "locked" : "active")}
                  className="text-xs font-bold gap-1.5"
                >
                  {status === "active" ? (
                    <>
                      <Lock className="size-3.5" /> Khóa tài khoản
                    </>
                  ) : (
                    <>
                      <Unlock className="size-3.5 text-emerald-300" /> Mở khóa ngay
                    </>
                  )}
                </Button>
              </div>

              {status === "locked" && (
                <div className="space-y-1.5 animate-in fade-in">
                  <Label className="text-xs font-bold text-red-700 flex items-center gap-1">
                    <AlertTriangle className="size-3.5 text-red-600" /> Lý do khóa tài khoản
                  </Label>
                  <Textarea
                    placeholder="Nhập chi tiết lý do vi phạm (VD: Đăng tin rác, giả mạo danh tính...)"
                    rows={2}
                    value={lockReason}
                    onChange={(e) => setLockReason(e.target.value)}
                    className="text-xs border-red-200 focus-visible:ring-red-500 bg-red-50/30"
                  />
                </div>
              )}
            </div>

          </form>
        </div>

      </DialogContent>
    </Dialog>
  );
}
