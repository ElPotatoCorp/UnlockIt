import { create } from "zustand";

export interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber: string | null;
  bio: string | null;
  avatar: string | null;
  wallet: number;
  createdAt: string;
}

export interface UserProfileDetails {
  firstName: string;
  lastName: string;
  birthdate: string;
  country: string;
  newsletter: boolean;
}

export interface UserBilling {
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string | null;
}

interface UserState {
  user: User | null;
  profile: UserProfileDetails | null;
  billing: UserBilling | null;

  setUser: (u: User) => void;
  clearUser: () => void;

  setProfile: (p: UserProfileDetails) => void;
  clearProfile: () => void;

  setBilling: (b: UserBilling) => void;
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