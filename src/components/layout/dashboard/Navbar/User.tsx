"use client";
import { useState } from "react";

import UserDropdown from "@/components/layout/dashboard/Navbar/UserDropdown";
import { getMe } from "@/features/users/api";
import { useApiHandler } from "@/lib/useApiHandler";
import { useOutsideClick } from "@/lib/useOutsideClick";

export default function User() {
  const { data } = useApiHandler(() => getMe(), []);

  const [isMenu, setIsMenu] = useState(false);

  const menuRef = useOutsideClick(() => setIsMenu(false));

  const userProfile = data?.profileImageUrl;
  const userName = data?.nickname;

  const toggleMenu = () => {
    setIsMenu((prev) => !prev);
  };

  return (
    <div ref={menuRef}>
      <button className="relative" onClick={toggleMenu}>
        <div>{userProfile}</div>
        <div>{userName}</div>
      </button>
      {isMenu && (
        <div className="absolute">
          <UserDropdown />
        </div>
      )}
    </div>
  );
}
