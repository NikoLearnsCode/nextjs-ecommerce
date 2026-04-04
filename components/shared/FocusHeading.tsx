'use client';

import {
  forwardRef,
  type HTMLAttributes,
  type ElementType,
} from 'react';
import {cn} from '@/styles/style.utils';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface FocusHeadingProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'id' | 'tabIndex'> {
  // Stable id for `aria-labelledby` / route landmarks
  id: string;
  as?: HeadingTag;
}


// Heading that receives focus when a panel opens (filter, cart etc)
// 1. Put <FocusHeading id="…"> as the panel title (match aria-labelledby)
// 2. Focus moves automatically if the parent uses ModalDialog or useFocusTrap

export const FocusHeading = forwardRef<HTMLHeadingElement, FocusHeadingProps>(
  function FocusHeading({as: Tag = 'h2', id, className, ...props}, ref) {
    const Component = Tag as ElementType;
    return (
      <Component
        ref={ref}
        id={id}
        tabIndex={-1}
        data-initial-focus
        className={cn('focus-heading', className)}
        {...props}
      />
    );
  },
);
