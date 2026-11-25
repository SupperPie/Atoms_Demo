import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Atoms-Mini · 一句话，跑出一支 AI 软件公司",
  description:
    "输入一句创业想法，产品经理、研发、运营三个智能体顺次协作，生成可预览的落地页与商业企划。",
};

export const viewport: Viewport = {
  themeColor: "#05060b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
