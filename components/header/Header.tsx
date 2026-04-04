import type {NavLink} from '@/lib/types/category-types';
import HeaderClient from './HeaderClient';

export default function Header({navLinks}: {navLinks: NavLink[]}) {
  return <HeaderClient navLinks={navLinks} />;
}
