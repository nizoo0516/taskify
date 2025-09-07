"use client";

import { usePathname } from "next/navigation";

import MotionLayout from "@/components/layout/MotionLayout";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) {
    return <>{children}</>;
  }

  return <MotionLayout>{children}</MotionLayout>;
}
