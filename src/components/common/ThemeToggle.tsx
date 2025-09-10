"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="bg-brand-blue-500 hover:bg-brand-blue-600 tablet:right-6 tablet:bottom-6 tablet:h-12 tablet:w-12 fixed right-3 bottom-3 z-50 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-lg transition-colors"
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}
