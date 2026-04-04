'use client';

import {useEffect, useRef, useState} from 'react';
import {FiX} from 'react-icons/fi';
import {useKeyboardShortcut} from '@/hooks/useKeyboardShortcut';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
  description?: string;
  triggerElement?: HTMLElement | null;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
  isLoading = false,
  description,
  triggerElement,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({x: 0, y: 0});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen && triggerElement) {
      const rect = triggerElement.getBoundingClientRect();
      const dialogWidth = 365;
      const dialogHeight = 180;

      let x = rect.left + rect.width / 2 - dialogWidth / 2;
      let y = rect.top - dialogHeight - 30;

      if (x < 5) x = 5;
      if (x + dialogWidth > window.innerWidth - 5) {
        x = window.innerWidth - dialogWidth - 5;
      }

      if (y < 5) {
        y = rect.bottom + 5;
      }

      setPosition({x, y});

      setTimeout(() => setIsVisible(true), 50);
    } else if (isOpen && !triggerElement) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, triggerElement]);

  // Escape closes the dialog
  useKeyboardShortcut('Escape', onCancel, isOpen && !isLoading);

  // Enter confirms
  useKeyboardShortcut('Enter', onConfirm, isOpen && !isLoading);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      confirmBtn: 'bg-red-800 hover:bg-red-700 focus:ring-red-700',
    },
    warning: {
      confirmBtn: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-200',
    },
    info: {
      confirmBtn: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-200',
    },
  };

  const styles = variantStyles[variant];

  const dialogStyle = triggerElement
    ? {
        position: 'fixed' as const,
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isVisible ? 'scale(1)' : 'scale(0.1)',
        opacity: isVisible ? 1 : 0,
      }
    : {};

  return (
    <div className='fixed inset-0 z-50 '>
      <div
        ref={dialogRef}
        className={`
          ${triggerElement ? 'fixed' : 'fixed inset-0 flex items-center justify-center p-4'}
          transition-all duration-200 ease-out
        `}
        style={dialogStyle}
      >
        <div
          className={`
            relative bg-white rounded-sm shadow-xl border 
            ${triggerElement ? 'w-[280px]' : 'w-full max-w-sm'}
            transform transition-all duration-200
          `}
        >
          <button
            type='button'
            onClick={!isLoading ? onCancel : undefined}
            disabled={isLoading}
            className='absolute right-3 top-3 cursor-pointer text-gray-800 hover:text-gray-600 transition-colors disabled:opacity-50 z-10'
          >
            <FiX className='h-4 w-4' />
          </button>

          <div className='p-5'>
            <div className='flex items-start gap-4 mb-4'>
              <div className='flex-1 pt-1'>
                <h3 className='text-base font-semibold text-gray-900 mb-2'>
                  {title}
                </h3>
                <p className=' text-xs sm:text-sm text-gray-600 leading-relaxed'>
                  {message}
                </p>
                {description && (
                  <p className='text-xs text-red-600 mt-2'>{description}</p>
                )}
              </div>
            </div>

            <div className='flex flex-col gap-2 justify-end mt-6'>
              <button
                type='button'
                onClick={onConfirm}
                disabled={isLoading}
                className={`
                  px-4 py-2 text-xs w-full cursor-pointer font-medium text-white rounded-sm uppercase
                  focus:outline-none focus:ring-2 transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${styles.confirmBtn}
                  ${isLoading ? 'cursor-wait' : ''}
                `}
              >
                {isLoading ? (
                  <div className='flex items-center gap-2 justify-center'>
                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    <span>Laddar...</span>
                  </div>
                ) : (
                  confirmText
                )}
              </button>

              <button
                type='button'
                onClick={onCancel}
                disabled={isLoading}
                className='px-4 py-2 text-xs w-full cursor-pointer font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50 uppercase'
              >
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
