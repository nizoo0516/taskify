"use client";

import Column from "@/components/column/Column";

export default function DashboardId() {
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
    <main className="flex min-h-screen bg-gray-50">
      {/* 컬럼 테스트 */}
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
    </main>
  );
}
