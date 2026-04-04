'use client';

import {Link} from '@/components/shared/ui/link';
import {formatPrice} from '@/utils/formatPrice';

type CartSummaryProps = {
  totalPrice: number;
  compact?: boolean;
  onCartClick?: () => void;
};

export default function CartSummary({
  totalPrice,
  compact = false,
  onCartClick = () => {},
}: CartSummaryProps) {
  if (compact) {
    return (
      <div className='p-3 border-t border-gray-100'>
        <div className='flex justify-between items-center'>
          <span className='text-xs md:text-sm'>Total:</span>
          <span className='font-medium text-xs md:text-base'>
            {formatPrice(totalPrice)}
          </span>
        </div>
        <div className='flex'>
          <Link
            href='/cart'
            variant='outline'
            size='md'
            width='full'
            className='mt-3 font-semibold text-xs md:text-sm h-8 md:h-10  '
            onClick={onCartClick}
          >
            View cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className=''>
      <div className='flex justify-between flex-col gap-1.5 text-sm lg:text-lg pr-2'>
        <span className='text-sm flex justify-between'>
          Subtotal <span>{formatPrice(totalPrice)}</span>
        </span>
        <span className='text-sm flex justify-between'>
          Shipping <span className=''>Free</span>
        </span>
        <span className='text-sm font-medium flex justify-between'>
          Total{' '}
          <span className=' font-semibold'>
            {formatPrice(totalPrice)}
          </span>
        </span>
      </div>
      <Link
        href='/checkout'
        variant='primary'
        width='full'
        className='mt-4 h-15 text-xs uppercase font-semibold'
      >
        Checkout
      </Link>
    </div>
  );
}
