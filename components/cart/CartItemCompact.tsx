'use client';

import Image from 'next/image';
import Link from 'next/link';
import {formatPrice} from '@/utils/formatPrice';
import type {CartItemWithProduct} from '@/lib/types/db-types';

type CartItemCompactProps = {
  item: CartItemWithProduct;
  onRemove: (itemId: string) => void;
  isRemoving: boolean;
  onNavigate?: () => void;
  imagePriority?: boolean;
};

export default function CartItemCompact({
  item,
  onRemove,
  isRemoving,
  onNavigate,
  imagePriority = false,
}: CartItemCompactProps) {
  return (
    <div
      className={`flex items-center px-3.5 lg:px-4 not-last:border-b  border-gray-100 py-3 justify-between gap-4 ${isRemoving ? 'opacity-50' : ''}`}
    >
      <div className='relative h-[4.5rem] w-14 shrink-0 overflow-hidden bg-gray-100 md:h-[5rem] md:w-16 mr-3'>
        <Link
          href={`/${item.slug}`}
          onClick={onNavigate}
          className='relative block h-full w-full outline-none focus-visible:shadow-[0_0_0_2px_var(--ring)]'
        >
          {item.images[0] ? (
            <Image
              src={item.images[0]}
              alt={item.name}
              fill
              sizes='(min-width: 768px) 64px, 56px'
              priority={imagePriority}
              className='object-contain'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center text-gray-400 text-xs'>
              No image
            </div>
          )}
        </Link>
      </div>

      <div className='flex-1 min-w-0 text-[11px] md:text-xs'>
        <h3 className=' font-medium truncate'>{item.name}</h3>

        <p>Size: {item.size}</p>
        <p>Color: {item.color}</p>
        <div className='flex justify-between items-center'>
          <span>
            {item.quantity} x {formatPrice(item.price)}
          </span>

          <button
            className={`font-medium mr-1 transition border-gray-400 text-black hover:text-red-700 hover:border-red-700 text-[10px] md:text-xs border-b disabled:opacity-50 cursor-pointer ${isRemoving ? 'text-red-700 border-red-700 hover:border-red-700' : ''}`}
            onClick={() => onRemove(item.id)}
            disabled={isRemoving}
          >
            {isRemoving ? 'Removing' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  );
}
