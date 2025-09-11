import type { Dashboard } from "@/features/dashboard/types";

export type DashboardWithAccepted = Dashboard & { acceptedAt?: string | null };

export const sortDashboards = (dashboards: DashboardWithAccepted[]) => {
  const getTime = (s?: string | null) => (s ? Date.parse(s) || 0 : 0);

  return [...dashboards].sort((a, b) => {
    const aHas = !!a.acceptedAt;
    const bHas = !!b.acceptedAt;

    if (aHas && bHas) {
      return getTime(b.acceptedAt) - getTime(a.acceptedAt);
    }
    if (aHas && !bHas) return -1; // a 먼저
    if (!aHas && bHas) return 1; // b 먼저

    // 둘 다 없음
    return getTime(b.createdAt) - getTime(a.createdAt);
  });
};
