import AdminProvider from '@/context/AdminProvider';
import {getCategoriesWithChildren} from '@/actions/admin/admin.categories.actions';
import AdminUIWrapper from '@/components/admin/AdminUIWrapper';
import {auth} from '@/lib/auth';
import {redirect} from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user.role !== 1) {
    return redirect('/');
  }

  const categoryTree = await getCategoriesWithChildren();

  return (
    <AdminProvider categories={categoryTree}>
      <AdminUIWrapper>{children}</AdminUIWrapper>
    </AdminProvider>
  );
}
