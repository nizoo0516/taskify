import type { Metadata } from "next";

import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Taskify",
  description: "Task management app",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-brand-gray-100 text-brand-gray-700 dark:bg-dark-900 dark:text-dark-200 min-h-screen">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="taskify-theme"
        >
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
