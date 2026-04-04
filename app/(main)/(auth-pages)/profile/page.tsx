import Link from 'next/link';
import {auth} from '@/lib/auth';
import {redirect} from 'next/navigation';
import {Metadata} from 'next';
import LogoutButton from '@/app/(main)/(auth-pages)/profile/LogoutButton';
import {ArrowRight} from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'My account',
  };
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    return redirect('/log-in');
  }

  const user = session?.user?.name?.split(' ')[0];

  return (
    <div className=' py-8  '>
      <h1 className='text-4xl  mb-16 mx-auto border-black w-fit '>
        Hi {user}
      </h1>
      <div className='flex flex-col justify-center items-center space-y-6'>
        <Link
          href='/profile/orders'
          className='text-base font-medium  hover:underline w-fit underline-offset-4 flex items-center gap-2 group'
        >
          My orders
          <ArrowRight
            size={16}
            strokeWidth={1.5}
            className='group-hover:translate-x-1  transition-transform duration-300'
          />
        </Link>

        <LogoutButton className='mt-10 h-6' />
      </div>
    </div>
  );
}
