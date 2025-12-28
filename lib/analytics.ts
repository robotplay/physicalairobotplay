/**
 * Analytics Event Tracking
 * Vercel Analytics와 Google Analytics 통합하여 사용자 행동 추적
 */

import { track } from '@vercel/analytics';

// Google Analytics gtag 타입 정의
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Event Types
export type AnalyticsEvent =
  | 'cta_click'
  | 'consultation_open'
  | 'consultation_submit'
  | 'course_view'
  | 'news_view'
  | 'external_link_click'
  | 'scroll_depth'
  | 'video_play'
  | 'image_view';

interface EventProperties {
  [key: string]: string | number | boolean;
}

/**
 * Track custom analytics event
 */
export function trackEvent(event: AnalyticsEvent, properties?: EventProperties) {
  try {
    // Vercel Analytics tracking
    track(event, properties);

    // Google Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, properties);
    }

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event, properties);
    }
  } catch (error) {
    console.error('[Analytics Error]', error);
  }
}

/**
 * Track page view with Google Analytics
 */
export function trackPageView(url: string, title?: string) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-LHLMYJLFY0', {
        page_path: url,
        page_title: title,
      });
    }
  } catch (error) {
    console.error('[GA PageView Error]', error);
  }
}

/**
 * Track conversion event (상담 신청 완료 등)
 */
export function trackConversion(eventName: string, value?: number, currency?: string) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'G-LHLMYJLFY0',
        event_category: 'engagement',
        event_label: eventName,
        value: value || 0,
        currency: currency || 'KRW',
      });
    }
  } catch (error) {
    console.error('[GA Conversion Error]', error);
  }
}

/**
 * Track advertising campaign parameters
 */
export function trackCampaign(source?: string, medium?: string, campaign?: string) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      const campaignParams: any = {};
      if (source) campaignParams.source = source;
      if (medium) campaignParams.medium = medium;
      if (campaign) campaignParams.campaign = campaign;
      
      window.gtag('event', 'campaign_view', campaignParams);
    }
  } catch (error) {
    console.error('[GA Campaign Error]', error);
  }
}

/**
 * Track CTA button clicks
 */
export function trackCTAClick(ctaName: string, location: string) {
  trackEvent('cta_click', {
    cta_name: ctaName,
    location: location,
  });
}

/**
 * Track consultation modal interactions
 */
export function trackConsultation(action: 'open' | 'submit', source?: string) {
  if (action === 'open') {
    trackEvent('consultation_open', { source: source || 'unknown' });
    
    // Google Analytics: 상담 모달 열기
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'consultation_open', {
        event_category: 'engagement',
        event_label: source || 'unknown',
        source: source || 'unknown',
      });
    }
  } else {
    trackEvent('consultation_submit', { source: source || 'unknown' });
    
    // Google Analytics: 상담 신청 완료 (전환 이벤트)
    trackConversion('consultation_submit', 0, 'KRW');
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'consultation_submit', {
        event_category: 'conversion',
        event_label: source || 'unknown',
        source: source || 'unknown',
      });
    }
  }
}

/**
 * Track course page views
 */
export function trackCourseView(courseName: string) {
  trackEvent('course_view', {
    course_name: courseName,
  });
}

/**
 * Track news article views
 */
export function trackNewsView(newsId: string, newsTitle: string) {
  trackEvent('news_view', {
    news_id: newsId,
    news_title: newsTitle,
  });
}

/**
 * Track external link clicks
 */
export function trackExternalLink(url: string, linkText: string) {
  trackEvent('external_link_click', {
    url: url,
    link_text: linkText,
  });
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(depth: number) {
  trackEvent('scroll_depth', {
    depth_percentage: depth,
  });
}

/**
 * Track video plays
 */
export function trackVideoPlay(videoTitle: string, videoUrl: string) {
  trackEvent('video_play', {
    video_title: videoTitle,
    video_url: videoUrl,
  });
}

/**
 * Track image views (for gallery/showcase)
 */
export function trackImageView(imageName: string, imageCategory: string) {
  trackEvent('image_view', {
    image_name: imageName,
    image_category: imageCategory,
  });
}

/**
 * Initialize scroll depth tracking
 */
export function initScrollTracking() {
  if (typeof window === 'undefined') return;

  const depths = [25, 50, 75, 100];
  const tracked = new Set<number>();

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;

    depths.forEach((depth) => {
      if (scrolled >= depth && !tracked.has(depth)) {
        tracked.add(depth);
        trackScrollDepth(depth);
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}

