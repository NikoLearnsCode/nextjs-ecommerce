'use client';

import {useRef} from 'react';
import {useCart} from '@/context/CartProvider';
import {AnimatePresence} from 'framer-motion';
import {useCartScroll} from '@/hooks/useCartScroll';
import CartItems from './CartItems';
import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';
import StickyMobileSummary from './StickyMobileSummary';
import SpinningLogo from '@/components/shared/ui/SpinningLogo';

export default function CartPage() {
  const {cartItems, loading: isLoading, totalPrice, itemCount} = useCart();
  const normalSummaryRef = useRef<HTMLDivElement>(null);
  const showFixedSummary = useCartScroll(normalSummaryRef);

  return (
    <div className='w-full h-full  mx-auto z-1'>
      {isLoading && (
        <div className='flex flex-col  justify-center items-center min-h-[calc(100vh-310px)]'>
          <SpinningLogo height='40' className='pb-32 opacity-30' />
        </div>
      )}

      {!isLoading && cartItems.length === 0 && <EmptyCart />}

      {cartItems.length > 0 && (
        <div className='space-y-6  py-2'>
          <h1 className='text-sm sm:text-base uppercase font-semibold  mb-5 px-4 sm:px-8'>
            Your cart ({itemCount})
          </h1>

          <div className='flex flex-col lg:flex-row gap-6 lg:gap-10'>
            {/* Cart items section - Left side */}
            <div className='w-full'>
              <CartItems />
            </div>

            {/* Desktop Order summary section, always visible */}
            <div
              ref={normalSummaryRef}
              className='w-full lg:min-w-[350px] lg:max-w-[350px] xl:min-w-[410px] xl:max-w-[410px]  lg:sticky lg:top-30 lg:self-start px-4 lg:px-0 lg:pl-3  bg-white   pt-5 sm:pt-0 lg:mt-0 transition-all duration-300'
            >
              <h2 className='text-[15px] uppercase font-semibold mb-3'>Order summary</h2>
              <CartSummary totalPrice={totalPrice} />
            </div>
          </div>

          {/* Mobile Fixed Summary, only visible when scrolling down */}
          <AnimatePresence>
            {cartItems.length > 0 && (
              <StickyMobileSummary
                totalPrice={totalPrice}
                visible={showFixedSummary}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
