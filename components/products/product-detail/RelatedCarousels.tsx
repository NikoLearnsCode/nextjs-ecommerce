'use client';

import Carousel from '@/components/shared/Carousel';
import CarouselProductCard from '@/components/shared/cards/CarouselCard';
import type {CarouselCard} from '@/lib/types/db-types';

type RelatedCarouselsProps = {
  categoryProducts: CarouselCard[];
  genderProducts: CarouselCard[];
};

export default function RelatedCarousels({
  categoryProducts,
  genderProducts,
}: RelatedCarouselsProps) {
  return (
    <>
      {/* Products in the same category */}
      {categoryProducts.length > 0 && (
        <div className='mx-auto pb-8'>
          <Carousel
            items={categoryProducts}
            titelDivClassName='pl-3 pr-0 md:px-6'
            title='Similar products'
            renderItem={(product/* , index */) => (
              <CarouselProductCard product={product} /* imagePriority={index < 4} */ />
            )}
            id='carousel-one'
          />
        </div>
      )}

      {/* Products for the same gender */}
      {genderProducts.length > 0 && (
        <div className='mx-auto py-8'>
          <Carousel
            items={genderProducts}
            title='You may also like'
            titelDivClassName='pl-3 pr-0 md:px-6'
            renderItem={(product/* , index */) => (
              <CarouselProductCard product={product} /* imagePriority={index < 4} */ />
            )}
            id='carousel-two'
          />
        </div>
      )}
    </>
  );
}
