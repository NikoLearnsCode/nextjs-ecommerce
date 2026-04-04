'use client';

import {useRef, useCallback, memo, useState, useEffect, useMemo} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ProductCard as ProductCardType} from '@/lib/types/db-types';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {twMerge} from 'tailwind-merge';
import {usePathname} from 'next/navigation';

import FavoriteButton from '@/components/favorites/AddToFavoriteButton';
import NewBadge from '@/components/shared/NewBadge';
import {formatPrice} from '@/utils/formatPrice';
import {useFavorites} from '@/context/FavoritesProvider';
import {useNavigatedHistory} from '@/context/NavigatedHistoryProvider';
import RemoveProductButton from '@/components/shared/ui/RemoveProductButton';
import {pathnameEndsWithNewCollection} from '@/actions/utils/virtualCategories';

/** Minimum horizontal swipe (px) to change image on touch; avoids firing the link. */
const SWIPE_THRESHOLD_PX = 50;
/** Matches transition duration; used as fallback when transitionend does not fire. */
const SLIDE_TRANSITION_MS = 300;

type ProductCardProps = {
  product: ProductCardType;
  className?: string;
  layout?: 'grid' | 'list';
  /** LCP: true for above-the-fold grid cells (ProductGrid uses first ~12). */
  imagePriority?: boolean;
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
  slideIndexRef.current = slideIndex;
  const imageFingerprint = useMemo(() => images.join('\0'), [images]);

  useEffect(() => {
    setSlideIndex(1);
    isAnimatingRef.current = false;
  }, [slug, imageFingerprint]);

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
      aria-roledescription='bildkarusell'
      aria-label={`${name} – ${n} images`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className={twMerge(
          'flex h-full ease-out',
          skipTransition
            ? 'duration-0'
            : 'transition-transform duration-300 motion-reduce:transition-none motion-reduce:duration-0',
        )}
        style={{
          width: `${totalSlides * 100}%`,
          transform: `translateX(-${(slideIndex * 100) / totalSlides}%)`,
        }}
        onTransitionEnd={onTransitionEnd}
      >
        {extendedImages.map((src, i) => {
          const imageNumber = i === 0 || i === n ? n : i === n + 1 ? 1 : i;
          const isCloneSlide = i === 0 || i === n + 1;
          const shouldEagerLoad =
            (imagePriority && i === 1) || isCloneSlide || i === n;

          return (
            <div
              key={`${i}-${src}`}
              className='relative h-full shrink-0'
              style={{flex: `0 0 ${100 / totalSlides}%`}}
              role='group'
              aria-roledescription='bild'
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
                  alt={`${name} - bild ${imageNumber}`}
                  fill
                  quality={80}
                  priority={imagePriority && i === 1}
                  fetchPriority={imagePriority && i === 1 ? 'high' : 'auto'}
                  loading={imagePriority && i === 1 ? 'eager' : 'lazy'}
                  className='object-cover p-[1px]'
                  sizes='(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw'
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
              'hidden pointer-fine:flex absolute left-1 top-1/2 -translate-y-1/2 z-10 items-center justify-center pr-4 pl-2 py-3 transition-opacity duration-500 opacity-0 group-hover/slider:opacity-100 group-focus-within/slider:opacity-100',
            )}
            aria-label='Previous image'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goSlide(-1);
            }}
          >
            <ChevronLeft size={26} strokeWidth={1} className='text-gray-700' />
          </button>
          <button
            type='button'
            className={twMerge(
              'hidden pointer-fine:flex absolute right-1 top-1/2 -translate-y-1/2 z-10 items-center justify-center pl-4 pr-2 py-3 transition-opacity duration-500 opacity-0 group-hover/slider:opacity-100 group-focus-within/slider:opacity-100',
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
              className='text-gray-700'
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
}: ProductCardProps) {
  const {name, price, images, slug, isNew, id, brand, color} = product;
  const {removeFavorite, updatingItems} = useFavorites();
  const {handleSaveNavigated} = useNavigatedHistory();

  const pathname = usePathname();
  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFavorite(productId);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

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
  const isUpdating = updatingItems[id] || false;

  return (
    <div
      className={
        isListLayout
          ? 'flex flex-row sm:flex-col pb-1 md:pb-0 overflow-hidden group'
          : 'flex relative flex-col w-full h-full pb-6 group'
      }
    >
      <div
        className={
          isListLayout
            ? 'relative min-w-2/3 w-full h-full aspect-[7/9]'
            : 'w-full relative bg-white aspect-[7/9]'
        }
      >
        {hasMultipleImages ? (
          <ProductCardImages
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
              loading={imagePriority ? 'eager' : 'lazy'}
              className='object-cover'
              sizes='(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw'
            />
          </Link>
        )}
      </div>

      {isListLayout ? (
        <div className='px-3 py-4 sm:py-2 relative min-w-1/3 lg:pb-10 lg:px-3 flex flex-col mb-2'>
          <RemoveProductButton
            isPending={isUpdating}
            onClick={() => handleRemoveItem(id)}
            className='absolute top-2 left-1/2 z-10 -translate-x-1/2 shrink-0 p-2 sm:hidden text-gray-600'
          />

          <div className='flex flex-col flex-1 gap-1 sm:gap-0 justify-center items-center sm:items-start text-sm w-full pt-8 sm:pt-0'>
            <div className='relative w-full min-w-0 sm:flex sm:flex-row sm:items-start sm:justify-between sm:gap-2'>
              <Link
                href={`/${slug}`}
                className='focus-visible:underline focus-visible:underline-offset-2 flex flex-col items-start gap-1 justify-center sm:justify-start w-full max-w-full min-w-0 sm:flex-1'
                onClick={() =>
                  handleSaveNavigated({slug, image: images[0], name})
                }
              >
                <span className='block w-full min-w-0 flex-1 break-words text-center line-clamp-2 sm:text-left'>
                  {name}
                </span>
              </Link>
              <RemoveProductButton
                isPending={isUpdating}
                onClick={() => handleRemoveItem(id)}
                className='hidden shrink-0 self-start sm:inline-flex'
              />
            </div>
            <span className='text-black/80 text-sm'>{formatPrice(price)}</span>
          </div>
          <div className='text-sm mt-1 gap-2 md:text-base  flex flex-col sm:flex-row items-center'>
            <div className='flex gap-3 justify-center flex-wrap px-4 sm:px-0 sm:gap-4 text-xs'>
              {brand && <span>{brand}</span>}
              {color && <span>{color}</span>}
            </div>
          </div>
        </div>
      ) : (
        <>
          {isNew && !pathnameEndsWithNewCollection(pathname) && (
            <div className='px-2 pt-0.5 -mb-1 flex items-center justify-between'>
              <NewBadge />
              <FavoriteButton product={product} />
            </div>
          )}

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
              {(!isNew || pathnameEndsWithNewCollection(pathname)) && (
                <FavoriteButton product={product} />
              )}
            </div>
            <p className='text-xs text-gray-700 sm:text-sm'>
              {formatPrice(price)}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

const ProductCard = memo(ProductCardInner);
export default ProductCard;
