'use client';

import Image from 'next/image';
import Link from 'next/link';
import {CarouselCard} from '@/lib/types/db-types';

import FavoriteButton from '@/components/favorites/AddToFavoriteButton';
import NewBadge from '@/components/shared/NewBadge';
import {formatPrice} from '@/utils/formatPrice';
import {useNavigatedHistory} from '@/context/NavigatedHistoryProvider';

type CarouselProductCardProps = {
  product: CarouselCard;
  imagePriority?: boolean;
};

export default function CarouselProductCard({
  product,
  imagePriority = false,
}: CarouselProductCardProps) {
  const {name, price, images, slug, isNew} = product;
  const hasImage = images && images.length > 0;
  const {handleSaveNavigated} = useNavigatedHistory();
  return (
    <div className='flex flex-col relative w-full h-full pb-6 group '>
      <div className='w-full relative bg-white aspect-[7/9]'>
        <Link
          href={`/${slug}`}
          className='block h-full w-full relative'
          tabIndex={-1}
          onClick={() => handleSaveNavigated({slug, image: images[0], name})}
        >
          {hasImage ? (
            <Image
              src={images[0]}
              alt={name}
              fill
              quality={90}
              priority={imagePriority}
              fetchPriority={imagePriority ? 'high' : 'auto'}
              loading={imagePriority ? 'eager' : 'lazy'}
              className='object-cover'
              sizes='(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw'
            />
          ) : (
            <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
              <span className='text-gray-500'>No image</span>
            </div>
          )}
        </Link>
      </div>

      {isNew && (
        <div className='px-2.5 pt-1.5 -mb-1 flex items-center justify-between'>
          <NewBadge />
          <FavoriteButton product={product} />
        </div>
      )}

      <div className='px-2.5 pt-0.5 flex flex-col'>
        <div className='flex items-center justify-between gap-1'>
          <Link
            href={`/${slug}`}
            className='pt-0.5 min-w-0 w-fit'
            onClick={() => handleSaveNavigated({slug, image: images[0], name})}
          >
            <h2 className='text-xs sm:text-sm font-normal truncate'>
              {name}
            </h2>
          </Link>
          {!isNew && <FavoriteButton product={product} />}
        </div>
        <p className='text-xs text-gray-700 sm:text-sm'>{formatPrice(price)}</p>
      </div>
    </div>
  );
}
