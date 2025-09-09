"use client";
import { create } from "zustand";

type columnIdData = {
  dashboardId: number;
  columnId: number;
  cardId?: number;
};

type columnState = {
  columnIdData: columnIdData | null;
  setColumnIdData: (dashboardId: number, columnId: number, cardId?: number) => void;
  setCardId: (cardId: number) => void;
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

  clearColumnIdData: () => set({ columnIdData: null }),
}));
