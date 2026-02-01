'use client';

import { useState, useEffect } from 'react';

import FiltersDrawer from '@/components/catalog/FiltersDrawer/FiltersDrawer';
import css from './CatalogPageShell.module.css';

//===========================================================================

type Props = {
  children: React.ReactNode;
  filters: React.ReactNode;

  onOpenFilters?: (open: () => void) => void;
};

//===========================================================================

function CatalogPageShell({ children, filters, onOpenFilters }: Props) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const open = () => setIsDrawerOpen(true);
  const close = () => setIsDrawerOpen(false);

  useEffect(() => {
    onOpenFilters?.(open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={css.layout}>
        <aside className={css.sidebar}>{filters}</aside>
        <section className={css.content}>{children}</section>
      </div>

      <FiltersDrawer isOpen={isDrawerOpen} onClose={close}>
        {filters}
      </FiltersDrawer>
    </>
  );
}

export default CatalogPageShell;
