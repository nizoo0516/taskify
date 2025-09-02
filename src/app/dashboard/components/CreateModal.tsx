"use client";

import Image from "next/image";

import Input from "@/components/form/Input";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Textarea from "@/components/form/Textarea";
import Button from "@/components/layout/Button";
import { Modal, ModalHeader, ModalContext, ModalFooter } from "@/components/Modal";

type ModalType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const managerOpt = [{ value: "1", label: "사람1" }];

export default function CreateModal({ isOpen, setIsOpen }: ModalType) {
  return (
    <div>
      {isOpen && (
        <Modal open={isOpen} size="lg">
          <ModalHeader title="할 일 생성" />
          <ModalContext>
            <div className="mb-8">
              <div>
                <Label essential>담당자</Label>
                <Select options={managerOpt} placeholder="선택하기" />
              </div>
            </div>
            <div className="mb-8">
              <Label essential>제목</Label>
              <Input />
            </div>
            <div className="mb-8">
              <Label essential>설명</Label>
              <Textarea className="resize-none" />
            </div>
            <div className="mb-8">
              <Label>마감일</Label>
              <Input />
            </div>
            <div className="mb-8">
              <Label>태그</Label>
              <Input />
            </div>
            <div>
              <Label>이미지 </Label>
              <Image
                src={`https://placehold.co/200x120?text=No+Image`}
                alt="프로필 이미지"
                height={76}
                width={76}
                unoptimized
              />
            </div>
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
              color="buttonBlue"
            >
              수정
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
