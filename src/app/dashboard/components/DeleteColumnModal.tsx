"use client";

import Button from "@/components/layout/Button";
import { Modal, ModalContext, ModalFooter } from "@/components/Modal";
import { deleteColumn } from "@/features/columns/api";
type ModalType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const COLUMN_ID = 54526;

export default function CreateColumnModal({ isOpen, setIsOpen }: ModalType) {
  const handleDelete = async () => {
    alert("컬럼의 모든 카드가 삭제됩니다");
    try {
      await deleteColumn(COLUMN_ID);
      setIsOpen(false);
    } catch (e) {
      alert((e as Error).message || "컬럼 삭제 오류");
    }
  };

  return (
    <div>
      {isOpen && (
        <Modal open={isOpen} isOpenModal={setIsOpen} size="md">
          <ModalContext>
            <p>컬럼의 모든 카드가 삭제됩니다.</p>
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
            <Button className="h-[54px] w-64" onClick={handleDelete} color="buttonBlue">
              삭제
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
