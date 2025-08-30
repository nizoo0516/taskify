"use client";

import type { Member } from "@/features/members/types";
import { useDevice } from "@/lib/useDevice";
import { cn } from "@/lib/utils/cn";

export default function MemberList({ members }: { members: Member[] }) {
  const device = useDevice();
  const maxCount = device === "pc" ? 4 : 2;
  const visible = members.slice(0, maxCount);

  const liBase = cn(
    "[&>li]:h-[2.125rem] [&>li]:w-[2.125rem] [&>li]:overflow-hidden [&>li]:rounded-full [&>li]:border-3 [&>li]:border-[var(--color-brand-red)] [&>li:not(:first-child)]:-ml-2",
  );

  return (
    <ol className={cn(liBase, "flex flex-row")}>
      {visible.map((m) => (
        <li key={m.id} className={"h-[2.125rem] w-[2.125rem]"}>
          <img
            src={m.profileImageUrl}
            alt="멤버 프로필"
            className="h-full w-full rounded-full object-cover"
          />
        </li>
      ))}
      {members.length > maxCount && (
        <li className="flex items-center justify-center bg-[#f4d7da] text-[#D25B68]">
          +{members.length - maxCount}
        </li>
      )}
    </ol>
  );
}
