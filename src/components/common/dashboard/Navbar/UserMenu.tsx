"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { logout } from "@/features/auth/actions";
import { cn } from "@/lib/utils/cn";

export default function UserMenu() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const hoverBlueStyle = cn(
    "hover:bg-brand-blue-50 hover:text-brand-blue-500",
    "dark:hover:bg-brand-gray-700 dark:hover:text-brand-blue-100",
  );
  const buttonBase = cn("h-full w-full text-base font-normal rounded-[4px]");
  const flexCenter = cn("flex items-center justify-center");

  return (
    <ol className="flex flex-col items-center justify-center [&>li]:h-8 [&>li]:w-full">
      <li>
        <button className={cn(hoverBlueStyle, buttonBase, "cursor-pointer")} onClick={handleLogout}>
          로그아웃
        </button>
      </li>
      <li>
        <Link href={"/mypage"} className={cn(hoverBlueStyle, buttonBase, flexCenter)}>
          내 정보
        </Link>
      </li>
      <li>
        <Link href={"/mydashboard"} className={cn(hoverBlueStyle, buttonBase, flexCenter)}>
          내 대시보드
        </Link>
      </li>
    </ol>
  );
}
