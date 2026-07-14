import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "admin" | "broker" | "collaborator" | "user" | "guest";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("guest");
  const [loading, setLoading] = useState(true);

  // Check if mock role is set in local storage
  const getMockRole = (): UserRole | null => {
    if (typeof window !== "undefined") {
      const val = localStorage.getItem("bds_mock_role");
      if (val) return val as UserRole;
    }
    return null;
  };

  useEffect(() => {
    const mockRole = getMockRole();
    if (mockRole) {
      // Mock Authentication Mode
      setRole(mockRole);
      if (mockRole === "guest") {
        setUser(null);
        setSession(null);
      } else {
        const mockEmail = `mock-${mockRole}@horizon.vn`;
        const mockUserId = `mock-${mockRole}-id`;
        setUser({
          id: mockUserId,
          email: mockEmail,
          aud: "authenticated",
          created_at: new Date().toISOString(),
        } as User);
        setSession({
          access_token: "mock-token",
          user: { id: mockUserId, email: mockEmail } as User,
        } as Session);
      }
      setLoading(false);
      return;
    }

    // Real Supabase Authentication Mode
    const fetchUserRole = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setRole(data.role as UserRole);
        } else {
          setRole("user"); // Registered user (default)
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
        setRole("user");
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setTimeout(() => fetchUserRole(s.user.id), 0);
      } else {
        setRole("guest");
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
      if (data.session?.user) {
        fetchUserRole(data.session.user.id);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const isAdmin = role === "admin";
  const isBroker = role === "broker";
  const isCollaborator = role === "collaborator";
  const isGuest = role === "guest" || !user;

  return { 
    session, 
    user, 
    role, 
    isAdmin, 
    isBroker, 
    isCollaborator, 
    isGuest, 
    loading 
  };
}
