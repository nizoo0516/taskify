import Link from "next/link";

import MemberList from "@/components/layout/dashboard/Navbar/MemberList";
import NavButton from "@/components/layout/dashboard/Navbar/NavButton";
import User from "@/components/layout/dashboard/Navbar/User";
import { getMembers } from "@/features/members/api";
import { useApiHandler } from "@/lib/useApiHandler";

// id는 사이드 바에서 클릭된 id와 title을 전달
export default function Navbar({ id, title }: { id?: number; title?: string }) {
  const { data } = useApiHandler(
    () => (id ? getMembers(id, {}) : Promise.resolve({ members: [], totalCount: 0 })),
    [id],
  );

  const members = data?.members ?? [];
  const isMember = members.length > 0;

  return (
    <div className="pc:justify-between flex h-full items-center justify-end">
      <h2 className="pc:inline-block tablet:text-xl hidden text-lg font-bold">{title}</h2>
      <div className="flex h-full flex-row items-center">
        {id && (
          <>
            <div className="tablet:[&>*:not(:first-child)]:ml-4 flex h-full flex-row [&>*:not(:first-child)]:ml-3.5">
              <Link href={`/dashboard/${id}/edit`}>
                <NavButton
                  icon="/icons/icon-settings.svg"
                  label="관리"
                  className="flex h-full flex-row"
                />
              </Link>
              <NavButton icon="/icons/icon-box-add.svg" label="초대하기" />
            </div>
            {isMember && <MemberList members={members} />}
            <div className="bg-brand-gray-300 h-[calc(100%-4px)] w-[1px]"></div>
          </>
        )}

        <User />
      </div>
    </div>
  );
}
