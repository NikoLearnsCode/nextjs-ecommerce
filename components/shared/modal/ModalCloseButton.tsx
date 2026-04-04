'use client';

import {X} from 'lucide-react';
import {cn} from '@/styles/style.utils';

interface ModalCloseButtonProps {
  onClick?: () => void;
  dialogId?: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
  'aria-label'?: string;
}

export function ModalCloseButton({
  onClick,
  dialogId,
  className,
  size = 15,
  strokeWidth = 1.5,
  'aria-label': ariaLabel = 'Close',
}: ModalCloseButtonProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn('cursor-pointer z-50', className)}
      aria-label={ariaLabel}
      command={dialogId ? 'close' : undefined}
      commandfor={dialogId}
    >
      <X size={size} strokeWidth={strokeWidth} />
    </button>
  );
}
