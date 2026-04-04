import MainCart from '@/components/cart/CartPage';
import {Metadata} from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Your cart',
  };
}

export default async function CartPage() {
  return (
    <div className='w-full flex min-h-[calc(100vh-350px)] justify-center  mx-auto py-8  pr-0 pl-0  lg:pr-7'>
      <div className='w-full '>
        <MainCart />
      </div>
    </div>
  );
}
