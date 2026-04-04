import {auth} from '@/lib/auth';
import {redirect} from 'next/navigation';
import {notFound} from 'next/navigation';
import {Metadata} from 'next';
import OrderDetailContent from './OrderDetailContent';
import {getUserOrderById} from '@/actions/orders.actions';

type Props = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Order #${resolvedParams.orderId.substring(0, 8)}`,
  };
}

export default async function OrderDetailPage({params}: Props) {
  const resolvedParams = await params;
  const session = await auth();

  if (!session?.user) {
    return redirect('/log-in');
  }

  const {success, order, error} = await getUserOrderById(
    resolvedParams.orderId
  );

  if (!success || error || !order) {
    console.error('Error fetching order for page:', error);
    return notFound();
  }

  if (order.user_id !== session.user.id) {
    return notFound();
  }

  return <OrderDetailContent order={order} />;
}
