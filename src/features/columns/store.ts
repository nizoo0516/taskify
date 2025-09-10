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
  cardId?: number;
  userId?: number | null;
  membersId?: MemberOption[];
};

type columnState = {
  columnIdData: columnIdData | null;
  setColumnIdData: (dashboardId: number, columnId: number, cardId?: number) => void;
  setCardId: (cardId: number) => void;
  setUserId: (userId: number | null) => void;
  setMembersId: (membersId: MemberOption[]) => void;
  clearColumnIdData: () => void;
};

export const useColumnId = create<columnState>((set) => ({
  columnIdData: null,

  setColumnIdData: (dashboardId, columnId, cardId) =>
    set({ columnIdData: { dashboardId, columnId, cardId } }),

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

  clearColumnIdData: () => set({ columnIdData: null }),
}));
