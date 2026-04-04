import {CategoryWithChildren} from '@/lib/types/category-types';

export interface DropdownOption {
  value: number;
  slug: string;
  label: string;
}

/**
 * @param nodes Nested list of categories to search.
 * @param allowedTypes String array, e.g. ['SUB-CATEGORY', 'COLLECTION'].
 * Only categories whose type is in this list are included.
 * @param parentName Parent category name; used to build descriptive labels.
 * @returns A flat array of `DropdownOption` objects.
 */
export function findCategoriesForDropdown(
  nodes: CategoryWithChildren[],
  allowedTypes: string[],
  parentName: string | null = null
): DropdownOption[] {
  let options: DropdownOption[] = [];


  for (const node of nodes) {
    // Different allowedTypes for products vs categories
    if (allowedTypes.includes(node.type)) {
      options.push({
        value: node.id,
        slug: node.slug,
        label: parentName ? `${node.name} - ${parentName}` : node.name,
      });
    }
    if (node.children && node.children.length > 0) {
      options = options.concat(
        findCategoriesForDropdown(
          node.children,
          allowedTypes,
          node.name
        )
      );
    }
  }

  return options;
}

/**
 * Builds a Map for fast category lookup by ID.
 * Walks the full tree recursively.
 * @param cats Nested list of categories.
 * @returns Map<number, CategoryWithChildren>
 */
export const createCategoryLookupMap = (
  cats: CategoryWithChildren[]
): Map<number, CategoryWithChildren> => {
  const map = new Map<number, CategoryWithChildren>();

  function buildMap(nodes: CategoryWithChildren[]) {
    for (const node of nodes) {
      map.set(node.id, node);
      if (node.children && node.children.length > 0) {
        buildMap(node.children);
      }
    }
  }

  buildMap(cats);
  return map;
};
