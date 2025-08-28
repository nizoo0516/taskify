import { create } from "zustand";

// 토큰 저장
interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  clearToken: () => set({ accessToken: null }),
}));
