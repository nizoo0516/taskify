"use client";
import { useState } from "react";

import BoardsModal from "../components/BoardsModal";
import CreateModal from "../components/CreateModal";
import ModifyModal from "../components/ModifyModal";

export default function DashboardId() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className=""></div>
      <button onClick={() => setIsOpen(!isOpen)}>BoardsModal</button>
      {isOpen && <CreateModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </>
  );
}
