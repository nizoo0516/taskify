import DashboardLayout from "@/components/layout/dashboard/DashboardLayout";
import MotionLayout from "@/components/layout/MotionLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <MotionLayout>{children}</MotionLayout>
    </DashboardLayout>
  );
}
