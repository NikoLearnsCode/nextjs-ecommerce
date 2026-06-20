'use client';

import {useCallback} from 'react';
import {useCart} from '@/context/CartProvider';
import type {AddToCartItem} from '@/lib/types/db-types';
import {
  CART_HEADER_POPOVER_ID,
  CART_HEADER_TRIGGER_ID,
  openHeaderPopover,
} from '@/components/shared/HeaderPopoverPanel';

// Returns focus to `returnFocusEl` once the cart popover closes, unless focus
// has meaningfully moved elsewhere. Attached after the popover is opened so the
// element exists even when it mounts lazily on first open.
function returnFocusOnCartClose(returnFocusEl: HTMLElement) {
  const popover = document.getElementById(CART_HEADER_POPOVER_ID);
  const trigger = document.getElementById(CART_HEADER_TRIGGER_ID);
  if (!popover) return;

  const onToggle = (event: Event) => {
    if ((event as ToggleEvent).newState === 'open') return;
    popover.removeEventListener('toggle', onToggle);
    const active = document.activeElement;
    const focusLandedOnOpener =
      !active ||
      active === document.body ||
      active === trigger ||
      popover.contains(active);
    if (focusLandedOnOpener) returnFocusEl.focus();
  };
  popover.addEventListener('toggle', onToggle);
}

type AddToCartOptions = {
  onSuccess?: () => void;
  // When set, focus returns to this element after the cart popover closes.
  returnFocusEl?: HTMLElement;
};

// Shared add-to-cart flow: add the item, open the cart popover, optionally
// restore focus. Returns whether the add succeeded.
export function useAddToCart() {
  const {addItem} = useCart();

  return useCallback(
    async (item: AddToCartItem, options: AddToCartOptions = {}) => {
      try {
        await addItem(item);
        options.onSuccess?.();
        openHeaderPopover(CART_HEADER_TRIGGER_ID, CART_HEADER_POPOVER_ID);
        if (options.returnFocusEl) returnFocusOnCartClose(options.returnFocusEl);
        return true;
      } catch (error) {
        console.error('Error adding to cart:', error);
        return false;
      }
    },
    [addItem],
  );
}
