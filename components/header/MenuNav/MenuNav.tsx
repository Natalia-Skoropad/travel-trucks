'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import css from './MenuNav.module.css';

//===============================================================

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

//===============================================================

function MenuNav() {
  const pathname = usePathname();

  return (
    <nav className={css.menuNav} aria-label="Primary navigation">
      <ul className={css.menuList}>
        <li>
          <Link
            href="/"
            className={`${css.link} ${
              isActive(pathname, '/') ? css.active : ''
            }`}
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            href="/catalog"
            className={`${css.link} ${
              isActive(pathname, '/catalog') ? css.active : ''
            }`}
          >
            Catalog
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default MenuNav;
