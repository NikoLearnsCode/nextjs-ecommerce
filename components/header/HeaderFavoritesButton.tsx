'use client';

import Link from 'next/link';
import {memo} from 'react';
import {useFavorites} from '@/context/FavoritesProvider';
import {Heart} from 'lucide-react';
import {useHeaderSearchUi} from '@/context/HeaderSearchUiProvider';

function HeaderFavoritesButtonInner() {
  const {collapseSearch, isSearchExpanded} = useHeaderSearchUi();
  const {favoriteCount} = useFavorites();

  return (
    <Link
      href='/favorites'
      className='relative flex cursor-pointer items-center outline-gray-800 justify-center group'
      onClick={() => {
        if (isSearchExpanded) {
          collapseSearch();
        }
      }}
      aria-label={`Go to favorites ${favoriteCount > 0 ? ` (${favoriteCount} favorites)` : ''}`}
    >
      <Heart
        size={22}
        strokeWidth={1}
        className='cursor-pointer lg:hidden'
        aria-hidden='true'
      />

      <span className='hidden lg:block text-xs font-semibold uppercase border-b border-transparent hover:border-black transition text-nowrap'>
        Favorites ({favoriteCount})
      </span>

      {favoriteCount > 0 && (
        <span
          className='absolute top-1/2 -translate-y-1/2 pb-1 text-[10px] font-medium rounded-full pt-[1px] flex items-center justify-center px-1 lg:hidden'
          aria-hidden='true'
        >
          {favoriteCount > 99 ? '99+' : favoriteCount}
        </span>
      )}
    </Link>
  );
}

const HeaderFavoritesButton = memo(HeaderFavoritesButtonInner);
export default HeaderFavoritesButton;
