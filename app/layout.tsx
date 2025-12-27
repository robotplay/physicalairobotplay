import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";
import Header from "@/components/Header";
import { OrganizationSchema, WebSiteSchema } from "@/components/JsonLd";
import ToastProvider from "@/components/ToastProvider";
import FloatingConsultationButton from "@/components/FloatingConsultationButton";

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

const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://parplay.co.kr';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "피지컬 AI 로봇플레이 | 천안 코딩 로봇 교육",
    template: "%s | 피지컬 AI 로봇플레이",
  },
  description: "상상을 현실로 만드는 코딩 교육. 천안 불당동의 로봇 코딩 전문 교육 기관. Basic부터 Advanced, 드론 과정까지 IRO, FIRA 국제 대회 준비.",
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
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon-32x32.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "피지컬 AI 로봇플레이 | 천안 코딩 로봇 교육",
    description: "상상을 현실로 만드는 코딩 교육. 천안 불당동의 로봇 코딩 전문 교육 기관. Basic부터 Advanced, 드론 과정까지 IRO, FIRA 국제 대회 준비.",
    url: siteUrl,
    siteName: "피지컬 AI 로봇플레이",
    images: [
      {
        url: `${siteUrl}/og-image.jpeg`,
        width: 1200,
        height: 630,
        alt: "피지컬 AI 로봇플레이 - 로봇 코딩 교육",
      },
    ],
    locale: "ko_KR",
    type: "website",
    countryName: "South Korea",
  },
  twitter: {
    card: "summary_large_image",
    title: "피지컬 AI 로봇플레이 | 천안 코딩 로봇 교육",
    description: "상상을 현실로 만드는 코딩 교육. 천안 불당동의 로봇 코딩 전문 교육 기관. Basic부터 Advanced, 드론 과정까지 IRO, FIRA 국제 대회 준비.",
    images: [`${siteUrl}/og-image.jpeg`],
    creator: "@parplay",
    site: "@parplay",
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
      <head>
        <OrganizationSchema />
        <WebSiteSchema />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <FloatingConsultationButton />
        <ToastProvider />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
