'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';

import CompanyLogo from '@/components/header/CompanyLogo/CompanyLogo';
import MenuNav from '@/components/header/MenuNav/MenuNav';
import MobileOffcanvas from '@/components/header/MobileOffcanvas/MobileOffcanvas';

import css from './Header.module.css';

//===============================================================

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openMenu = () => setIsMobileMenuOpen(true);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={css.header}>
      <div className={`container ${css.inner}`}>
        <CompanyLogo />

        <button
          type="button"
          onClick={openMenu}
          aria-label="Open navigation"
          className={css.menuToggle}
        >
          <Menu className={css.menuIcon} />
        </button>

        <div className={css.desktopNav}>
          <MenuNav />
        </div>

        <MobileOffcanvas isOpen={isMobileMenuOpen} onClose={closeMenu} />
      </div>
    </header>
  );
}

export default Header;
