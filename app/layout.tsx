import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "人気おにぎり投票 | 長米",
  description: "米問屋のおにぎり屋「長米」の人気おにぎり投票サイトです。あなたの推しおにぎりに票を入れてください。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
