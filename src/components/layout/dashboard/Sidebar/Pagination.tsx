"use client";

import { usePagination } from "@/features/dashboard/store";

export default function Pagination() {
  const { page, totalPages, setPage } = usePagination();

  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex justify-center gap-2">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="rounded border px-2 py-1 disabled:opacity-50"
      >
        이전
      </button>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="rounded border px-2 py-1 disabled:opacity-50"
      >
        다음
      </button>
    </div>
  );
}
