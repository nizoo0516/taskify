"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import MyButton from "@/components/layout/Button";
import { useAuthStore } from "@/features/auth/store";

export default function UserDropdown() {
  const router = useRouter();
  const clearToken = useAuthStore((state) => state.clearToken);

  const handleLogout = () => {
    clearToken();
    router.push("/");
  };

  return (
    <div>
      <MyButton onClick={handleLogout}>로그아웃</MyButton>
      <Link href={"/mypage"}>내 정보</Link>
      <Link href={"/mydashboard"}>내 대시보드</Link>
    </div>
  );
}
