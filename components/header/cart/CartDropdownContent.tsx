'use client';

import {useCart} from '@/context/CartProvider';
import CartItems from '@/components/cart/CartItems';
import CartSummary from '@/components/cart/CartSummary';
import EmptyCart from '@/components/cart/EmptyCart';
import SpinningLogo from '@/components/shared/ui/SpinningLogo';
import {MotionCloseX} from '@/components/shared/AnimatedSidebar';

type CartDropdownContentProps = {
  onClose: () => void;
};

export function CartDropdownContent({onClose}: CartDropdownContentProps) {
  const {cartItems, loading: isLoading, totalPrice, itemCount} = useCart();

  return (
    <>
      <div className='flex justify-between items-center p-3 border-b border-gray-100'>
        <h2
          className='font-medium text-xs lg:text-sm'
        >
          Your cart ({itemCount})
        </h2>
        <div className='absolute right-1'>
          <MotionCloseX
            className='px-3.5 py-1'
            size={12}
            strokeWidth={2}
            onClick={onClose}
            aria-label='Close cart'
          />
        </div>
      </div>

      {isLoading && (
        <div className='flex justify-center items-center p-8 z-50 bg-white'>
          <SpinningLogo />
        </div>
      )}

      {!isLoading && cartItems.length === 0 && (
        <EmptyCart compact onCartClick={onClose} />
      )}

      {!isLoading && cartItems.length > 0 && (
        <>
          <CartItems compact onNavigate={onClose} />
          <CartSummary totalPrice={totalPrice} compact onCartClick={onClose} />
        </>
      )}
    </>
  );
}
