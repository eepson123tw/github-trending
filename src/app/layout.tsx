import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://github-trending.zeabur.app";
const TITLE = "GitHub Trending Observatory";
const DESCRIPTION =
  "354 天、4995 個開源專案的脈動 — 一整年的 GitHub Trending 資料視覺化觀測站 | A year-long GitHub Trending data visualization observatory";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  keywords: [
    "GitHub Trending",
    "open source",
    "data visualization",
    "trending repos",
    "GitHub",
    "開源趨勢",
    "資料視覺化",
  ],
  authors: [{ name: "eepson123tw", url: "https://github.com/eepson123tw" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: TITLE,
    locale: "zh_TW",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "theme-color": "#0a0a0f",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
