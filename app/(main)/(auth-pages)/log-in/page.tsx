import type {Metadata} from 'next';
import SignInForm from './sign-in-form';
import {Suspense} from 'react';
import {auth} from '@/lib/auth';
import {redirect} from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Log in',
  };
}

export default async function Login() {
  const session = await auth();

  if (session?.user) {
    return redirect('/profile');
  }
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
