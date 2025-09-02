import Link from "next/link";

import { Dashboard } from "@/features/dashboard/types";

export default function Sidebar({ dashboards }: { dashboards: Dashboard[] }) {
  return (
    <>
      <aside>
        {/* 로고 이미지 */}
        <Link href={`/`}>
          <h1>logo</h1>
        </Link>
        {/* 클릭 시 대시보드 생성 모달*/}
        <div>
          <span>Dash Boards</span>
          <button>+</button>
        </div>
        <ul>
          {dashboards.map((d: Dashboard) => (
            <li key={d.id}>
              <span>{d.color}</span>
              <div>{d.title}</div>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
