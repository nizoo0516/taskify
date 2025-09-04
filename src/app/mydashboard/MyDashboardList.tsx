"use client";

import {useState} from "react";

import MyButton from "@/components/layout/Button";
import {Modal, ModalHeader, ModalContext, ModalFooter} from "@/components/Modal";


interface Dashboard{
  id: string;
  title: string;
}

interface Invite{
  id: string;
  name: string;
  inviter: string;
}

const dashboards: Dashboard[] = [
  {id: "1", title: "Jennie"},
  {id: "2", title: "Lisa"},
  {id: "3", title: "Rose"},
  {id: "4", title: "Chaewon"},
  {id: "5", title: "Annie"},
  {id: "6", title: "Rei"},
  {id: "7", title: "Hyunjin"},
];

const invites: Invite[] = [
  {id: "8", name: "NCT", inviter: "Mark"},
  {id: "9", name: "Stray Kids", inviter: "Felix"},
  {id: "10", name: "fromis9", inviter: "Hayoung"},
  {id: "11", name: "NCT", inviter: "Mark"},
  {id: "12", name: "Stray Kids", inviter: "Felix"},
  {id: "13", name: "fromis9", inviter: "Hayoung"},
  {id: "14", name: "NCT", inviter: "Mark"},
  {id: "15", name: "Stray Kids", inviter: "Felix"},
  {id: "16", name: "fromis9", inviter: "Hayoung"},
];

export default function MyDashboardList() {
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState("");

  const itemsPerPage = 5;
  const totalPages = Math.ceil(dashboards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = dashboards.slice(startIndex, startIndex + itemsPerPage);

  return (
    
    <div className="bg-[#fafafa] py-[40px]">

      {/* 내 대시보드*/}
      <div className="w-[1022px] mx-[40px] min-h-[204px]">
        <div className="grid grid-cols-3 gap-4 min-h-[156px]">
          <MyButton className="w-[332px] h-[70px] p-4 text-center font-semibold" color="buttonBasic" onClick={() => setIsModalOpen(true)}>
            + 새로운 대시보드
          </MyButton>
          {currentItems.map((item) => (
            <MyButton key={item.id} className="w-[332px] h-[70px] p-4 text-left font-semibold" color="buttonBasic" onClick={() => alert('대시보드 이동!')}>
              {item.title}
            </MyButton>
          ))}
        </div>

        {/* Pagination */}
        <div className="float-right py-[12px]">
          <span className="text-sm px-[16px]">
            {totalPages} 페이지 중 {currentPage}
          </span>
          <MyButton className="px-4 py-2" color="buttonBasic" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>&lt;</MyButton>
          <MyButton className="px-4 py-2" color="buttonBasic" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>&gt;</MyButton>
        </div>
      </div>

      {/* 초대 받은 대시보드*/}
      <div className="w-[1022px] m-[40px] max-h-[650px]  bg-white rounded-lg truncate">
        <h2 className="text-2xl font-bold py-[32px] px-[28px]">초대 받은 대시보드</h2>
        <div>
        </div>

        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="py-2 px-[76px] w-1/3">이름</th>
              <th className="py-2 px-[76px] w-1/3">초대자</th>
              <th className="py-2 px-[76px] w-1/3">수락 여부</th>
            </tr>
          </thead>
          <tbody>
            {invites.map((invite) => (
              <tr key={invite.id} className="border-b last:border-0">
                <td className="px-[76px] py-[23px] w-1/3">{invite.name}</td>
                <td className="px-[76px] py-[23px] w-1/3">{invite.inviter}</td>
                <td className="px-[76px] py-[23px] w-1/3">
                  <div className="flex gap-2">
                    <MyButton className="py-[4px] px-[29.5px] text-white" color="buttonBlue" onClick={() => alert('수락!')}>수락</MyButton>
                    <MyButton className="py-[4px] px-[29.5px] text-[#4276EC]" color="buttonBasic" onClick={() => alert('거절!')}>거절</MyButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/*모달*/}
      {isModalOpen && (
        <Modal open={isModalOpen} size="sm">
          <ModalHeader title="새로운 대시보드 생성" onClose={() => setIsModalOpen(false)} />
          <ModalContext>
            <input type="text" className="w-full border border-gray-300 rounded p-2" placeholder="대시보드이름" value={newDashboardName} onChange={(e) => setNewDashboardName(e.target.value)} />
          </ModalContext>
          <ModalFooter>
            <MyButton color="buttonBasic" onClick={() => setIsModalOpen(false)}>취소</MyButton>
            <MyButton color="buttonBlue" onClick={() => alert(`대시보드 생성: ${newDashboardName}`)}>생성</MyButton>
          </ModalFooter>
        </Modal>
      )}
    </div>

  );
}