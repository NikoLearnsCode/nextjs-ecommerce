'use client';

// UNUSED — intended for InfiniteProductList (not wired up yet)

import {useEffect, useRef} from 'react';
import {usePathname, useSearchParams} from 'next/navigation';


export function useScrollRestoration() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasRestoredRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const scrollKey = `scroll:${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

 
  const saveScrollPosition = () => {
    try {
      const scrollY = window.scrollY;
      if (scrollY > 0) {
        sessionStorage.setItem(scrollKey, scrollY.toString());
        /* console.log(
          `Scroll position saved: ${scrollY}px for key: ${scrollKey}`
        ); */
      }
    } catch (error) {
      console.warn('Failed to save scroll position:', error);
    }
  };


  const restoreScrollPosition = () => {
    try {
      const savedPosition = sessionStorage.getItem(scrollKey);

      if (!savedPosition || hasRestoredRef.current) {
        /*  console.log(
          `No scroll position to restore or already restored. Key: ${scrollKey}`
        ); */
        return;
      }

      const scrollY = parseInt(savedPosition, 10);

      if (isNaN(scrollY) || scrollY <= 0) {
        console.warn(`Invalid scroll position: ${savedPosition}`);
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      /* console.log(`Attempting to restore scroll to: ${scrollY}px`); */

      const attemptRestore = (
        attempt: number = 1,
        maxAttempts: number = 15
      ) => {
        if (attempt > maxAttempts) {
          console.warn(
            `Failed to restore scroll position after ${maxAttempts} attempts`
          );
          return;
        }

        const documentHeight = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );

        const viewportHeight = window.innerHeight;
        const requiredHeight = scrollY + viewportHeight;

        /* console.log(
          `Attempt ${attempt}: documentHeight=${documentHeight}, requiredHeight=${requiredHeight}`
        ); */

        if (documentHeight >= requiredHeight) {
          window.scrollTo({top: scrollY, behavior: 'instant'});
          hasRestoredRef.current = true;
          /* console.log(
            `Scroll restored to ${scrollY}px on attempt ${attempt}`
          ); */

          setTimeout(() => {
            const actualScrollY = window.scrollY;
            if (Math.abs(actualScrollY - scrollY) > 10) {
              console.warn(
                `Scroll position verification failed. Expected: ${scrollY}, Actual: ${actualScrollY}`
              );
            } else {
              /*  console.log(`Scroll position verified: ${actualScrollY}px`); */
            }
          }, 100);
        } else {
          const delay = Math.min(100 * Math.pow(1.2, attempt - 1), 500);
          /* console.log(`DOM not ready, retrying in ${delay}ms...`); */

          timeoutRef.current = setTimeout(() => {
            attemptRestore(attempt + 1, maxAttempts);
          }, delay);
        }
      };

      setTimeout(() => {
        attemptRestore();
      }, 100);
    } catch (error) {
      console.warn('Failed to restore scroll position:', error);
    }
  };

  const clearScrollPosition = () => {
    try {
      sessionStorage.removeItem(scrollKey);
      /* console.log(`Scroll position cleared for key: ${scrollKey}`); */
    } catch (error) {
      console.warn('Failed to clear scroll position:', error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveScrollPosition();
      }
    };

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(saveScrollPosition, 150);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => {
      saveScrollPosition();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [scrollKey]);

  useEffect(() => {
    hasRestoredRef.current = false;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [scrollKey]);

  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
    scrollKey,
  };
}
