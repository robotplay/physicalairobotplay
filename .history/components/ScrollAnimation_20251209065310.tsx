'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

export default function ScrollAnimation({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const directionClasses = useMemo(() => ({
    up: 'translate-y-10',
    down: '-translate-y-10',
    left: 'translate-x-10',
    right: '-translate-x-10',
    fade: '',
  }), []);

  useEffect(() => {
    if (isVisible) return; // Already visible, no need to observe

    let timeoutId: NodeJS.Timeout | undefined;
    let observer: IntersectionObserver | null = null;
    
    const currentRef = ref.current;
    if (!currentRef) return;

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Use requestIdleCallback for better performance if available
          const scheduleAnimation = (callback: () => void) => {
            if ('requestIdleCallback' in window) {
              requestIdleCallback(callback, { timeout: 200 });
            } else {
              timeoutId = setTimeout(callback, delay);
            }
          };

          scheduleAnimation(() => {
            setIsVisible(true);
          });
          
          // Unobserve after triggering to improve performance
          if (currentRef && observer) {
            observer.unobserve(currentRef);
          }
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start animation slightly before element is visible
      }
    );

    observer.observe(currentRef);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (currentRef && observer) {
        observer.unobserve(currentRef);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]); // isVisible is intentionally excluded to prevent infinite loop

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${
        isVisible
          ? 'opacity-100 translate-y-0 translate-x-0'
          : `opacity-0 ${directionClasses[direction]}`
      } ${className}`}
    >
      {children}
    </div>
  );
}

