import {useEffect, useRef, type RefObject} from 'react';
import {focusInitialIn, safeFocus} from '@/lib/focus';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    (el) =>
      el.getAttribute('aria-hidden') !== 'true' &&
      el.getAttribute('tabindex') !== '-1',
  );
}

interface UseFocusTrapOptions {
  /** Whether to return focus to the previously focused element when the trap deactivates. Defaults to true. */
  returnFocusOnDeactivate?: boolean;
  /**
   * Whether to automatically move focus into the container when the trap
   * activates. Set to false when the overlay is opened by mouse hover and
   * focus should remain wherever it is (e.g. desktop nav mega-menu).
   * Defaults to true.
   */
  autoFocus?: boolean;
}

/**
 * Traps keyboard focus within `containerRef` while `enabled` is true.
 *
 * - Tab / Shift+Tab cycle stays inside the container.
 * - On activation: focuses `[data-initial-focus]` if present, else first focusable child.
 * - On deactivation: restores focus to the element that was active before the trap.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  {returnFocusOnDeactivate = true, autoFocus = true}: UseFocusTrapOptions = {},
) {
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Stash previously focused element and move focus into the trap.
  useEffect(() => {
    if (!enabled || !autoFocus) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    if (!container) return;

    // Defer so the DOM is fully rendered (Framer Motion may animate in).
    const frame = requestAnimationFrame(() => {
      if (focusInitialIn(container)) return;

      const focusable = getFocusableElements(container);
      if (focusable.length > 0) {
        safeFocus(focusable[0]);
      } else {
        safeFocus(container);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [enabled, autoFocus, containerRef]);

  // When autoFocus is off, still track the previously focused element so
  // return-focus on deactivate works correctly.
  useEffect(() => {
    if (!enabled || autoFocus) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
  }, [enabled, autoFocus]);

  // Restore focus when the trap deactivates.
  useEffect(() => {
    if (enabled) return;

    if (returnFocusOnDeactivate && previouslyFocusedRef.current) {
      safeFocus(previouslyFocusedRef.current);
      previouslyFocusedRef.current = null;
    }
  }, [enabled, returnFocusOnDeactivate]);

  // Tab-wrap keydown handler — attach to the container.
  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !container.contains(active)) {
          event.preventDefault();
          safeFocus(last);
        }
      } else {
        if (active === last || !container.contains(active)) {
          event.preventDefault();
          safeFocus(first);
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [enabled, containerRef]);
}

export {getFocusableElements, FOCUSABLE_SELECTOR};
