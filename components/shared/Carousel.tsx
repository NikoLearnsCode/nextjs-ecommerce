'use client';

import {ArrowLeft, ArrowRight} from 'lucide-react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, A11y, Mousewheel} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/a11y';
import type SwiperType from 'swiper';
import {useState} from 'react';
import {twMerge} from 'tailwind-merge';

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  title?: string;
  id?: string;
  className?: string;
  spaceBetween?: number;
  slidesOffsetBefore?: number;
  breakpoints?: {
    [key: number]: {
      slidesPerView: number;
      spaceBetween?: number;
    };
  };
  showNavigation?: boolean;
  navigationClassName?: string;
  titleClassName?: string;
  titelDivClassName?: string;
}

const Carousel = <T,>({
  items,
  renderItem,
  title,
  id = 'carousel',
  className = '',
  spaceBetween = 3,

  breakpoints = {
    640: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 4,
    },
    1280: {
      slidesPerView: 5,
    },
  },
  showNavigation = true,
  navigationClassName = '',
  titleClassName = '',
  titelDivClassName = '',
}: CarouselProps<T>) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Keep nav state in sync and pull off-screen slides out of tab order / a11y tree
  // so keyboard focus only ever reaches the currently visible slides.
  const syncA11y = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    swiper.slides.forEach((slide) => {
      const visible = slide.classList.contains('swiper-slide-visible');
      slide.toggleAttribute('inert', !visible);
    });
  };

  const prevButtonClass = `${id}-prev`;
  const nextButtonClass = `${id}-next`;
  const titleId = `${id}-title`;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={twMerge('', className)}>
      {(title || showNavigation) && (
        <div
          className={twMerge(
            'flex justify-between items-center mb-2 lg:mb-3 ',
            titelDivClassName,
          )}
        >
          {title && (
            <h2
              id={titleId}
              className={twMerge(
                'text-sm text-gray-800 uppercase font-semibold',
                titleClassName,
              )}
            >
              {title}
            </h2>
          )}

          {showNavigation && (
            <div className={twMerge('flex z-10', navigationClassName)}>
              <button
                className={`${prevButtonClass} py-1.5 pl-3 pr-1.5 transition cursor-pointer ${
                  isBeginning ? 'opacity-30 pointer-events-none' : 'opacity-100'
                }`}
                aria-label='Previous slide'
                disabled={isBeginning}
              >
                <ArrowLeft
                  strokeWidth={1.25}
                  className='h-3.5 w-3.5 sm:h-4.5 sm:w-4.5'
                />
              </button>

              <button
                className={`${nextButtonClass} py-1.5 pr-3 pl-1.5 transition cursor-pointer ${
                  isEnd ? 'opacity-30 pointer-events-none' : 'opacity-100'
                }`}
                aria-label='Next slide'
                disabled={isEnd}
              >
                <ArrowRight
                  strokeWidth={1.25}
                  className='h-3.5 w-3.5 sm:h-4.5 sm:w-4.5'
                />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Swiper carousel */}
      <Swiper
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : 'Product carousel'}
        modules={[Navigation, A11y, Mousewheel]}
        mousewheel={{forceToAxis: true, thresholdDelta: 10, thresholdTime: 100}}
        spaceBetween={spaceBetween}
        slidesPerView={2}
        breakpoints={breakpoints}
        navigation={{
          prevEl: `.${prevButtonClass}`,
          nextEl: `.${nextButtonClass}`,
        }}
        watchSlidesProgress
        a11y={{
          enabled: true,
          containerRoleDescriptionMessage: 'carousel',
          itemRoleDescriptionMessage: 'slide',
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
          firstSlideMessage: 'This is the first slide',
          lastSlideMessage: 'This is the last slide',
          slideLabelMessage: '{{index}} of {{slidesLength}}',
        }}
        onInit={syncA11y}
        onSlideChange={syncA11y}
        onTransitionEnd={syncA11y}
        onResize={syncA11y}
        onBreakpoint={syncA11y}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>{renderItem(item, index)}</SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
