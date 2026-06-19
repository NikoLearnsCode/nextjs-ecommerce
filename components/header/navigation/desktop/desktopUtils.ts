import {NavLink} from '@/lib/types/category-types';

// Dropdown width constants (single source of truth)
export const COLUMN_MIN_WIDTH = 180;
const DROPDOWN_MIN_WIDTH = 350;
const CLOSE_BUTTON_SPACE = 150;
const CONTENT_PADDING_X = 48;

export function computeDropdownWidth(
  measuredColumnsWidth: number,
  headerContentWidth: number,
): number {
  return Math.max(
    DROPDOWN_MIN_WIDTH,
    headerContentWidth + CLOSE_BUTTON_SPACE,
    measuredColumnsWidth + CONTENT_PADDING_X,
  );
}

// Column builder
export function buildNavColumns(
  navLinks: NavLink[],
  activePath: number[],
): NavLink[][] {
  if (activePath.length === 0) return [];

  const columns: NavLink[][] = [];

  let currentChildren = navLinks[activePath[0]]?.children;
  if (currentChildren) {
    columns.push(currentChildren);
  }

  for (let i = 1; i < activePath.length; i++) {
    const nextChildren = currentChildren?.[activePath[i]]?.children;

    if (nextChildren && nextChildren.length > 0) {
      columns.push(nextChildren);
      currentChildren = nextChildren;
    } else {
      break;
    }
  }

  return columns;
}
