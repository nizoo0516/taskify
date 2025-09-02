"use client";

import { useParams } from "next/navigation";
import { ReactNode } from "react";

import Navbar from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import { getDashboards } from "@/features/dashboard/api";
import { useApiHandler } from "@/lib/useApiHandler";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { id } = useParams();
  // 테스트 id
  const dashboardId = id ? Number(id) : null;

  const { data } = useApiHandler(() => getDashboards("pagination", {}), []);
  const dashboards = data?.dashboards ?? [];

  const currentDashboard = dashboards.find((dashboard) => dashboard.id === dashboardId);

  return (
    <div className="flex">
      <aside className="tablet:w-40 pc:w-[18.75rem] border-brand-gray-300 h-screen w-16 flex-shrink-0 border-r bg-white px-3.5 pt-5">
        <Sidebar dashboards={dashboards} />
      </aside>

      <div className="flex flex-1 flex-col">
        <div className="border-brand-gray-300 tablet:px-10 tablet:py-4 tablet:h-[4.375rem] h-[3.75rem] border-b px-3 py-3.5 align-middle">
          <Navbar id={dashboardId ?? undefined} title={currentDashboard?.title ?? "내 대시보드"} />
        </div>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
