import {auth} from '@/lib/auth';

// Allows local admin access without login if ADMIN_DEV_BYPASS=true (disabled in production)
export const ADMIN_DEV_BYPASS =
  process.env.NODE_ENV !== 'production' &&
  process.env.ADMIN_DEV_BYPASS === 'true';

export async function isAdmin(): Promise<boolean> {
  if (ADMIN_DEV_BYPASS) return true;
  const session = await auth();
  return session?.user?.role === 1;
}
