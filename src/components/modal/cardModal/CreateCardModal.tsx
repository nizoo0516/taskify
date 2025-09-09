"use client";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import DatePicker from "@/components/form/DatePicker";
import Field from "@/components/form/Field";
import ImgUpload from "@/components/form/ImgUpload";
import Input from "@/components/form/Input";
import Select, { Option } from "@/components/form/Select";
import TagInput from "@/components/form/TagInput";
import Textarea from "@/components/form/Textarea";
import Button from "@/components/common/Button";
import { Modal, ModalHeader, ModalContext, ModalFooter } from "@/components/modal/Modal";
import { createCard } from "@/features/cards/api";
import { uploadCardImage } from "@/features/columns/api";
import { useColumnId } from "@/features/columns/store";
import { CardData, ColumnData } from "@/features/dashboard/types";
import { getMembers } from "@/features/members/api";

const now = dayjs();

type ModalType = {
  isOpen: boolean;
  setIsOpen: () => void;
  setColumns: React.Dispatch<React.SetStateAction<ColumnData[]>>;
  onCardCreated?: () => void;
};

export default function CreateCardModal({
  isOpen,
  setIsOpen,
  setColumns,
  onCardCreated,
}: ModalType) {
  // Zustand에서 컬럼 정보 가져오기
  const { columnIdData, setCardId } = useColumnId();

  // input 값들
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [members, setMembers] = useState<Option[]>([]);
  const [assigneeId, setAssigneeId] = useState<number | null>(null);

  // 필수 값 체크
  const isDisabled = title.trim() === "" || description.trim() === "";

  // Zustand에서 값 가져오기
  const dashboardId = columnIdData?.dashboardId ?? 0;
  const columnId = columnIdData?.columnId ?? 0;

  useEffect(() => {
    if (!isOpen || !dashboardId) return;

    (async () => {
      try {
        const res = await getMembers(dashboardId, { page: 1, size: 20 });

        const opts = res.members.map((m) => ({
          value: String(m.userId),
          label: m.nickname,
          chip: (
            <img
              src={m.profileImageUrl}
              alt={m.nickname}
              className="h-[26px] w-[26px] rounded-full object-cover"
            />
          ),
        }));

        setMembers(opts);
      } catch (err) {
        console.error("멤버 목록 불러오기 실패:", err);
      }
    })();
  }, [isOpen, dashboardId]);

  const handleCreate = async () => {
    if (isDisabled || isLoading) return;
    if (!columnIdData) {
      alert("컬럼 정보가 없습니다.");
      return;
    }
    if (!assigneeId) {
      alert("담당자를 선택해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // 이미지 업로드 처리
      let finalImageUrl: string | undefined;

      if (imageFile) {
        try {
          const formData = new FormData();
          formData.append("image", imageFile);

          const uploadResult = await uploadCardImage(columnId, formData);

          // API 응답 구조에 따른 처리
          const direct = (uploadResult as { imageUrl?: unknown }).imageUrl;
          const nested = (uploadResult as { data?: { imageUrl?: unknown } }).data?.imageUrl;
          const url =
            typeof direct === "string" ? direct : typeof nested === "string" ? nested : undefined;

          finalImageUrl = url;
        } catch (uploadError) {
          console.error("이미지 업로드 실패", uploadError);
        }
      } else if (imageUrl && !imageUrl.startsWith("blob:")) {
        finalImageUrl = imageUrl;
      }

      // 카드 생성 데이터
      const cardData = {
        assigneeUserId: assigneeId,
        dashboardId,
        columnId,
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate ? dayjs(dueDate).format("YYYY-MM-DD HH:mm") : "",
        tags: Array.isArray(tags) ? tags : [],
        imageUrl: finalImageUrl,
      };

      console.log("카드 생성 요청 데이터:", cardData);

      // 카드 생성 API 호출
      const createResult = await createCard(cardData);

      // API 응답 구조에 따른 처리
      const createdCard: CardData =
        "data" in (createResult as any) ? (createResult as any).data : createResult;

      // Zustand에다가 생성된 카드 아이디 담기
      const createdCardId = createdCard as CardData & { id: number };
      if (createdCardId.id) {
        setCardId(createdCardId.id);
      }

      // 컬럼 상태 업데이트
      setColumns((prevColumns) => {
        return prevColumns.map((col) => {
          if (col.id === columnId) {
            return {
              ...col,
              cards: [...(col.cards ?? []), createdCard],
            };
          }
          return col;
        });
      });

      // 카드 생성 완료 콜백 호출 (서버에서 최신 데이터 다시 불러오기용)
      if (onCardCreated) {
        onCardCreated();
      }

      // 성공 시 모달 닫기 및 폼 초기화
      handleClose();
      alert("카드가 생성되었습니다!");
    } catch (error) {
      console.error("카드 생성 오류:", error);
      alert((error as Error).message || "카드 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // 폼 초기화
    setTitle("");
    setDescription("");
    setDueDate(null);
    setTags([]);
    setImageFile(null);
    setImageUrl("");
    setAssigneeId(null);

    // 모달 닫기
    setIsOpen();
  };

  return (
    <>
      {isOpen && (
        <Modal open={isOpen} isOpenModal={setIsOpen} size="lg">
          <ModalHeader title="할 일 생성" />
          <ModalContext className="flex flex-col gap-7">
            <Field id="manager" label="담당자">
              <Select
                options={members}
                placeholder="선택하기"
                onSelect={(opt) => setAssigneeId(Number(opt.value))}
              />
            </Field>

            <Field id="title" label="제목" essential>
              <Input
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
                placeholder="제목을 입력해주세요"
              />
            </Field>

            <Field id="description" label="설명" essential>
              <Textarea
                className="resize-none"
                value={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
                placeholder="설명을 입력해주세요"
              />
            </Field>

            <Field id="dueDate" label="마감일">
              <DatePicker value={dueDate} onChange={(date) => setDueDate(date)} />
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
              onClick={handleCreate}
              color={isDisabled ? "buttonGrey" : "buttonBlue"}
              disabled={isDisabled || isLoading}
            >
              {isLoading ? "생성 중..." : "생성"}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
}
