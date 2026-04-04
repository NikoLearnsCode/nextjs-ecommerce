import {Metadata} from 'next';
import CheckoutPage from '@/components/checkout/CheckoutPage';
import {redirect} from 'next/navigation';
import {auth} from '@/lib/auth';
import {getSessionId} from '@/utils/cookies';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Checkout',
  };
}

export default async function Checkout({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const isGuestCheckout = params.guest === 'true';
  const session_id = await getSessionId();
  const session = await auth();
  const user = session?.user;

  if (!user && !isGuestCheckout && session_id) {
    const callbackUrl = isGuestCheckout ? '/checkout?guest=true' : '/checkout';
    return redirect(
      `/log-in?callbackUrl=${encodeURIComponent(callbackUrl)}&source=checkout`
    );
  }

  return <CheckoutPage />;
}
