import React, { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import {
  UserAccount,
  UserRole as DbUserRole,
  LOCAL_USERS_DB,
  getProfileForRole,
  INITIAL_MOCK_USERS,
} from "@/data/mockUsersData";
import { toast } from "sonner";

export type UserRole = DbUserRole | "guest";

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: UserRole;
  profile: UserAccount | null;
  isAdmin: boolean;
  isBroker: boolean;
  isCollaborator: boolean;
  isGuest: boolean;
  loading: boolean;
  isMock: boolean;
  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  updateProfile: (updatedData: Partial<UserAccount>) => Promise<boolean>;
  switchMockRole: (newRole: UserRole) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("guest");
  const [profile, setProfile] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const isMock = false;

  // Load initial profile & auth state (Real Supabase Authentication Mode)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("bds_mock_role");
      localStorage.removeItem("bds_mock_admin");
    }

    const fetchUserRoleAndProfile = async (userId: string, userEmail?: string) => {
      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .maybeSingle();

        if (error) console.warn("Error fetching user role from supabase:", error);
        
        const resolvedRole: UserRole = (data?.role as UserRole) || "user";
        setRole(resolvedRole);

        // Fetch profile if exists in profiles table
        const { data: profileData } = await (supabase as any)
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (profileData) {
          setProfile(profileData as unknown as UserAccount);
        } else {
          // Fallback to local profile or default
          const defaultProf = getProfileForRole(resolvedRole as DbUserRole);
          setProfile({
            ...defaultProf,
            id: userId,
            email: userEmail || defaultProf.email,
            name: userEmail?.split("@")[0] || defaultProf.name,
          });
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setRole("user");
        setProfile(INITIAL_MOCK_USERS[3]);
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setTimeout(() => fetchUserRoleAndProfile(s.user.id, s.user.email), 0);
      } else {
        setRole("guest");
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
      if (data.session?.user) {
        fetchUserRoleAndProfile(data.session.user.id, data.session.user.email);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const updateProfile = async (updatedData: Partial<UserAccount>): Promise<boolean> => {
    if (!profile) return false;

    const merged: UserAccount = {
      ...profile,
      ...updatedData,
    };

    // Update local reactive state immediately
    setProfile(merged);

    // Save to localStorage
    LOCAL_USERS_DB.saveUser(merged);

    // If Supabase real mode, try updating Supabase profiles table
    if (!isMock && user?.id) {
      try {
        await (supabase as any)
          .from("profiles")
          .upsert({
            id: user.id,
            name: merged.name,
            phone: merged.phone,
            avatar: merged.avatar,
            role: merged.role,
            district: merged.district,
            specialties: merged.specialties,
            years_exp: merged.yearsExp,
            id_card_number: merged.id_card_number,
            license_number: merged.license_number,
            updated_at: new Date().toISOString(),
          });
      } catch (err) {
        console.warn("Could not sync profile with Supabase:", err);
      }
    }

    return true;
  };

  const switchMockRole = (_newRole: UserRole) => {
    toast.info("Chế độ xem thử đã được tắt. Vui lòng sử dụng tài khoản thực.");
  };

  const logout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("bds_mock_role");
      localStorage.removeItem("bds_mock_admin");
    }
    await supabase.auth.signOut();
    setRole("guest");
    setUser(null);
    setSession(null);
    setProfile(null);
    toast.success("Đã đăng xuất");
  };

  const isAdmin = role === "admin";
  const isBroker = role === "broker";
  const isCollaborator = role === "collaborator";
  const isGuest = role === "guest" || !user;

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        role,
        profile,
        isAdmin,
        isBroker,
        isCollaborator,
        isGuest,
        loading,
        isMock,
        isProfileModalOpen,
        openProfileModal,
        closeProfileModal,
        updateProfile,
        switchMockRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // If rendered outside provider during transition or standalone test, return safe fallback
    return {
      session: null,
      user: null,
      role: "guest" as UserRole,
      profile: null,
      isAdmin: false,
      isBroker: false,
      isCollaborator: false,
      isGuest: true,
      loading: false,
      isMock: false,
      isProfileModalOpen: false,
      openProfileModal: () => {},
      closeProfileModal: () => {},
      updateProfile: async () => false,
      switchMockRole: () => {},
      logout: async () => {},
    };
  }
  return context;
}
