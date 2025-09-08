import DashboardLayout from "@/components/layout/dashboard/DashboardLayout";
import { IdContext } from "@/contexts/IdContext";

export default function Layout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <IdContext
      value={{
        dashboardId: Number(id),
        columnId: null,
        cardId: null,
      }}
    >
      <DashboardLayout>{children}</DashboardLayout>
    </IdContext>
  );
}
