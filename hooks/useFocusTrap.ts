import {useEffect, useMemo, useRef, type RefObject} from 'react';
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
      el.getAttribute('tabindex') !== '-1' &&
      el.getClientRects().length > 0,
  );
}

type ContainerRef = RefObject<HTMLElement | null>;

// Focusables across containers, in ref order (deterministic tab order).
function getScopeFocusables(refs: ContainerRef[]): HTMLElement[] {
  return refs.flatMap((ref) =>
    ref.current ? getFocusableElements(ref.current) : [],
  );
}

function scopeContains(refs: ContainerRef[], node: Node | null): boolean {
  return refs.some((ref) => ref.current?.contains(node));
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
  containerRef: ContainerRef | ContainerRef[],
  enabled: boolean,
  {returnFocusOnDeactivate = true, autoFocus = true}: UseFocusTrapOptions = {},
) {
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  // `instanceof Array` (not Array.isArray) avoids the react-hooks ref-in-render warning.
  const refs = useMemo(
    () => (containerRef instanceof Array ? containerRef : [containerRef]),
    [containerRef],
  );

  // Stash previously focused element and move focus into the trap.
  useEffect(() => {
    if (!enabled || !autoFocus) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const first = refs[0]?.current;
    if (!first) return;

    // Defer so the DOM is fully rendered (Framer Motion may animate in).
    const frame = requestAnimationFrame(() => {
      if (focusInitialIn(first)) return;

      const focusable = getScopeFocusables(refs);
      if (focusable.length > 0) {
        safeFocus(focusable[0]);
      } else {
        safeFocus(first);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [enabled, autoFocus, refs]);

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

  // Tab-wrap keydown handler — attach to every container in the scope.
  useEffect(() => {
    if (!enabled) return;

    const containers = refs
      .map((ref) => ref.current)
      .filter((el): el is HTMLElement => el !== null);
    if (containers.length === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusable = getScopeFocusables(refs);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !scopeContains(refs, active)) {
          event.preventDefault();
          safeFocus(last);
        }
      } else {
        if (active === last || !scopeContains(refs, active)) {
          event.preventDefault();
          safeFocus(first);
        }
      }
    };

    containers.forEach((c) => c.addEventListener('keydown', handleKeyDown));
    return () =>
      containers.forEach((c) =>
        c.removeEventListener('keydown', handleKeyDown),
      );
  }, [enabled, refs]);
}

export {getFocusableElements, FOCUSABLE_SELECTOR};
