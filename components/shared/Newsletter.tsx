'use client';
import {FloatingLabelInput} from './ui/floatingLabelInput';
import {Button} from './ui/button';

export default function Newsletter() {
  return (
    <section className='px-4'>
      <form>
        <div className=' sm:text-center py-14 max-w-md mx-auto'>
          <h2 className=' font-semibold mb-4 text-sm '>
            Get 10% off your next purchase when you sign up for our newsletter
          </h2>
          <div className=' gap-2 flex'>
            <FloatingLabelInput
              id='email'
              label='Email address'
              type='email'
              className='w-full'
              required
            />
            <Button
              variant='secondary'
              className='w-20 border-gray-500  hover:border-gray-600 h-auto mt-0'
            >
              Sign up
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
