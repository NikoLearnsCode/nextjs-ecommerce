import React from 'react';
import Link from 'next/link';
import {GoArrowLeft} from 'react-icons/go';

export default function NotFound() {
  return (
    <section className='min-h-[calc(100vh-350px)] flex items-center justify-center px-4'>
      <div className='text-center'>
        <h1 className='text-5xl mb-4'>404</h1>
        <h2 className='text-sm font-medium text-primary mb-7'>
          Congrats! You found a page that doesn{"'"}t exist (yet)
        </h2>

        <Link
          className='text-xs text-primary font-medium underline flex justify-center  items-center gap-1 group tracking-wider mx-auto text-center'
          href='/'
        >
          <GoArrowLeft
            size={16}
            className='group-hover:-translate-x-2 transition-transform duration-300'
          />
          Back to home
        </Link>
      </div>
    </section>
  );
}
