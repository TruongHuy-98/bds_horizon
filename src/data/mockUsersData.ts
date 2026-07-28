export type UserRole = "admin" | "broker" | "collaborator" | "user";
export type UserStatus = "active" | "locked";
export type BrokerPlanType = "free" | "pro" | "vip";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  isVerified: boolean;
  activePlan: BrokerPlanType;
  planExpiry?: string;
  remainingPosts: number;
  createdAt: string;
  status: UserStatus;
  lockReason?: string;
  // Extra fields for brokers
  district?: string;
  specialties?: string[];
  rating?: number;
  reviews?: number;
  reviewsCount?: number;
  yearsExp?: number;
  yearsExperience?: number;
  verificationRequestDate?: string;
}

export const INITIAL_MOCK_USERS: UserAccount[] = [
  {
    id: "usr-admin-1",
    name: "Quản trị viên Hệ thống",
    email: "admin@bds-horizon.vn",
    phone: "0905 123 456",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    role: "admin",
    isVerified: true,
    activePlan: "vip",
    planExpiry: "2030-12-31",
    remainingPosts: 999,
    createdAt: "2025-01-01T08:00:00.000Z",
    status: "active",
  },
  {
    id: "usr-broker-1",
    name: "Nguyễn Văn Nam",
    email: "nam.nguyen@horizon-realty.vn",
    phone: "0914 888 999",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80",
    role: "broker",
    isVerified: true,
    activePlan: "vip",
    planExpiry: "2026-12-30",
    remainingPosts: 45,
    createdAt: "2025-03-15T09:30:00.000Z",
    status: "active",
    district: "Hải Châu",
    specialties: ["Căn hộ cao cấp", "Hải Châu", "BĐS Ven sông"],
    rating: 4.9,
    reviews: 128,
    yearsExp: 5,
  },
  {
    id: "usr-broker-2",
    name: "Trần Thị Minh",
    email: "minh.tran@danangland.vn",
    phone: "0905 678 123",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    role: "broker",
    isVerified: true,
    activePlan: "pro",
    planExpiry: "2026-10-15",
    remainingPosts: 18,
    createdAt: "2025-02-10T14:20:00.000Z",
    status: "active",
    district: "Sơn Trà",
    specialties: ["Biệt thự biển", "Sơn Trà", "Nghỉ dưỡng"],
    rating: 5.0,
    reviews: 245,
    yearsExp: 8,
  },
  {
    id: "usr-broker-3",
    name: "Lê Hoàng Long",
    email: "long.le@horizon-broker.vn",
    phone: "0988 333 444",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
    role: "broker",
    isVerified: false,
    activePlan: "free",
    remainingPosts: 3,
    createdAt: "2025-06-01T11:15:00.000Z",
    status: "active",
    district: "Ngũ Hành Sơn",
    specialties: ["Đất nền dự án", "FPT City"],
    rating: 4.7,
    reviews: 89,
    yearsExp: 3,
    verificationRequestDate: "2026-07-20T10:00:00.000Z",
  },
  {
    id: "usr-broker-4",
    name: "Phạm Ngọc Lan",
    email: "lan.pham@bds-mientrung.com",
    phone: "0935 222 111",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    role: "broker",
    isVerified: false,
    activePlan: "pro",
    planExpiry: "2026-08-20",
    remainingPosts: 12,
    createdAt: "2025-01-20T16:45:00.000Z",
    status: "active",
    district: "Toàn thành phố",
    specialties: ["Đầu tư quy mô lớn", "Khách sạn ven biển"],
    rating: 5.0,
    reviews: 512,
    yearsExp: 12,
    verificationRequestDate: "2026-07-25T14:30:00.000Z",
  },
  {
    id: "usr-collab-1",
    name: "Vũ Đình Trọng",
    email: "trong.vu@ctv-horizon.vn",
    phone: "0977 555 666",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    role: "collaborator",
    isVerified: true,
    activePlan: "free",
    remainingPosts: 10,
    createdAt: "2025-04-12T10:00:00.000Z",
    status: "active",
  },
  {
    id: "usr-collab-2",
    name: "Đặng Thu Thảo",
    email: "thao.dang@tintucbds.vn",
    phone: "0906 111 222",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    role: "collaborator",
    isVerified: false,
    activePlan: "free",
    remainingPosts: 5,
    createdAt: "2025-05-18T09:00:00.000Z",
    status: "active",
  },
  {
    id: "usr-cust-1",
    name: "Hoàng Văn Thái",
    email: "thai.hoang@gmail.com",
    phone: "0912 345 678",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    role: "user",
    isVerified: false,
    activePlan: "free",
    remainingPosts: 1,
    createdAt: "2025-07-01T15:20:00.000Z",
    status: "active",
  },
  {
    id: "usr-cust-2",
    name: "Ngô Thị Bích",
    email: "bich.ngo@yahoo.com",
    phone: "0983 999 888",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    role: "user",
    isVerified: false,
    activePlan: "free",
    remainingPosts: 0,
    createdAt: "2025-07-10T11:00:00.000Z",
    status: "locked",
    lockReason: "Đăng tin rác không đúng sự thật liên tục.",
  },
  {
    id: "usr-cust-3",
    name: "Bùi Quốc Khánh",
    email: "khanh.bui@hotmail.com",
    phone: "0908 444 555",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
    role: "user",
    isVerified: false,
    activePlan: "free",
    remainingPosts: 2,
    createdAt: "2026-01-05T13:40:00.000Z",
    status: "active",
  },
];

export const MOCK_USERS_STORAGE_KEY = "mock_users";

export const LOCAL_USERS_DB = {
  getUsers: (): UserAccount[] => {
    if (typeof window === "undefined") return INITIAL_MOCK_USERS;
    const stored = localStorage.getItem(MOCK_USERS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_USERS));
      return INITIAL_MOCK_USERS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_MOCK_USERS;
    }
  },

  saveUser: (updatedUser: Partial<UserAccount> & { id: string }): UserAccount[] => {
    const users = LOCAL_USERS_DB.getUsers();
    const index = users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
    } else {
      const newUser: UserAccount = {
        name: "Người dùng mới",
        email: "user@domain.com",
        phone: "0900000000",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
        role: "user",
        isVerified: false,
        activePlan: "free",
        remainingPosts: 5,
        createdAt: new Date().toISOString(),
        status: "active",
        ...updatedUser,
      };
      users.unshift(newUser);
    }
    localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(users));
    return users;
  },

  toggleLockStatus: (id: string, lockReason?: string): UserAccount[] => {
    const users = LOCAL_USERS_DB.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) {
      const isLocked = users[index].status === "locked";
      users[index].status = isLocked ? "active" : "locked";
      if (!isLocked && lockReason) {
        users[index].lockReason = lockReason;
      } else if (isLocked) {
        delete users[index].lockReason;
      }
      localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(users));
    }
    return users;
  },

  approveVerification: (id: string): UserAccount[] => {
    const users = LOCAL_USERS_DB.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) {
      users[index].isVerified = true;
      delete users[index].verificationRequestDate;
      localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(users));
    }
    return users;
  },

  deleteUser: (id: string): UserAccount[] => {
    const users = LOCAL_USERS_DB.getUsers().filter((u) => u.id !== id);
    localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(users));
    return users;
  },
};
