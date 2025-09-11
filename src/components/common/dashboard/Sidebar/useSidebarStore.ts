import { DashboardWithAccepted } from "@/lib/sortDashboard";
import { create } from "zustand";

type SidebarDashboardState = {
  dashboards: DashboardWithAccepted[];
  page: number;
  setDashboards: (list: DashboardWithAccepted[]) => void;
  setPage: (page: number) => void;
};

export const useSidebarStore = create<SidebarDashboardState>((set) => ({
  dashboards: [],
  page: 1,
  setDashboards: (list) => set({ dashboards: list }),
  setPage: (page) => set({ page }),
}));
