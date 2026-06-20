import {notFound} from 'next/navigation';
import {Suspense} from 'react';
import {getProductBySlug} from '@/actions/product.queries';
import type {Metadata} from 'next';
import ProductPage from '@/components/products/product-detail/ProductDetailPage';
import RelatedProducts from '@/components/products/product-detail/RelatedProducts';

interface PageProps {
  params: Promise<{slug: string}>;
  searchParams: Promise<{[key: string]: string | string[] | undefined}>;
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({params}: PageProps) {
  const {slug} = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <ProductPage
      product={product}
      related={
        <Suspense fallback={null}>
          <RelatedProducts product={product} />
        </Suspense>
      }
    />
  );
}
