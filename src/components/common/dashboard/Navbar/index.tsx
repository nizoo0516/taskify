import Image from "next/image";
import Link from "next/link";

import MemberList from "@/components/common/dashboard/Navbar/MemberList";
import NavButton from "@/components/common/dashboard/Navbar/NavButton";
import User from "@/components/common/dashboard/Navbar/User";
import { getDashboardById } from "@/features/dashboard/api";
import { Dashboard } from "@/features/dashboard/types";
import { getMembers } from "@/features/members/api";
import { Member } from "@/features/members/types";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils/cn";
import { getMe } from "@/features/users/api";

// id는 사이드 바에서 클릭된 id와 title을 전달
export default function Navbar({ id }: { id?: number }) {
  const { data: dashboard } = useQuery<Dashboard | null>({
    queryKey: ["dashboard", id],
    queryFn: () => (id ? getDashboardById(id) : Promise.resolve(null)),
    enabled: !!id,
  });

  const { data: members = [] } = useQuery<Member[]>({
    queryKey: ["members", id],
    queryFn: () => (id ? getMembers(id, {}).then((res) => res.members) : Promise.resolve([])),
    enabled: !!id,
  });

  const { data: users } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const isMember = members.length > 0;
  const title = dashboard?.title ?? "내 대시보드";
  const createdByMe = dashboard?.createdByMe ?? false;
  const myUserId = users?.id;

  return (
    <div className="pc:justify-between pc:max-w-[calc(100vw-380px)] tablet:max-w-[calc(100vw-240px)] flex h-full max-w-[calc(100vw-92px)] items-center justify-end">
      <h2 className="flex max-w-[490px] gap-2">
        <div
          className={cn(
            "hidden truncate overflow-hidden text-lg font-bold",
            "pc:inline-block tablet:text-xl",
          )}
        >
          {title}
        </div>
        {createdByMe && (
          <Image
            src={"/icons/icon-crown.svg"}
            alt="내가만든 대시보드"
            width={20}
            height={16}
            className="pc:inline-block hidden"
          />
        )}
      </h2>

      <div className="flex h-full flex-row items-center">
        {id && (
          <>
            {createdByMe && (
              <div className="flex h-full flex-row">
                <Link href={`/dashboard/${id}/edit`}>
                  <NavButton
                    src="/icons/icon-settings.svg"
                    label="관리"
                    className="flex h-full flex-row"
                  />
                </Link>
                <NavButton src="/icons/icon-box-add.svg" label="초대하기" dashboardId={id} />
              </div>
            )}

            {isMember && <MemberList members={members} myUserId={myUserId} />}
            <div className="bg-brand-gray-300 pc:ml-8 tablet:ml-6 ml-3 h-[calc(100%-4px)] w-[1px]"></div>
          </>
        )}

        <User users={users} />
      </div>
    </div>
  );
}
