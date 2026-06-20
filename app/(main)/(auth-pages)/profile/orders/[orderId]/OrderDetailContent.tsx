'use client';

import Image from 'next/image';
import {ArrowLeft} from 'lucide-react';

import type {OrderWithItems} from '@/lib/types/db-types';
import AnimatedAuthContainer from '@/components/shared/AnimatedContainer';
import Link from 'next/link';

import {formatPrice} from '@/utils/formatPrice';

interface OrderDetailContentProps {
  order: OrderWithItems;
}

export default function OrderDetailContent({order}: OrderDetailContentProps) {
  return (
    <AnimatedAuthContainer direction='right' className='max-w-5xl w-full'>
      <div className='px-5 mb-8'>
        <Link
          className='text-xs   mb-8 text-primary font-medium hover:underline inline-flex flex-row-reverse gap-2 group tracking-wider'
          href='/profile/orders'
        >
          Back
          <ArrowLeft
            size={16}
            strokeWidth={1.5}
            className='group-hover:-translate-x-1 transition-transform duration-300'
          />
        </Link>

        <h1 className='text-base  font-semibold text-gray-900 '>
          ORDER DETAILS
        </h1>
      </div>

      <div className=''>
        <div className='grid md:grid-cols-2 '>
          {/* Left Side - Order Information */}
          <div className='space-y-8 px-5 '>
            {/* Order Details */}
            <div>
              <h2 className='text-sm font-semibold mb-2 text-gray-900'>
                ORDER NO.
              </h2>
              <p className='text-gray-600 text-sm'>{order.id}</p>
            </div>

            {/* Purchase Date */}
            <div>
              <h2 className='text-sm font-semibold mb-2 text-gray-900'>
                PURCHASE DATE
              </h2>
              <p className='text-gray-800 text-sm'>
                {order.created_at
                  ? new Date(order.created_at).toLocaleDateString('en-GB')
                  : 'Unknown date'}
              </p>
            </div>

            {/* Delivery Information */}
            {order.delivery_info && (
              <div>
                <h2 className='text-sm font-semibold mb-2 text-gray-900'>
                  DELIVERY DETAILS
                </h2>
                <div className='space-y-1 text-sm   text-gray-800'>
                  <p>
                    {order.delivery_info.firstName}{' '}
                    {order.delivery_info.lastName}
                  </p>
                  <p>{order.delivery_info.address}</p>
                  <p>
                    {order.delivery_info.postalCode} {order.delivery_info.city}
                  </p>
                  {order.delivery_info.phone && (
                    <p>{order.delivery_info.phone}</p>
                  )}
                  {order.delivery_info.email && (
                    <p>{order.delivery_info.email}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Product Images */}
          <div>
            <h2 className='text-sm  px-5 md:px-0 font-semibold mt-10 md:mt-0 mb-6 text-gray-900'>
              ITEMS ({order.order_items.length})
            </h2>
            <div className='space-y-1'>
              {order.order_items.map((item) => (
                /*   <div
                  key={`${item.product_id}-${item.size || index}`}
                  className='flex '
                > */
                <div key={`${item.id}`} className='flex'>
                  {/* Product image — sole tab stop into the product link */}
                  <div className='relative aspect-[7/9] min-w-2/3 shrink-0'>
                    <Link
                      href={`/${item.slug}`}
                      className='group relative block h-full w-full outline-none'
                    >
                      {item.image ? (
                        <div className='relative h-full w-full'>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes='(max-width: 768px) 70vw, 45vw'
                            className='object-cover w-full h-full'
                          />
                          <span
                            aria-hidden
                            className='pointer-events-none absolute inset-0 z-[1] transition-[box-shadow] group-focus-visible:shadow-[inset_0_0_0_2px_var(--ring)]'
                          />
                        </div>
                      ) : (
                        <>
                          <div className='w-full h-full flex items-center justify-center text-gray-400 bg-gray-50'>
                            <span className='text-xs'>No image</span>
                          </div>
                          <span
                            aria-hidden
                            className='pointer-events-none absolute inset-0 z-[1] transition-[box-shadow] group-focus-visible:shadow-[inset_0_0_0_2px_var(--ring)]'
                          />
                        </>
                      )}
                    </Link>
                  </div>

                  {/* Product Info */}
                  <div className='min-w-0 flex-1 text-xs md:text-sm py-2 px-4'>
                    <h3 className='font-semibold text-gray-900 mb-2'>
                      {item.name}
                    </h3>
                    <div className='space-y-1 text-gray-600'>
                      <p>Item ID: {item.product_id?.substring(0, 8)}</p>
                      {item.size && <p>Size: {item.size}</p>}
                      {item.color && <p>Color: {item.color}</p>}
                      <p>Qty: {item.quantity}</p>
                      <p>Price: {formatPrice(item.price)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Order Summary */}

        <div className='float-right pb-10 border-t border-gray-200 px-5 lg:px-0  w-full md:w-[50%] p-3 mt-7'>
          <h3 className='text-sm uppercase font-semibold pt-5  mb-3 text-gray-900'>
            ORDER SUMMARY
          </h3>
          <div className='space-y-0.5 text-sm'>
            <div className='flex justify-between'>
              <span className='text-gray-700'>Subtotal</span>
              <span className='text-gray-900'>
                {formatPrice(order.total_amount)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-700'>Shipping</span>
              <span className='text-gray-900'>Free</span>
            </div>
            <div>
              <div className='flex justify-between font-semibold'>
                <span className='text-gray-900'>Total</span>
                <span className='text-gray-900'>
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedAuthContainer>
  );
}
