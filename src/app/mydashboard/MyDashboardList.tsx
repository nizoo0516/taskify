"use client";

import Image from "next/image";
import { useState } from "react";

import Chip from "@/components/chip/Chip";
import Input from "@/components/form/Input";
import MyButton from "@/components/layout/Button";
import Pagination from "@/components/layout/Pagination";
import { Modal, ModalHeader, ModalContext, ModalFooter } from "@/components/Modal";
import { Dashboard, Invitation } from "@/features/dashboard/types";

interface InvitationResponse{
  cursorId: number;
  invitations: Invitation[];
}

const dashboards: Dashboard[] = [
  {id: 1, title: "제니", color: "#7AC555", createdAt: "2025-09-03T00:00:00Z", updatedAt: "2025-09-03T00:00:00Z", createdByMe: true, userId: 1},
  {id: 2, title: "로제", color: "#7AC555", createdAt: "2025-09-03T00:00:00Z", updatedAt: "2025-09-03T00:00:00Z", createdByMe: true, userId: 2},
  {id: 3, title: "채원", color: "#7AC555", createdAt: "2025-09-03T00:00:00Z", updatedAt: "2025-09-03T00:00:00Z", createdByMe: true, userId: 3},
  {id: 4, title: "영서", color: "#7AC555", createdAt: "2025-09-03T00:00:00Z", updatedAt: "2025-09-03T00:00:00Z", createdByMe: true, userId: 4},
  {id: 5, title: "리사", color: "#7AC555", createdAt: "2025-09-03T00:00:00Z", updatedAt: "2025-09-03T00:00:00Z", createdByMe: true, userId: 5},
  {id: 6, title: "애니", color: "#7AC555", createdAt: "2025-09-03T00:00:00Z", updatedAt: "2025-09-03T00:00:00Z", createdByMe: true, userId: 6},
  {id: 7, title: "나띠", color: "#7AC555", createdAt: "2025-09-03T00:00:00Z", updatedAt: "2025-09-03T00:00:00Z", createdByMe: true, userId: 7}
];

const mockResponse: InvitationResponse = {
  cursorId: 0,
  invitations: [
    {
      id: 1,
      inviter: {nickname: "Mark", email: "mark@nct.com", id: 100},
      teamId: "team-1",
      dashboard: { title: "프로덕트 디자인", id: 201 },
      invitee: { nickname: "You", email: "you@email.com", id: 999 },
      inviteAccepted: false,
      createdAt: "2025-09-03T15:54:08.171Z",
      updatedAt: "2025-09-03T15:54:08.171Z",
    },
    {
      id: 2,
      inviter: {nickname: "Felix", email: "felix@skz.com", id: 101},
      teamId: "team-2",
      dashboard: { title: "새로운 기획 문서", id: 202 },
      invitee: { nickname: "You", email: "you@email.com", id: 999 },
      inviteAccepted: false,
      createdAt: "2025-09-03T15:54:08.171Z",
      updatedAt: "2025-09-03T15:54:08.171Z",
    },
    {
      id: 3,
      inviter: {nickname: "Hayoung", email: "hayoung@fromis9.com", id: 102},
      teamId: "team-3",
      dashboard: { title: "유닛A", id: 203 },
      invitee: { nickname: "You", email: "you@email.com", id: 999 },
      inviteAccepted: false,
      createdAt: "2025-09-03T15:54:08.171Z",
      updatedAt: "2025-09-03T15:54:08.171Z",
    },
    {
      id: 4,
      inviter: {nickname: "Mark", email: "mark@nct.com", id: 103},
      teamId: "team-1",
      dashboard: { title: "프로덕트 디자인", id: 204 },
      invitee: { nickname: "You", email: "you@email.com", id: 999 },
      inviteAccepted: false,
      createdAt: "2025-09-03T15:54:08.171Z",
      updatedAt: "2025-09-03T15:54:08.171Z",
    },
    {
      id: 5,
      inviter: {nickname: "Felix", email: "felix@skz.com", id: 104},
      teamId: "team-2",
      dashboard: { title: "새로운 기획 문서", id: 205 },
      invitee: { nickname: "You", email: "you@email.com", id: 999 },
      inviteAccepted: false,
      createdAt: "2025-09-03T15:54:08.171Z",
      updatedAt: "2025-09-03T15:54:08.171Z",
    },
    {
      id: 6,
      inviter: {nickname: "Hayoung", email: "hayoung@fromis9.com", id: 105},
      teamId: "team-3",
      dashboard: { title: "유닛A", id: 206 },
      invitee: { nickname: "You", email: "you@email.com", id: 999 },
      inviteAccepted: false,
      createdAt: "2025-09-03T15:54:08.171Z",
      updatedAt: "2025-09-03T15:54:08.171Z",
    },
    {
      id: 7,
      inviter: {nickname: "Mark", email: "mark@nct.com", id: 106},
      teamId: "team-1",
      dashboard: { title: "프로덕트 디자인", id: 207 },
      invitee: { nickname: "You", email: "you@email.com", id: 999 },
      inviteAccepted: false,
      createdAt: "2025-09-03T15:54:08.171Z",
      updatedAt: "2025-09-03T15:54:08.171Z",
    },
    {
      id: 8,
      inviter: {nickname: "Felix", email: "felix@skz.com", id: 107},
      teamId: "team-2",
      dashboard: { title: "새로운 기획 문서", id: 208 },
      invitee: { nickname: "You", email: "you@email.com", id: 999 },
      inviteAccepted: false,
      createdAt: "2025-09-03T15:54:08.171Z",
      updatedAt: "2025-09-03T15:54:08.171Z",
    },
    {
      id: 9,
      inviter: {nickname: "Hayoung", email: "hayoung@fromis9.com", id: 108},
      teamId: "team-3",
      dashboard: { title: "유닛A", id: 209 },
      invitee: { nickname: "You", email: "you@email.com", id: 999 },
      inviteAccepted: false,
      createdAt: "2025-09-03T15:54:08.171Z",
      updatedAt: "2025-09-03T15:54:08.171Z",
    },
  ]
}

export default function MyDashboardList() {
  
  const [currentPage, setCurrentPage] = useState(1);

  const [dashboardList, setDashboardList] = useState<Dashboard[]>(dashboards);
  const [invitations, setInvitations] = useState<Invitation[]>(mockResponse.invitations);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(dashboardList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = dashboardList.slice(startIndex, startIndex + itemsPerPage);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState("");

  const colors = ["#7AC555", "#760DDE", "#FFA500", "#E876EA", "#76A5EA"];
  const [selectedColor, setSelectedColor] = useState("#7AC555");

  const handleAcceptInvite = (inviteId: number) => {
    const invite = invitations.find(inv => inv.id === inviteId);
    if(!invite) return;

    //내 대시보드 끝에 추가
    setDashboardList(
      prev => [...prev, {
        id: invite.dashboard.id,
        title: invite.dashboard.title,
        color: selectedColor, 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdByMe: false,
        userId: invite.inviter.id,
      },]
    );
    
    //초대 목록에서 제거
    setInvitations(prev => prev.filter(inv => inv.id !== inviteId));
  };

  const handleRejectInvite = (inviteId: number) => {
    setInvitations(prev => prev.filter(inv => inv.id !== inviteId));
  }

  const [searchKeyword, setSearchKeyword] = useState("");
  const filteredInvitations = invitations.filter(invite => 
    invite.dashboard.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    
    <div className="bg-[#fafafa] py-[40px]">

      {/* 내 대시보드*/}
      <div className="w-[95%] mx-auto max-w-[1022px] min-h-[204px] pc:mx-0 pc:ml-[40px]">
        <div className="grid grid-cols-1 tablet:grid-cols-2 pc:grid-cols-3 gap-4 min-h-[156px]">
          <MyButton className="h-[70px] p-4 text-center font-semibold" color="buttonBasic" onClick={() => setIsModalOpen(true)}>
            새로운 대시보드 &nbsp; <Chip variant="add" size="sm"/> 
          </MyButton>

          {currentItems.map((dashboard) => (
            <MyButton key={dashboard.id} className="h-[70px] p-4 text-left font-semibold" color="buttonBasic" onClick={() => alert('대시보드 이동!')}>
              <div className="flex items-center gap-2">
                <div style={{backgroundColor: dashboard.color}} className="h-2 w-2 shrink-0 rounded-full" />
                <div>{dashboard.title}</div>
                {dashboard.createdByMe && (
                  <Image src="/icons/icon-crown.svg" alt="내가 만든 대시보드" width={18} height={14} />
                )}
                &nbsp; <Image src="/icons/icon-arrow-right.svg" alt="내가 만든 대시보드" width={18} height={14} className="ml-auto"/>
              </div>
            </MyButton>
          ))}
        </div>
        <div className="float-right flex">
          <div className="mt-4 mr-4">{totalPages} 페이지 중 {currentPage}</div> 
          <Pagination page={currentPage} setPage={setCurrentPage} totalPages={totalPages}/>
        </div>
      </div>

      {/* 초대 받은 대시보드*/}  
      <div className="w-[95%] mx-auto max-w-[1022px] max-h-[650px] pc:mx-0 pc:ml-[40px] bg-white rounded-lg overflow-scroll">
        <h2 className="text-2xl font-bold py-[32px] px-[28px]">초대 받은 대시보드</h2>
        <div className="px-[28px] pb-[16px]">
          <Input placeholder="검색" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)}
            leftIcon={<Image src="/icons/icon-search.svg" alt="검색 아이콘" width={20} height={20} /> } />
        </div>

        <div className="hidden pc:block tablet:block">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2 w-1/3 px-[28px]">이름</th>
                <th className="py-2 w-1/3 px-[28px]">초대자</th>
                <th className="py-2 w-1/3 px-[28px]">수락 여부</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvitations.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-400">
                    검색 결과가 없습니다. 
                    <Image src="/images/img-no-dashboard.svg" alt="없음" width={100} height={100} className="mx-auto mt-4 block" />
                  </td>
                </tr>
              ) : (
                filteredInvitations.map((invite) => (
                  <tr key={invite.id} className="border-b last:border-0">
                    <td className="py-[23px] w-1/3 px-[28px]">{invite.dashboard.title}</td>
                    <td className="py-[23px] w-1/3 px-[28px]">{invite.inviter.nickname}</td>
                    <td className="py-[23px] w-1/3 px-[28px]">
                      <div className="flex gap-2">
                        <MyButton className="py-[4px] px-[29.5px] text-white" color="buttonBlue" onClick={() => handleAcceptInvite(invite.id)}>수락</MyButton>
                        <MyButton className="py-[4px] px-[29.5px] text-[#4276EC]" color="buttonBasic" onClick={() => handleRejectInvite(invite.id)}>거절</MyButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 모바일 전용 */}
        <div className="block pc:hidden tablet:hidden px-[20px] pb-[20px] space-y-4">
          {filteredInvitations.length === 0 ? (
            <div className="text-center text-gray-400">
              검색 결과가 없습니다.
              <Image src="/images/img-no-dashboard.svg" alt="없음" width={100} height={100} className="mx-auto mt-4 block" />
            </div>
          ) : (
            filteredInvitations.map((invite) => (
              <div key={invite.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="mb-2">
                  <div className="text-gray-500 text-sm">이름</div>
                  <div className="text-base font-semibold">{invite.dashboard.title}</div>
                </div>
                <div className="mb-4">
                  <div className="text-gray-500 text-sm">초대자</div>
                  <div className="text-base font-medium">{invite.inviter.nickname}</div>
                </div>
                <div className="flex gap-2">
                  <MyButton className="w-full py-[4px] text-white" color="buttonBlue" onClick={() => handleAcceptInvite(invite.id)}>수락</MyButton>
                  <MyButton className="w-full py-[4px] text-[#4276EC]" color="buttonBasic" onClick={() => handleRejectInvite(invite.id)}>거절</MyButton>
                </div>
              </div>
            ))
          )}
        </div>
      </div>



      {/*모달*/}
      {isModalOpen && (
        <Modal open={isModalOpen} size="lg" className="w-[584px] h-[344px]">
          <ModalHeader title="새로운 대시보드" />
          <ModalContext>
            <span>대시보드 이름</span>
            <input type="text" className="w-full border border-gray-300 rounded p-2" placeholder="대시보드 이름을 입력해주세요." value={newDashboardName} onChange={(e) => setNewDashboardName(e.target.value)} />
            <div className="mt-4 mb-4 flex items-center gap-2">
              {colors.map((c) => (
                <Chip key={c} variant="color" color={c} selected={c === selectedColor} onClick={() => setSelectedColor(c)}/>
              ))}
            </div>
          </ModalContext>
          <ModalFooter>
            <MyButton color="buttonBasic" className="w-[256px] h-[54px]" onClick={() => setIsModalOpen(false)}>취소</MyButton>
            <MyButton color="buttonBlue" className="w-[256px] h-[54px] text-white" onClick={() => {alert("생성!"); setIsModalOpen(false);}}>생성</MyButton>
          </ModalFooter>
        </Modal>
      )}

      

    </div>

  );
}
