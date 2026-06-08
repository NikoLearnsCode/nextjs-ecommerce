import AdminProvider from '@/context/AdminProvider';
import {getCategoriesWithChildren} from '@/actions/admin/admin.categories.actions';
import AdminUIWrapper from '@/components/admin/AdminUIWrapper';
import {isAdmin} from '@/lib/admin-guard';
import {redirect} from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) {
    return redirect('/');
  }

  const categoryTree = await getCategoriesWithChildren();

  return (
    <AdminProvider categories={categoryTree}>
      <AdminUIWrapper>{children}</AdminUIWrapper>
    </AdminProvider>
  );
}
