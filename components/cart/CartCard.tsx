'use client';

import Image from 'next/image';
import Link from 'next/link';
import {Minus, Plus} from 'lucide-react';
import {motion} from 'framer-motion';
import {formatPrice} from '@/utils/formatPrice';
import RemoveProductButton from '@/components/shared/ui/RemoveProductButton';
import type {CartItemWithProduct} from '@/lib/types/db-types';

type CartCardProps = {
  item: CartItemWithProduct;
  onRemove: (cartItemId: string) => void;
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  isUpdating?: boolean;
  isRemoving?: boolean;
  imagePriority?: boolean;
};

export default function CartCard({
  item,
  onRemove,
  onUpdateQuantity,
  isUpdating = false,
  isRemoving = false,
  imagePriority = false,
}: CartCardProps) {
  const {id, name, price, slug, images, quantity, size, color} = item;

  return (
    <motion.div
      key={id}
      className='flex flex-row sm:flex-col pb-1 md:pb-0 overflow-hidden'
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      exit={{
        opacity: 0,
        height: 0,
        marginBottom: 0,
        transition: {
          opacity: {duration: 0.2},
          height: {duration: 0.3},
        },
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
      layout
    >
      <div className='relative min-w-2/3 w-full h-full aspect-7/9 group'>
        <Link
          className='block h-full w-full relative'
          tabIndex={-1}
          href={`/${slug}`}
        >
          {images && images[0] ? (
            <Image
              src={images[0]}
              alt={name}
              fill
              quality={90}
              priority={imagePriority}
              fetchPriority={imagePriority ? 'high' : 'auto'}
              className='object-cover w-full h-full'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-gray-400'>
              No image
            </div>
          )}
        </Link>
      </div>

      <div className='px-3 py-4 sm:py-2  relative min-w-1/3 lg:pb-10 lg:px-3 flex flex-col mb-2'>
        <RemoveProductButton
          isPending={isRemoving}
          onClick={() => onRemove(id)}
          className='absolute top-2 left-1/2 z-10 -translate-x-1/2 shrink-0 p-2 sm:hidden text-gray-600'
        />

        <div className='flex flex-col flex-1 gap-1 sm:gap-0 justify-center items-center sm:items-start text-xs sm:text-sm w-full pt-8 sm:pt-0'>
          <div className='relative w-full min-w-0 sm:flex sm:flex-row sm:items-start sm:justify-between sm:gap-2'>
            <Link
              href={`/${slug}`}
              className='block min-w-0 w-full text-center line-clamp-2 sm:w-fit sm:text-left break-words'
            >
              {name}
            </Link>
            <RemoveProductButton
              isPending={isRemoving}
              onClick={() => onRemove(id)}
              className='hidden  shrink-0 self-start sm:inline-flex text-gray-600'
            />
          </div>
          <span className='text-black/80'>
            {typeof price === 'string'
              ? formatPrice(Number(price))
              : formatPrice(price || 0)}
          </span>
        </div>

        <div className='text-xs sm:text-sm mt-1 gap-2 flex flex-col sm:flex-row items-center'>
          {onUpdateQuantity && quantity && (
            <div className='flex items-center gap-2 sm:pr-2  justify-center'>
              <button
                aria-label='Decrease quantity'
                onClick={() => onUpdateQuantity(id, quantity - 1)}
                disabled={isUpdating || quantity <= 1}
                className={`h-8 w-8 flex items-center justify-center ${
                  quantity <= 1
                    ? 'pointer-events-none opacity-30'
                    : 'cursor-pointer'
                }`}
              >
                <Minus
                  strokeWidth={1.25}
                  className={`w-4.5 h-4.5 ${isUpdating ? 'cursor-not-allowed' : ''}`}
                />
              </button>

              <span className='text-sm'>{quantity}</span>

              <button
                aria-label='Increase quantity'
                onClick={() => onUpdateQuantity(id, quantity + 1)}
                disabled={isUpdating}
                className='h-8 w-8 flex items-center justify-center cursor-pointer'
              >
                <Plus
                  strokeWidth={1.25}
                  className={`w-4.5 h-4.5 ${isUpdating ? 'cursor-not-allowed' : ''}`}
                />
              </button>
            </div>
          )}
          <div className='flex py-1 gap-3 flex-wrap px-4 justify-center sm:px-0 sm:gap-4 text-xs uppercase'>
            {size && <span>{size}</span>}
            {color && <span>{color}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
