"use client";

import { useState } from "react";

import Chip from "@/components/chip/Chip";
import MyButton from "@/components/layout/Button";
import { Modal, ModalHeader, ModalContext, ModalFooter } from "@/components/Modal";

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
    defaultColor = "#7AC555"
}: NewDashboardModalProps){
    const [name, setName] = useState("");
    const [selectedColor, setSelectedColor] = useState(defaultColor);

    const handleCreate = () => {
        if (!name.trim()) return alert("대시보드 이름을 입력해주세요.");
        onCreate(name, selectedColor);
        setName("");
        setSelectedColor(defaultColor);
        onClose();
    };

    if(!open) return null;

    return (
        <Modal open={open} size="lg" className="w-[584px] h-[334px]">
            <ModalHeader title="새로운 대시보드" />
            <ModalContext>
                <span>대시보드 이름</span>
                <input type="text" className="w-full border border-gray-300 rounded p-2"
                placeholder="대시보드 이름을 입력해주세요." value={name} onChange={(e) => setName(e.target.value)}/>
                <div className="mt-4 mb-4 flex items-center gap-2">
                    {colors.map((color) => (
                        <Chip key={color} variant="color" color={color} selected={color === selectedColor}
                        onClick={() => setSelectedColor(color)} />
                    ))}
                </div>
            </ModalContext>
            <ModalFooter>
                <MyButton color="buttonBasic" className="w-[256px] h-[54px]" onClick={onClose}>취소</MyButton>
                <MyButton color="buttonBlue" className="w-[256px] h-[54px] text-white" onClick={handleCreate}>생성</MyButton>
            </ModalFooter>
        </Modal>
    )
}