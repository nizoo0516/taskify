"use client";

import { useParams } from "next/navigation";
import { ReactNode } from "react";

import Navbar from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import { getDashboards } from "@/features/dashboard/api";
import { useApiHandler } from "@/lib/useApiHandler";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { id } = useParams();
  const dashboardId = id ? Number(id) : null;

  const { data } = useApiHandler(() => getDashboards("pagination", {}), []);
  const dashboards = data?.dashboards ?? [];

  const currentDashboard = dashboards.find((dashboard) => dashboard.id === dashboardId);

  return (
    <div className="flex h-screen">
      <aside className="tablet:w-[160px] pc:w-[300px] h-screen w-[67px] flex-shrink-0 border-r bg-white">
        <Sidebar dashboards={dashboards} />
      </aside>
      <div>
        {dashboardId && (
          <div className="tablet:h-[70px] pc:h-[70px] flex h-[60px] items-center border-b px-4">
            <Navbar id={dashboardId} title={currentDashboard?.title ?? "내 대시보드"} />
          </div>
        )}
        <main className="pc:p-6 flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
