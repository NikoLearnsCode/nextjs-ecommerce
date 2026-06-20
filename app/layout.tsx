import type {Metadata, Viewport} from 'next';
import '@/styles/globals.css';

import {Arimo} from 'next/font/google';
import AuthProvider from '@/context/AuthProvider';
import {CartProvider} from '@/context/CartProvider';
import {FavoritesProvider} from '@/context/FavoritesProvider';

import QueryProvider from '@/context/QueryProvider';
import {auth} from '@/lib/auth';

import {NavigatedHistoryProvider} from '@/context/NavigatedHistoryProvider';
import {RouteFocusManager} from '@/components/shared/RouteFocusManager';
import {Toaster} from 'sonner';
import {Analytics} from '@vercel/analytics/next';
import {SpeedInsights} from '@vercel/speed-insights/next';

const arimo = Arimo({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-arimo',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Next.js Demo',
  description: 'Next.js Demo',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang='en'>
      <body className={`${arimo.variable} font-arimo`}>
        <QueryProvider>
          <AuthProvider session={session}>
            <CartProvider>
              <FavoritesProvider>
                <NavigatedHistoryProvider>{children}</NavigatedHistoryProvider>
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
        <RouteFocusManager />
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
