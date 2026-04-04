import {useEffect, useRef, type RefObject} from 'react';

type UseDropdownDismissalOptions = {
  isOpen: boolean;
  onClose: () => void;
  containerRef: RefObject<HTMLElement | null>;
  triggerRef?: RefObject<HTMLElement | null>;
};

/**
 * Close on mousedown outside `containerRef`.
 * Optional `triggerRef` keeps toggles inside the trigger from counting as "outside" (e.g. cart button).
 */
export function useDropdownDismissal({
  isOpen,
  onClose,
  containerRef,
  triggerRef,
}: UseDropdownDismissalOptions) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef?.current?.contains(target)) {
        return;
      }
      if (containerRef.current && !containerRef.current.contains(target)) {
        onCloseRef.current();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen, containerRef, triggerRef]);
}
