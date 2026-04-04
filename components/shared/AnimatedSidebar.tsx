'use client';
import React, {ReactNode, forwardRef} from 'react';
import {motion, Variants} from 'framer-motion';
import {X} from 'lucide-react';
import {cn} from '@/styles/style.utils';

interface MotionCloseXProps {
  onClick: () => void;
  className?: string;
  size?: number;
  strokeWidth?: number;
  withTranslate?: boolean;
  withDelay?: boolean;
  'aria-label'?: string;
}

export const MotionCloseX = ({
  onClick,
  className = '',
  size = 15,
  strokeWidth = 1.5,
  withTranslate = false,
  'aria-label': ariaLabel = 'Close menu',
}: MotionCloseXProps) => {
  return (
    <motion.button
      type='button'
      onClick={onClick}
      className={`cursor-pointer z-50 ${className}`}
      aria-label={ariaLabel}
      initial={withTranslate ? {opacity: 0, rotate: 0, translateX: -200} : {}}
      animate={withTranslate ? {opacity: 1, rotate: 0, translateX: 0} : {}}
      transition={{delay: 0.15, duration: 0.3}}
    >
      <X size={size} strokeWidth={strokeWidth} />
    </motion.button>
  );
};

interface MotionDropdownProps {
  children: ReactNode;
  onMouseLeave?: () => void;
  className?: string;
  id?: string;
  isMobile?: boolean;
  position?: 'right' | 'top' | 'newLeft' | 'bottom';
  style?: React.CSSProperties;
}

export const MotionDropdown = forwardRef<HTMLDivElement, MotionDropdownProps>(
  function MotionDropdown(
    {
      children,
      onMouseLeave,
      className = '',
      isMobile = false,
      id = 'dropdown',
      position = 'right',
      style,
    },
    ref,
  ) {
    const rightVariants: Variants = {
      hidden: {x: 300, opacity: 0, width: 0},
      visible: {
        x: 0,
        opacity: 1,
        width: 'auto',
        transition: {
          type: 'tween',
          ease: [0.4, 0, 0.2, 1], // Material Design standard easing
          duration: 0.45,
        },
      },
      exit: {
        x: 300,
        opacity: 0,
        width: 0,
        transition: {type: 'tween', ease: 'easeIn', duration: 0.15},
      },
    };

    const topVariants: Variants = {
      hidden: {
        clipPath: 'inset(0% 0% 100% 0%)',
        opacity: 0,
      },

      visible: {
        // Negative inset allows focus outlines that extend beyond the element
        // boundary to remain visible and not be clipped.
        clipPath: 'inset(-4px -4px -4px -4px)',
        opacity: 1,
        transition: {
          type: 'tween',
          ease: 'easeOut',
          duration: 0.2,
        },
      },

      exit: {
        clipPath: 'inset(0% 0% 100% 0%)',
        opacity: 1,
        transition: {
          type: 'tween',
          ease: 'easeIn',
          duration: 0.1,
          delay: 0.1,
        },
      },
    };

    const newLeftVariants: Variants = {
      hidden: {
        clipPath: 'inset(0% 100% 0% 0%)',
        opacity: 1,
      },

      visible: {
        clipPath: 'inset(-4px -4px -4px -4px)',
        opacity: 1,
        transition: {
          type: 'tween',
          ease: 'easeOut',
          duration: 0.3,
          delay: 0.1,
        },
      },

      exit: {
        clipPath: 'inset(0% 100% 0% 0%)',
        opacity: 1,
        transition: {
          type: 'tween',
          ease: 'easeIn',
          duration: 0.2,
          delay: 0.1,
        },
      },
    };

    const bottomVariants: Variants = {
      hidden: {y: '100%', opacity: 1},
      visible: {
        y: 0,
        opacity: 1,
        transition: {type: 'tween', ease: [0.4, 0, 0.2, 1], duration: 0.35},
      },
      exit: {
        y: '100%',
        opacity: 1,
        transition: {type: 'tween', ease: 'easeIn', duration: 0.25},
      },
    };

    const getVariants = () => {
      switch (position) {
        case 'right':
          return rightVariants;
        case 'top':
          return topVariants;
        case 'newLeft':
          return newLeftVariants;
        case 'bottom':
          return bottomVariants;
        default:
          return rightVariants;
      }
    };

    const getPositionClasses = () => {
      switch (position) {
        case 'right':
          return `right-0 top-0 h-full`;
        case 'top':
          return 'w-full';
        case 'newLeft':
          return `left-0 top-0 h-full ${isMobile ? 'w-full' : ''}`;
        case 'bottom':
          return 'bottom-0 left-0 w-full';
        default:
          return 'right-0 top-0 h-full';
      }
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'fixed bg-white z-40 shadow-md',
          getPositionClasses(),
          className,
        )}
        variants={getVariants()}
        initial='hidden'
        animate='visible'
        exit='exit'
        key={id}
        onMouseLeave={onMouseLeave}
        style={style}
      >
        {children}
      </motion.div>
    );
  },
);

interface MotionOverlayProps {
  onMouseEnter?: () => void;
  className?: string;
  isMobile?: boolean;
  id?: string;
  onClick?: () => void;
  ariaHidden?: boolean;
  withDelay?: boolean;
}

export const MotionOverlay = ({
  onMouseEnter,
  onClick,
  className = '',
  id = 'overlay',
  ariaHidden = true,
  withDelay = false,
}: MotionOverlayProps) => {
  const backdropVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 0.2,
      transition: {duration: 0.3, delay: withDelay ? 0.15 : 0},
    },
    exit: {
      opacity: 0,
      transition: {duration: 0.1, delay: withDelay ? 0.1 : 0},
    },
  };

  return (
    <motion.div
      className={`fixed inset-0 h-full cursor-pointer w-full bg-black z-30 ${className}`}
      variants={backdropVariants}
      initial='hidden'
      animate='visible'
      exit='exit'
      key={id}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      aria-hidden={ariaHidden}
    />
  );
};
