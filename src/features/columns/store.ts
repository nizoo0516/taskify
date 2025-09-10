"use client";
import { create } from "zustand";

type MemberOption = {
  value: string;
  label: string;
  chip?: React.ReactNode;
};

type columnIdData = {
  dashboardId: number;
  columnId: number;
  columnTitle?: string;
  cardId?: number;
  userId?: number | null;
  membersId?: MemberOption[];
};

type columnState = {
  columnIdData: columnIdData | null;
  // 컬럼 타이틀 아이디로 변경 (to do, on progress, done)
  columnStatusTitle?: Record<string, number>;
  setColumnIdData: (
    dashboardId: number,
    columnId: number,
    columnTitle?: string,
    cardId?: number,
  ) => void;
  setCardId: (cardId: number) => void;
  setUserId: (userId: number | null) => void;
  setMembersId: (membersId: MemberOption[]) => void;
  setStatus: (map: Record<string, number>) => void;
  clearColumnIdData: () => void;
};

export const useColumnId = create<columnState>((set) => ({
  columnIdData: null,

  setColumnIdData: (dashboardId, columnId, columnTitle, cardId) =>
    set({ columnIdData: { dashboardId, columnId, columnTitle, cardId } }),

  setCardId: (cardId) =>
    set((state) => ({
      columnIdData: state.columnIdData ? { ...state.columnIdData, cardId } : null,
    })),

  setUserId: (userId) =>
    set((state) => ({
      columnIdData: state.columnIdData ? { ...state.columnIdData, userId } : null,
    })),
  setMembersId: (membersId) =>
    set((state) => ({
      columnIdData: state.columnIdData ? { ...state.columnIdData, membersId } : null,
    })),
  setStatus: (map) => set({ columnStatusTitle: map }),
  clearColumnIdData: () => set({ columnIdData: null }),
}));
