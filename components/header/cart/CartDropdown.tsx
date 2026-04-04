'use client';

import {useRef, useCallback} from 'react';
import {useCart} from '@/context/CartProvider';
import {AnimatePresence} from 'framer-motion';
import {PiBagSimpleThin} from 'react-icons/pi';
import {useKeyboardShortcut} from '@/hooks/useKeyboardShortcut';
import {useHeaderSearchUi} from '@/context/HeaderSearchUiProvider';
import {useDropdownDismissal} from '@/hooks/useDropdownDismissal';
import {useFocusTrap} from '@/hooks/useFocusTrap';
import {useScrollLock} from '@/hooks/useScrollLock';
import {HeaderPopoverPanel} from '../shared/HeaderPopoverPanel';
import {
  CART_DROPDOWN_TITLE_ID,
  CartDropdownContent,
} from './CartDropdownContent';

export default function CartDropdown() {
  const {collapseSearch, isSearchExpanded} = useHeaderSearchUi();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const {isCartOpen, openCart, closeCart, itemCount} = useCart();

  useScrollLock(isCartOpen);
  useFocusTrap(dropdownRef, isCartOpen);
  useKeyboardShortcut('Escape', closeCart, isCartOpen);

  useDropdownDismissal({
    isOpen: isCartOpen,
    onClose: closeCart,
    containerRef: dropdownRef,
    triggerRef: cartButtonRef,
  });

  const handleCartToggle = useCallback(() => {
    if (isSearchExpanded) {
      collapseSearch();
    }
    if (isCartOpen) {
      closeCart();
    } else {
      openCart();
    }
  }, [isSearchExpanded, isCartOpen, closeCart, openCart, collapseSearch]);

  return (
    <div className='relative '>
      <button
        ref={cartButtonRef}
        className='relative flex cursor-pointer items-center justify-center group'
        onClick={handleCartToggle}
        aria-label={`View cart ${itemCount > 0 ? ` (${itemCount} items)` : ''}`}
      >
        <PiBagSimpleThin
          size={23}
          strokeWidth={0.8}
          className='cursor-pointer lg:hidden'
          aria-hidden='true'
        />
        <span className='hidden lg:block text-xs font-semibold uppercase border-b border-transparent hover:border-black transition text-nowrap'>
          Cart {''}({itemCount})
        </span>

        {itemCount > 0 && (
          <span
            className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pt-[2.5px] text-black text-[10px] font-medium lg:hidden'
            aria-hidden='true'
          >
            {itemCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isCartOpen && (
          <HeaderPopoverPanel
            ref={dropdownRef}
            tabIndex={-1}
            aria-labelledby={CART_DROPDOWN_TITLE_ID}
            className={`absolute -right-1.5 lg:right-0 top-9.5 lg:top-9 w-72 sm:w-96 bg-white shadow-lg rounded-xs z-20 outline-none border border-gray-300

            before:content-[''] before:absolute before:bottom-full before:right-2 lg:before:right-4 before:w-0 before:h-0  before:border-[8px] before:border-transparent before:border-b-gray-400/70

            after:content-[''] after:absolute after:bottom-full after:right-2 lg:after:right-4 after:w-0 after:h-0  after:border-[8px] after:border-transparent after:border-b-white after:-mb-px
            `}
          >
            <CartDropdownContent onClose={closeCart} />
          </HeaderPopoverPanel>
        )}
      </AnimatePresence>
    </div>
  );
}
