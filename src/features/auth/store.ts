import { create } from "zustand";
import { persist } from "zustand/middleware";

// 토큰 저장
interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (token) => set({ accessToken: token }),
      clearToken: () => set({ accessToken: null }),
    }),
    { name: "accessToken" },
  ),
);

// 로그인 여부
export const useIsLoggedIn = () => useAuthStore((s) => !!s.accessToken);
