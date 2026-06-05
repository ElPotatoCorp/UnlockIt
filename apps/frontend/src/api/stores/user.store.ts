import { create } from "zustand";
import type { UserEntity, UserProfileEntity, UserBillingEntity } from "@unlockit/shared";

interface UserState {
  user: UserEntity | null;
  profile: UserProfileEntity | null;
  billing: UserBillingEntity | null;

  setUser: (u: UserEntity) => void;
  clearUser: () => void;

  setProfile: (p: UserProfileEntity) => void;
  clearProfile: () => void;

  setBilling: (b: UserBillingEntity) => void;
  clearBilling: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  profile: null,
  billing: null,

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),

  setBilling: (billing) => set({ billing }),
  clearBilling: () => set({ billing: null }),
}));