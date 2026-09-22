import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Check,
  Sparkles,
  Award,
  Building2,
  Users,
  Eye,
  PlusCircle,
} from "lucide-react";
import { useAuth, UserRole } from "@/hooks/use-auth";

interface HeaderProfileDropdownProps {
  align?: "end" | "start" | "center";
  showNameOnMobile?: boolean;
}

const ROLE_INFO: Record<
  string,
  { label: string; badgeClass: string; icon: React.ElementType }
> = {
  admin: {
    label: "Quản trị viên",
    badgeClass:
      "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    icon: ShieldCheck,
  },
  broker: {
    label: "Môi giới BĐS",
    badgeClass:
      "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    icon: Building2,
  },
  collaborator: {
    label: "Cộng tác viên",
    badgeClass:
      "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    icon: Award,
  },
  user: {
    label: "Thành viên",
    badgeClass:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    icon: User,
  },
  guest: {
    label: "Khách vãng lai",
    badgeClass: "bg-gray-100 text-gray-600 border-gray-200",
    icon: Eye,
  },
};

export function HeaderProfileDropdown({
  align = "end",
  showNameOnMobile = false,
}: HeaderProfileDropdownProps) {
  const { role, profile, user, openProfileModal, switchMockRole, logout, isMock } =
    useAuth();
  const navigate = useNavigate();

  const roleMeta = ROLE_INFO[role] || ROLE_INFO.user;
  const RoleIcon = roleMeta.icon;

  const displayName =
    profile?.name ||
    user?.email?.split("@")[0] ||
    (role === "admin"
      ? "Quản trị viên"
      : role === "broker"
        ? "Môi giới BĐS"
        : role === "collaborator"
          ? "Cộng tác viên"
          : "Thành viên");

  const displayEmail = profile?.email || user?.email || "user@bds-horizon.vn";
  const avatarUrl =
    profile?.avatar ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="group flex items-center gap-2.5 p-1 pl-1.5 pr-2.5 rounded-full border border-border/80 bg-background/60 hover:bg-accent/70 hover:border-primary/40 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="Menu tài khoản"
        >
          <div className="relative">
            <Avatar className="size-8 ring-1 ring-border group-hover:ring-primary/40 transition-all">
              <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
          </div>

          <div
            className={`flex flex-col text-left leading-none ${
              showNameOnMobile ? "flex" : "hidden sm:flex"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors max-w-[120px] truncate">
                {displayName}
              </span>
              {profile?.isVerified && (
                <span
                  title="Tài khoản đã xác minh"
                  className="size-3 text-sky-500 inline-flex items-center justify-center font-bold text-[9px]"
                >
                  ✓
                </span>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">
              {roleMeta.label}
            </span>
          </div>

          <ChevronDown className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors ml-0.5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        sideOffset={8}
        className="w-72 p-2 shadow-xl border-border/70 backdrop-blur-xl bg-card/95 rounded-xl z-50 animate-in fade-in-50 zoom-in-95"
      >
        {/* User Card Header */}
        <div className="p-2.5 bg-muted/40 rounded-lg border border-border/50 mb-1.5 flex items-center gap-3">
          <Avatar className="size-11 ring-2 ring-primary/20 shadow-sm">
            <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-sm font-bold text-foreground truncate">{displayName}</p>
              {profile?.isVerified && (
                <span
                  title="Đã xác minh danh tính"
                  className="size-3.5 rounded-full bg-sky-500 text-white text-[10px] flex items-center justify-center font-bold shrink-0"
                >
                  ✓
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
            <div className="mt-1">
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 font-medium ${roleMeta.badgeClass}`}
              >
                <RoleIcon className="size-2.5 mr-1 inline-block" />
                {roleMeta.label}
              </Badge>
            </div>
          </div>
        </div>

        <DropdownMenuGroup>
          {/* Hồ sơ cá nhân */}
          <DropdownMenuItem
            onClick={openProfileModal}
            className="flex items-center gap-2.5 px-2.5 py-2 cursor-pointer rounded-md text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors focus:bg-primary/10 focus:text-primary"
          >
            <User className="size-4 text-primary" />
            <div className="flex-1">
              <span>Hồ sơ cá nhân</span>
              <span className="block text-[10px] text-muted-foreground font-normal">
                Xem & chỉnh sửa thông tin tài khoản
              </span>
            </div>
          </DropdownMenuItem>

          {/* Bảng Quản Trị (if not regular customer) */}
          {role !== "user" && role !== "guest" && (
            <DropdownMenuItem asChild>
              <Link
                to="/admin"
                className="flex items-center gap-2.5 px-2.5 py-2 cursor-pointer rounded-md text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors focus:bg-primary/10 focus:text-primary"
              >
                <LayoutDashboard className="size-4 text-teal-600 dark:text-teal-400" />
                <div className="flex-1">
                  <span>Bảng Quản Trị</span>
                  <span className="block text-[10px] text-muted-foreground font-normal">
                    Truy cập trang điều hành hệ thống
                  </span>
                </div>
              </Link>
            </DropdownMenuItem>
          )}

          {/* Đăng tin mới (if admin or broker) */}
          {(role === "admin" || role === "broker") && (
            <DropdownMenuItem asChild>
              <Link
                to="/admin"
                className="flex items-center gap-2.5 px-2.5 py-2 cursor-pointer rounded-md text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors focus:bg-primary/10 focus:text-primary"
              >
                <PlusCircle className="size-4 text-blue-600" />
                <div className="flex-1">
                  <span>Đăng tin BĐS</span>
                  <span className="block text-[10px] text-muted-foreground font-normal">
                    Tạo bài đăng tin bán / cho thuê
                  </span>
                </div>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1.5" />

        {/* Đổi vai trò xem thử (Mock Mode) */}
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2.5 px-2.5 py-2 cursor-pointer rounded-md text-sm font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30">
              <Sparkles className="size-4 text-amber-500" />
              <div className="flex-1 text-left">
                <span>Đổi vai trò xem thử</span>
                <span className="block text-[10px] text-muted-foreground font-normal">
                  Chuyển nhanh quyền hạn UI
                </span>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-56 p-1.5 bg-card/95 backdrop-blur-xl border-border/70 rounded-xl shadow-xl z-50">
              <DropdownMenuLabel className="text-[11px] text-muted-foreground px-2 py-1 font-semibold uppercase tracking-wider">
                Chọn vai trò thử nghiệm
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => switchMockRole("admin")}
                className="flex items-center justify-between px-2.5 py-2 cursor-pointer text-xs rounded-md"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-purple-600" />
                  <span className="font-semibold">Quản trị viên (Admin)</span>
                </div>
                {role === "admin" && <Check className="size-4 text-primary font-bold" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => switchMockRole("broker")}
                className="flex items-center justify-between px-2.5 py-2 cursor-pointer text-xs rounded-md"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-blue-600" />
                  <span className="font-semibold">Môi giới BĐS (Broker)</span>
                </div>
                {role === "broker" && <Check className="size-4 text-primary font-bold" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => switchMockRole("collaborator")}
                className="flex items-center justify-between px-2.5 py-2 cursor-pointer text-xs rounded-md"
              >
                <div className="flex items-center gap-2">
                  <Award className="size-4 text-amber-600" />
                  <span className="font-semibold">Cộng tác viên (CTV)</span>
                </div>
                {role === "collaborator" && (
                  <Check className="size-4 text-primary font-bold" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => switchMockRole("user")}
                className="flex items-center justify-between px-2.5 py-2 cursor-pointer text-xs rounded-md"
              >
                <div className="flex items-center gap-2">
                  <User className="size-4 text-slate-600" />
                  <span className="font-semibold">Thành viên (Khách)</span>
                </div>
                {role === "user" && <Check className="size-4 text-primary font-bold" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1.5" />

        {/* Đăng xuất */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-2.5 py-2 cursor-pointer rounded-md text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 focus:bg-rose-50 focus:text-rose-600 transition-colors"
        >
          <LogOut className="size-4 text-rose-500" />
          <span>Đăng xuất tài khoản</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
