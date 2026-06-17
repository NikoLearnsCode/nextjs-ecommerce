declare global {
  interface FocusOptions {
    focusVisible?: boolean;
  }
}

// Id of the page <main> landmark; focus target on navigation.
export const MAIN_CONTENT_ID = 'main-content';

const NAV_KEYS = new Set([
  'Tab',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
]);

let pointerActive = false;

if (typeof document !== 'undefined') {
  document.addEventListener(
    'pointerdown',
    (e) => {
      if (e.pointerType === 'mouse') pointerActive = true;
    },
    true,
  );
  document.addEventListener(
    'keydown',
    (e) => {
      if (NAV_KEYS.has(e.key)) pointerActive = false;
    },
    true,
  );
}

/**
 * Focus an element, suppressing `:focus-visible` when the last interaction was
 * a pointer (mouse) event. This prevents programmatic `.focus()` calls (e.g.
 * focus-trap return, Escape-close) from flashing focus rings for mouse users
 * while preserving them for keyboard navigation.
 */
export function safeFocus(el: HTMLElement | null | undefined) {
  if (!el) return;
  el.focus(pointerActive ? {focusVisible: false} : undefined);
}

// Focus the `FocusHeading` inside `root`, if any. No visible ring.
export function focusInitialIn(root: ParentNode): boolean {
  const el = root.querySelector<HTMLElement>('[data-initial-focus]');
  if (!el) return false;
  el.focus({focusVisible: false});
  return true;
}
