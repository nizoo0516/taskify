"use client";

import Chip from "@/components/chip/Chip";
import Textarea from "@/components/form/Textarea";
import { Modal, ModalHeader, ModalContext } from "@/components/Modal";

type ModalType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function BoardsModal({ isOpen, setIsOpen }: ModalType) {
  return (
    <div>
      {isOpen && (
        <Modal open={isOpen}>
          <ModalHeader title="새로운 새로운 일정 관리 Taskify" onClose={() => setIsOpen(false)} />
          <ModalContext>
            <div className="flex items-center gap-5">
              <Chip variant="status" label="To Do" />
              <span className="bg-brand-gray-300 h-5 w-[1px]" />
              <div className="flex gap-1.5">
                <Chip variant="category" label="프로젝트" />
                <Chip variant="category" label="일반" />
                <Chip variant="category" label="백앤드" />
                <Chip variant="category" label="상 " />
              </div>
            </div>
            <div>일정관리 내용</div>
            <div>
              <Textarea />
            </div>
          </ModalContext>
        </Modal>
      )}
    </div>
  );
}
