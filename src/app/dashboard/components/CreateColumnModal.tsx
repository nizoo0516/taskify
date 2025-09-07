"use client";

import { useState } from "react";

import Field from "@/components/form/Field";
import Input from "@/components/form/Input";
import Button from "@/components/layout/Button";
import { Modal, ModalHeader, ModalContext, ModalFooter } from "@/components/modal/Modal";
import { createColumn } from "@/features/columns/api";

type Columns = { title: string; id: number };

type ModalType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setColumns: React.Dispatch<React.SetStateAction<Columns[]>>;
};

const DASHBOARD_ID = 16162;

export default function CreateColumnModal({ isOpen, setIsOpen, setColumns }: ModalType) {
  const [newColumn, setNewColumn] = useState("");
  const isDisabled = newColumn.trim() === "";

  const handleCreate = async () => {
    if (isDisabled) return;
    try {
      const craeteNewCol = await createColumn({
        title: newColumn.trim(),
        dashboardId: DASHBOARD_ID,
      });
      setColumns((prev) => [...prev, { title: craeteNewCol.title, id: craeteNewCol.id }]);
      setIsOpen(false);
      console.log("created column:", craeteNewCol);
    } catch (e) {
      alert((e as Error).message || "컬럼 생성 오류");
    }
  };

  return (
    <div>
      {isOpen && (
        <Modal open={isOpen} isOpenModal={setIsOpen} size="md">
          <ModalHeader title="새 컬럼 생성" />
          <ModalContext>
            <Field id="name" label="이름">
              <Input
                placeholder="새로운 프로젝트"
                value={newColumn}
                onChange={(e) => setNewColumn(e.currentTarget.value)}
              />
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
              className="h-[54px] w-64"
              onClick={handleCreate}
              color={isDisabled ? "buttonGrey" : "buttonBlue"}
              disabled={isDisabled}
            >
              생성
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
