'use client';

import {useRef, useCallback, memo, useState, useEffect, useMemo} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ProductCard as ProductCardType} from '@/lib/types/db-types';
import {ChevronLeft, ChevronRight, Plus} from 'lucide-react';
import {twMerge} from 'tailwind-merge';
import {usePathname} from 'next/navigation';

import FavoriteButton from '@/components/favorites/AddToFavoriteButton';
import NewBadge from '@/components/shared/NewBadge';
import {formatPrice} from '@/utils/formatPrice';
import {useNavigatedHistory} from '@/context/NavigatedHistoryProvider';
import CardAddToCart from '@/components/shared/cards/CardAddToCart';
import {useSizeDrawer} from '@/context/SizeDrawerProvider';
import {pathnameEndsWithNewCollection} from '@/actions/utils/virtualCategories';
import type {GridLayout} from '@/components/products/product-grid/ProductGrid';

/** Minimum horizontal swipe (px) to change image on touch; avoids firing the link. */
const SWIPE_THRESHOLD_PX = 50;
/** Matches transition duration; used as fallback when transitionend does not fire. */
const SLIDE_TRANSITION_MS = 300;

type ProductCardProps = {
  product: ProductCardType;
  className?: string;
  layout?: 'grid' | 'list';
  /** LCP: true for above-the-fold grid cells (ProductGrid uses first 4). */
  imagePriority?: boolean;
  /** Grid density (only affects the non-list grid card). */
  gridLayout?: GridLayout;
};

function ProductCardImages({
  images,
  slug,
  name,
  imagePriority,
  onSaveNavigated,
}: {
  images: string[];
  slug: string;
  name: string;
  imagePriority: boolean;
  onSaveNavigated: (image: string) => void;
}) {
  const n = images.length;
  // Clone last + first slide so wrap-around can animate instead of jumping.
  const extendedImages = useMemo(
    () => (n >= 2 ? [images[n - 1], ...images, images[0]] : images),
    [images, n],
  );
  const totalSlides = extendedImages.length;
  const [slideIndex, setSlideIndex] = useState(1);
  const [skipTransition, setSkipTransition] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const suppressLinkClick = useRef(false);
  const isAnimatingRef = useRef(false);
  const slideIndexRef = useRef(slideIndex);

  useEffect(() => {
    slideIndexRef.current = slideIndex;
  }, [slideIndex]);

  useEffect(() => {
    if (skipTransition) {
      requestAnimationFrame(() => {
        setSkipTransition(false);
        isAnimatingRef.current = false;
      });
    }
  }, [skipTransition]);

  const applyWrapReset = useCallback(
    (idx: number) => {
      if (idx === 0) {
        setSkipTransition(true);
        setSlideIndex(n);
      } else if (idx === n + 1) {
        setSkipTransition(true);
        setSlideIndex(1);
      } else {
        isAnimatingRef.current = false;
      }
    },
    [n],
  );

  const onTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget || e.propertyName !== 'transform') return;
      if (n < 2 || skipTransition) return;
      applyWrapReset(slideIndexRef.current);
    },
    [n, skipTransition, applyWrapReset],
  );

  const goSlide = useCallback(
    (direction: -1 | 1) => {
      if (n < 2 || isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      setSlideIndex((i) => i + direction);
      window.setTimeout(() => {
        if (!isAnimatingRef.current) return;
        applyWrapReset(slideIndexRef.current);
      }, SLIDE_TRANSITION_MS + 50);
    },
    [n, applyWrapReset],
  );

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || n < 2) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
    suppressLinkClick.current = true;
    goSlide(dx < 0 ? 1 : -1);
    window.setTimeout(() => {
      suppressLinkClick.current = false;
    }, 400);
  };

  const handleImageLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (suppressLinkClick.current) {
        e.preventDefault();
        return;
      }
      const src = e.currentTarget.dataset.src;
      if (src) onSaveNavigated(src);
    },
    [onSaveNavigated],
  );

  return (
    <div
      className='relative h-full w-full overflow-clip group/slider touch-pan-y'
      role='region'
      aria-roledescription='image carousel'
      aria-label={`${name} – ${n} images`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className={twMerge(
          'flex h-full ease-out',
          skipTransition
            ? 'duration-0'
            : 'transition-transform duration-300',
        )}
        style={{
          width: `${totalSlides * 100}%`,
          transform: `translateX(-${(slideIndex * 100) / totalSlides}%)`,
        }}
        onTransitionEnd={onTransitionEnd}
      >
        {extendedImages.map((src, i) => {
          const imageNumber = i === 0 || i === n ? n : i === n + 1 ? 1 : i;

          return (
            <div
              key={`${i}-${src}`}
              className='relative h-full shrink-0'
              style={{flex: `0 0 ${100 / totalSlides}%`}}
              role='group'
              aria-roledescription='image'
              aria-label={`${imageNumber} of ${n}`}
              aria-hidden={i !== slideIndex}
            >
              <Link
                href={`/${slug}`}
                className='block h-full w-full relative'
                tabIndex={-1}
                data-src={src}
                onClick={handleImageLinkClick}
              >
                <Image
                  src={src}
                  alt={`${name} - image ${imageNumber}`}
                  fill
                  quality={80}
                  priority={imagePriority && i === 1}
                  fetchPriority={imagePriority && i === 1 ? 'high' : 'auto'}
                  className='object-cover p-[1px]'
                  sizes='(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw'
                />
              </Link>
            </div>
          );
        })}
      </div>

      {n > 1 && (
        <>
          <button
            type='button'
            className={twMerge(
              'hidden pointer-fine:flex absolute left-1 top-1/2 -translate-y-1/2 z-10 items-center justify-center pr-4 pl-2 py-3 transition-opacity duration-300 opacity-0 group-hover/slider:opacity-100 group-focus-within/slider:opacity-100 overlay-focus-ring',
            )}
            aria-label='Previous image'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goSlide(-1);
            }}
          >
            <ChevronLeft
              size={26}
              strokeWidth={1}
              className='overlay-chevron'
            />
          </button>
          <button
            type='button'
            className={twMerge(
              'hidden pointer-fine:flex absolute right-1 top-1/2 -translate-y-1/2 z-10 items-center justify-center pl-4 pr-2 py-3 transition-opacity duration-300 opacity-0 group-hover/slider:opacity-100 group-focus-within/slider:opacity-100 overlay-focus-ring',
            )}
            aria-label='Next image'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goSlide(1);
            }}
          >
            <ChevronRight
              size={24}
              strokeWidth={1.25}
              className='overlay-chevron'
            />
          </button>
          {/* <div className='absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5'>
            {images.map((_, i) => (
              <span
                key={i}
                className={twMerge(
                  'w-1.5 h-1.5 rounded-full transition-colors duration-200',
                  i === slideIndex ? 'bg-gray-800' : 'bg-gray-800/30',
                )}
              />
            ))}
          </div> */}
        </>
      )}
    </div>
  );
}

function ProductCardInner({
  product,
  layout = 'grid',
  imagePriority = false,
  gridLayout = 'compact',
}: ProductCardProps) {
  const {name, price, images, slug, isNew, id, sizes} = product;
  const {handleSaveNavigated} = useNavigatedHistory();
  const {openSizeDrawer} = useSizeDrawer();

  const pathname = usePathname();

  const hasMultipleImages = images && images.length > 1;
  const hasImages = images && images.length > 0;

  const onSaveNavigated = useCallback(
    (image: string) => {
      handleSaveNavigated({slug, image, name});
    },
    [handleSaveNavigated, slug, name],
  );

  if (!hasImages) {
    return (
      <div className='border border-gray-50 h-full group'>
        <div className='w-full aspect-[7/9] bg-gray-200 flex items-center justify-center'>
          <span className='text-gray-500'>No image available</span>
        </div>
        <div className='p-1.5 overflow-hidden'>
          <h2 className='truncate w-fit'>{name}</h2>
          <p className='mt-2'>{formatPrice(price)}</p>
        </div>
      </div>
    );
  }

  const isListLayout = layout === 'list';
  const isComfortable = !isListLayout && gridLayout === 'comfortable';
  // Compact hides the heart on touch (the + handles add); comfortable keeps it.
  const heartClassName =
    gridLayout === 'comfortable' ? '' : 'hidden pointer-fine:inline-flex';

  // Compact grid: on touch the + sits in the heart's slot and opens the size sheet.
  const plusTrigger =
    !isListLayout && gridLayout === 'compact' && sizes && sizes.length > 0 ? (
      <button
        type='button'
        className='pointer-fine:hidden inline-flex shrink-0 items-center justify-center pl-3 text-gray-800'
        aria-label={`Choose a size for ${name}`}
        onClick={() => openSizeDrawer({productId: id, sizes})}
      >
        <Plus size={18} strokeWidth={1.5} />
      </button>
    ) : null;

  return (
    <div className='flex relative flex-col w-full h-full pb-6 group'>
      <div className='w-full relative bg-white aspect-[7/9]'>
        {hasMultipleImages ? (
          <ProductCardImages
            key={`${slug}-${images.join('\0')}`}
            images={images}
            slug={slug}
            name={name}
            imagePriority={imagePriority}
            onSaveNavigated={onSaveNavigated}
          />
        ) : (
          <Link href={`/${slug}`} className='block h-full w-full'>
            <Image
              src={images[0]}
              alt={name}
              fill
              quality={80}
              priority={imagePriority}
              fetchPriority={imagePriority ? 'high' : 'auto'}
              className='object-cover'
              sizes='(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw'
            />
          </Link>
        )}
        {sizes && sizes.length > 0 && (
          <CardAddToCart
            productId={id}
            name={name}
            sizes={sizes}
            showTouchPlus={isListLayout}
          />
        )}
      </div>

      {isListLayout ? (
        <div className='px-2 pt-0.5 flex flex-col'>
          <div className='flex items-center justify-between gap-1'>
            <Link
              href={`/${slug}`}
              className='pt-0.5 min-w-0 w-fit'
              onClick={() =>
                handleSaveNavigated({slug, image: images[0], name})
              }
            >
              <h2 className='text-xs sm:text-sm font-normal truncate '>
                {name}
              </h2>
            </Link>
            <FavoriteButton
              product={product}
              size={18}
              className='shrink-0 h-auto w-8 p-0'
            />
          </div>
          <p className='text-xs text-gray-700 sm:text-sm'>
            {formatPrice(price)}
          </p>
        </div>
      ) : (
        <>
          {isNew && !pathnameEndsWithNewCollection(pathname) && (
            <div className='px-2 pt-1 -mb-1 flex items-center justify-between'>
              <NewBadge />
              {plusTrigger}
              <FavoriteButton product={product} className={heartClassName} />
            </div>
          )}

          <div className='px-2 pt-1 flex flex-col'>
            <div className='flex items-center justify-between gap-1'>
              <Link
                href={`/${slug}`}
                className='pt-0.5 min-w-0 w-fit'
                onClick={() =>
                  handleSaveNavigated({slug, image: images[0], name})
                }
              >
                <h2 className='text-xs sm:text-sm font-normal truncate '>
                  {name}
                </h2>
              </Link>
              {(!isNew || pathnameEndsWithNewCollection(pathname)) && (
                <>
                  {plusTrigger}
                  <FavoriteButton product={product} className={heartClassName} />
                </>
              )}
            </div>
            <p className='text-xs text-gray-700 sm:text-sm'>
              {formatPrice(price)}
            </p>
          </div>
        </>
      )}

      {isComfortable && sizes && sizes.length > 0 && (
        <button
          type='button'
          className='pointer-fine:hidden my-2 mt-4 mx-2  bg-black h-11 text-[11px] font-medium uppercase tracking-wide text-white'
          aria-label={`Choose a size for ${name}`}
          onClick={() => openSizeDrawer({productId: id, sizes})}
        >
          Add to cart
        </button>
      )}
    </div>
  );
}

const ProductCard = memo(ProductCardInner);
export default ProductCard;
