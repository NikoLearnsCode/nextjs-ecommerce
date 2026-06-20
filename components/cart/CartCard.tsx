'use client';

import Image from 'next/image';
import Link from 'next/link';
import {Minus, Plus, X, Heart} from 'lucide-react';
import {motion} from 'framer-motion';
import {formatPrice} from '@/utils/formatPrice';
import {useFavorites} from '@/context/FavoritesProvider';
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
  const {id, product_id, name, price, slug, images, quantity, size, color} =
    item;
  const {toggleFavoriteItem, isFavorite, updatingItems} = useFavorites();
  const isMovingToFavorites = updatingItems[product_id] || false;

  // Heart = move to favorites: only drop it from the cart once it's saved,
  // otherwise a failed save would lose the item entirely.
  const handleMoveToFavorites = async () => {
    if (isFavorite(product_id)) {
      onRemove(id);
      return;
    }
    const saved = await toggleFavoriteItem(product_id);
    if (saved) onRemove(id);
  };

  const actionButtons = (
    <>
      <button
        type='button'
        aria-label={`Move ${name} to favorites`}
        onClick={handleMoveToFavorites}
        disabled={isMovingToFavorites}
        className='flex sm:h-5 h-8 w-9 items-center justify-center text-gray-600 transition-colors hover:text-black disabled:opacity-50 cursor-pointer'
      >
        <Heart size={18} strokeWidth={1.5} />
      </button>
      <button
        type='button'
        aria-label={`Remove ${name} from cart`}
        onClick={() => onRemove(id)}
        disabled={isRemoving}
        className='flex h-8 sm:h-5 w-9 items-center justify-center text-gray-600 transition-colors hover:text-black disabled:opacity-50 cursor-pointer'
      >
        <X size={20} strokeWidth={1.5} />
      </button>
    </>
  );

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
      <div className='relative min-w-[55%] w-full h-full aspect-7/9 group'>
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
              quality={80}
              priority={imagePriority}
              fetchPriority={imagePriority ? 'high' : 'auto'}
              className='object-cover w-full h-full'
              sizes='(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 66vw'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-gray-400'>
              No image
            </div>
          )}
        </Link>
      </div>

      <div className='px-3 py-4 sm:py-2  relative min-w-1/3 lg:pb-10 lg:px-3 flex flex-col mb-2'>
        <div className='flex justify-end items-center gap-0.5 -mt-1.5 -mr-1.5 sm:hidden'>
          {actionButtons}
        </div>
        <div className='flex flex-col flex-1 gap-1 sm:gap-0 justify-center items-center sm:items-start text-xs sm:text-sm w-full'>
          <div className='relative w-full min-w-0 sm:flex sm:flex-row sm:items-start sm:justify-between sm:gap-2'>
            <Link
              href={`/${slug}`}
              className='block min-w-0 w-full text-center line-clamp-2 sm:w-fit sm:text-left break-words'
            >
              {name}
            </Link>
            <div className='hidden sm:flex items-center gap-0.5 shrink-0 -mr-1.5'>
              {actionButtons}
            </div>
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
