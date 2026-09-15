import { create } from "zustand";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type UserRole = "teacher" | "student"; // adjust to your roles

type UserProfile = {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole | null;
  email?: string;
  created_at?: string;
  updated_at?: string;
};

type UserState = {
  authUser: SupabaseUser | null;
  profile: UserProfile | null;
  isLoading: boolean;

  setAuthUser: (user: SupabaseUser | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  authUser: null,
  profile: null,
  isLoading: false,

  setAuthUser: (user) => set({ authUser: user }),

  setProfile: (profile) => set({ profile }),

  setLoading: (loading) => set({ isLoading: loading }),

  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, ...updates }
        : (updates as UserProfile),
    })),

  clearUser: () => set({ authUser: null, profile: null, isLoading: false }),
}));
