'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NAV_ITEMS } from '@/lib/constants/navigation';

import css from './MenuNav.module.css';

//===========================================================================

function MenuNav() {
  const pathname = usePathname();

  return (
    <nav className={css.nav} aria-label="Main navigation">
      <ul className={css.list}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${css.link} ${isActive ? css.active : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MenuNav;
