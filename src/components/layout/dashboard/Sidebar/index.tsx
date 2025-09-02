"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { getDashboards } from "@/features/dashboard/api";
import { useApiHandler } from "@/lib/useApiHandler";

import DashboardList from "./DashboardList";
import Pagination from "./Pagination";
import MyButton from "../../Button";

export default function Sidebar() {
  const [page, setPage] = useState<number>(1);
  const { data } = useApiHandler(() => getDashboards("pagination", { page, size: 15 }), [page]);

  const dashboards = data?.dashboards ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / 15);

  return (
    <>
      <div>
        {/* 로고 이미지 */}
        <h1 className="h=full tablet:mb-14 pc:justify-start mb-8 flex w-full items-center justify-center">
          <Link href={`/`} className="tablet:h=[50px] tablet:w-[110px]">
            <Image
              src="/images/img-logo-large.svg"
              alt="로고"
              width={110}
              height={35}
              className="tablet:block hidden"
            />
            <Image
              src="/images/img-logo-small.svg"
              alt="로고"
              width={24}
              height={27}
              className="tablet:hidden"
            />
          </Link>
        </h1>
        {/*클릭 시 대시보드 생성 모달 열림*/}
        <div className="tablet:mb-4 mb-6 flex w-full justify-center">
          <MyButton
            className="tablet:justify-between tablet:w-full flex justify-center border-0"
            onClick={() => {}}
          >
            <div className="tablet:flex hidden">Dash Boards</div>
            <Image src={"/icons/icon-box-add.svg"} alt="대시보드 추가" width={14} height={14} />
          </MyButton>
        </div>
        <DashboardList dashboards={dashboards} />
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </>
  );
}
