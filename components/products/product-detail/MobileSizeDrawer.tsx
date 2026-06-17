'use client';

import {useEffect, useId} from 'react';
import {ModalDialog} from '@/components/shared/modal/ModalDialog';
import {ModalCloseButton} from '@/components/shared/modal/ModalCloseButton';
import {FocusHeading} from '@/components/shared/FocusHeading';
import {useCart} from '@/context/CartProvider';
import {useScrollLock} from '@/hooks/useScrollLock';
import {focusInitialIn} from '@/lib/focus';
import {
  CART_HEADER_POPOVER_ID,
  CART_HEADER_TRIGGER_ID,
  openHeaderPopover,
} from '@/components/shared/HeaderPopoverPanel';
import type {ProductDetail} from '@/lib/types/db-types';

type MobileSizeDrawerProps = {
  product: ProductDetail;
  isOpen: boolean;
  selectedSize: string | null;
  onClose: () => void;
  onAddSuccess: () => void;
};

export default function MobileSizeDrawer({
  product,
  isOpen,
  onClose,
  onAddSuccess,
}: MobileSizeDrawerProps) {
  const {addItem} = useCart();
  const dialogId = useId();
  const titleId = useId();
  useScrollLock(isOpen);

  // Opened programmatically (add-to-cart with no size), so drive the native
  // <dialog> from `isOpen`; user-driven closes sync back via ModalDialog.onClose.
  useEffect(() => {
    const dialog = document.getElementById(
      dialogId,
    ) as HTMLDialogElement | null;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
      const frame = requestAnimationFrame(() => focusInitialIn(dialog));
      return () => cancelAnimationFrame(frame);
    }

    if (dialog.open) dialog.close();
  }, [isOpen, dialogId]);

  const handleSizeSelect = async (size: string) => {
    onClose();
    try {
      await addItem({product_id: product.id, quantity: 1, size});
      onAddSuccess();
      openHeaderPopover(CART_HEADER_TRIGGER_ID, CART_HEADER_POPOVER_ID);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <ModalDialog
      id={dialogId}
      variant='bottom'
      onClose={onClose}
      className='[--modal-bottom-height:auto] [--modal-bottom-max-height:70svh] flex flex-col'
      aria-labelledby={titleId}
    >
      <div className='flex items-center justify-between pl-4 pr-1 py-2 border-b border-gray-200'>
        <FocusHeading
          id={titleId}
          className='text-xs font-semibold uppercase tracking-wide'
        >
          Choose your size
        </FocusHeading>
        <ModalCloseButton
          dialogId={dialogId}
          size={14}
          strokeWidth={1.5}
          aria-label='Close size picker'
          className='px-4 py-2'
        />
      </div>
      <div className='overflow-y-auto flex-1'>
        {product.sizes.map((size) => (
          <button
            key={size}
            type='button'
            className='w-full text-left first:mt-1 px-5 py-3.5 my-0.5 text-xs font-medium border-b last:border-b-0 last:pb-8 border-gray-200 cursor-pointer'
            onClick={() => handleSizeSelect(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </ModalDialog>
  );
}
