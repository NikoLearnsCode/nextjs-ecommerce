'use client';

import {useEffect, useRef} from 'react';
import Image from 'next/image';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {twMerge} from 'tailwind-merge';

type MobileImageSwiperProps = {
  images: string[];
  productName: string;
  initialSlide?: number;
  activeIndex: number;
  onSlideChange: (index: number) => void;
  className?: string;
};

export default function MobileImageSwiper({
  images,
  productName,
  initialSlide = 0,
  activeIndex,
  onSlideChange,
  className,
}: MobileImageSwiperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isBeginning = activeIndex === 0;
  const isEnd = activeIndex === images.length - 1;

  // Jump to the initial slide once on mount (no animation)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || initialSlide === 0) return;
    container.scrollLeft = initialSlide * container.clientWidth;
  }, [initialSlide]);

  // Report the centered slide as the user scrolls
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onSlideChange(Number(entry.target.getAttribute('data-index')));
          }
        }
      },
      {root: container, threshold: 0.6}
    );

    slideRefs.current.forEach((slide) => slide && observer.observe(slide));
    return () => observer.disconnect();
  }, [images.length, onSlideChange]);

  const scrollByDir = (dir: -1 | 1) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollBy({left: dir * container.clientWidth, behavior: 'smooth'});
  };

  if (!images || images.length === 0) {
    return (
      <div
        className={twMerge(
          'relative aspect-7/9 bg-gray-200 flex items-center justify-center',
          className
        )}
      >
        <span className='text-gray-500'>No image available</span>
      </div>
    );
  }

  return (
    <div className={twMerge('relative', className)}>
      {/* Native scroll-snap track */}
      <div
        tabIndex={-1}
        ref={containerRef}
        className='flex aspect-7/9 w-full outline-none touch-pan-x touch-pan-y snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [-webkit-overflow-scrolling:touch] scrollbar-hide'
      >
        {images.map((imgSrc, idx) => (
          <div
            key={idx}
            ref={(el) => {
              slideRefs.current[idx] = el;
            }}
            data-index={idx}
            className='relative h-full w-full shrink-0 snap-start snap-always'
          >
            <Image
              src={imgSrc}
              alt={`${productName} - image ${idx + 1}`}
              fill
              quality={80}
              sizes='(max-width: 1023px) 100vw, 0px'
              priority={idx === 0}
              fetchPriority={idx === 0 ? 'high' : 'auto'}
              className='object-cover '
            />
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => scrollByDir(-1)}
            disabled={isBeginning}
            className={twMerge(
              'hidden pointer-fine:flex absolute left-0 top-1/2 -translate-y-1/2 pr-4 py-4 pl-2 cursor-pointer z-10 overlay-focus-ring',
              isBeginning ? 'opacity-30 pointer-events-none' : 'opacity-100'
            )}
            aria-label='Previous image'
          >
            <ChevronLeft
              size={24}
              strokeWidth={1.25}
              className='overlay-chevron'
            />
          </button>
          <button
            onClick={() => scrollByDir(1)}
            disabled={isEnd}
            className={twMerge(
              'hidden pointer-fine:flex absolute right-0 top-1/2 -translate-y-1/2 pl-4 py-4 pr-2 cursor-pointer z-10 overlay-focus-ring',
              isEnd ? 'opacity-30 pointer-events-none' : 'opacity-100'
            )}
            aria-label='Next image'
          >
            <ChevronRight
              size={24}
              strokeWidth={1.25}
              className='overlay-chevron'
            />
          </button>
        </>
      )}

      {/* Pagination text indicator */}
      {images.length > 1 && (
        <div className='absolute bottom-2 left-2 justify-center mt-4 flex gap-2 z-10'>
          <span className='text-[11px] font-medium text-gray-500 px-1'>
            {activeIndex + 1} / {images.length}
          </span>
        </div>
      )}
    </div>
  );
}
