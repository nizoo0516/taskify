"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useMemo } from "react";

import Chip from "@/components/common/chip/Chip";
import CreateDashboardModal from "@/components/modal/CreateDashboardModal";
import Input from "@/components/form/Input";
import MyButton from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";

import {
  getDashboards,
  createDashboard as apiCreateDashboard,
  createDashboard,
} from "@/features/dashboard/api";
import { getInvitations, respondInvitation } from "@/features/invitations/api";
import type { Invitation } from "@/features/invitations/types";

import { loadAcceptedMap, saveAcceptedAt } from "@/lib/utils/localStorage";
import { useQueryClient } from "@tanstack/react-query";
import { useMyDashboardStore } from "./useDashboardStore";
import { sortDashboards } from "@/lib/sortDashboard";

export default function MyDashboardList() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Zustand 대시보드 상태
  const { dashboards, setDashboards, addDashboard, page, setPage } = useMyDashboardStore();

  // 로컬 상태
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor] = useState("#7AC555");
  const [searchKeyword, setSearchKeyword] = useState("");

  // 초대 무한스크롤
  const [visibleCount, setVisibleCount] = useState(6);
  const loadMoreRefPc = useRef<HTMLTableRowElement>(null);
  const loadMoreRefMobile = useRef<HTMLDivElement>(null);

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(dashboards.length / itemsPerPage));

  // 대시보드 + 초대 데이터 불러오기
  useEffect(() => {
    const fetchDashboardsAndInvites = async () => {
      try {
        const [dashboardRes, invitationRes] = await Promise.all([
          getDashboards("pagination", { page: 1, size: 100 }),
          getInvitations({ cursorId: 0, size: 100 }),
        ]);

        setInvitations(invitationRes.invitations);

        const acceptedMap = loadAcceptedMap();

        const myDashboards = dashboardRes.dashboards.map((d) => ({
          ...d,
          acceptedAt: acceptedMap[d.id] ?? null,
        }));

        // 초대받은 대시보드 가공
        const invitedDashboards = invitationRes.invitations
          .filter((inv) => inv.inviteAccepted) // 수락된 초대만 추가
          .map((inv) => ({
            id: inv.dashboard.id,
            title: inv.dashboard.title,
            color: "#7AC555", // 초대된 대시보드는 색 정보 없을 수 있음
            createdAt: inv.createdAt,
            updatedAt: inv.updatedAt,
            createdByMe: false,
            userId: inv.inviter.id,
            acceptedAt: acceptedMap[inv.dashboard.id] ?? null,
          }));

        const mergedDashboards = [...myDashboards, ...invitedDashboards];

        setDashboards(sortDashboards(mergedDashboards));
        setPage(1);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboardsAndInvites();
  }, [setDashboards, setPage]);

  // 초대 필터링
  const filteredInvitations = useMemo(
    () =>
      invitations.filter((invite) =>
        invite.dashboard.title.toLowerCase().includes(searchKeyword.toLowerCase()),
      ),
    [invitations, searchKeyword],
  );
  const visibleInvitations = useMemo(
    () => filteredInvitations.slice(0, visibleCount),
    [filteredInvitations, visibleCount],
  );

  // 무한스크롤 (PC)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => (prev >= filteredInvitations.length ? prev : prev + 6));
        }
      },
      { threshold: 1 },
    );
    if (loadMoreRefPc.current) observer.observe(loadMoreRefPc.current);
    return () => {
      if (loadMoreRefPc.current) observer.unobserve(loadMoreRefPc.current);
    };
  }, [filteredInvitations.length]);

  // 무한스크롤 (모바일)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => (prev >= filteredInvitations.length ? prev : prev + 6));
        }
      },
      { threshold: 1 },
    );
    if (loadMoreRefMobile.current) observer.observe(loadMoreRefMobile.current);
    return () => {
      if (loadMoreRefMobile.current) observer.unobserve(loadMoreRefMobile.current);
    };
  }, [filteredInvitations.length]);

  // 페이지 아이템
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = useMemo(
    () => dashboards.slice(startIndex, startIndex + itemsPerPage),
    [dashboards, startIndex, itemsPerPage],
  );

  // 초대 수락
  const handleAcceptInvite = async (
    inviteId: number,
    dashboardId: number,
    title: string,
    inviterId: number,
  ) => {
    await respondInvitation(inviteId, true);
    // 초대 수락한 시간
    const now = new Date().toISOString();
    addDashboard({
      id: dashboardId,
      title,
      color: "#7AC555",
      createdAt: now,
      updatedAt: now,
      createdByMe: false,
      userId: inviterId,
      acceptedAt: now,
    });
    saveAcceptedAt(dashboardId, now);

    // 사이드 반영
    queryClient.invalidateQueries({ queryKey: ["dashboards", "sidebar"] });

    // 초대 목록 다시 반영
    setInvitations((prev) => prev.filter((inv) => inv.id !== inviteId));
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
  const handleCreateDashboard = async (title: string, color: string) => {
    const newDashboard = await createDashboard({ title, color });
    const now = new Date().toISOString();
    addDashboard({ ...newDashboard, acceptedAt: now });
    saveAcceptedAt(newDashboard.id, now);
  };

  return (
    <div className="bg-brand-gray-100 py-[40px]">
      {/* 내 대시보드 */}
      <div className="pc-[95%] tablet-[95%] pc:mx-0 pc:ml-[40px] mx-auto min-h-[204px] w-[90%] max-w-[1022px] overflow-hidden">
        <div className="tablet:grid-cols-2 pc:grid-cols-3 grid min-h-[156px] grid-cols-1 gap-4">
          {/* 새 대시보드 버튼 */}
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
              className="pc:text-lg tablet:text-lg h-[70px] p-4 text-left text-sm font-semibold"
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
      <div className="pc-[95%] tablet-[95%] pc:mx-0 pc:ml-[40px] mx-auto mt-8 w-[90%] max-w-[1022px] rounded-lg">
        <h2 className="pc:px-[28px] tablet:px-[28px] px-4 py-[32px] text-2xl font-bold">
          초대 받은 대시보드
        </h2>
        {invitations.length > 0 && (
          <div className="pc:px-[28px] tablet:px-[28px] px-4 pb-[16px]">
            <Input
              placeholder="검색"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              leftIcon={
                <Image src="/icons/icon-search.svg" alt="검색 아이콘" width={20} height={20} />
              }
            />
          </div>
        )}

        {/* PC/태블릿 - 테이블 */}
        {invitations.length > 0 && (
          <div className="pc:block tablet:block hidden pb-[28px]">
            <div className="h-[458px] overflow-y-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="sticky top-0 z-10 border-b">
                  <tr>
                    <th className="w-1/3 px-[28px] py-2 text-lg font-normal text-gray-500">이름</th>
                    <th className="w-1/3 px-[28px] py-2 text-lg font-normal text-gray-500">
                      초대자
                    </th>
                    <th className="w-1/3 px-[28px] py-2 text-lg font-normal text-gray-500">
                      수락 여부
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleInvitations.length === 0 ? (
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
                    visibleInvitations.map((invite) => (
                      <tr key={invite.id} className="border-b last:border-0">
                        <td className="w-1/3 truncate overflow-hidden px-[28px] py-[23px] text-lg whitespace-nowrap">
                          {invite.dashboard.title}
                        </td>
                        <td className="w-1/3 truncate overflow-hidden px-[28px] py-[23px] whitespace-nowrap">
                          {invite.inviter.nickname}
                        </td>
                        <td className="w-1/3 truncate overflow-hidden px-[28px] py-[23px] text-lg whitespace-nowrap">
                          <div className="flex gap-2">
                            <MyButton
                              className="tablet:px-[19px] pc:px-[29.5px] py-[4px] text-white"
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
                              className="tablet:px-[19px] pc:px-[29.5px] px-[29.5px] py-[4px] text-[#4276EC]"
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
          <div className="pc:flex tablet:flex hidden h-[458px] flex-col items-center justify-center px-[28px] text-center text-gray-400">
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
        <div className="pc:hidden tablet:hidden block pb-[28px]">
          {visibleInvitations.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
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
              return (
                <div
                  key={invite.id}
                  ref={isLast ? loadMoreRefMobile : null}
                  className="border-b px-4 py-3"
                >
                  <span className="inline-block w-[40px] truncate overflow-hidden text-sm whitespace-nowrap text-gray-500">
                    이름
                  </span>
                  <span className="inline-block truncate overflow-hidden text-sm whitespace-nowrap">
                    {invite.dashboard.title}
                  </span>
                  <span className="inline-block w-[40px] truncate overflow-hidden text-sm whitespace-nowrap text-gray-500">
                    초대자
                  </span>
                  <span className="inline-block truncate overflow-hidden text-sm whitespace-nowrap">
                    {invite.inviter.nickname}
                  </span>
                  <div className="mt-3 flex gap-2">
                    <MyButton
                      className="w-full px-[29.5px] py-[8px] text-white"
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
                      className="w-full px-[29.5px] py-[4px] text-[#4276EC]"
                      color="buttonBasic"
                      onClick={() => handleRejectInvite(invite.id)}
                    >
                      거절
                    </MyButton>
                  </div>
                </div>
              );
            })
          )}
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
