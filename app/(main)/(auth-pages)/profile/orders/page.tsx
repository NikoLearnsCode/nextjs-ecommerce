import {auth} from '@/lib/auth';
import {redirect} from 'next/navigation';
import {Metadata} from 'next';
import {getUserOrdersOverview} from '@/actions/orders.actions';
import OrdersClientContent from './OrdersContent';

export const metadata: Metadata = {
  title: 'My orders',
};

export default async function ProfileOrdersPage() {
  const session = await auth();

  if (!session?.user) {
    return redirect('/log-in');
  }

  const {success, orders, error} = await getUserOrdersOverview();

  if (!success || error) {
    console.error('Error fetching orders for page:', error);
    return (
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-2xl font-semibold mb-8'>My orders</h1>
        <p className='text-red-600'>
          Could not load your orders. Please try again later.
        </p>
      </div>
    );
  }

  return <OrdersClientContent orders={orders} />;
}
