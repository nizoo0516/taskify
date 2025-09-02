"use client";

import { usePagination } from "@/features/dashboard/store";

import PaginationButton from "./PaginationButton";

export default function Pagination() {
  const { page, totalPages, setPage } = usePagination();

  if (totalPages <= 1) return null;

  return (
    <div className="tablet:flex mt-4 hidden">
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
