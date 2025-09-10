"use client";

import { usePathname } from "next/navigation";

import ThemeToggle from "@/components/common/ThemeToggle";
import PageMotion from "@/components/layout/PageMotion";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  const isHome = pathname === "/";

  if (isHome) {
    return <PageMotion>{children}</PageMotion>;
  }

  if (isDashboard) {
    return (
      <>
        {children}
        <ThemeToggle />
      </>
    );
  }

  return (
    <PageMotion>
      {children}
      <ThemeToggle />
    </PageMotion>
  );
}
