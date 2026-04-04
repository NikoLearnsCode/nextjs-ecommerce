import {useEffect} from 'react';

/** Viewport below this width gets the extra touch/overscroll lock (matches Tailwind `lg`). */
const MOBILE_TOUCH_LOCK_MEDIA = '(max-width: 1023px)';

let activeLocks = 0;
let originalStyles: {
  overflow: string;
  paddingRight: string;
} | null = null;

/** True if the touch target sits inside a vertically scrollable element (do not block). */
function touchTargetCanScrollVertically(target: EventTarget | null): boolean {
  let el: Element | null =
    target instanceof Element
      ? target
      : target instanceof Node
        ? target.parentElement
        : null;
  const root = document.documentElement;
  while (el && el !== root) {
    const style = window.getComputedStyle(el);
    const overflowY = style.overflowY;
    const scrollable =
      overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay';
    if (scrollable && el.scrollHeight > el.clientHeight) {
      return true;
    }
    el = el.parentElement;
  }
  return false;
}

let touchMoveHandler: ((e: TouchEvent) => void) | null = null;
let touchLockActive = false;
let savedHtmlOverscroll = '';

/** Mobile layer: block background scroll on touch and reduce overscroll bleed-through. */
function lockMobileTouchScroll() {
  if (typeof window === 'undefined') return;
  if (!window.matchMedia(MOBILE_TOUCH_LOCK_MEDIA).matches) return;
  if (touchLockActive) return;

  touchMoveHandler = (e: TouchEvent) => {
    if (touchTargetCanScrollVertically(e.target)) return;
    e.preventDefault();
  };
  document.addEventListener('touchmove', touchMoveHandler, {
    capture: true,
    passive: false,
  });

  const html = document.documentElement;
  savedHtmlOverscroll = html.style.overscrollBehavior;
  html.style.overscrollBehavior = 'none';
  touchLockActive = true;
}

/** Removes the touch listener and restores `html` overscroll when the last lock ends. */
function unlockMobileTouchScroll() {
  if (!touchLockActive || !touchMoveHandler) return;

  document.removeEventListener('touchmove', touchMoveHandler, {capture: true});
  const html = document.documentElement;
  html.style.overscrollBehavior = savedHtmlOverscroll;
  savedHtmlOverscroll = '';
  touchMoveHandler = null;
  touchLockActive = false;
}

/** Sets `overflow: hidden` on `body` and pads for scrollbar width to avoid layout shift. */
function lockBodyScroll() {
  const body = document.body;
  const html = document.documentElement;
  const computedStyle = window.getComputedStyle(body);
  const currentPaddingRight = parseFloat(computedStyle.paddingRight) || 0;
  const scrollbarWidth = window.innerWidth - html.clientWidth;

  originalStyles = {
    overflow: body.style.overflow,
    paddingRight: body.style.paddingRight,
  };

  body.style.overflow = 'hidden';

  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
  }
}

/** Restores `body` overflow/padding from before the lock. */
function unlockBodyScroll() {
  if (!originalStyles) return;

  const body = document.body;
  body.style.overflow = originalStyles.overflow;
  body.style.paddingRight = originalStyles.paddingRight;

  originalStyles = null;
}

/** Locks document scroll while e.g. a modal or menu is open; nested callers share `activeLocks`. */
export function useScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked) return;

    activeLocks += 1;
    if (activeLocks === 1) {
      lockBodyScroll();
      lockMobileTouchScroll();
    }

    return () => {
      activeLocks = Math.max(0, activeLocks - 1);
      if (activeLocks === 0) {
        unlockBodyScroll();
        unlockMobileTouchScroll();
      }
    };
  }, [isLocked]);
}
