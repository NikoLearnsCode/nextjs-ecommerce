'use client';

import {ProductCard} from '@/lib/types/db-types';
import {getInfiniteProducts} from '@/actions/product.actions';
import {useInfiniteQuery} from '@tanstack/react-query';
import {parseSortParam} from '@/utils/filterSort';
import {parseCollectionSlug} from '@/actions/utils/virtualCategories';

export function useInfiniteProducts({
  query,
  initialProducts,
  initialHasMore,
  category,
  gender,
  color,
  sizes,
  sort,
}: {
  query?: string;
  initialProducts?: ProductCard[];
  initialHasMore?: boolean;
  category?: string;
  gender?: string;
  color?: string[];
  sizes?: string[];
  sort?: string;
}) {
  // t.ex 'price_desc' -> sort: 'price', order: 'desc'
  const {sort: sortField, order} = parseSortParam(sort);

  const {actualCategory, isNewOnly} = parseCollectionSlug(category);

  return useInfiniteQuery({
    queryKey: ['products', {query, category, gender, color, sizes, sort}],
    queryFn: async ({
      pageParam,
    }: {
      pageParam?: {lastId: string; lastValue?: number | string};
    }) => {
      const result = await getInfiniteProducts({
        query,
        lastId: pageParam?.lastId || null,
        lastValue: pageParam?.lastValue || null,
        limit: 8,
        category: actualCategory,
        gender: gender || null,
        color: color || [],
        sizes: sizes || [],
        sort: sortField,
        order,
        isNewOnly,
      });
      return {
        products: result.products,
        hasMore: result.hasMore,
      };
    },

    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore || !lastPage.products.length) return undefined;

      const lastProduct = lastPage.products[lastPage.products.length - 1];
      let lastValue: number | string | undefined;

      if (sortField === 'price') {
        lastValue = lastProduct.price;
      } else if (sortField === 'name') {
        lastValue = lastProduct.name;
      }

      return {
        lastId: lastProduct.id,
        lastValue,
      };
    },

    initialPageParam: undefined,
    // hydrate with SSR data (including empty lists to avoid redundant client fetch)
    initialData: Array.isArray(initialProducts)
      ? {
          pageParams: [undefined],
          pages: [
            {
              products: initialProducts,
              hasMore: initialHasMore ?? false,
            },
          ],
        }
      : undefined,
  });
}
