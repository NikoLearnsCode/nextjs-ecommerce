import {NavLink} from '@/lib/types/category-types';

export function findInitialCategory(
  navLinks: NavLink[],
  pathname: string
): number {
  const foundIndex = navLinks.findIndex((link) => {
    if (link.href === '/' && pathname === '/') {
      return true;
    }
    if (link.href !== '/' && pathname.startsWith(link.href || '')) {
      return true;
    }
    return false;
  });

  return foundIndex !== -1 ? foundIndex : 0;
}
