"use client";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

import Chip from "@/components/common/chip/Chip";
import DatePicker from "@/components/form/DatePicker";
import Field from "@/components/form/Field";
import ImgUpload from "@/components/form/ImgUpload";
import Input from "@/components/form/Input";
import Select, { Option } from "@/components/form/Select";
import TagInput, { Tag } from "@/components/form/TagInput";
import Textarea from "@/components/form/Textarea";
import Button from "@/components/common/Button";
import { Modal, ModalHeader, ModalContext, ModalFooter } from "@/components/modal/Modal";
import { updateCard } from "@/features/cards/api";
import { uploadCardImage } from "@/features/columns/api";
import { useColumnId } from "@/features/columns/store";
import { ColumnData } from "@/features/dashboard/types";
import { getMembers } from "@/features/members/api";
import { Card } from "@/features/cards/types";
import { getColorForTag } from "@/lib/utils/tagColor";

const now = dayjs();

type ModalType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cardData?: Card | null;
  setColumns?: React.Dispatch<React.SetStateAction<ColumnData[]>>;
  onModifyComplete?: () => void;
  columnTitle: string;
};

export default function ModifyCardModal({
  isOpen,
  setIsOpen,
  cardData,
  setColumns,
  onModifyComplete,
  columnTitle,
}: ModalType) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null); // 추가: 선택된 컬럼 ID

  // 멤버 관련
  const [members, setMembers] = useState<Option[]>([]);
  const [selectedMember, setSelectedMember] = useState<Option | null>(null);
  const [assigneeId, setAssigneeId] = useState<number | null>(null);

  // 공백값 체크(필수 표시 붙은것만!)
  const isDisabled = title.trim() === "" || description.trim() === "";

  const { columnIdData, setMembersId, columnStatusTitle } = useColumnId();
  const cardId = columnIdData?.cardId ?? 0;
  const dashboardId = columnIdData?.dashboardId ?? 0;
  const columnId = columnIdData?.columnId ?? 0;

  // 상태 선택하기 - 주스탠드 데이터를 활용해서 생성
  const stateOpt = columnStatusTitle
    ? Object.entries(columnStatusTitle).map(([title, id]) => ({
        value: String(id),
        label: title,
        chip: <Chip variant="status" label={title} />,
      }))
    : [];

  // 멤버 목록 가져오기
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

  // 담당자 선택 시 호출되는 함수
  const handleAssigneeSelect = (opt: Option) => {
    const selectedId = Number(opt.value);
    setAssigneeId(selectedId);
    setSelectedMember(opt);

    // 선택된 담당자만 Zustand에 저장
    setMembersId([opt]);
  };

  // 상태(컬럼) 선택 시 호출되는 함수
  const handleStatusSelect = (opt: Option) => {
    const newColumnId = Number(opt.value);
    setSelectedColumnId(newColumnId);
  };

  useEffect(() => {
    if (cardData && isOpen && members.length > 0) {
      setTitle(cardData.title || "");
      setDescription(cardData.description || "");
      setDueDate(cardData.dueDate ? new Date(cardData.dueDate) : null);

      // string[] → Tag[]
      setTags(
        (cardData.tags || []).map((t) => ({
          label: t,
          color: getColorForTag(t),
        })),
      );

      setImageUrl(cardData.imageUrl || "");
      setImageFile(null);
      setSelectedColumnId(columnId);

      if (cardData.assignee) {
        const currentAssigneeId = cardData.assignee.id;
        setAssigneeId(currentAssigneeId);
        const currentMember = members.find((m) => Number(m.value) === currentAssigneeId);
        if (currentMember) {
          setSelectedMember(currentMember);
          setMembersId([currentMember]);
        }
      }
    }
  }, [cardData, isOpen, members, columnId]);

  const handleUpdate = async () => {
    if (isDisabled || isLoading) return;

    // cardId 있는지
    if (!cardId) {
      alert("카드 확인 실패");
      return;
    }

    if (!assigneeId) {
      alert("담당자를 선택해주세요.");
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

      // 카드가 이동할 컬럼 ID 결정
      const targetColumnId = selectedColumnId || columnId;

      // 카드 수정 데이터 준비
      const updateData = {
        assigneeUserId: assigneeId,
        dashboardId: dashboardId,
        columnId: targetColumnId, // 새로운 컬럼 ID 사용
        title: title.trim(),
        description,
        dueDate: dueDate ? dayjs(dueDate).format("YYYY-MM-DD HH:mm") : "",
        tags: tags.map((t) => t.label),
        imageUrl: updateImg,
      };

      // 카드 수정 API 호출
      const updateResult = await updateCard(cardId, updateData);

      // 컬럼 상태 업데이트
      if (setColumns) {
        const updatedCard =
          "data" in (updateResult as any) ? (updateResult as any).data : updateResult;

        setColumns((prevColumns) => {
          return prevColumns.map((col) => {
            if (col.id === columnId && targetColumnId !== columnId) {
              // 기존 컬럼에서 제거
              return {
                ...col,
                cards: col.cards?.filter((card) => (card as any).id !== cardId) || [],
              };
            } else if (col.id === targetColumnId) {
              // 새 컬럼에 추가 or 기존 카드 업데이트
              if (targetColumnId !== columnId) {
                return { ...col, cards: [...(col.cards || []), updatedCard] };
              } else {
                return {
                  ...col,
                  cards:
                    col.cards?.map((card) => ((card as any).id === cardId ? updatedCard : card)) ||
                    [],
                };
              }
            }
            return col;
          });
        });
      }

      alert("수정되었습니다.");
      handleClose();

      // 수정 완료
      if (onModifyComplete) {
        onModifyComplete();
      }
    } catch (e) {
      console.error("카드 수정 오류");
      alert((e as Error).message || "카드 수정 중 오류가 발생했습니다.");
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
    setSelectedMember(null);
    setSelectedColumnId(null); // 추가

    // 모달 닫기
    setIsOpen(false);
  };

  return (
    <div>
      {isOpen && (
        <Modal open={isOpen} isOpenModal={setIsOpen} size="lg">
          <ModalHeader title="할 일 수정" />
          <ModalContext className="flex max-w-xl flex-col gap-7">
            <div className="grid grid-cols-2 gap-8">
              <Field id="status" label="상태">
                <Select
                  options={stateOpt}
                  placeholder="선택하기"
                  labelNone={true}
                  onSelect={handleStatusSelect}
                  value={selectedColumnId ? String(selectedColumnId) : undefined}
                />
              </Field>
              <Field id="manager" label="담당자">
                <Select options={members} placeholder="선택하기" onSelect={handleAssigneeSelect} />
              </Field>
            </div>
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
              <TagInput
                value={tags}
                onChange={(newTags) =>
                  setTags(
                    newTags.map((t) => ({
                      label: t.label,
                      color: getColorForTag(t.label),
                    })),
                  )
                }
              />
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
              className="h-[54px] w-64"
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
