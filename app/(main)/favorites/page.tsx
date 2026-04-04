import FavoritesPage from '@/components/favorites/FavoritesPage';
import {Metadata} from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Your favorites',
    description: 'Your saved favorites',
  };
}

export default async function Favorites() {
  return (
    <div className='w-full flex justify-center  mx-auto py-8 min-h-[calc(100vh-350px)] '>
      <div className='w-full'>
        <FavoritesPage />
      </div>
    </div>
  );
}
