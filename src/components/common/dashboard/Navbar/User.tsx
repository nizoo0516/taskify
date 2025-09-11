"use client";
import { useState } from "react";

import UserMenu from "@/components/common/dashboard/Navbar/UserMenu";
import { getMe } from "@/features/users/api";
import { useApiHandler } from "@/lib/useApiHandler";
import { useOutsideClick } from "@/lib/useOutsideClick";
import Dropdown from "@/components/layout/Dropdown";
import { cn } from "@/lib/utils/cn";

export default function User() {
  const { data } = useApiHandler(() => getMe(), []);

  const [isMenu, setIsMenu] = useState(false);

  const userProfile = data?.profileImageUrl;
  const userName = data?.nickname;

  const toggleMenu = () => {
    setIsMenu((prev) => !prev);
  };

  return (
    <div className="tablet:ml-6 pc:ml-8 relative z-10 ml-3">
      <button className="flex flex-row items-center" onClick={toggleMenu}>
        <img
          src={userProfile}
          alt="유저 프로필 이미지"
          className="tablet:w-[38px] tablet:h-[38px] h-[34px] w-[34px] rounded-full object-cover"
        />

        <div className="tablet:flex ml-3 hidden">{userName}</div>
      </button>

      <Dropdown
        isOpen={isMenu}
        onClose={() => setIsMenu(false)}
        className={cn(
          "tablet:right-[-28px] border-brand-gray-300 absolute top-2 right-0 w-[128px] overflow-hidden rounded-[6px] border bg-white p-1.5 shadow-md",
        )}
      >
        <UserMenu />
      </Dropdown>
    </div>
  );
}
