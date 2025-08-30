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
    <div className="fixed top-0 right-0 bg-white">
      <div className="flex justify-between">
        <h2 className="text-xl-bold">{title}</h2>
        <div>
          {id && <NavButton id={id} />}
          {isMember && (
            <ol>
              {members.map((m: Member) => (
                <li key={m.id}>
                  <img src={m.profileImageUrl} alt="멤버 프로필" />
                </li>
              ))}
            </ol>
          )}
          <User />
        </div>
      </div>
    </div>
  );
}
