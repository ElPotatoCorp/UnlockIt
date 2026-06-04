import { create } from "zustand";

export interface AuthSession {
  sub: string;
  sid: string;
  iat: number;
  exp: number;
}

interface AuthState {
  session: AuthSession | null;
  isLogged: boolean;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLogged: false,

  setSession: (session) => set({ session, isLogged: true }),

  clearSession: () => set({ session: null, isLogged: false }),
}));