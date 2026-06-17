import {MAIN_CONTENT_ID} from '@/lib/focus';

export default function CheckoutLayout({children}: {children: React.ReactNode}) {
  return (
    <div className='min-h-[calc(100vh-250px)] w-full flex  '>
      <main
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        className='flex-1 w-full flex-col outline-none'
      >
        {children}
      </main>
    </div>
  );
}
