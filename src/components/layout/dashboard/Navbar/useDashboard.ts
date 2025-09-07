import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { getDashboards } from "@/features/dashboard/api";

export function useDashboards(page: number, device: string) {
  const queryKey = ["dashboards", page, device];

  return useQuery({
    queryKey,
    queryFn: () =>
      device === "mobile"
        ? getDashboards("infiniteScroll", { size: 20 })
        : getDashboards("pagination", { page, size: 15 }),
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData,
  });
}
