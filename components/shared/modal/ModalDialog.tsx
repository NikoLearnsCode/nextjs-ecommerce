'use client';

import {ReactNode} from 'react';
import {cn} from '@/styles/style.utils';

export type PanelVariant = 'right' | 'left' | 'bottom' | 'top';

const DEFAULT_VARIANT: PanelVariant = 'right';

interface ModalDialogProps {
  id: string;
  children: ReactNode;
  className?: string;
  variant?: PanelVariant;
  onClose?: () => void;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

export function ModalDialog({
  id,
  children,
  className,
  variant = DEFAULT_VARIANT,
  onClose,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
}: ModalDialogProps) {
  return (
    <dialog
      id={id}
      className={cn('modal-dialog', `modal-variant-${variant}`, className)}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      closedby='any'
      onClose={onClose}
      // Fix for Safari aka New IE
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          (event.currentTarget as HTMLDialogElement).close();
        }
      }}
    >
      {children}
    </dialog>
  );
}
