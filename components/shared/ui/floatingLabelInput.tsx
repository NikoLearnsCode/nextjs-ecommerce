'use client';

import {
  useId,
  type InputHTMLAttributes,
  type Ref,
  type TextareaHTMLAttributes,
} from 'react';
import {cn} from '@/styles/style.utils';

type FowardableElement = HTMLInputElement | HTMLTextAreaElement;

interface FloatingLabelBaseProps {
  label: string;
  id: string;
  hasError?: boolean;
  errorMessage?: string;
  value?: string;
  ref?: Ref<FowardableElement>;
}

type FloatingLabelProps = FloatingLabelBaseProps &
  (
    | ({as?: 'input'} & Omit<InputHTMLAttributes<HTMLInputElement>, 'ref'>)
    | ({as: 'textarea'} & Omit<
        TextareaHTMLAttributes<HTMLTextAreaElement>,
        'ref'
      >)
  );

function FloatingLabelField(allProps: FloatingLabelProps) {
  const uniqueSuffix = useId();

  if (allProps.as === 'textarea') {
    const {id, label, hasError, errorMessage, className, ref, ...restProps} =
      allProps;
    const resolvedId = `${id}${uniqueSuffix}`;
    const errorId = `${resolvedId}-error`;
    const showError = hasError && errorMessage;

    return (
      <div className={cn('relative', className)}>
        <textarea
          id={resolvedId}
          placeholder=' '
          {...restProps}
          ref={ref as Ref<HTMLTextAreaElement>}
          aria-invalid={hasError || undefined}
          aria-describedby={showError ? errorId : undefined}
          className={cn(
            'peer w-full border bg-transparent px-3 pt-6 pb-1 text-[15px]',
            ' outline-none transition-all duration-200',
            'disabled:cursor-not-allowed  disabled:opacity-50',
            ' min-h-[80px]',
            hasError
              ? 'border-destructive'
              : 'border-gray-400/70 hover:border-gray-500 focus:border-gray-500',
          )}
        />
        <label
          htmlFor={resolvedId}
          className={cn(
            'absolute left-3 w-[90%] py-1 bg-white pointer-events-none select-none transition-all text-gray-500 duration-200',
            hasError ? 'text-destructive' : 'peer-focus:text-black',
            'top-0.25 text-xs',
            'peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm',
            'peer-focus:top-0.25 peer-focus:text-xs',
            'peer-disabled:opacity-50',
          )}
        >
          {label}
        </label>
        {showError && (
          <p id={errorId} role='alert' className='text-xs ml-1 text-destructive '>
            {errorMessage}
          </p>
        )}
      </div>
    );
  }

  const {id, label, hasError, errorMessage, className, ref, ...restProps} =
    allProps;
  const resolvedId = `${id}${uniqueSuffix}`;
  const errorId = `${resolvedId}-error`;
  const showError = hasError && errorMessage;

  return (
    <div className={cn('relative', className)}>
      <input
        id={resolvedId}
        placeholder=' '
        {...restProps}
        ref={ref as Ref<HTMLInputElement>}
        aria-invalid={hasError || undefined}
        aria-describedby={showError ? errorId : undefined}
        className={cn(
          'peer w-full border bg-transparent px-4 pt-5 pb-1 text-[15px]',
          ' outline-none transition-all duration-200',
          'disabled:cursor-not-allowed autofill:bg-transparent disabled:opacity-50',
          hasError
            ? 'border-destructive '
            : 'border-gray-400/70 hover:border-gray-500 focus:border-gray-500',
        )}
      />
      <label
        htmlFor={resolvedId}
        className={cn(
          'absolute left-3 pointer-events-none select-none transition-all duration-200 bg-white px-1 text-gray-500',
          hasError ? 'text-destructive' : 'peer-focus:text-black',
          'top-3 -translate-y-1/2 text-xs',
          'peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm',
          'peer-focus:top-3 peer-focus:text-xs',
          'peer-disabled:opacity-50 ',
        )}
      >
        {label}
      </label>
      {showError && (
        <p id={errorId} role='alert' className='text-xs ml-1 text-destructive mt-1 '>
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export {FloatingLabelField as FloatingLabelInput};
