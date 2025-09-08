"use client";
import { createContext, useContext, useMemo } from "react";

type IdsContextValue = {
  dashboardId: number;
  columnId?: number | null;
  cardId?: number | null;
};

const IdsContext = createContext<IdsContextValue | null>(null);

export function IdsProvider({
  value,
  children,
}: {
  value: IdsContextValue;
  children: React.ReactNode;
}) {
  // 객체 재생성을 줄여 불필요한 리렌더 방지
  const memo = useMemo(() => value, [value.dashboardId, value.columnId, value.cardId]);
  return <IdsContext.Provider value={memo}>{children}</IdsContext.Provider>;
}

export function useIds() {
  const ctx = useContext(IdsContext);
  if (!ctx) throw new Error("useIds must be used within IdsProvider");
  return ctx;
}
