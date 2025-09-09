"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import Chip from "@/components/common/chip/Chip";
import CreateDashboardModal from "@/components/modal/CreateDashboardModal";
import Input from "@/components/form/Input";
import MyButton from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";
import type { Dashboard } from "@/features/dashboard/types";
import { getDashboards, createDashboard as apiCreateDashboard } from "@/features/dashboard/api";
import type { Invitation } from "@/features/invitations/types";
import { getInvitations, respondInvitation } from "@/features/invitations/api";

export default function MyDashboardList() {
  const router = useRouter();

  // 상태
  const [dashboardList, setDashboardList] = useState<Dashboard[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor] = useState("#7AC555");
  const [searchKeyword, setSearchKeyword] = useState("");

  // 필터링된 초대 목록
  const filteredInvitations = invitations.filter((invite) =>
    invite.dashboard.title.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  const totalPages = Math.ceil(dashboardList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = dashboardList.slice(startIndex, startIndex + itemsPerPage);

  // 데이터 불러오기
  useEffect(() => {
    // 내 대시보드 목록
    getDashboards("pagination", { page: 1, size: 100 })
      .then((res) => setDashboardList(res.dashboards))
      .catch((err) => console.error("대시보드 조회 실패:", err));

    // 내가 받은 초대 목록
    getInvitations({ size: 100 })
      .then((res) => {
        console.log("받은 초대 목록: ", res.invitations);
        setInvitations(res.invitations);
      })
      .catch((err) => console.error("초대 조회 실패:", err));
  }, []);

  // 초대 수락
  const handleAcceptInvite = async (
    inviteId: number,
    dashboardId: number,
    title: string,
    inviterId: number,
  ) => {
    try {
      await respondInvitation(inviteId, true);

      setDashboardList((prev) => {
        // 중복 대시보드가 있으면 추가하지 않음
        if (prev.some((d) => d.id === dashboardId)) return prev;

        const newDashboard: Dashboard = {
          id: dashboardId,
          title,
          color: selectedColor,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByMe: false,
          userId: inviterId,
        };

        // 새 대시보드를 리스트 맨 앞에 추가 (최근 수락이 위로)
        return [newDashboard, ...prev];
      });

      // 초대 목록에서 제거
      setInvitations((prev) => prev.filter((inv) => inv.id !== inviteId));
    } catch (err) {
      console.error("초대 수락 실패:", err);
    }
  };

  // 초대 거절
  const handleRejectInvite = async (inviteId: number) => {
    try {
      await respondInvitation(inviteId, false);
      setInvitations((prev) => prev.filter((inv) => inv.id !== inviteId));
    } catch (err) {
      console.error("초대 거절 실패:", err);
    }
  };

  // 대시보드 생성
  const handleCreateDashboard = async (name: string, color: string) => {
    try {
      const newDashboard = await apiCreateDashboard({ title: name, color });
      setDashboardList((prev) => [newDashboard, ...prev]); // 생성한 것도 앞에 추가
    } catch (err) {
      console.error("대시보드 생성 실패:", err);
    }
  };

  return (
    <div className="bg-[#fafafa] py-[40px]">
      {/* 내 대시보드 */}
      <div className="pc:mx-0 pc:ml-[40px] mx-auto min-h-[204px] w-[95%] max-w-[1022px]">
        <div className="tablet:grid-cols-2 pc:grid-cols-3 grid min-h-[156px] grid-cols-1 gap-4">
          <MyButton
            className="h-[70px] p-4 text-center font-semibold"
            color="buttonBasic"
            onClick={() => setIsModalOpen(true)}
          >
            새로운 대시보드 &nbsp; <Chip variant="add" size="sm" />
          </MyButton>

          {currentItems.map((dashboard, index) => (
            <MyButton
              key={`${dashboard.id}-${index}`} // 중복키 방지
              className="h-[70px] p-4 text-left font-semibold"
              color="buttonBasic"
              onClick={() => router.push(`/dashboard/${dashboard.id}`)}
            >
              <div className="flex items-center gap-2">
                <div
                  style={{ backgroundColor: dashboard.color }}
                  className="h-2 w-2 shrink-0 rounded-full"
                />
                <div>{dashboard.title}</div>
                {dashboard.createdByMe && (
                  <Image
                    src="/icons/icon-crown.svg"
                    alt="내가 만든 대시보드"
                    width={18}
                    height={14}
                  />
                )}
                &nbsp;{" "}
                <Image
                  src="/icons/icon-arrow-right.svg"
                  alt="대시보드 이동"
                  width={18}
                  height={14}
                  className="ml-auto"
                />
              </div>
            </MyButton>
          ))}
        </div>
        <div className="float-right flex">
          <div className="mt-4 mr-4">
            {totalPages} 페이지 중 {currentPage}
          </div>
          <Pagination page={currentPage} setPage={setCurrentPage} totalPages={totalPages} />
        </div>
      </div>

      {/* 초대 받은 대시보드 */}
      <div className="pc:mx-0 pc:ml-[40px] mx-auto mt-8 max-h-[650px] w-[95%] max-w-[1022px] overflow-scroll rounded-lg bg-white">
        <h2 className="px-[28px] py-[32px] text-2xl font-bold">초대 받은 대시보드</h2>
        <div className="px-[28px] pb-[16px]">
          <Input
            placeholder="검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            leftIcon={
              <Image src="/icons/icon-search.svg" alt="검색 아이콘" width={20} height={20} />
            }
          />
        </div>

        {/* PC/태블릿 */}
        <div className="pc:block tablet:block hidden">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="w-1/3 px-[28px] py-2">이름</th>
                <th className="w-1/3 px-[28px] py-2">초대자</th>
                <th className="w-1/3 px-[28px] py-2">수락 여부</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvitations.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-400">
                    검색 결과가 없습니다.
                    <Image
                      src="/images/img-no-dashboard.svg"
                      alt="없음"
                      width={100}
                      height={100}
                      className="mx-auto mt-4 block"
                    />
                  </td>
                </tr>
              ) : (
                filteredInvitations.map((invite) => (
                  <tr key={invite.id} className="border-b last:border-0">
                    <td className="w-1/3 px-[28px] py-[23px]">{invite.dashboard.title}</td>
                    <td className="w-1/3 px-[28px] py-[23px]">{invite.inviter.nickname}</td>
                    <td className="w-1/3 px-[28px] py-[23px]">
                      <div className="flex gap-2">
                        <MyButton
                          className="px-[29.5px] py-[4px] text-white"
                          color="buttonBlue"
                          onClick={() =>
                            handleAcceptInvite(
                              invite.id,
                              invite.dashboard.id,
                              invite.dashboard.title,
                              invite.inviter.id,
                            )
                          }
                        >
                          수락
                        </MyButton>
                        <MyButton
                          className="px-[29.5px] py-[4px] text-[#4276EC]"
                          color="buttonBasic"
                          onClick={() => handleRejectInvite(invite.id)}
                        >
                          거절
                        </MyButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 모바일 */}
        <div className="pc:hidden tablet:hidden block space-y-4 px-[20px] pb-[20px]">
          {filteredInvitations.length === 0 ? (
            <div className="text-center text-gray-400">
              검색 결과가 없습니다.
              <Image
                src="/images/img-no-dashboard.svg"
                alt="없음"
                width={100}
                height={100}
                className="mx-auto mt-4 block"
              />
            </div>
          ) : (
            filteredInvitations.map((invite) => (
              <div key={invite.id} className="rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="mb-2">
                  <div className="text-sm text-gray-500">이름</div>
                  <div className="text-base font-semibold">{invite.dashboard.title}</div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-500">초대자</div>
                  <div className="text-base font-medium">{invite.inviter.nickname}</div>
                </div>
                <div className="flex gap-2">
                  <MyButton
                    className="w-full py-[4px] text-white"
                    color="buttonBlue"
                    onClick={() =>
                      handleAcceptInvite(
                        invite.id,
                        invite.dashboard.id,
                        invite.dashboard.title,
                        invite.inviter.id,
                      )
                    }
                  >
                    수락
                  </MyButton>
                  <MyButton
                    className="w-full py-[4px] text-[#4276EC]"
                    color="buttonBasic"
                    onClick={() => handleRejectInvite(invite.id)}
                  >
                    거절
                  </MyButton>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 모달 */}
      <CreateDashboardModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateDashboard}
      />
    </div>
  );
}
