"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { useDevice } from "@/lib/useDevice";

import AddDashboard from "./AddDashboard";
import DashboardList from "./DashboardList";
import DashboardSkeleton from "./DashboardSkeleton";
import Logo from "../../Logo";
import Pagination from "../../Pagination";
import { useDashboards } from "../Navbar/useDashboard";

export default function Sidebar() {
  const device = useDevice();
  const [page, setPage] = useState<number>(1);
  const [direction, setDirection] = useState<"prev" | "next">("next");
  const prevPage = useRef(page);

  useEffect(() => {
    if (page > prevPage.current) {
      setDirection("next");
    } else if (page < prevPage.current) {
      setDirection("prev");
    }
    prevPage.current = page;
  }, [page]);

  const { data, isLoading } = useDashboards(page, device);

  const dashboards = data?.dashboards ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / 15);

  const isPage = totalPages > 1;
  const isPrev = direction === "prev";

  return (
    <>
      <div>
        {/* 로고 이미지 */}
        <div className="tablet:mb-14 pc:justify-start mb-8 flex h-full w-full items-center justify-center">
          <Logo />
        </div>

        {/*클릭 시 대시보드 생성 모달 열림*/}
        <AddDashboard />

        <div className="grid">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={page}
              initial={{ x: isPrev ? "-23%" : "23%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isPrev ? "-23%" : "23%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="col-start-1 row-start-1"
            >
              {isLoading ? <DashboardSkeleton /> : <DashboardList dashboards={dashboards} />}
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
