"use client";
import { useState, useEffect } from "react";

import Chip from "@/components/chip/Chip";
import DatePicker from "@/components/form/DatePicker";
import Field from "@/components/form/Field";
import ImgUpload from "@/components/form/ImgUpload";
import Input from "@/components/form/Input";
import Select from "@/components/form/Select";
import TagInput from "@/components/form/TagInput";
import Textarea from "@/components/form/Textarea";
import Button from "@/components/layout/Button";
import { Modal, ModalHeader, ModalContext, ModalFooter } from "@/components/Modal";
import { updateCard } from "@/features/cards/api";
import { uploadCardImage } from "@/features/columns/api";
import { useColumnId } from "@/features/columns/store";

import type { ColumnData, CardData } from "../../types";

type ModalType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cardData?: CardData; // 기존 카드 데이터를 props로 받기
  setColumns?: React.Dispatch<React.SetStateAction<ColumnData[]>>; // 컬럼 상태 업데이트용
  onModifyComplete?: () => void; // 수정 완료 콜백 추가
};

const stateOpt = [
  { value: "1", label: "To Do", chip: <Chip variant="status" label="To Do" /> },
  { value: "2", label: "On Progress", chip: <Chip variant="status" label="On Progress" /> },
  { value: "3", label: "Done", chip: <Chip variant="status" label="Done" /> },
];
const managerOpt = [
  { value: "6204", label: "사람1" },
  { value: "1", label: "배유철" },
  { value: "2", label: "배동석" },
];

export default function ModifyModal({
  isOpen,
  setIsOpen,
  cardData,
  setColumns,
  onModifyComplete,
}: ModalType) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 공백값 체크(필수 표시 붙은것만!)
  const isDisabled = title.trim() === "" || description.trim() === "";

  const { columnIdData } = useColumnId();
  const cardId = columnIdData?.cardId ?? 0;
  const dashboardId = columnIdData?.dashboardId ?? 0;
  const columnId = columnIdData?.columnId ?? 0;
  const assigneeUserId = 6204;

  // 기존 카드 데이터로 폼 초기화
  useEffect(() => {
    if (cardData && isOpen) {
      setTitle(cardData.title || "");
      setDescription(cardData.description || "");
      setDueDate(cardData.dueDate || "");
      setTags(cardData.tags || []);
      setImageUrl(cardData.imageUrl || "");
      setImageFile(null);
    }
  }, [cardData, isOpen]);

  const handleUpdate = async () => {
    if (isDisabled || isLoading) return;

    // cardId 있는지
    if (!cardId) {
      alert("카드 확인 실패");
      return;
    }

    setIsLoading(true);

    try {
      // 이미지 업로드 부분
      let updateImg: string | undefined;
      if (imageFile) {
        try {
          const formData = new FormData();
          formData.append("image", imageFile);

          const uploaded = await uploadCardImage(columnId, formData);
          const direct = (uploaded as { imageUrl?: unknown }).imageUrl;
          const nested = (uploaded as { data?: { imageUrl?: unknown } }).data?.imageUrl;
          const url =
            typeof direct === "string" ? direct : typeof nested === "string" ? nested : undefined;

          updateImg = url;
        } catch {
          console.error("이미지 업로드 실패");
        }
      } else if (imageUrl && !imageUrl.startsWith("blob:")) {
        updateImg = imageUrl;
      }

      // 카드 수정 데이터 준비
      const updateData = {
        assigneeUserId: assigneeUserId,
        dashboardId: dashboardId,
        columnId: columnId,
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate && { dueDate },
        tags: tags.length > 0 && { tags },
        imageUrl: updateImg && { imageUrl: updateImg },
      };

      console.log("카드 수정 요청 데이터:", updateData);

      // 카드 수정 API 호출
      const updateResult = await updateCard(cardId, updateData);

      console.log("수정된 카드:", updateResult);

      // 컬럼 상태 업데이트
      if (setColumns) {
        const updatedCard = "data" in updateResult ? updateResult.data : updateResult;

        setColumns((prevColumns) => {
          return prevColumns.map((col) => {
            if (col.id === columnId) {
              return {
                ...col,
                cards:
                  col.cards?.map((card) => ((card as any).id === cardId ? updatedCard : card)) ||
                  [],
              };
            }
            return col;
          });
        });
      }

      alert("수정 완료");
      handleClose();

      // 수정 완료 콜백 호출 (디테일 모달 업데이트용)
      if (onModifyComplete) {
        onModifyComplete();
      }
    } catch (error) {
      console.error("카드 수정 오류:", error);
      alert((error as Error).message || "카드 수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // 폼 초기화
    setTitle("");
    setDescription("");
    setDueDate("");
    setTags([]);
    setImageFile(null);
    setImageUrl("");

    // 모달 닫기
    setIsOpen(false);
  };

  return (
    <div>
      {isOpen && (
        <Modal open={isOpen} isOpenModal={setIsOpen} size="lg">
          <ModalHeader title="할 일 수정" />
          <ModalContext className="flex flex-col gap-7">
            <div className="grid grid-cols-2 gap-8">
              <Field id="status" label="상태">
                <Select options={stateOpt} placeholder="선택하기" labelNone={true} />
              </Field>
              <Field id="manager" label="담당자">
                <Select options={managerOpt} placeholder="선택하기" />
              </Field>
            </div>
            <Field id="title" label="제목">
              <Input
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
                placeholder="제목을 입력해주세요"
              />
            </Field>
            <Field id="description" label="설명">
              <Textarea
                className="resize-none"
                value={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
                placeholder="설명을 입력해주세요"
              />
            </Field>
            <Field id="dueDate" label="마감일">
              <DatePicker
                value={dueDate ? new Date(dueDate) : null}
                onChange={(date) => {
                  if (date) {
                    const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
                    setDueDate(formatted);
                  } else {
                    setDueDate("");
                  }
                }}
              />
            </Field>
            <Field id="tag" label="태그">
              <TagInput value={tags} onChange={setTags} />
            </Field>
            <Field id="image" label="이미지">
              <ImgUpload
                value={imageUrl}
                onChange={(file, previewUrl) => {
                  setImageFile(file);
                  setImageUrl(previewUrl);
                }}
              />
            </Field>
          </ModalContext>
          <ModalFooter>
            <Button className="h-[54px] w-64" onClick={handleClose} disabled={isLoading}>
              취소
            </Button>
            <Button
              className="text-brand-gray-100 h-[54px] w-64"
              onClick={handleUpdate}
              color={isDisabled || isLoading ? "buttonGrey" : "buttonBlue"}
              disabled={isDisabled || isLoading}
            >
              {isLoading ? "수정 중..." : "수정"}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
