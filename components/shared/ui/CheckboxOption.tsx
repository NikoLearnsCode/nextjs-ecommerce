'use client';
import {twMerge} from 'tailwind-merge';
import React, {forwardRef} from 'react';

interface CheckboxOptionProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  className?: string;
  labelClassName?: string;
}

export const CheckboxOption = forwardRef<HTMLInputElement, CheckboxOptionProps>(
  ({id, label, className, labelClassName, ...props}, ref) => {
    return (
      <div className='flex w-fit items-center space-x-2'>
        <input
          type='checkbox'
          id={id}
          ref={ref}
          className={twMerge(
            'input-checkmark w-5 h-5 border border-gray-300 cursor-pointer appearance-none',
            'hover:border-gray-500 transition-colors',
            'bg-center bg-no-repeat bg-[length:1rem_1rem]',
            'checked:border-black',
            className
          )}
          {...props}
        />

        <label
          htmlFor={id}
          className={twMerge(
            'text-xs uppercase w-fit select-none cursor-pointer',
            labelClassName
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);

CheckboxOption.displayName = 'CheckboxOption';
