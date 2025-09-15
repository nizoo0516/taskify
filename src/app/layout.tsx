import type { Metadata } from "next";

import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import QueryProvider from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Taskify",
  description: "Task management app",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-brand-gray-100 text-brand-gray-700 dark:bg-dark-900 dark:text-dark-200 h-full">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="taskify-theme"
        >
          <div id="portal" />
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
