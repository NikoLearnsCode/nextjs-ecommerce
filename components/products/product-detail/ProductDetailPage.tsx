'use client';

import Image from 'next/image';
import AddToCartButton from '@/components/products/product-detail/AddToCartButton';
import type {ProductDetail} from '@/lib/types/db-types';
import {useState, type ReactNode} from 'react';
import SizeDrawer from '@/components/shared/SizeDrawer';
import Newsletter from '@/components/shared/Newsletter';
import FavoriteButton from '@/components/favorites/AddToFavoriteButton';
import MobileImageSwiper from './MobileImageSwiper';
import SizeDropdown from './SizeDropdown';
import NewBadge from '@/components/shared/NewBadge';

type ProductPageProps = {
  product: ProductDetail;
  related?: ReactNode;
  onCartClick?: () => void;
  initial?: boolean;
};

export default function ProductPage({product, related}: ProductPageProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [isMobileSizeDrawerOpen, setIsMobileSizeDrawerOpen] = useState(false);
  const initialImageIndex = 0;
  const [activeImageIndex, setActiveImageIndex] = useState(initialImageIndex);

  const handleAddToCartSuccess = () => {
    // Keep selected size after add to cart (previously: setSelectedSize(null))
    // setSelectedSize(null);
  };

  return (
    <>
      <div className='w-full mx-auto lg:pt-4 lg:pb-8 '>
        <div className='flex  flex-col justify-center gap-4  lg:gap-8 lg:flex-row xl:gap-10 '>
          {/* Left column - images */}
          <div className='h-full w-full '>
            {product.images && product.images.length > 0 ? (
              <div className='flex flex-col justify-start w-full'>
                {/* Mobile view - Only rendered in the DOM on mobile */}
                <div className='lg:hidden'>
                  <MobileImageSwiper
                    images={product.images}
                    productName={product.name}
                    activeIndex={activeImageIndex}
                    initialSlide={initialImageIndex}
                    onSlideChange={setActiveImageIndex}
                  />
                </div>

                {/* Desktop view - Display all images in a grid */}
                <div className='hidden flex-1 relative lg:grid md lg:grid-cols-2 lg:gap-0.5 '>
                  {product.images.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className='relative  aspect-[7/9] w-full h-full'
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - bild ${idx + 1}`}
                        fill
                        quality={80}
                        sizes='(min-width: 1024px) 30vw, 0vw'
                        priority={idx < 2}
                        fetchPriority={idx < 2 ? 'high' : 'auto'}
                        className='object-cover  max-h-full '
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className='w-full bg-gray-200 flex items-center justify-center h-[500px]'>
                <span className='text-gray-500'>No image available</span>
              </div>
            )}
          </div>

          {/* Right column - product info */}
          <div className='flex  flex-col lg:pt-12 px-3 lg:px-0 2xl:px-4 lg:mr-7 sticky top-18 h-full lg:gap-1 mb-10  lg:w-[35%] transition-all duration-300'>
            {/* Product name */}
            <div className='flex flex-col mt-1 relative '>
              <div>{product.isNew && <NewBadge />}</div>
              <h1 className='text-base uppercase mt-0 font-semibold'>
                {product.name}
              </h1>
              {/* <p className='text-gray-700 font-semibold uppercase text-sm'>
                {product.brand}
              </p> */}
            </div>

            <div className='text-sm text-gray-600 '>{product.price} kr</div>
            <div className='my-5 px-1 lg:px-0 lg:my-0 lg:mt-7 flex items-center justify-between gap-1 '>
              <div className='flex flex-col items-center'>
                <div className='cursor-pointer h-4 w-4 bg-gray-200 flex items-center justify-center'></div>
                <div className='w-4 border-b border-black mt-1'></div>
              </div>
              <p className='text-xs font-medium uppercase text-gray-600'>
                {product.color}
              </p>
            </div>

            {/* Size */}
            <SizeDropdown
              sizes={product.sizes}
              selectedSize={selectedSize}
              showWarning={showSizeWarning}
              onSelect={(size) => {
                setSelectedSize(size);
                setShowSizeWarning(false);
              }}
            />

            {/* Add to cart and favorites buttons */}
            <div className='flex gap-1 mt-1 items-center'>
              <AddToCartButton
                product={product}
                quantity={1}
                selectedSize={selectedSize || ''}
                onAddSuccess={handleAddToCartSuccess}
                className='flex-1 h-13 uppercase text-sm m-0 font-medium transition duration-300 rounded-none'
                onSizeMissing={() => {
                  if (window.innerWidth < 1024) {
                    setIsMobileSizeDrawerOpen(true);
                  } else {
                    setShowSizeWarning(true);
                  }
                }}
              />
              <FavoriteButton
                product={product}
                size={20}
                strokeWidth={2}
                className='border  border-black/20 hover:border-black/60  h-13 p-0 w-13 text-white'
              />
            </div>
          </div>
        </div>
      </div>
      <SizeDrawer
        productId={product.id}
        sizes={product.sizes}
        isOpen={isMobileSizeDrawerOpen}
        onClose={() => setIsMobileSizeDrawerOpen(false)}
        onAddSuccess={handleAddToCartSuccess}
      />

      <div className=' px-3 pb-20 lg:pb-36 lg:px-8 lg:w-[65%]'>
        <h2 className='uppercase text-sm mb-1 font-semibold'>Description</h2>
        <p className='text-gray-800 font-normal text-sm   '>
          {product.description}
        </p>
      </div>
      {/* Related products — streamed in below the fold */}
      {related}
      <Newsletter />
    </>
  );
}
