import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';

import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useEscapeToClose } from '@/hooks/useEscapeToClose';

import CloseButton from '@/components/common/CloseButton/CloseButton';

import css from './FiltersDrawer.module.css';

//===========================================================================

type Props = {
  children: ReactNode;
  onOpenFilters: (open: () => void) => void;
};

//===========================================================================

function FiltersDrawer({ children, onOpenFilters }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    onOpenFilters(open);
  }, [onOpenFilters, open]);

  useEscapeToClose(isOpen, close);
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className={css.root}>
      <button
        type="button"
        className={css.backdrop}
        aria-label="Close filters"
        onClick={close}
      />

      <aside
        className={css.drawer}
        aria-modal="true"
        role="dialog"
        aria-labelledby="filters-drawer-title"
      >
        <div className={css.header}>
          <h2 id="filters-drawer-title" className={css.title}>
            Filters
          </h2>

          <CloseButton onClick={close} />
        </div>

        <div className={css.body}>{children}</div>
      </aside>
    </div>
  );
}

export default FiltersDrawer;
