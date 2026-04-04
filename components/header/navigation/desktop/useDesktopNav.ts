import {useState, useRef, useMemo, useCallback, useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {NavLink} from '@/lib/types/category-types';
import {useScrollLock} from '@/hooks/useScrollLock';
import {useKeyboardShortcut} from '@/hooks/useKeyboardShortcut';
import {buildNavColumns, isActivePath} from './desktopUtils';

/**
 * Desktop mega-menu: active path indices, hover delays, and column rendering.
 *
 * @param navLinks Top-level categories
 */
export function useDesktopNav(navLinks: NavLink[]) {
  const pathname = usePathname();

  // Indices along the open path — e.g. [0, 2, 1] = 1st top item, 3rd child, 2nd grandchild
  const [activePath, setActivePath] = useState<number[]>([]);

  // Delay before opening dropdown on first hover
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Latest hovered top-level index (for debounced open)
  const candidateIndexRef = useRef<number | null>(null);

  /** Close dropdown and clear pending hover timers */
  const closeDropdown = useCallback(() => {
    setActivePath([]);
    candidateIndexRef.current = null;

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  /**
   * Top-level hover: 200ms delay before open to avoid flicker when moving across items.
   */
  const handleMainMenuHover = useCallback(
    (index: number) => {
      candidateIndexRef.current = index;

      if (activePath.length === 0) {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }

        hoverTimeoutRef.current = setTimeout(() => {
          if (candidateIndexRef.current === index) {
            setActivePath([index]);
          }
        }, 200);
      } else {
        // Already open — switch column immediately
        setActivePath([index]);
      }
    },
    [activePath.length]
  );

  /**
   * Sub-column hover: extend path to show deeper columns.
   */
  const handleSubMenuHover = useCallback(
    (level: number, index: number) => {
      setActivePath([...activePath.slice(0, level + 1), index]);
    },
    [activePath]
  );

  /**
   * Pointer left top bar while closed — cancel pending open.
   */
  const handleMainMenuLeave = useCallback(() => {
    if (activePath.length === 0) {
      candidateIndexRef.current = null;
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    }
  }, [activePath.length]);

  /** After navigation, close immediately */
  const handleClick = useCallback(() => {
    closeDropdown();
  }, [closeDropdown]);

  /** Keyboard: open a top-level column */
  const handleKeyOpen = useCallback((index: number) => {
    setActivePath([index]);
  }, []);

  /** Whether href matches current route */
  const checkIsActivePath = useCallback(
    (href: string) => {
      return isActivePath(href, pathname);
    },
    [pathname]
  );

  const columnsToRender = useMemo(() => {
    return buildNavColumns(navLinks, activePath);
  }, [navLinks, activePath]);

  useScrollLock(activePath.length > 0);

  useKeyboardShortcut('Escape', closeDropdown, activePath.length > 0);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return {
    activePath,
    columnsToRender,

    closeDropdown,
    handleMainMenuHover,
    handleSubMenuHover,
    handleMainMenuLeave,
    handleClick,
    handleKeyOpen,
    checkIsActivePath,
  };
}
