'use client';

import * as React from 'react';
import {cn} from '@/styles/style.utils';
import {CalendarCheck} from 'lucide-react';

interface CustomDateInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'onChange' | 'value' | 'name'
  > {
  label: string;
  id: string;
  name: string;
  hasError?: boolean;
  errorMessage?: string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
}

const CustomDateInput = React.forwardRef<
  HTMLInputElement,
  CustomDateInputProps
>(
  (
    {
      label,
      id,
      name,
      hasError,
      errorMessage,
      className,
      onFocus,
      onBlur,
      onChange,
      value,
      disabled,
      ...restProps
    },
    ref
  ) => {
    const elementRef = React.useRef<HTMLInputElement | null>(null);

    const combinedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        elementRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const formatDateForInput = (date: Date | null): string => {
      if (!date) return '';

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const parseDateFromInput = (inputValue: string): Date | null => {
      if (!inputValue) return null;
      const date = new Date(inputValue);
      return isNaN(date.getTime()) ? null : date;
    };

    const openPicker = () => {
      if (disabled) return;
      try {
        elementRef.current?.showPicker?.();
      } catch {
        // showPicker() can throw if unsupported or already open; the input
        // remains fully editable via the keyboard, so this is safe to ignore.
      }
    };

    const isoDateString = value instanceof Date ? value.toISOString() : '';

    return (
      <div className={cn('relative', className)}>
        <div
          className={cn(
            'relative w-full px-3 border rounded-xs transition-all duration-200',
            'hover:border-gray-500',
            // Visible keyboard focus indicator (input keeps outline-none).
            ' has-[input:focus-visible]:ring-1 has-[input:focus-visible]:ring-gray-500',
            disabled && 'opacity-50',
            hasError ? 'border-destructive' : 'border-gray-400/70'
          )}
        >
          <input
            id={id}
            type='datetime-local'
            {...restProps}
            ref={combinedRef}
            value={formatDateForInput(value || null)}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            className={cn(
              'w-full bg-transparent text-gray-500 font-medium h-12.5 pt-3.5 text-sm',
              'outline-none cursor-pointer',
              'disabled:cursor-not-allowed',
              // Hide the native picker indicator entirely: at opacity-0 it stays
              // in the tab order as an invisible "ghost" tab stop between the
              // segments and the icon. The button below opens the picker instead.
              '[&::-webkit-calendar-picker-indicator]:hidden'
            )}
            placeholder={label}
            onClick={openPicker}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={(e) => {
              const newDate = parseDateFromInput(e.target.value);
              onChange?.(newDate);
            }}
          />

          <input type='hidden' name={name} value={isoDateString} />

          <button
            type='button'
            aria-label='Open calendar'
            onClick={openPicker}
            disabled={disabled}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 rounded-xs outline-none',
              'focus-visible:ring-2 focus-visible:ring-black',
              'disabled:cursor-not-allowed'
            )}
          >
            <CalendarCheck
              strokeWidth={1.25}
              size={26}
              aria-hidden='true'
              className={cn(
                'text-gray-500 transition-colors',
                hasError && 'text-destructive'
              )}
            />
          </button>

          <label
            htmlFor={id}
            className={cn(
              'absolute left-3 top-1.5 text-xs text-gray-500 pointer-events-none',
              hasError ? 'text-destructive' : ''
            )}
          >
            {label}
          </label>
        </div>

        {hasError && errorMessage && (
          <p className='text-xs ml-1 text-destructive mt-1'>{errorMessage}</p>
        )}
      </div>
    );
  }
);

CustomDateInput.displayName = 'CustomDateInput';

export {CustomDateInput};
