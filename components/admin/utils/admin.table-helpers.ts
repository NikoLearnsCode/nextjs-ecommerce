import {CategoryWithChildren} from '@/lib/types/category-types';

export type FlattenedCategory = CategoryWithChildren & {
  level: number;
  parentName?: string;
};

/**
 * @param cats Nested list of categories to flatten.
 * @param expandedCategories A `Set` of IDs for categories the user has expanded in the UI.
 * This controls which child rows are included in the flat list.
 * @param level Current depth in the hierarchy; incremented on each recursive call.
 * @param parentName Name of the parent of the `cats` list.
 * @returns A flat array of `FlattenedCategory` objects.
 */
export const flattenCategoriesRecursive = (
  cats: CategoryWithChildren[],
  expandedCategories: Set<number>,
  level = 0,
  parentName?: string
): FlattenedCategory[] => {
  const flattened: FlattenedCategory[] = [];


  cats.forEach((cat) => {
  
    flattened.push({...cat, level, parentName});
    if (
      expandedCategories.has(cat.id) &&
      cat.children &&
      cat.children.length > 0
    ) {
      flattened.push(
        ...flattenCategoriesRecursive(
          cat.children,
          expandedCategories,
          level + 1,
          cat.name
        )
      );
    }
  });

  return flattened;
};

// Used for expandAll/collapseAll in CategoryTable.tsx
export const getAllCategoryIdsRecursive = (
  cats: CategoryWithChildren[]
): number[] => {
  let ids: number[] = [];
  for (const cat of cats) {
    ids.push(cat.id);
    if (cat.children && cat.children.length > 0) {
      ids = ids.concat(getAllCategoryIdsRecursive(cat.children));
    }
  }
  return ids;
};

// Used to style categories in CategoryTable.tsx
export const categoryConfig = {
  'MAIN-CATEGORY': {
    name: 'Main category',
    className: 'text-black ',
  },
  'SUB-CATEGORY': {
    name: 'Subcategory',
    className: 'text-black font-medium',
  },
  COLLECTION: {
    name: 'Collection',
    className: 'text-red-900 uppercase  ',
  },
  CONTAINER: {
    name: 'Container',
    className: 'text-emerald-900 uppercase  ',
  },
};
