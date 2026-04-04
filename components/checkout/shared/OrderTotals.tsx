'use client';

import {useCart} from '@/context/CartProvider';
import {formatPrice} from '@/utils/formatPrice';

export default function OrderTotals() {
  const {totalPrice} = useCart();

  return (
    <div className='space-y-2 pt-4'>
      <div className='flex justify-between text-sm'>
        <span>Subtotal</span>
        <span>{totalPrice} kr</span>
      </div>
      <div className='flex justify-between text-sm'>
        <span>Shipping</span>
        <span>Free</span>
      </div>
      <div className='flex justify-between pt-4 border-t'>
        <span>Total</span>
        <span className='font-medium'>{formatPrice(totalPrice)}</span>
      </div>
    </div>
  );
}
