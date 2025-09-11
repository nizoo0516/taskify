"use client";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { createDashboard, getDashboards } from "@/features/dashboard/api";
import { useDevice } from "@/lib/useDevice";

import AddDashboard from "./AddDashboard";
import DashboardList from "./DashboardList";
import Logo from "../../Logo";
import Pagination from "../../Pagination";
import { useQuery } from "@tanstack/react-query";
import { GetDashboardsResponse } from "@/features/dashboard/types";
import { sortDashboards } from "@/lib/sortDashboard";
import { loadAcceptedMap } from "@/lib/utils/localStorage";
import { useSidebarStore } from "./useSidebarStore";

export type CreateData = {
  title: string;
  color: string;
};

export default function Sidebar() {
  const router = useRouter(); // dash보드 페이지에서 id 값 가지고 오려고 추가
  const device = useDevice();
  const [page, setPage] = useState<number>(1);
  const [direction, setDirection] = useState<"prev" | "next">("next");
  const prevPage = useRef(page);
  const pageSize = 15;

  const { dashboards, setDashboards } = useSidebarStore();

  // 페이지 버튼 방향 감지
  useEffect(() => {
    if (page > prevPage.current) {
      setDirection("next");
    } else if (page < prevPage.current) {
      setDirection("prev");
    }
    prevPage.current = page;
  }, [page]);

  const { data } = useQuery<GetDashboardsResponse>({
    queryKey: ["dashboards", "sidebar", page, device],
    queryFn: () =>
      device === "mobile"
        ? getDashboards("infiniteScroll", { size: 40 })
        : getDashboards("pagination", { page: 1, size: 9999 }),
  });

  useEffect(() => {
    if (data?.dashboards) {
      const acceptedMap = loadAcceptedMap();
      const merged = data.dashboards.map((d) => ({
        ...d,
        acceptedAt: acceptedMap[d.id] ?? null,
      }));
      setDashboards(sortDashboards(merged));
    }
  }, [data, setDashboards]);

  const totalCount = dashboards.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  const isPage = totalPages > 1;
  const isPrev = direction === "prev";

  // 대시보드 리스트 자르기
  const pagedDashboards = useMemo(() => {
    const start = (page - 1) * pageSize;
    return dashboards.slice(start, start + pageSize);
  }, [dashboards, page]);

  const handleCreate = async (form: CreateData) => {
    const created = await createDashboard(form); // dash보드 페이지에서 id 값 가지고 오려고 변경
    router.push(`/dashboard/${created.id}`); // dash보드 페이지에서 id 값 가지고 오려고 추가
  };

  return (
    <>
      <div className="w-full">
        {/* 로고 이미지 */}
        <div className="tablet:mb-14 tablet:justify-start mb-8 flex h-full w-full items-center justify-center">
          <Logo />
        </div>

        {/*클릭 시 대시보드 생성 모달 열림*/}
        <AddDashboard handleCreate={handleCreate} />

        <div className="pc:grid-cols-[271px_1fr] tablet:grid-cols-[130px_1fr] grid">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ x: isPrev ? "-23%" : "23%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isPrev ? "23%" : "-23%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="col-start-1 row-start-1"
            >
              <DashboardList dashboards={pagedDashboards} />
            </motion.div>
          </AnimatePresence>
        </div>

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
