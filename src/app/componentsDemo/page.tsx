"use client";
import { useState } from "react";

import { Modal, ModalHeader, ModalFooter } from "@/components/Modal";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-500">Tailwind 테스트</h1>
      <button
        className="px-4 py-2 mt-4 text-white rounded bg-violet-500 hover:bg-violet-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        버튼 테스트
      </button>
      {isOpen && (
        <Modal open={isOpen}>
          <ModalHeader title="모달제목" onClose={() => setIsOpen(false)} />
          내용ㅇㅇㅇㅇㅇ
          <ModalFooter>
            <button>확인</button>
          </ModalFooter>
        </Modal>
      )}
      <div className="h-[2000px] w-80 bg-red-700"></div>
    </div>
  );
}
