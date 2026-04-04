'use client';

import * as React from 'react';
import {cn} from '@/styles/style.utils';

type FowardableElement = HTMLInputElement | HTMLTextAreaElement;

interface FloatingLabelBaseProps {
  label: string;
  id: string;
  hasError?: boolean;
  errorMessage?: string;
  value?: string;
}

type FloatingLabelProps = FloatingLabelBaseProps &
  (
    | ({as?: 'input'} & React.InputHTMLAttributes<HTMLInputElement>)
    | ({as: 'textarea'} & React.TextareaHTMLAttributes<HTMLTextAreaElement>)
  );

const FloatingLabelField = React.forwardRef<
  FowardableElement,
  FloatingLabelProps
>((allProps, ref) => {
  const uniqueSuffix = React.useId();

  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);
  const elementRef = React.useRef<FowardableElement | null>(null);

  const combinedRef = React.useCallback(
    (node: FowardableElement | null) => {
      elementRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  const checkElementValue = React.useCallback(() => {
    if (elementRef.current) {
      setHasValue(elementRef.current.value !== '');
    }
  }, []);

  React.useEffect(() => {
    checkElementValue();
  }, [allProps.value, checkElementValue]);

  if (allProps.as === 'textarea') {
    const {
      id,
      label,
      hasError,
      errorMessage,
      className,
      onFocus,
      onBlur,
      onChange,
      ...restProps
    } = allProps;
    const resolvedId = `${id}${uniqueSuffix}`;
    const isFloating = isFocused || hasValue;

    return (
      <div className={cn('relative', className)}>
        <textarea
          id={resolvedId}
          {...restProps}
          ref={combinedRef as React.Ref<HTMLTextAreaElement>}
          className={cn(
            'peer w-full border bg-transparent px-3 pt-6 pb-1 text-[15px]',
            ' outline-none transition-all duration-200',
            'disabled:cursor-not-allowed  disabled:opacity-50',
            ' min-h-[80px]',
            hasError
              ? 'border-destructive'
              : 'border-gray-400/70 hover:border-gray-500 focus:border-gray-500',
          )}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            checkElementValue();
            onBlur?.(e);
          }}
          onChange={(e) => {
            checkElementValue();
            onChange?.(e);
          }}
        />
        <label
          htmlFor={resolvedId}
          className={cn(
            'absolute left-3 w-[90%] py-1 bg-white pointer-events-none select-none transition-all text-gray-500 duration-200',
            hasError ? 'text-destructive' : 'peer-focus:text-black',
            isFloating ? 'top-0.25 text-xs' : 'top-2 text-sm ',
            'peer-disabled:opacity-50',
          )}
        >
          {label}
        </label>
        {hasError && errorMessage && (
          <p className='text-xs ml-1 text-destructive '>{errorMessage}</p>
        )}
      </div>
    );
  }

  const {
    id,
    label,
    hasError,
    errorMessage,
    className,
    onFocus,
    onBlur,
    onChange,
    ...restProps
  } = allProps;
  const resolvedId = `${id}${uniqueSuffix}`;
  const isFloating = isFocused || hasValue;

  return (
    <div className={cn('relative', className)}>
      <input
        id={resolvedId}
        {...restProps}
        ref={combinedRef as React.Ref<HTMLInputElement>}
        className={cn(
          'peer w-full border bg-transparent px-4 pt-5 pb-1 text-[15px]',
          ' outline-none transition-all duration-200',
          'disabled:cursor-not-allowed autofill:bg-transparent disabled:opacity-50',
          hasError
            ? 'border-destructive '
            : 'border-gray-400/70 hover:border-gray-500 focus:border-gray-500',
        )}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          checkElementValue();
          onBlur?.(e);
        }}
        onChange={(e) => {
          checkElementValue();
          onChange?.(e);
        }}
      />
      <label
        htmlFor={resolvedId}
        className={cn(
          'absolute left-3 pointer-events-none select-none transition-all duration-200 bg-white px-1 text-gray-500',
          hasError ? 'text-destructive' : 'peer-focus:text-black',
          isFloating
            ? 'top-3 -translate-y-1/2 text-xs'
            : 'top-6 -translate-y-1/2 text-sm ',
          'peer-disabled:opacity-50 ',
        )}
      >
        {label}
      </label>
      {hasError && errorMessage && (
        <p className='text-xs ml-1 text-destructive mt-1 '>{errorMessage}</p>
      )}
    </div>
  );
});

FloatingLabelField.displayName = 'FloatingLabelField';

export {FloatingLabelField as FloatingLabelInput};
