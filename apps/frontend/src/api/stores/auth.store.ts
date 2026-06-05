import { create } from "zustand";
import type { JwtPayload } from "@unlockit/shared";

interface AuthState {
  session: JwtPayload | null;
  isLogged: boolean;
  setSession: (session: JwtPayload) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLogged: false,

  setSession: (session) => set({ session, isLogged: true }),

  clearSession: () => set({ session: null, isLogged: false }),
}));