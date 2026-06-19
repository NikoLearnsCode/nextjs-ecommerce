import {NavLink} from '@/lib/types/category-types';

/** True when href matches the current route (prefix match, with exact-home special case). */
export function matchesPath(
  href: string | null | undefined,
  pathname: string,
): boolean {
  if (!href || href === '#') return false;
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

/** Index of the first navLink matching the route, or 0 as fallback. */
export function findActiveCategoryIndex(
  navLinks: NavLink[],
  pathname: string,
): number {
  const index = navLinks.findIndex((link) => matchesPath(link.href, pathname));
  return index === -1 ? 0 : index;
}
