import {useState, useEffect, RefObject} from 'react';

export function useCartScroll(
  normalSummaryRef: RefObject<HTMLDivElement | null>
) {
  const [showFixedSummary, setShowFixedSummary] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (!normalSummaryRef.current) return;
      const rect = normalSummaryRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      setShowFixedSummary(rect.top >= windowHeight - 100);
    };

    const throttledScrollHandler = (() => {
      let waiting = false;
      return () => {
        if (!waiting) {
          waiting = true;
          setTimeout(() => {
            handleScroll();
            waiting = false;
          }, 100);
        }
      };
    })();

    window.addEventListener('scroll', throttledScrollHandler);
    handleScroll();
    return () => window.removeEventListener('scroll', throttledScrollHandler);
  }, [normalSummaryRef]);

  return showFixedSummary;
}
