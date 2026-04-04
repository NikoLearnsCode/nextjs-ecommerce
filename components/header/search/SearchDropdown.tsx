'use client';

import {useMemo, useRef} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {useNavigatedHistory} from '@/context/NavigatedHistoryProvider';
import {AnimatePresence} from 'framer-motion';
import {
  MotionDropdown,
  MotionOverlay,
  MotionCloseX,
} from '../../shared/AnimatedSidebar';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {useHeaderSearchUi} from '@/context/HeaderSearchUiProvider';
import {useFocusTrap} from '@/hooks/useFocusTrap';
import {Button} from '@/components/shared/ui/button';

const POPULAR_SEARCHES = [
  'T-shirts',
  'Overshirt',
  'Women',
  'Jackets',
  'Pants',
  'Tops',
  'Men',
] as const;

function PopularSearches({
  onSelectSearch,
}: {
  onSelectSearch: (term: string) => void;
}) {
  return (
    <div className=' w-full lg:max-w-72 lg:py-1'>
      <h2 className='text-xs font-semibold  uppercase mb-4'>
        Popular searches
      </h2>
      <ul className='flex flex-wrap gap-3 lg:pr-10 '>
        {POPULAR_SEARCHES.map((search) => (
          <li key={search} className='min-w-0 max-w-full'>
            <Link
              href={`/search?q=${encodeURIComponent(search)}`}
              className='block min-w-0 max-w-full text-gray-600 font-medium text-[11px] hover:border-gray-600 border-b pb-0.5 uppercase border-transparent transition-colors duration-200 line-clamp-2 [overflow-wrap:anywhere]'
              onClick={() => onSelectSearch(search)}
            >
              {search}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SearchHistorySection({
  searchHistory,
  onSelectSearch,
  onRemoveAll,
}: {
  searchHistory: string[];
  onSelectSearch: (term: string) => void;
  onRemoveAll: () => void;
}) {
  return (
    <div className='w-full lg:max-w-72 lg:py-1'>
      <div className='flex justify-between mb-5'>
        <h2 className='text-xs font-semibold uppercase'>Recent searches</h2>
        <Button
          type='button'
          variant='link'
          className='text-[11px] font-semibold underline hover:text-gray-500 m-0 py-0 h-auto px-3 '
          onClick={() => onRemoveAll()}
        >
          Clear
        </Button>
      </div>

      <ul className='flex flex-wrap gap-3 lg:pr-10 '>
        {searchHistory.map((term, index) => (
          <li key={`${term}-${index}`} className='min-w-0 max-w-full'>
            <Link
              href={`/search?q=${encodeURIComponent(term)}`}
              onClick={() => onSelectSearch(term)}
              className='block min-w-0 max-w-full text-gray-600 font-medium text-[11px] hover:border-gray-600 border-b pb-0.5 uppercase border-transparent transition-colors duration-200 line-clamp-2 [overflow-wrap:anywhere]'
            >
              {term}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

type RecentlyViewedProduct = {
  slug: string;
  name: string;
  image: string;
};

function RecentlyViewedProducts({
  products,
  onNavigate,
}: {
  products: RecentlyViewedProduct[];
  onNavigate: () => void;
}) {
  if (products.length === 0) return null;

  return (
    <div className=' lg:pl-10 lg:py-1'>
      <h2 className='text-xs font-semibold uppercase mb-4'>Recently viewed</h2>
      <div className='grid -mx-4 lg:-mx-0 grid-cols-3 gap-0.5 lg:gap-2 lg:pb-2 lg:flex flex-col'>
        {products.map((product) => (
          <div
            key={product.slug}
            className='relative aspect-[7/9] lg:aspect-auto w-full h-full '
          >
            <Link
              href={`/${product.slug}`}
              className='group lg:flex lg:items-center lg:gap-5'
              tabIndex={0}
              onClick={onNavigate}
            >
              <Image
                src={product.image}
                alt={product.slug}
                quality={90}
                tabIndex={-1}
                fill
                sizes='(max-width: 768px) 100vw, 50vw'
                className='block lg:hidden object-cover border  border-gray-200  hover:border-black transition-colors duration-200 active:border-black group-focus:border-black'
              />
              <Image
                src={product.image}
                alt={product.slug}
                quality={90}
                tabIndex={-1}
                height={50}
                width={50}
                className='hidden w-10 h-10 rounded-full lg:block object-cover border border-gray-200  transition-colors duration-200 opacity-85 active:border-black group-hover:border-gray-300 group-hover:opacity-100 '
              />
              <p className='text-xs group-hover:text-black text-gray-700 hidden  lg:block'>
                {product.name}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchDropdown() {
  const {isSearchExpanded, collapseSearch} = useHeaderSearchUi();
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const {
    navigatedProducts,
    searchHistory,
    handleSaveSearch,
    handleRemoveAllSearches,
  } = useNavigatedHistory();

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Return focus is handled in SearchBar — the trigger unmounts on expand so the
  // trap's "previous focus" is often the input or body, not the search icon.
  useFocusTrap(searchPanelRef, isSearchExpanded, {
    returnFocusOnDeactivate: false,
    autoFocus: false,
  });

  const displayedProducts = useMemo(
    () => (isDesktop ? navigatedProducts.slice(0, 3) : navigatedProducts),
    [isDesktop, navigatedProducts],
  );

  const onSelectSearch = (term: string) => {
    handleSaveSearch(term);
    collapseSearch();
  };

  return (
    <AnimatePresence>
      {isSearchExpanded && (
        <>
          <MotionDropdown
            ref={searchPanelRef}
            key='top-menu'
            position='top'
            className='overflow-y-auto overscroll-y-none pt-8 pb-24 lg:pt-6 lg:pb-10 h-full lg:h-auto bg-white shadow-none'
          >
            {/* Close button inside the trap so keyboard users can always
                reach it. Positioned absolutely so it doesn't affect layout. */}
            <div className='absolute top-0 right-0 flex items-center pr-2 pt-1 lg:pr-4 lg:pt-2 '>
              <MotionCloseX
                onClick={collapseSearch}
                size={12}
                strokeWidth={2}
                className='px-3 py-2 opacity-0 pointer-events-none focus-visible:opacity-100 focus-visible:pointer-events-auto transition-opacity duration-200 focus:outline-none focus-visible:ring-2'
                aria-label='Close search'
              />
            </div>

            <div
              className={`px-4 lg:px-8 flex flex-col lg:flex-row ${
                navigatedProducts.length > 0
                  ? 'gap-10 lg:gap-6'
                  : 'gap-0 lg:gap-6'
              }`}
            >
              {!searchHistory.length && (
                <PopularSearches onSelectSearch={onSelectSearch} />
              )}
              {searchHistory.length > 0 && (
                <SearchHistorySection
                  searchHistory={searchHistory}
                  onSelectSearch={onSelectSearch}
                  onRemoveAll={handleRemoveAllSearches}
                />
              )}

              <RecentlyViewedProducts
                products={displayedProducts}
                onNavigate={collapseSearch}
              />
            </div>
          </MotionDropdown>

          <MotionOverlay
            key='search-overlay'
            className='top-14'
            withDelay={true}
            onClick={collapseSearch}
          />
        </>
      )}
    </AnimatePresence>
  );
}
