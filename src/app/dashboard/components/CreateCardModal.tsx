"use client";
import { useState } from "react";
import { CardRequest } from "@/features/cards/api";

import DatePicker from "@/components/form/DatePicker";
import Field from "@/components/form/Field";
import ImgUpload from "@/components/form/ImgUpload";
import Input from "@/components/form/Input";
import Select from "@/components/form/Select";
import TagInput from "@/components/form/TagInput";
import Textarea from "@/components/form/Textarea";
import Button from "@/components/layout/Button";
import { Modal, ModalHeader, ModalContext, ModalFooter } from "@/components/modal/Modal";
import { create } from "domain";

type ModalType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const managerOpt = [
  { value: "1", label: "배유철" },
  { value: "2", label: "배동석" },
];

export default function CreateModal({ isOpen, setIsOpen }: ModalType) {
  // input 값
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [tag, setTag] = useState([]);
  const [image, setImage] = useState("");

  // 공백값 체크(필수 표시 붙은것만!)
  const isDisabled = title.trim() === "" || description.trim() === "";

  const assigneeUserId = 6166;
  const dashboardId = 16162;
  const columnId = 54522;

  const handleCreate = async () => {
    if (isDisabled) return;
    try {
      const createNewCard = await createCard({
        assigneeUserId: assigneeUserId,
        dashboardId: dashboardId,
        columnId: columnId,
        title: title.trim(),
        description: description.trim(),
        dueDate: "2025-09-05 10:34",
      });
    } catch {
      alert("오류");
    }
  };

  return (
    <div>
      {isOpen && (
        <Modal open={isOpen} isOpenModal={setIsOpen} size="lg">
          <ModalHeader title="할 일 생성" />
          <ModalContext className="flex flex-col gap-7">
            <Field id="manager" label="담당자">
              <Select options={managerOpt} placeholder="선택하기" />
            </Field>
            <Field id="title" label="제목">
              <Input value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
            </Field>
            <Field id="description" label="설명">
              <Textarea
                className="resize-none"
                value={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
              />
            </Field>
            <Field id="dueDate" label="마감일">
              <DatePicker />
            </Field>
            <Field id="tag" label="태그">
              <TagInput />
            </Field>
            <Field id="image" label="이미지">
              <ImgUpload />
            </Field>
          </ModalContext>
          <ModalFooter>
            <Button
              className="h-[54px] w-64"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              취소
            </Button>
            <Button
              className="text-brand-gray-100 h-[54px] w-64"
              onClick={() => {}}
              color={isDisabled ? "buttonGrey" : "buttonBlue"}
            >
              생성
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
