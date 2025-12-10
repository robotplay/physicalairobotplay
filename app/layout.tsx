import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://physicalairobotplay.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "피지컬 AI 로봇플레이",
  description: "상상을 현실로 만드는 코딩 교육, 피지컬 AI 로봇플레이입니다.",
  keywords: [
    "천안 코딩 교육",
    "로봇 교육",
    "피지컬 AI",
    "로봇 코딩",
    "아이 로봇 교육",
    "스크래치 코딩",
    "Python 로봇",
    "드론 코딩",
    "IRO",
    "FIRA",
    "로봇 올림피아드"
  ],
  authors: [{ name: "하광진", url: siteUrl }],
  creator: "Physical AI Robot Play",
  publisher: "Physical AI Robot Play",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "피지컬 AI 로봇플레이",
    description: "상상을 현실로 만드는 코딩 교육. Basic부터 Advanced, 드론 과정까지.",
    url: siteUrl,
    siteName: "피지컬 AI 로봇플레이",
    images: [
      {
        url: `${siteUrl}/og-image.jpeg`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "피지컬 AI 로봇플레이",
    description: "상상을 현실로 만드는 코딩 교육. Basic부터 Advanced, 드론 과정까지.",
    images: [`${siteUrl}/og-image.jpeg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
