'use server';
import {getNavigationData} from '@/actions/navigation.actions';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import {MAIN_CONTENT_ID} from '@/lib/focus';
import {Toaster} from 'sonner';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navLinks = await getNavigationData();

  return (
    <div className='min-h-[calc(100vh-250px)] w-full flex flex-col'>
      <Header navLinks={navLinks} />
      <main
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        className='flex-1 w-full outline-none'
      >
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
