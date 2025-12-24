import "./globals.css";
import { Inter } from "next/font/google";
import ThemeRegistry from "./theme-registry";
import { Metadata, Viewport } from "next";
import icon from "@/public/images/robot-logo.png";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

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
    "ボケ魔性",
    "ボケてみた",
    "ボケ",
    "魔性",
    "コラ画像",
  ],
  applicationName: "ボケ魔性",
  category: "entertainment",
  creator: "ボケ魔性編集部",
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  alternates: {
    canonical: "https://bokemasho.hirokilab.com/",
  },
  openGraph: {
    title: "ボケ魔性 | 魔性の笑いを届けるお笑いメディア",
    description:
      "ボケ魂を刺激する魔性の笑い・面白ネタ・大喜利を毎日更新！芸人志望者にも役立つインスピレーション満載。",
    url: "https://bokemasho.hirokilab.com/",
    siteName: "ボケ魔性",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "https://bokemasho.hirokilab.com/ogp.png",
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
    images: ["https://bokemasho.hirokilab.com/ogp.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/images/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N51ZY8S9FB"
          strategy="afterInteractive"
        />
        <Script id="ga4-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N51ZY8S9FB');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
