import {useState, useCallback} from 'react';
import {usePathname} from 'next/navigation';
import {NavLink} from '@/lib/types/category-types';
import {useScrollLock} from '@/hooks/useScrollLock';
import {useKeyboardShortcut} from '@/hooks/useKeyboardShortcut';
import {findActiveCategoryIndex} from '../shared/navUtils';

/**
 * Mobile navigation state and handlers (stack, direction, menu open).
 *
 * @param navLinks Top-level categories shown in the menu
 */
export function useMobileNav(navLinks: NavLink[]) {
  const pathname = usePathname();

  // Menu open / closed
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Active top-level tab index
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(
    findActiveCategoryIndex(navLinks, pathname)
  );

  // Breadcrumb stack — e.g. [Women, Jackets] means Jackets under Women
  const [navigationStack, setNavigationStack] = useState<NavLink[]>([]);

  // Animation direction: forward = deeper (from right), back = pop (from left)
  const [navigationDirection, setNavigationDirection] = useState<
    'forward' | 'back'
  >('forward');

  /** Sync active tab when pathname changes (e.g. browser back). */
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setActiveCategoryIndex(findActiveCategoryIndex(navLinks, pathname));
    setNavigationStack([]);
  }

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setNavigationStack([]);
  }, []);

  /** Folder → push stack; leaf link → close menu (Next.js navigates). */
  const handleLinkClick = useCallback(
    (link: NavLink) => {
      if (link.isFolder) {
        // Deeper — push stack, slide from right
        setNavigationDirection('forward');
        setNavigationStack((prev) => [...prev, link]);
      } else {
        // Leaf — close menu; Next.js handles navigation
        closeMenu();
      }
    },
    [closeMenu]
  );

  /** Pop one level off the stack */
  const goBack = useCallback(() => {
    setNavigationDirection('back'); // Back — slide from left
    setNavigationStack((prev) => prev.slice(0, -1));
  }, []);

  /** Switch tab — clears the navigation stack */
  const changeCategory = useCallback((index: number) => {
    setActiveCategoryIndex(index);
    setNavigationStack([]);
  }, []);

  useScrollLock(isMenuOpen);
  useKeyboardShortcut('Escape', closeMenu, isMenuOpen);

  return {
    isMenuOpen,
    activeCategoryIndex,
    navigationStack,
    navigationDirection,

    isAtMainLevel: navigationStack.length === 0,
    currentLevel: navigationStack.at(-1) ?? null,

    toggleMenu,
    closeMenu,
    handleLinkClick,
    goBack,
    changeCategory,
  };
}
