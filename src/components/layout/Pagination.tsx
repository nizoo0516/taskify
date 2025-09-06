"use client";

import { cn } from "@/lib/utils/cn";

import PaginationButton from "./PaginationButton";

type dataProps = {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  className?: string;
};

export default function Pagination({ page, setPage, totalPages, className }: dataProps) {
  return (
    <div className={cn("mt-4 flex", className)}>
      <PaginationButton
        direction={"prev"}
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      />

      <PaginationButton
        direction={"next"}
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      />
    </div>
  );
}
