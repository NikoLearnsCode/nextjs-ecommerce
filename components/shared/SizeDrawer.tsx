'use client';

import {useEffect, useId} from 'react';
import {ModalDialog} from '@/components/shared/modal/ModalDialog';
import {ModalCloseButton} from '@/components/shared/modal/ModalCloseButton';
import {FocusHeading} from '@/components/shared/FocusHeading';
import {useAddToCart} from '@/hooks/useAddToCart';
import {useScrollLock} from '@/hooks/useScrollLock';
import {focusInitialIn} from '@/lib/focus';

type SizeDrawerProps = {
  productId: string;
  sizes: string[];
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess?: () => void;
};

export default function SizeDrawer({
  productId,
  sizes,
  isOpen,
  onClose,
  onAddSuccess,
}: SizeDrawerProps) {
  const addToCart = useAddToCart();
  const dialogId = useId();
  const titleId = useId();
  useScrollLock(isOpen);

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
    await addToCart(
      {product_id: productId, quantity: 1, size},
      {onSuccess: onAddSuccess},
    );
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
        {sizes.map((size) => (
          <button
            key={size}
            type='button'
            className='w-full text-left first:mt-1 px-5 py-3 my-0.5 text-xs font-semibold border-b last:border-b-0 last:pb-8 border-gray-200 cursor-pointer'
            onClick={() => handleSizeSelect(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </ModalDialog>
  );
}
