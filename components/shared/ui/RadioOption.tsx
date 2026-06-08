'use client';

import type {ReactNode, Ref} from 'react';
import {twMerge} from 'tailwind-merge';

interface RadioOptionProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'ref'> {
  id: string;
  label?: string;
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

export function RadioOption({
  id,
  label,
  children,
  className,
  ref,
  ...props
}: RadioOptionProps) {
  return (
    <label
      className={
        className ||
        `flex items-center space-x-2 cursor-pointer${
          children
            ? ' has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-black'
            : ''
        }`
      }
    >
      <input
        type='radio'
        id={id}
        ref={ref}
        aria-label={label}
        className={
          children
            ? 'sr-only'
            : twMerge(
                'input-checkmark w-5 h-5 border border-gray-300 cursor-pointer appearance-none',
                'hover:border-gray-500 transition-colors',
                'bg-center bg-no-repeat bg-[length:1rem_1rem]',
                'checked:border-black'
              )
        }
        {...props}
      />

      {children
        ? children
        : label && (
            <span className='text-xs uppercase w-fit select-none'>{label}</span>
          )}
    </label>
  );
}
