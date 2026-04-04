'use client';

import {useRef} from 'react';
import {useCart} from '@/context/CartProvider';
import Link from 'next/link';
import {
  MotionOverlay,
  MotionDropdown,
  MotionCloseX,
} from '@/components/shared/AnimatedSidebar';
import Image from 'next/image';
import {formatPrice} from '@/utils/formatPrice';
import {AnimatePresence} from 'framer-motion';
import {useScrollLock} from '@/hooks/useScrollLock';
import {useFocusTrap} from '@/hooks/useFocusTrap';
import {useKeyboardShortcut} from '@/hooks/useKeyboardShortcut';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {createPortal} from 'react-dom';

interface ProductModalProps {
  closeMenu: () => void;
  isOpen: boolean;
}

export default function ProductModal({closeMenu, isOpen}: ProductModalProps) {
  const {cartItems, itemCount, removeItem, removingItems} = useCart();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const modalPanelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(modalPanelRef, isOpen);

  useKeyboardShortcut('Escape', closeMenu, isOpen);
  useScrollLock(isOpen);

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <MotionOverlay key='product-modal-overlay' onClick={closeMenu} />
          <MotionDropdown
            ref={modalPanelRef}
            key={isDesktop ? 'product-modal-desktop' : 'product-modal-mobile'}
            id='product-modal'
            position={isDesktop ? 'right' : 'bottom'}
            isMobile={!isDesktop}
            className={
              isDesktop
                ? 'overflow-y-auto h-full w-full min-w-[min(100vw,450px)] max-w-[450px] flex flex-col pb-4'
                : 'max-h-[85dvh] w-full flex flex-col overflow-hidden pb-4'
            }
          >
            <div className='flex shrink-0 py-1 justify-between items-center'>
              <h2 className='font-semibold text-sm px-3 lg:px-4 pt-4 pb-3'>
                YOUR CART ({itemCount})
              </h2>
              <MotionCloseX
                onClick={closeMenu}
                size={14}
                strokeWidth={1.5}
                className='p-3 mr-2 cursor-pointer'
              />
            </div>
            <div className=' min-h-0 flex-1 flex flex-col overflow-y-auto'>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex relative  sm:px-4 py-1 justify-between gap-4 w-full ${
                    removingItems[item.id] ? 'opacity-50' : ''
                  }`}
                >
                  <Link
                    href={`/${item.slug}`}
                    tabIndex={-1}
                    className='relative aspect-[7/9] min-w-2/3 max-w-2/3 h-full'
                  >
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      sizes='(max-width: 767px) 70vw, 300px'
                      priority
                      loading='eager'
                      className='object-cover w-full h-full'
                    />
                  </Link>
                  <div className='text-xs flex flex-col justify-center items-start space-y-1 pt-2 px-1 w-full'>
                    <Link
                      href={`/${item.slug}`}
                      className='w-full font-medium outline-none focus:underline focus:underline-offset-2 line-clamp-2'
                    >
                      {item.name}
                    </Link>

                    <p className=' text-gray-600'>Size: {item.size}</p>
                    <p className=' text-gray-600'>Color: {item.color}</p>
                    <p className=' text-gray-600'>
                      {item.quantity} x {formatPrice(item.price)}
                    </p>
                    {cartItems.length > 1 && (
                      <button
                        className={`font-medium mr-3 mt-6 transition border-gray-400 text-black hover:text-red-700 hover:border-red-700 text-xs border-b disabled:opacity-50 cursor-pointer ${
                          removingItems[item.id]
                            ? 'text-red-700 border-red-700 hover:border-red-700'
                            : ''
                        }`}
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removingItems[item.id]}
                      >
                        {removingItems[item.id] ? 'Removing' : 'Remove'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </MotionDropdown>
        </>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(modalContent, document.body);
}
