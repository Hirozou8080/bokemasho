import "./globals.css";
import { Inter } from "next/font/google";
import ThemeRegistry from "./theme-registry";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ボケ魔性",
  description: "ボケ魂を刺激する魔性の笑いを提供するウェブサイト",
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
