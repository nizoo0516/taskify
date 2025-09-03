"use client";
import { useState } from "react";

import Card from "@/components/card/Card";

import CreateModal from "../components/CreateModal";

export default function DashboardId() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="">
        <Card
          title="새로운 일정 관리 Taskify"
          tags={["프로젝트", "백엔드", "상"]}
          date="2025.09.01"
        />
      </div>
      <button className="mt-8 w-72 bg-red-200" onClick={() => setIsOpen(true)}>
        +
      </button>
      <CreateModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
