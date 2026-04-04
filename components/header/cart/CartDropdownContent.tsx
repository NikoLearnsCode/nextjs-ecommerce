'use client';

import {useCart} from '@/context/CartProvider';
import {FocusHeading} from '@/components/shared/FocusHeading';
import CartItems from '../../cart/CartItems';
import CartSummary from '../../cart/CartSummary';
import EmptyCart from '../../cart/EmptyCart';
import SpinningLogo from '../../shared/ui/SpinningLogo';
import {MotionCloseX} from '../../shared/AnimatedSidebar';

export const CART_DROPDOWN_TITLE_ID = 'cart-dropdown-title';

type CartDropdownContentProps = {
  onClose: () => void;
};

export function CartDropdownContent({onClose}: CartDropdownContentProps) {
  const {cartItems, loading: isLoading, totalPrice, itemCount} = useCart();

  return (
    <>
      <div className='flex justify-between items-center p-3 border-b border-gray-100'>
        <FocusHeading
          id={CART_DROPDOWN_TITLE_ID}
          className='font-medium text-xs lg:text-sm'
        >
          Your cart ({itemCount})
        </FocusHeading>
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
