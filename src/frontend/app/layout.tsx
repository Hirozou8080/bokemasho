import "./globals.css";
import { Inter } from "next/font/google";
import ThemeRegistry from "./theme-registry";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ボケ魔性 | 魔性の笑いを届けるお笑いメディア",
    template: "%s | ボケ魔性",
  },
  description:
    "ボケ魂を刺激する魔性の笑い・面白ネタ・大喜利を毎日更新する日本最大級のお笑いプラットフォーム。芸人志望者にも役立つネタ作りのコツやインスピレーションを得られるコンテンツを提供します。",
  keywords: [
    "お笑い",
    "ボケ",
    "ツッコミ",
    "大喜利",
    "ネタ",
    "芸人",
    "笑い",
    "日本語ジョーク",
  ],
  applicationName: "ボケ魔性",
  category: "entertainment",
  creator: "ボケ魔性編集部",
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#ffffff",
  alternates: {
    canonical: "https://bokemasho.vercel.app/",
  },
  openGraph: {
    title: "ボケ魔性 | 魔性の笑いを届けるお笑いメディア",
    description:
      "ボケ魂を刺激する魔性の笑い・面白ネタ・大喜利を毎日更新！芸人志望者にも役立つインスピレーション満載。",
    url: "https://bokemasho.vercel.app/",
    siteName: "ボケ魔性",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "https://bokemasho.vercel.app/ogp.png",
        width: 1200,
        height: 630,
        alt: "ボケ魔性のOGP画像",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ボケ魔性 | 魔性の笑いを届けるお笑いメディア",
    description:
      "ボケ魂を刺激する魔性の笑い・面白ネタ・大喜利を毎日更新！芸人志望者にも役立つインスピレーション満載。",
    creator: "@bokemasho",
    images: ["https://bokemasho.vercel.app/ogp.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
