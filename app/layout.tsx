import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "GYM TRACKER",
  description: "헬스 운동 기록 및 주간 루틴 관리 애플리케이션",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-slate-900 text-slate-100 min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}