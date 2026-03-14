import { useEffect, useRef, useState } from 'react';

interface UseDashboardScrollIdleOptions {
  disabled?: boolean;
  idleMs?: number;
}

export function useDashboardScrollIdle({
  disabled = false,
  idleMs = 160,
}: UseDashboardScrollIdleOptions = {}) {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollingRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (disabled) {
      scrollingRef.current = false;
      setIsScrolling(false);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const markScrolling = () => {
      if (!scrollingRef.current) {
        scrollingRef.current = true;
        setIsScrolling(true);
      }

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        scrollingRef.current = false;
        setIsScrolling(false);
        timeoutRef.current = null;
      }, idleMs);
    };

    const options: AddEventListenerOptions = { passive: true };
    window.addEventListener('scroll', markScrolling, options);
    window.addEventListener('wheel', markScrolling, options);
    window.addEventListener('touchmove', markScrolling, options);

    return () => {
      window.removeEventListener('scroll', markScrolling);
      window.removeEventListener('wheel', markScrolling);
      window.removeEventListener('touchmove', markScrolling);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [disabled, idleMs]);

  return isScrolling;
}
