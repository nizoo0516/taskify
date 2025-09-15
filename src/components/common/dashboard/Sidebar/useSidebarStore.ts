import { DashboardWithAccepted } from "@/lib/sortDashboard";
import { create } from "zustand";

type SidebarDashboardState = {
  dashboards: DashboardWithAccepted[];
  page: number;
  setDashboards: (list: DashboardWithAccepted[]) => void;
  setPage: (page: number) => void;
  addDashboard: (dashboard: DashboardWithAccepted) => void;
};

export const useSidebarStore = create<SidebarDashboardState>((set) => ({
  dashboards: [],
  page: 1,
  setDashboards: (list) => set({ dashboards: list }),
  setPage: (page) => set({ page }),
  addDashboard: (dashboard) => set((state) => ({ dashboards: [dashboard, ...state.dashboards] })),
}));
