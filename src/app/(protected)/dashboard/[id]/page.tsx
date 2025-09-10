"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import Chip from "@/components/common/chip/Chip";
import Column from "@/components/column/Column";
import MyButton from "@/components/common/Button";
import { getColumns } from "@/features/columns/api";
import { getCards } from "@/features/cards/api";
import { useColumnId } from "@/features/columns/store";
import { ColumnData } from "@/features/dashboard/types";
import CreateCardModal from "@/components/modal/cardModal/CreateCardModal";
import CreateColumnModal from "@/components/modal/columnModal/CreateColumnModal";

export default function DashboardId() {
  const { id } = useParams();
  const dashboardId = Number(id);

  const [modal, setModal] = useState<null | "card" | "column">(null);
  const [isKebabOpen, setIsKebabOpen] = useState<number | null>(null);
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Zustand 스토어에서 함수 가져오기
  const { setColumnIdData, setStatus } = useColumnId();

  console.log("컬럼값!!!", columns);
  useEffect(() => {
    if (!dashboardId) return;

    (async () => {
      try {
        setIsLoading(true);
        // 컬럼 목록 가져오기
        const response = await getColumns(dashboardId);
        const columnsData = Array.isArray(response) ? response : response?.data || [];

        // 컬럼마다 카드 목록 가져오기
        const columnsWithCards = await Promise.all(
          columnsData.map(async (col) => {
            try {
              const cardResponse = await getCards(col.id, { size: 50 });
              const cards = cardResponse?.cards ?? [];
              return {
                ...col,
                cards: cards, // 실제 카드 데이터 포함
              };
            } catch (err) {
              console.error(`컬럼 ${col.id} 카드 조회 실패:`, err);
              return {
                ...col,
                cards: [], // 에러 시 빈 배열
              };
            }
          }),
        );
        setColumns(columnsWithCards);

        const statusMap = Object.fromEntries(columnsWithCards.map((c) => [c.title, c.id]));
        setStatus(statusMap);
      } catch (error) {
        console.error("컬럼 목록 조회 실패:", error);
        setColumns([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [dashboardId]);

  // 카드 추가 버튼 클릭 시 - zustand에 정보 저장하고 모달 열기
  const handleAddCard = (columnId: number, columnTitle: string) => {
    console.log("카드 추가 클릭 - 컬럼 ID:", columnId, "대시보드 ID:", dashboardId);

    // Zustand에 현재 선택된 컬럼과 대시보드 정보 저장
    setColumnIdData(dashboardId, columnId, columnTitle);

    // 카드 생성 모달 열기
    setModal("card");
  };

  const handleAddColumn = () => {
    setModal("column");
  };

  const closeModal = () => {
    setModal(null);
  };

  if (isLoading) {
    return <div className="flex flex-1 items-center justify-center">로딩 중</div>;
  }

  return (
    <main className="pc:flex-row pc:min-h-screen bg-brand-gray-100 flex flex-1 flex-col">
      {columns.map((item, i) => (
        <Column
          key={item.id}
          status={item.title}
          cards={item.cards ?? []}
          onAddCard={() => handleAddCard(item.id, item.title)} // 여기서 컬럼 ID 전달
          kebabIndex={isKebabOpen === i}
          isKebabOpen={() => setIsKebabOpen((prev) => (prev === i ? null : i))}
          dashboardId={dashboardId}
          columnId={item.id}
          setColumns={setColumns}
        />
      ))}

      {/* 새로운 컬럼 추가 버튼 */}
      <div className="pc:pt-17 pc:w-[354px] mx-5 flex flex-shrink-0 py-5">
        <MyButton
          onClick={handleAddColumn}
          className="border-brand-gray-300 flex h-[70px] w-full items-center justify-center border bg-white"
        >
          <span className="mr-3 text-lg font-bold">새로운 컬럼 추가하기</span>
          <Chip variant="add" />
        </MyButton>
      </div>

      {/* 모달들 */}
      {modal === "card" && (
        <CreateCardModal isOpen setIsOpen={closeModal} setColumns={setColumns} />
      )}

      {modal === "column" && (
        <CreateColumnModal isOpen setIsOpen={closeModal} setColumns={setColumns} />
      )}
    </main>
  );
}
