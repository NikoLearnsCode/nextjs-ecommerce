'use client';
import Link from 'next/link';
import {cn} from '@/styles/style.utils';

type LogoProps = {
  href?: string;
  className?: string;
  width?: number;
  height?: number;
  responsiveStroke?: boolean;
  'aria-label'?: string;
};

function Logo({
  href = '/',
  className,
  width = 25,
  height = 33,
  responsiveStroke = true,
  'aria-label': ariaLabel = 'Go to home page',
}: LogoProps) {
  const pillarStrokeClass = responsiveStroke
    ? 'stroke-[4px] md:stroke-[6px]'
    : 'stroke-[6px]';
  const curveStrokeClass = responsiveStroke
    ? 'stroke-[8px] md:stroke-[10px]'
    : 'stroke-[10px]';

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn('inline-flex rounded-none', className)}
    >
      <svg
        width={width}
        height={height}
        viewBox='0 0 130 162'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='text-black/90'
      >
        {/* Left pillar (fill + stroke to swell the shape cleanly) */}
        <path
          d='M47.5 49.7 h3 v66.4 h-3 z'
          fill='currentColor'
          stroke='currentColor'
          className={pillarStrokeClass}
          // strokeLinejoin='round'
        />

        {/* Right pillar */}
        <path
          d='M106.5 41.6 h3 v68.4 h-3 z'
          fill='currentColor'
          stroke='currentColor'
          className={pillarStrokeClass}
          // strokeLinejoin='round'
        />

        {/* Diagonalen */}
        <path
          d='M47.5 44.5 L44.5 47.5 L108.5 111.5 L111.5 108.5 Z'
          fill='currentColor'
          stroke='currentColor'
          className={pillarStrokeClass}
          // strokeLinejoin='round'
        />

        {/* C-kurvan (Endast stroke, ingen fill) */}
        <path
          d='M125 22 A 73 73 0 1 0 125 139'
          stroke='currentColor'
          className={curveStrokeClass}
          // strokeLinecap='square'
          fill='none'
        />
      </svg>
    </Link>
  );
}
export default Logo;
