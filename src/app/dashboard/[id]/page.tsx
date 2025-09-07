"use client";

import { useState } from "react";

import Chip from "@/components/chip/Chip";
import Column from "@/components/column/Column";
import MyButton from "@/components/layout/Button";

import CreateCardModal from "../components/CreateCardModal";
import CreateColumnModal from "../components/CreateColumnModal";

export default function DashboardId() {
  // 모달 오픈
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isColumnOpen, setIsColumnOpen] = useState(false);
  const [columnIndex, setColumnIndex] = useState<number | null>(null);

  const [cards, setCards] = useState([
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
  ]);
  // 기본적으로 보여지는 컬럼
  const [columns, setColumns] = useState([
    { title: "To Do", id: 0 },
    { title: "On Progress", id: 1 },
    { title: "On Done", id: 2 },
  ]);

  return (
    <main className="pc:flex-row bg-brand-gray-100 flex flex-1 flex-col">
      {columns.map((item, i) => (
        <Column
          status={item.title}
          count={cards.length}
          cards={cards}
          onAddCard={() => setIsCardOpen(true)}
          key={item.id}
          kebabIndex={columnIndex === i}
          // 클릭한 index만 열기
          isKebabOpen={() => setColumnIndex((prev) => (prev === i ? null : i))}
          columnId={item.id}
          setColumns={setColumns}
        />
      ))}
      {/* 새로운 컬럼 추가 버튼 */}
      <div className="pc:pt-17 pc:w-[354px] mx-5 py-5">
        {/* 새로운 컬럼 추가 버튼 */}
        <MyButton
          onClick={() => {
            setIsColumnOpen(true);
          }}
          className="border-brand-gray-300 flex h-[70px] w-full items-center justify-center border bg-white"
        >
          <span className="mr-3 text-lg font-bold">새로운 컬럼 추가하기</span>
          <Chip variant="add" />
        </MyButton>
      </div>
      {isCardOpen && <CreateCardModal isOpen={isCardOpen} setIsOpen={setIsCardOpen} />}
      {isColumnOpen && (
        <CreateColumnModal
          isOpen={isColumnOpen}
          setIsOpen={setIsColumnOpen}
          setColumns={setColumns}
        />
      )}
    </main>
  );
}
