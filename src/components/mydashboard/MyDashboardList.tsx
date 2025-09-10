"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor] = useState("#7AC555");
  const [searchKeyword, setSearchKeyword] = useState("");

  // 무한스크롤 관련 상태
  const [visibleCount, setVisibleCount] = useState(6);
  const loadMoreRefPc = useRef<HTMLTableRowElement>(null);
  const loadMoreRefMobile = useRef<HTMLDivElement>(null);

  // 필터링된 초대 목록
  const filteredInvitations = invitations.filter(invite =>
    invite.dashboard.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // 현재 보여줄 초대 리스트 (무한스크롤 적용)
  const visibleInvitations = filteredInvitations.slice(0, visibleCount);

  // 대시보드 페이징 처리 (기존 방식 유지)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const totalPages = Math.ceil(dashboardList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = dashboardList.slice(startIndex, startIndex + itemsPerPage);

  // 데이터 불러오기 (처음에만)
  useEffect(() => {
    getDashboards("pagination", { page: 1, size: 100 })
      .then(res => setDashboardList(res.dashboards))
      .catch(err => console.error("대시보드 조회 실패:", err));

    getInvitations({ size: 100 })
      .then(res => {
        setInvitations(res.invitations);
      })
      .catch(err => console.error("초대 조회 실패:", err));
  }, []);

  // 무한스크롤 IntersectionObserver 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => {
            if (prev >= filteredInvitations.length) return prev; // 최대치 이상은 증가 금지
            return prev + 6; // 5개씩 더 보여주기
          });
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRefPc.current) {
      observer.observe(loadMoreRefPc.current);
    }

    return () => {
      if (loadMoreRefPc.current) {
        observer.unobserve(loadMoreRefPc.current);
      }
    };
  }, [filteredInvitations.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if(entries[0].isIntersecting){
          setVisibleCount((prev) => {
            if(prev >= filteredInvitations.length) return prev;
            return prev + 6;
          });
        }
      },
      {threshold: 1}
    );

    if(loadMoreRefMobile.current){
      observer.observe(loadMoreRefMobile.current);
    }

    return () => {
      if(loadMoreRefMobile.current){
        observer.unobserve(loadMoreRefMobile.current);
      }
    };
  }, [filteredInvitations.length]);

  // 초대 수락
  const handleAcceptInvite = async (inviteId: number, dashboardId: number, title: string, inviterId: number) => {
    try {
      await respondInvitation(inviteId, true);

      setDashboardList(prev => {
        if (prev.some(d => d.id === dashboardId)) return prev;

        const newDashboard: Dashboard = {
          id: dashboardId,
          title,
          color: selectedColor,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByMe: false,
          userId: inviterId,
        };

        return [newDashboard, ...prev];
      });

      setInvitations(prev => prev.filter(inv => inv.id !== inviteId));
    } catch (err) {
      console.error("초대 수락 실패:", err);
    }
  };

  // 초대 거절
  const handleRejectInvite = async (inviteId: number) => {
    try {
      await respondInvitation(inviteId, false);
      setInvitations(prev => prev.filter(inv => inv.id !== inviteId));
    } catch (err) {
      console.error("초대 거절 실패:", err);
    }
  };

  // 대시보드 생성
  const handleCreateDashboard = async (name: string, color: string) => {
    try {
      const newDashboard = await apiCreateDashboard({ title: name, color });
      setDashboardList(prev => [newDashboard, ...prev]);
    } catch (err) {
      console.error("대시보드 생성 실패:", err);
    }
  };

  return (
    <div className="bg-[#fafafa] py-[40px]">
      {/* 내 대시보드 */}
      <div className="w-[95%] mx-auto max-w-[1022px] min-h-[204px] pc:mx-0 pc:ml-[40px] overflow-hidden">
        <div className="grid grid-cols-1 tablet:grid-cols-2 pc:grid-cols-3 gap-4 min-h-[156px]">
          <MyButton
            className="h-[70px] p-4 text-center font-semibold"
            color="buttonBasic"
            onClick={() => setIsModalOpen(true)}
          >
            새로운 대시보드 &nbsp; <Chip variant="add" size="sm" />
          </MyButton>

          {currentItems.map((dashboard, index) => (
            <MyButton
              key={`${dashboard.id}-${index}`}
              className="h-[70px] p-4 text-left font-semibold"
              color="buttonBasic"
              onClick={() => router.push(`/dashboard/${dashboard.id}`)}
            >
              <div className="flex items-center gap-2">
                <div
                  style={{ backgroundColor: dashboard.color }}
                  className="h-2 w-2 shrink-0 rounded-full"
                />
                <div className="truncate overflow-hidden whitespace-nowrap">{dashboard.title}</div>
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
      <div className="w-[95%] mx-auto max-w-[1022px] pc:mx-0 pc:ml-[40px] bg-white rounded-lg mt-8">
        <h2 className="text-2xl font-bold py-[32px] px-[28px]">초대 받은 대시보드</h2>
        {invitations.length > 0 && (
        <div className="px-[28px] pb-[16px]">
          <Input
            placeholder="검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            leftIcon={<Image src="/icons/icon-search.svg" alt="검색 아이콘" width={20} height={20} />}
          />
        </div>
        )}

        {/* PC/태블릿 - 테이블 스크롤 영역 */}
        {invitations.length > 0 && (
        <div className="hidden pc:block tablet:block px-[28px] pb-[28px]">
          <div className="h-[458px] overflow-y-auto border rounded-md">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="sticky top-0 bg-white z-10 border-b">
                <tr>
                  <th className="py-2 w-1/3 px-[28px]">이름</th>
                  <th className="py-2 w-1/3 px-[28px]">초대자</th>
                  <th className="py-2 w-1/3 px-[28px]">수락 여부</th>
                </tr>
              </thead>
              <tbody>
                {invitations.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-gray-400">
                      아직 초대받은 대시보드가 없어요.
                      <Image
                        src="/images/img-no-dashboard.svg"
                        alt="없음"
                        width={100}
                        height={100}
                        className="mx-auto mt-4 block"
                      />
                    </td>
                  </tr>
                ) : visibleInvitations.length === 0 ? (
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
                  visibleInvitations.map(invite => (
                    <tr key={invite.id} className="border-b last:border-0">
                      <td className="py-[23px] w-1/3 px-[28px] truncate overflow-hidden whitespace-nowrap">{invite.dashboard.title}</td>
                      <td className="py-[23px] w-1/3 px-[28px] truncate overflow-hidden whitespace-nowrap">{invite.inviter.nickname}</td>
                      <td className="py-[23px] w-1/3 px-[28px]">
                        <div className="flex gap-2">
                          <MyButton
                            className="tablet:px-[19px] pc:px-[29.5px] py-[4px] text-white"
                            color="buttonBlue"
                            onClick={() =>
                              handleAcceptInvite(
                                invite.id,
                                invite.dashboard.id,
                                invite.dashboard.title,
                                invite.inviter.id
                              )
                            }
                          >
                            수락
                          </MyButton>
                          <MyButton
                            className="tablet:px-[19px] pc:px-[29.5px] py-[4px] px-[29.5px] text-[#4276EC]"
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

                {/* 무한스크롤 관찰 요소 */}
                {visibleInvitations.length < filteredInvitations.length && (
                  <tr ref={loadMoreRefPc}>
                    <td colSpan={3} className="py-4 text-center text-gray-400">
                      불러오는 중...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {invitations.length === 0 && (
          <div className="hidden pc:flex tablet:flex h-[458px] flex-col justify-center items-center text-center text-gray-400 px-[28px]">
            아직 초대받은 대시보드가 없어요.
            <Image
              src="/images/img-no-dashboard.svg"
              alt="없음"
              width={100}
              height={100}
              className="mx-auto mt-4 block"
            />
          </div>
        )}


        {/* 모바일 - 카드 리스트 */}
        <div className="block pc:hidden tablet:hidden px-[28px] pb-[28px]">
          {invitations.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
            아직 초대받은 대시보드가 없어요.
            <Image
              src="/images/img-no-dashboard.svg"
              alt="없음"
              width={100}
              height={100}
              className="mx-auto mt-4 block"
            />
          </div>
          ) : visibleInvitations.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
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
            visibleInvitations.map((invite, index) => {
              const isLast = index === visibleInvitations.length - 1;
              return(
              <div
                key={invite.id}
                ref={isLast ? loadMoreRefMobile : null}
                className="mb-4 border rounded-md px-4 py-3 shadow-sm"
              >
                <div className="text-lg font-semibold truncate overflow-hidden whitespace-nowrap">{invite.dashboard.title}</div>
                <div className="text-sm text-gray-500 truncate overflow-hidden whitespace-nowrap">초대자: {invite.inviter.nickname}</div>
                <div className="mt-3 flex gap-2">
                  <MyButton
                    className="py-[4px] px-[29.5px] text-white w-full"
                    color="buttonBlue"
                    onClick={() =>
                      handleAcceptInvite(
                        invite.id,
                        invite.dashboard.id,
                        invite.dashboard.title,
                        invite.inviter.id
                      )
                    }
                  >
                    수락
                  </MyButton>
                  <MyButton
                    className="py-[4px] px-[29.5px] text-[#4276EC] w-full"
                    color="buttonBasic"
                    onClick={() => handleRejectInvite(invite.id)}
                  >
                    거절
                  </MyButton>
                </div>
              </div>
              );
          }))}

          

        </div>
      </div>

      {/* 대시보드 생성 모달 */}
      <CreateDashboardModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateDashboard}
        defaultColor={selectedColor}
      />
    </div>
  );
}
