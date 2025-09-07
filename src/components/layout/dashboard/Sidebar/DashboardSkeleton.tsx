"use client";

export default function DashboardSkeleton() {
  return (
    <ul className="grid gap-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <li key={i} className="bg-brand-gray-200 h-12 w-full animate-pulse rounded-md" />
      ))}
    </ul>
  );
}
