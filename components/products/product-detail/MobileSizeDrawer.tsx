'use client';

import {AnimatePresence} from 'framer-motion';
import {twMerge} from 'tailwind-merge';
import {
  MotionDropdown,
  MotionOverlay,
  MotionCloseX,
} from '@/components/shared/AnimatedSidebar';
import {useCart} from '@/context/CartProvider';
import {useScrollLock} from '@/hooks/useScrollLock';
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
  // selectedSize,
  onClose,
  onAddSuccess,
}: MobileSizeDrawerProps) {
  const {addItem, openCart} = useCart();
  useScrollLock(isOpen);

  const handleSizeSelect = async (size: string) => {
    onClose();
    try {
      await addItem({product_id: product.id, quantity: 1, size});
      onAddSuccess();
      openCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <MotionOverlay onClick={onClose} id='size-drawer-overlay' />
          <MotionDropdown
            position='bottom'
            id='size-drawer'
            className='max-h-[70svh] flex flex-col'
          >
            <div className='flex items-center justify-between px-4 py-4 border-b border-gray-100'>
              <h2 className='text-xs font-semibold uppercase tracking-wide'>
                Choose your size
              </h2>
              <MotionCloseX
                onClick={onClose}
                size={14}
                strokeWidth={1.5}
                aria-label='Close size picker'
              />
            </div>
            <div className='overflow-y-auto flex-1 '>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type='button'
                  className={twMerge(
                    'w-full text-left px-4 py-4 text-xs font-medium border-b last:border-b-0 last:pb-8 border-gray-200 cursor-pointer',
                  )}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </MotionDropdown>
        </>
      )}
    </AnimatePresence>
  );
}
