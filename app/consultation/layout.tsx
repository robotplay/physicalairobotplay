import type { Metadata } from 'next';

const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://parplay.co.kr';

export const metadata: Metadata = {
  title: "무료 상담 예약 | 피지컬 AI 로봇플레이",
  description: "전문 상담사와 함께 아이에게 맞는 로봇 코딩 교육 과정을 찾아보세요. 무료 상담으로 시작하는 피지컬 AI 교육. Basic, Advanced, 드론 과정까지 체계적인 커리큘럼.",
  keywords: [
    "로봇 코딩 상담",
    "천안 코딩 교육 상담",
    "무료 상담",
    "로봇 교육 문의",
    "아이 코딩 교육",
    "피지컬 AI 상담",
    "로봇 플레이 상담",
    "코딩 학원 상담"
  ],
  openGraph: {
    title: "무료 상담 예약 | 피지컬 AI 로봇플레이",
    description: "전문 상담사와 함께 아이에게 맞는 로봇 코딩 교육 과정을 찾아보세요. 무료 상담으로 시작하세요.",
    url: `${siteUrl}/consultation`,
    siteName: "피지컬 AI 로봇플레이",
    images: [
      {
        url: `${siteUrl}/og-image.jpeg`,
        width: 1200,
        height: 630,
        alt: "피지컬 AI 로봇플레이 - 무료 상담 예약",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "무료 상담 예약 | 피지컬 AI 로봇플레이",
    description: "전문 상담사와 함께 아이에게 맞는 로봇 코딩 교육 과정을 찾아보세요.",
    images: [`${siteUrl}/og-image.jpeg`],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${siteUrl}/consultation`,
  },
};

export default function ConsultationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

