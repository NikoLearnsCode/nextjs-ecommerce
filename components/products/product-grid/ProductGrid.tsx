'use client';

import {ProductCard} from '@/lib/types/db-types';
import Cards from '@/components/shared/cards/ProductCard';

export type GridLayout = 'compact' | 'comfortable';

type ProductGridProps = {
  products: ProductCard[];
  title?: string;
  emptyMessage?: string;
  className?: string;
  gridLayout?: GridLayout;
};

// compact: more per row (current). comfortable: 1 on mobile, 2 from sm up.
const GRID_COLS: Record<GridLayout, string> = {
  compact: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  comfortable:
    'grid-cols-1 lg:grid-cols-2 w-auto max-w-auto lg:max-w-[1100px] lg:w-[70%] mx-auto',
};

export default function ProductGrid({
  products,
  className = '',
  gridLayout = 'compact',
}: ProductGridProps) {
  return (
    <div className={className}>
      <div className={`grid gap-[1px] ${GRID_COLS[gridLayout]}`}>
        {products.map((product, index) => (
          <Cards
            key={product.id}
            product={product}
            imagePriority={index < 4}
            gridLayout={gridLayout}
          />
        ))}
      </div>
    </div>
  );
}
