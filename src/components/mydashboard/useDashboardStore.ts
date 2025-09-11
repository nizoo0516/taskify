import { create } from "zustand";
import type { Dashboard } from "@/features/dashboard/types";

// 타입 확장
export type DashboardWithAccepted = Dashboard & { acceptedAt?: string | null };

// 정렬 함수
const sortDashboards = (dashboards: DashboardWithAccepted[]) => {
  const getTime = (s?: string | null) => (s ? Date.parse(s) || 0 : 0);

  return [...dashboards].sort((a, b) => {
    const aHas = !!a.acceptedAt;
    const bHas = !!b.acceptedAt;

    if (aHas && bHas) return getTime(b.acceptedAt) - getTime(a.acceptedAt);
    if (aHas && !bHas) return -1;
    if (!aHas && bHas) return 1;

    return getTime(b.createdAt) - getTime(a.createdAt);
  });
};

// Zustand 상태
type DashboardState = {
  dashboards: DashboardWithAccepted[];
  setDashboards: (list: DashboardWithAccepted[]) => void;
  addDashboard: (item: DashboardWithAccepted) => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  dashboards: [],
  setDashboards: (list) => set({ dashboards: sortDashboards(list) }),
  addDashboard: (item) =>
    set((state) => ({
      dashboards: sortDashboards([item, ...state.dashboards]),
    })),
}));
