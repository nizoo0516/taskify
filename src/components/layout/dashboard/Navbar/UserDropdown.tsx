"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/features/auth/store";

export default function UserDropdown() {
  const router = useRouter();
  const clearToken = useAuthStore((state) => state.clearToken);

  const handleClick = () => {
    clearToken();
    router.push("/");
  };

  return (
    <div>
      <button className="" onClick={handleClick}>
        로그아웃
      </button>
      <Link href={"/mypage"}>내 정보</Link>
      <Link href={"/mydashboard"}>내 대시보드</Link>
    </div>
  );
}
