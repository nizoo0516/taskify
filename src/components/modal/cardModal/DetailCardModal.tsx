"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import Chip from "@/components/common/chip/Chip";
import KebabModal from "@/components/modal/KebabModal";
import Button from "@/components/common/Button";
import { Modal, ModalHeader, ModalContext } from "@/components/modal/Modal";
import { getCard, deleteCard } from "@/features/cards/api";
import { useColumnId } from "@/features/columns/store";
import { cn } from "@/lib/utils/cn";

import Comment from "./Comment";
import ModifyCardModal from "./ModifyCardModal";
import { CardData, ColumnData } from "@/features/dashboard/types";

type ModalType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setColumns?: React.Dispatch<React.SetStateAction<ColumnData[]>>;
  columnId?: number;
};

export default function BoardsModal({ isOpen, setIsOpen, setColumns }: ModalType) {
  const [card, setCard] = useState<CardData | null>(null);
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const [isModifyModal, setIsModifyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { columnIdData } = useColumnId();
  const cardId = columnIdData?.cardId;
  const columnId = columnIdData?.columnId;

  // 카드 데이터 다시 불러오기 함수
  const fetchCardData = async () => {
    if (!cardId) return;

    setIsLoading(true);
    try {
      console.log("카드 데이터 로딩 시작, cardId:", cardId);
      const res = await getCard(cardId);
      const data = (res as any)?.data ?? res;

      console.log("받아온 카드 데이터:", data);
      setCard(data);
    } catch (e) {
      console.error("카드 로딩 오류:", e);
      alert((e as Error)?.message || "카드 상세 불러오기 실패");
    } finally {
      setIsLoading(false);
    }
  };

  // 디테일 모달값 받아오기
  useEffect(() => {
    if (!isOpen || !cardId) return;

    fetchCardData();
  }, [isOpen, cardId]);

  // 카드 삭제하기
  const handleDelete = async () => {
    if (!cardId) {
      alert("카드 정보가 없습니다.");
      return;
    }

    if (!confirm("이 카드를 삭제할까요?")) return;

    setIsLoading(true);

    try {
      await deleteCard(cardId);

      // 컬럼 상태에서 카드 제거
      if (setColumns && columnId) {
        setColumns((prevColumns) => {
          return prevColumns.map((col) => {
            if (col.id === columnId) {
              return {
                ...col,
                cards: col.cards?.filter((c) => c.id !== cardId) || [],
              };
            }
            return col;
          });
        });
      }

      alert("삭제되었습니다.");
      setIsKebabOpen(false);
      setIsOpen(false);
    } catch (e) {
      console.error("카드 삭제 오류:", e);
      alert((e as Error).message || "카드 삭제 오류");
    } finally {
      setIsLoading(false);
    }
  };

  // 수정 모달 열기
  const handleModify = () => {
    setIsKebabOpen(false); // 케밥 메뉴 닫기
    setIsModifyModal(true); // 수정 모달 열기
  };

  //  서버에서 최신 데이터 다시 불러오기
  const handleModifyComplete = async () => {
    setIsModifyModal(false); // 수정 모달 닫기
    await fetchCardData(); // 최신 데이터 다시 불러오기
  };

  // 로딩 중일 때
  if (isLoading && !card) {
    return (
      <div>
        {isOpen && (
          <Modal open={isOpen} size="xl" className="relative">
            <ModalHeader title="로딩 중..." onClose={() => setIsOpen(false)} />
            <ModalContext className="flex items-center justify-center p-8">
              <p>카드 정보를 불러오는 중...</p>
            </ModalContext>
          </Modal>
        )}
      </div>
    );
  }

  return (
    <div>
      {isOpen && (
        <Modal open={isOpen} size="xl" className="relative">
          <ModalHeader title={card?.title || "카드 상세 모달"} onClose={() => setIsOpen(false)}>
            <Button
              onClick={() => setIsKebabOpen(!isKebabOpen)}
              className="mr-6 ml-auto border-0"
              disabled={isLoading}
            >
              <Image src="/icons/icon-menu.svg" width={28} height={28} alt="더보기" />
            </Button>
          </ModalHeader>
          <ModalContext
            className={cn(
              "flex flex-col",
              "pc:flex pc:items-start pc:justify-between pc:flex-row-reverse",
              "tablet:flex tablet:items-start tablet:justify-between tablet:flex-row-reverse",
            )}
          >
            <div
              className={cn(
                "mb-4 flex w-full justify-between gap-4 self-start rounded-lg border border-[#D9D9D9] p-4",
                "tablet:w-[180px] tablet:flex-col tablet:mb-4",
                "pc:w-[200px]",
              )}
            >
              <div className="w-2/5">
                <p className="font-bold">담당자</p>
                <p className="text-sm">배문철</p>
              </div>
              <div className="w-3/5">
                <p className="font-bold">마감일</p>
                <p className="text-sm whitespace-nowrap">{card?.dueDate || "마감일 없음"}</p>
              </div>
            </div>
            <div className={cn("flex w-full flex-col gap-4", "tablet:w-[420px]", "pc:w-[450px]")}>
              <div className="flex items-center gap-5">
                <Chip variant="status" label="To Do" />
                <span className="bg-brand-gray-300 h-5 w-[1px]" />
                <div className="flex gap-1.5">
                  {card?.tags?.map((tag, index) => (
                    <Chip key={`${tag}-${index}`} variant="category" label={tag} />
                  ))}
                </div>
              </div>
              <div>
                <p className="p-2.5">{card?.description}</p>
                {card?.imageUrl && card.imageUrl.trim() ? (
                  <Image
                    src={card.imageUrl}
                    alt="이미지"
                    width={274}
                    height={160}
                    className={cn("h-[168px] w-full rounded-md object-contain", "pc:h-[260px]")}
                  />
                ) : (
                  <Image
                    src="/images/img-card-pink.svg"
                    alt="기본 이미지"
                    width={274}
                    height={160}
                    className={cn("rounded-mdobject-contain h-[168px] w-full", "pc:h-[260px]")}
                  />
                )}
              </div>
              <Comment />
            </div>
          </ModalContext>

          {/* 케밥 메뉴 */}
          {isKebabOpen && (
            <KebabModal className="top-16 right-24 bg-white">
              <Button
                onClick={handleModify}
                className="h-8 w-20"
                color="buttonWhite"
                disabled={isLoading}
              >
                수정하기
              </Button>
              <Button
                onClick={handleDelete}
                className="h-8 w-20"
                color="buttonWhite"
                disabled={isLoading}
              >
                {isLoading ? "삭제 중..." : "삭제하기"}
              </Button>
            </KebabModal>
          )}
        </Modal>
      )}

      {/* 수정 모달 */}
      {isModifyModal && (
        <ModifyCardModal
          isOpen={isModifyModal}
          setIsOpen={setIsModifyModal}
          cardData={card}
          setColumns={setColumns}
          onModifyComplete={handleModifyComplete} // 수정 완료 콜백 추가
        />
      )}
    </div>
  );
}
