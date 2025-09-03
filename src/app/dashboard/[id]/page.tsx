"use client";

import Chip from "@/components/chip/Chip";
import Column from "@/components/column/Column";
import MyButton from "@/components/layout/Button";
import Navbar from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import { Dashboard } from "@/features/dashboard/types";

export default function DashboardId() {
  const dashboards: Dashboard[] = [
    {
      id: 1,
      title: "비브리지",
      color: "#7AC555",
      createdAt: "2025-09-03T00:00:00Z", // 더미 날짜
      updatedAt: "2025-09-03T00:00:00Z",
      createdByMe: true,
      userId: 1,
    },
    {
      id: 2,
      title: "코드잇",
      color: "#760DDE",
      createdAt: "2025-09-03T00:00:00Z",
      updatedAt: "2025-09-03T00:00:00Z",
      createdByMe: true,
      userId: 2,
    },
    {
      id: 3,
      title: "3분기 계획",
      color: "#FFA500",
      createdAt: "2025-09-03T00:00:00Z",
      updatedAt: "2025-09-03T00:00:00Z",
      createdByMe: false,
      userId: 2,
    },
  ];

  const cards = [
    {
      title: "새로운 일정 관리 Taskify",
      tags: ["프로젝트", "백엔드", "상"],
      date: "2022.12.31",
      image: "/images/img-card-pink.svg",
      author: "B",
    },
    {
      title: "새로운 일정 관리 Taskify",
      tags: ["프로젝트", "백엔드", "상"],
      date: "2022.12.31",
      image: "/images/img-card-blue.svg",
      author: "B",
    },
    {
      title: "새로운 일정 관리 Taskify",
      tags: ["프로젝트", "백엔드", "상"],
      date: "2022.12.31",
      image: "/images/img-card-lime.svg",
      author: "B",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 사이드바 */}
      <aside className="w-[300px] bg-[#FFFFFF] px-3 py-5">
        <Sidebar dashboards={dashboards} />
      </aside>

      {/* 메인 영역 */}
      <div className="flex flex-1 flex-col">
        {/* 네비게이션 바 */}
        <header className="h-[70px] items-center border-b border-[#D9D9D9] bg-white px-10">
          <Navbar id={1} title="비브리지" />
        </header>

        {/* 컬럼 영역 */}
        <main className="flex flex-1">
          <Column
            status="To Do"
            count={cards.length}
            cards={cards}
            onAddCard={() => alert("카드 추가")}
          />
          <Column
            status="On Progress"
            count={cards.length}
            cards={cards}
            onAddCard={() => alert("카드 추가")}
          />
          <Column
            status="Done"
            count={cards.length}
            cards={cards}
            onAddCard={() => alert("카드 추가")}
          />

          {/* 새로운 컬럼 추가 버튼 */}
          <MyButton
            onClick={() => alert("새 컬럼 추가")}
            className="mt-17 ml-5 flex h-[70px] w-[354px] items-center justify-center border border-[#D9D9D9] bg-white"
          >
            <span className="mr-3 text-lg font-bold">새로운 컬럼 추가하기</span>
            <Chip variant="add" />
          </MyButton>
        </main>
      </div>
    </div>
  );
}
