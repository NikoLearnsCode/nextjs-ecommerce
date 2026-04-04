'use client';

import type {KeyboardEvent, MouseEvent, ReactNode} from 'react';
import Link from 'next/link';
import {NavLink} from '@/lib/types/category-types';
import {cn} from '@/styles/style.utils';

export type NavLinkVariant = 'desktop' | 'sidebar';

export interface NavLinkItemProps {
  link: NavLink;
  onClick: () => void;
  className?: string;
  variant?: NavLinkVariant;
  isActive?: boolean;
  isDimmed?: boolean;
  isSecondary?: boolean;
  /** Renders `<li className="h-12 …">` around the control; control is centered inside with padding-y */
  asListItem?: boolean;
  listItemClassName?: string;
  /** Desktop: submenu hover trigger on interactive content (button/link) */
  onItemMouseEnter?: () => void;
  /** Desktop dropdown: prevent parent submenu items from activating on click/keyboard */
  preventSubmenuActivation?: boolean;
  /** Desktop dropdown: open submenu from keyboard and manage focus */
  onSubmenuKeyOpen?: () => void;
}

function hasSubmenu(link: NavLink): boolean {
  return (link.children?.length ?? 0) > 0;
}

function hasValidHref(href: NavLink['href']): href is string {
  return typeof href === 'string' && href.trim().length > 0;
}

function getInteractiveClassName({
  variant,
  isActive,
  isDimmed,
  isSecondary,
  className,
}: {
  variant: NavLinkVariant;
  isActive: boolean;
  isDimmed: boolean;
  isSecondary: boolean;
  className?: string;
}) {
  const variantClasses: Record<NavLinkVariant, string> = {
    desktop: 'text-xs',
    sidebar: 'text-xs',
  };

  const isMutedInactive = !isActive && (isDimmed || isSecondary);

  return cn(
    'inline-flex w-fit max-w-full cursor-pointer items-center justify-center',
    'whitespace-nowrap bg-transparent p-0 py-0.5 text-left',
    'text-sm font-semibold uppercase leading-5',
    'border-b border-transparent transition-colors duration-200 ease-in-out',
    'hover:border-primary hover:text-primary',
    variantClasses[variant],
    isActive && 'border-primary text-primary',
    isMutedInactive &&
      'text-muted-foreground hover:text-primary focus-visible:text-primary',
    !isActive && !isMutedInactive && 'text-primary',
    className,
  );
}

/**
 * Folder rows render as `<button>`; leaves use Next.js `<Link>`.
 * With `asListItem`, the control is centered in `h-12` `<li>` with padding-y; pointer + underline only on the control.
 */
export function NavLinkItem({
  link,
  onClick,
  className,
  variant = 'desktop',
  isActive = false,
  isDimmed = false,
  isSecondary = false,
  asListItem = false,
  listItemClassName,
  onItemMouseEnter,
  preventSubmenuActivation = false,
  onSubmenuKeyOpen,
}: NavLinkItemProps) {
  const interactiveClassName = getInteractiveClassName({
    variant,
    isActive,
    isDimmed,
    isSecondary,
    className,
  });

  const wrapListItem = (node: ReactNode) => {
    if (!asListItem) return node;
    return (
      <li
        className={cn('box-border flex h-12 items-center', listItemClassName)}
      >
        {node}
      </li>
    );
  };

  if (hasSubmenu(link)) {
    const handleSubmenuClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (preventSubmenuActivation) {
        event.preventDefault();
        event.stopPropagation();
        onItemMouseEnter?.();
        return;
      }

      onClick();
    };

    const handleSubmenuKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (!preventSubmenuActivation) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;

      event.preventDefault();
      event.stopPropagation();
      if (onSubmenuKeyOpen) {
        onSubmenuKeyOpen();
        return;
      }

      onItemMouseEnter?.();
    };

    return wrapListItem(
      <button
        type='button'
        aria-expanded={isActive}
        onClick={handleSubmenuClick}
        onKeyDown={handleSubmenuKeyDown}
        onMouseEnter={onItemMouseEnter}
        className={interactiveClassName}
      >
        {link.title}
      </button>,
    );
  }

  if (hasValidHref(link.href)) {
    return wrapListItem(
      <Link
        href={link.href}
        onClick={onClick}
        onMouseEnter={onItemMouseEnter}
        className={interactiveClassName}
        aria-current={isActive ? 'page' : undefined}
      >
        {link.title}
      </Link>,
    );
  }

  const staticLabelClassName = cn(
    'inline-flex w-fit max-w-full items-center justify-center whitespace-nowrap',
    'cursor-default border-b border-transparent',
    'text-sm font-semibold uppercase leading-5 text-muted-foreground text-xs',
    className,
  );

  return wrapListItem(
    <span className={staticLabelClassName}>{link.title}</span>,
  );
}
