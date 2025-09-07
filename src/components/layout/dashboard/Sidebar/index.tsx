"use client";

import { useState } from "react";

import { getDashboards } from "@/features/dashboard/api";
import { useApiHandler } from "@/lib/useApiHandler";
import { useDevice } from "@/lib/useDevice";
import { cn } from "@/lib/utils/cn";

import DashboardList from "./DashboardList";
import MyButton from "../../Button";
import Logo from "../../Logo";
import Pagination from "../../Pagination";

export default function Sidebar() {
  const device = useDevice();
  const [page, setPage] = useState<number>(1);

  const { data } = useApiHandler(() => {
    if (device === "mobile") {
      return getDashboards("infiniteScroll", { size: 20 });
    }
    return getDashboards("pagination", { page, size: 15 });
  }, [page, device]);
  const dashboards = data?.dashboards ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / 15);

  const isPage = totalPages > 1;
  const addIconSrc = "/icons/icon-box-add.svg";

  return (
    <>
      <div>
        {/* 로고 이미지 */}
        <div className="tablet:mb-14 pc:justify-start mb-8 flex h-full w-full items-center justify-center">
          <Logo />
        </div>
        {/*클릭 시 대시보드 생성 모달 열림*/}
        <div className="tablet:mb-4 mb-6 flex w-full justify-center">
          <MyButton
            className="tablet:justify-between tablet:w-full flex justify-center border-0 bg-transparent"
            onClick={() => {}}
          >
            <div
              className={cn(
                "tablet:flex text-brand-gray-500 hidden text-xs font-semibold",
                "dark:text-dark-200",
              )}
            >
              Dash Boards
            </div>
            {/* 이미지 색상 바꾸기 위해서 svg라이브러리 설치해도 좋았을거같다. */}
            <span
              className={cn("bg-brand-gray-500 h-5 w-5", "dark:bg-brand-gray-200")}
              style={{
                mask: `url(${addIconSrc}) no-repeat center`,
                WebkitMask: `url(${addIconSrc}) no-repeat center`,
                maskSize: "contain",
                WebkitMaskSize: "contain",
              }}
            />
          </MyButton>
        </div>
        <DashboardList dashboards={dashboards} />
        {isPage && (
          <Pagination
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            className={"tablet:flex hidden"}
          />
        )}
      </div>
    </>
  );
}
