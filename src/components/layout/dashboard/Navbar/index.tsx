import Link from "next/link";

import NavButton from "@/components/layout/dashboard/Navbar/NavButton";
import User from "@/components/layout/dashboard/Navbar/User";
import { getMembers } from "@/features/members/api";
import type { Member } from "@/features/members/types";
import { useApiHandler } from "@/lib/useApiHandler";

// id는 사이드 바에서 클릭된 id와 title을 전달
export default function Navbar({ id = 16130, title }: { id?: number; title?: string }) {
  const { data } = useApiHandler(() => getMembers(id, {}), [id]);

  const members = data?.members ?? [];
  const isMember = members.length > 0;

  return (
    <div className="flex h-full items-center justify-between">
      <h2 className="text-lg-bold tablet:text-xl-bold pc:text-2xl-bold">{title}</h2>
      <div className="flex h-full flex-row items-center">
        {id && (
          <>
            <div className="tablet:[&>*:not(:first-child)]:ml-4 tablet:mr-8 pc:mr-9 mr-4 flex h-full flex-row [&>*:not(:first-child)]:ml-3.5">
              <Link href={`/dashboard/${id}/edit`}>
                <NavButton
                  icon="/icons/icon-settings.svg"
                  label="관리"
                  className="flex h-full flex-row"
                />
              </Link>
              <NavButton icon="/icons/icon-box-add.svg" label="초대하기" />
            </div>
            {isMember && (
              <ol>
                {members.map((m: Member) => (
                  <li key={m.id}>
                    <img src={m.profileImageUrl} alt="멤버 프로필" />
                  </li>
                ))}
              </ol>
            )}
          </>
        )}
        <User />
      </div>
    </div>
  );
}
