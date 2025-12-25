/**
 * JSON-LD Structured Data Component
 * Google이 웹사이트 정보를 더 잘 이해할 수 있도록 Schema.org 형식의 구조화된 데이터 제공
 */

interface JsonLdProps {
  data: Record<string, any>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Organization Schema
 * 조직 정보 (이름, 로고, 연락처, 주소 등)
 */
export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["Organization", "EducationalOrganization"],
    name: "피지컬 AI 로봇플레이",
    alternateName: "Physical AI Robot Play",
    url: "https://parplay.co.kr",
    logo: "https://parplay.co.kr/icon.png",
    description: "상상을 현실로 만드는 코딩 교육. 천안 불당동의 로봇 코딩 전문 교육 기관.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "천안시",
      addressRegion: "충청남도",
      addressCountry: "KR",
    },
    areaServed: {
      "@type": "Place",
      name: "천안시, 충청남도",
    },
    sameAs: [
      // 소셜 미디어 링크 (있는 경우 추가)
      // "https://www.facebook.com/parplay",
      // "https://www.instagram.com/parplay",
      // "https://www.youtube.com/@parplay",
    ],
  };

  return <JsonLd data={data} />;
}

/**
 * Website Schema
 * 웹사이트 정보 및 검색 기능
 */
export function WebSiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "피지컬 AI 로봇플레이",
    url: "https://parplay.co.kr",
    description: "상상을 현실로 만드는 코딩 교육",
    publisher: {
      "@type": "Organization",
      name: "피지컬 AI 로봇플레이",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://parplay.co.kr/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={data} />;
}

/**
 * Course Schema - Basic Course
 * 기초 과정 정보
 */
export function BasicCourseSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Basic Course - 로봇 코딩 기초 과정",
    description: "아두이노와 엠블록으로 시작하는 로봇 코딩 입문 과정. 초등학생부터 중학생까지 논리적 사고력과 창의력을 키우는 체계적인 커리큘럼.",
    provider: {
      "@type": "Organization",
      name: "피지컬 AI 로봇플레이",
      url: "https://parplay.co.kr",
    },
    url: "https://parplay.co.kr/basic-course",
    courseCode: "BASIC-001",
    educationalLevel: "초급",
    teaches: [
      "블록 코딩",
      "아두이노 기초",
      "엠블록 프로그래밍",
      "센서 활용",
      "모터 제어",
    ],
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      audienceType: "초등학생, 중학생",
    },
    inLanguage: "ko-KR",
    availableLanguage: "ko",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: "천안시",
          addressRegion: "충청남도",
          addressCountry: "KR",
        },
      },
    },
  };

  return <JsonLd data={data} />;
}

/**
 * Course Schema - Advanced Course
 * 심화 과정 정보
 */
export function AdvancedCourseSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Advanced Course - AI 비전 로봇 심화 과정",
    description: "Python, C++, 라즈베리파이, OpenCV를 활용한 실전 AI 로봇 개발 과정. IRO, FIRA 국제 대회 준비 및 현업 개발자 수준의 기술 습득.",
    provider: {
      "@type": "Organization",
      name: "피지컬 AI 로봇플레이",
      url: "https://parplay.co.kr",
    },
    url: "https://parplay.co.kr/advanced-course",
    courseCode: "ADV-001",
    educationalLevel: "고급",
    teaches: [
      "Python 프로그래밍",
      "C++ 프로그래밍",
      "라즈베리파이",
      "OpenCV",
      "AI 비전",
      "IRO 대회 준비",
      "FIRA 대회 준비",
      "AI 로봇 개발",
    ],
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      audienceType: "중학생, 고등학생",
    },
    inLanguage: "ko-KR",
    availableLanguage: "ko",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: "천안시",
          addressRegion: "충청남도",
          addressCountry: "KR",
        },
      },
    },
  };

  return <JsonLd data={data} />;
}

/**
 * Course Schema - AirRobot Course
 * 드론 과정 정보
 */
export function AirRobotCourseSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "AirRobot Course - 드론 코딩 전문 과정",
    description: "항공 역학과 알고리즘을 활용한 드론 제어 전문 과정. 드론 조종부터 자율 비행 프로그래밍까지 체계적인 교육.",
    provider: {
      "@type": "Organization",
      name: "피지컬 AI 로봇플레이",
      url: "https://parplay.co.kr",
    },
    url: "https://parplay.co.kr/airrobot-course",
    courseCode: "AIR-001",
    educationalLevel: "중급-고급",
    teaches: [
      "드론 조종",
      "항공 역학",
      "자율 비행 프로그래밍",
      "드론 코딩",
      "비행 제어 알고리즘",
    ],
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      audienceType: "초등학생, 중학생, 고등학생",
    },
    inLanguage: "ko-KR",
    availableLanguage: "ko",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: "천안시",
          addressRegion: "충청남도",
          addressCountry: "KR",
        },
      },
    },
  };

  return <JsonLd data={data} />;
}

/**
 * Breadcrumb Schema
 * 빵 부스러기 네비게이션
 */
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

