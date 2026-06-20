'use client';

import Link from 'next/link';
import {GoArrowLeft} from 'react-icons/go';
import {useEffect} from 'react';
import {CreateOrderResult, CartItemWithProduct} from '@/lib/types/db-types';
import Image from 'next/image';
import {formatPrice} from '@/utils/formatPrice';

interface OrderConfirmationProps {
  order: CreateOrderResult | null;
  orderSnapshot: {
    items: CartItemWithProduct[];
    totalPrice: number;
  } | null;
  clearCart: () => Promise<void>;
}

export default function OrderConfirmation({
  orderSnapshot,
  clearCart,
}: OrderConfirmationProps) {
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className='max-w-3xl mx-auto  sm:pt-5 pt-2 py-8 text-center'>
      <h1 className='text-xl sm:text-2xl font-medium mb-2'>
        Thank you for your order!
      </h1>
      <p className='font-normal text-[15px] sm:text-base mb-12'>
        We&apos;ve received your order and will process it as soon as possible.
      </p>
      {/*  {order && order.success && (
        <p className='text-sm text-gray-600 mb-6'>
          Ordernummer: {order.orderId}
        </p>
      )} */}

      {/* Order Items */}
      {orderSnapshot && orderSnapshot.items.length > 0 && (
        <div className=' mx-auto mb-4 '>
          {/*   <h3 className='text-lg font-medium mb-4 text-center'>
            Your order
          </h3> */}

          {/*  <div className='flex  items-center justify-center  gap-1 mb-8'>
              <span className='font-medium'>Totalt:</span>
              <span className='font-medium text-lg'>
                {formatPrice(orderSnapshot.totalPrice)}
              </span>
            </div> */}

          <div className='grid grid-cols-2   md:grid-cols-3 gap-1 '>
            {orderSnapshot.items.map((item) => (
              <div
                key={`${item.product_id}-${item.size}-${item.color}`}
                className='flex relative flex-col w-full h-full pb-6 group'
              >
                <div className='w-full relative bg-white aspect-[7/9]'>
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    priority
                    loading='eager'
                    className='object-cover'
                    sizes='(min-width: 768px) 33vw, 50vw'
                  />
                </div>

                <div className=' text-xs py-1 px-1.5 justify-start flex flex-col items-start'>
                  <h2 className=' font-medium'>{item.name}</h2>
                  <p className=' text-gray-700 '>
                    {formatPrice(item.price)} x {item.quantity}{' '}
                  </p>
                  <div className='  flex gap-2 text-gray-700'>
                    <div>{item.size},</div>
                    <div>{item.color}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='mt-12'>
        <Link
          className='mx-auto mt-4 inline-flex w-fit items-center justify-center gap-1 text-sm font-medium tracking-wide text-primary hover:underline underline group'
          href='/'
        >
          <GoArrowLeft
            size={16}
            className='mr-0.5 transition-transform duration-300 group-hover:-translate-x-2 group-active:-translate-x-2'
          />
          Back to home
        </Link>
      </div>
    </div>
  );
}
