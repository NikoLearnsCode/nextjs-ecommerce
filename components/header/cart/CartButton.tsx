'use client';

import {useCart} from '@/context/CartProvider';
import {PiBagSimpleThin} from 'react-icons/pi';
import {useHeaderSearchUi} from '@/context/HeaderSearchUiProvider';
import {
  CART_HEADER_POPOVER_ID,
  CART_HEADER_TRIGGER_ID,
} from '@/components/shared/HeaderPopoverPanel';

export function CartButton() {
  const {itemCount} = useCart();
  const {collapseSearch, isSearchExpanded} = useHeaderSearchUi();

  return (
    <button
      id={CART_HEADER_TRIGGER_ID}
      type='button'
      popoverTarget={CART_HEADER_POPOVER_ID}
      className='relative flex cursor-pointer items-center justify-center group'
      onClick={() => {
        if (isSearchExpanded) {
          collapseSearch();
        }
      }}
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
  );
}
