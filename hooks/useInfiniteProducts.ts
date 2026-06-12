'use client';

import {ProductCard} from '@/lib/types/db-types';
import type {SearchMode} from '@/lib/types/query-types';
import {getInfiniteProducts} from '@/actions/product.actions';
import {useInfiniteQuery} from '@tanstack/react-query';
import {parseSortParam} from '@/utils/filterSort';
import {parseCollectionSlug} from '@/actions/utils/virtualCategories';

export function useInfiniteProducts({
  query,
  initialProducts,
  initialHasMore,
  initialSearchMode,
  category,
  gender,
  color,
  sizes,
  sort,
}: {
  query?: string;
  initialProducts?: ProductCard[];
  initialHasMore?: boolean;
  /** Mode the SSR first page was fetched with, so page 2 continues it. */
  initialSearchMode?: SearchMode;
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
      pageParam?: {
        lastId: string;
        lastValue?: number | string;
        searchMode?: SearchMode;
      };
    }) => {
      const result = await getInfiniteProducts({
        query,
        lastId: pageParam?.lastId || null,
        lastValue: pageParam?.lastValue ?? null,
        limit: 8,
        category: actualCategory,
        gender: gender || null,
        color: color || [],
        sizes: sizes || [],
        sort: sortField,
        order,
        isNewOnly,
        searchMode: pageParam?.searchMode,
      });
      return {
        products: result.products,
        hasMore: result.hasMore,
        searchMode: result.searchMode,
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
      } else if (query) {
        // Relevance-sorted search: cursor carries the rank score
        lastValue = lastProduct.rank;
      }

      return {
        lastId: lastProduct.id,
        lastValue,
        searchMode: lastPage.searchMode,
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
              searchMode: initialSearchMode,
            },
          ],
        }
      : undefined,
  });
}
