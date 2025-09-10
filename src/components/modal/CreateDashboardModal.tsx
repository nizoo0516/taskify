"use client";

import { useState } from "react";

import Chip from "@/components/common/chip/Chip";
import MyButton from "@/components/common/Button";
import { Modal, ModalHeader, ModalContext, ModalFooter } from "@/components/modal/Modal";

interface NewDashboardModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, color: string) => void;
  defaultColor?: string;
}

const colors = ["#7AC555", "#760DDE", "#FFA500", "#E876EA", "#76A5EA"];

export default function NewDashboardModal({
  open,
  onClose,
  onCreate,
  defaultColor = "#7AC555",
}: NewDashboardModalProps) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(defaultColor);

  const handleCreate = () => {
    if (!name.trim()) return alert("대시보드 이름을 입력해주세요.");
    onCreate(name, selectedColor);
    setName("");
    setSelectedColor(defaultColor);
    onClose();
  };

  return (
    <Modal open={open} size="lg" className="h-[334px] w-[584px]">
      <ModalHeader title="새로운 대시보드" />
      <ModalContext>
        <span>대시보드 이름</span>
        <input
          type="text"
          className="border-brand-gray-200 dark:bg-dark-900 w-full rounded border p-2"
          placeholder="대시보드 이름을 입력해주세요."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="mt-4 mb-4 flex items-center gap-2">
          {colors.map((color) => (
            <Chip
              key={color}
              variant="color"
              color={color}
              selected={color === selectedColor}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
      </ModalContext>
      <ModalFooter>
        <MyButton color="buttonBasic" className="h-[54px] w-[256px]" onClick={onClose}>
          취소
        </MyButton>
        <MyButton color="buttonBlue" className="h-[54px] w-[256px]" onClick={handleCreate}>
          생성
        </MyButton>
      </ModalFooter>
    </Modal>
  );
}
