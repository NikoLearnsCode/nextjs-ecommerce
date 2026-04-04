import {
  Category,
  CategoryWithChildren,
  NavLink,
} from '@/lib/types/category-types';

/**
 * Build a nested category tree from a flat DB list (recursive by parentId).
 * @param parentId `null` for roots on the first call
 */
export function buildCategoryTree(
  items: Category[],
  parentId: number | null = null
): CategoryWithChildren[] {
  return items
    .filter((item) => item.parentId === parentId)
    .map((item) => {
      const children = buildCategoryTree(items, item.id);

      return {
        ...item,
        ...(children.length > 0 && {children}),
      };
    });
}

/**
 * Turn the category tree into `NavLink` items with cumulative `/c/...` paths.
 * @param parentSlugs Accumulated slug segments from ancestors (start with `[]`)
 */
export function transformTreeToNavLinks(
  categories: CategoryWithChildren[],
  parentSlugs: string[] = []
): NavLink[] {
  return categories.map((category) => {
    let currentPathSlugs: string[];
    const hasChildren = category.children && category.children.length > 0;

    // Container nodes do not add URL segments
    if (category.type === 'CONTAINER') {
      currentPathSlugs = parentSlugs;
    } else {
      currentPathSlugs = [...parentSlugs, category.slug];
    }

    const navLink: NavLink = {
      title: category.name,
      href:
        category.type === 'CONTAINER'
          ? null
          : `/c/${currentPathSlugs.join('/')}`,
      displayOrder: category.displayOrder,
      isFolder: hasChildren,
    };

    if (hasChildren) {
      navLink.children = transformTreeToNavLinks(
        category.children!,
        currentPathSlugs
      );
    }

    return navLink;
  });
}
