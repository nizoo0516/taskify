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
    <div>
      <Sidebar dashboards={dashboards} />
      <div>
        {dashboardId && (
          <Navbar id={dashboardId} title={currentDashboard?.title ?? "내 대시보드"} />
        )}
        <main>{children}</main>
      </div>
    </div>
  );
}
