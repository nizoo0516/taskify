import { ReactNode } from "react";

import DashboardLayout from "@/components/layout/dashboard/DashboardLayout";

export default function MyPageLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
