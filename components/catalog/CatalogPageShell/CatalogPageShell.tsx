'use client';

import type { ReactNode } from 'react';

import FiltersDrawer from '@/components/catalog/FiltersDrawer/FiltersDrawer';

import css from './CatalogPageShell.module.css';

//===========================================================================

type Props = {
  children: ReactNode;
  desktopFilters: ReactNode;
  drawerFilters: ReactNode;
  onOpenFilters: (open: () => void) => void;
};

//===========================================================================

function CatalogPageShell({
  children,
  desktopFilters,
  drawerFilters,
  onOpenFilters,
}: Props) {
  return (
    <div className={css.layout}>
      <aside className={css.sidebar}>{desktopFilters}</aside>

      <section className={css.content}>
        <FiltersDrawer onOpenFilters={onOpenFilters}>
          {drawerFilters}
        </FiltersDrawer>

        {children}
      </section>
    </div>
  );
}

export default CatalogPageShell;
