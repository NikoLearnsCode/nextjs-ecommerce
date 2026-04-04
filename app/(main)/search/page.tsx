import type {Metadata} from 'next';
import {getInfiniteProducts} from '@/actions/product.actions';
import InfiniteProductList from '@/components/products/product-grid/InfiniteProductList';

type Props = {
  searchParams: Promise<{q?: string}>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const {q = ''} = await searchParams;

  return {
    title: q ? `Search results for "${q}" | NC` : 'Search products | NC',
    description: q
      ? `See our products matching "${q}"`
      : 'Search our product range',
  };
}

export default async function SearchPage({searchParams}: Props) {
  const {q = ''} = await searchParams;

  const result = q
    ? await getInfiniteProducts({
        query: q,
        limit: 8,
        includeCount: true,
      })
    : {products: [], hasMore: false};

  if (!result.products || result.products.length === 0) {
    return (
      <div className='flex items-center justify-center min-h-[calc(100vh-400px)]'>
        <div className='text-center max-w-full '>
          <p className='px-6 text-sm md:text-base font-medium break-words '>
            No products were found for{' '}
            <span className='italic font-medium'>"{q}"</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full flex justify-center py-4'>
      <div className='w-full'>
        <InfiniteProductList
          mode='search'
          query={q}
          initialHasMore={result.hasMore}
          initialProducts={result.products}
          totalCount={result.totalCount}
        />
      </div>
    </div>
  );
}
