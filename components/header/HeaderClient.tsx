'use client';

import {
  HeaderSearchUiProvider,
  useHeaderSearchUi,
} from '@/context/HeaderSearchUiProvider';
import SearchBar from './search/SearchBar';
import UserButton from './user/UserButtonDropdown';
import HeaderFavoritesButton from './HeaderFavoritesButton';
import HeaderCartDropdown from './cart/CartDropdown';
import SearchDropdown from './search/SearchDropdown';
import {NavLink} from '@/lib/types/category-types';
import Navigation from './navigation/Navigation';
import Logo from '../shared/Logo';
import {useScrollLock} from '@/hooks/useScrollLock';

function HeaderInner({navLinks}: {navLinks: NavLink[]}) {
  const {isSearchExpanded} = useHeaderSearchUi();

  useScrollLock(isSearchExpanded);

  return (
    <>
      <div className='fixed w-full top-0 z-30 left-0 right-0 text-black bg-white flex justify-between items-center px-4 sm:px-8 h-14 gap-8'>
        {!isSearchExpanded && (
          <div className='flex gap-4 lg:gap-0 items-center'>
            <Navigation navLinks={navLinks} />
            <div className='lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2'>
              <Logo />
            </div>
          </div>
        )}

        <div
          className={`flex items-center justify-end gap-4 sm:gap-5 ${
            isSearchExpanded ? 'flex-grow' : ''
          }`}
        >
          <SearchBar />
          <UserButton />
          <HeaderFavoritesButton />
          <HeaderCartDropdown />
        </div>
      </div>

      <SearchDropdown />
    </>
  );
}

export default function HeaderClient({navLinks}: {navLinks: NavLink[]}) {
  return (
    <HeaderSearchUiProvider>
      <HeaderInner navLinks={navLinks} />
    </HeaderSearchUiProvider>
  );
}
