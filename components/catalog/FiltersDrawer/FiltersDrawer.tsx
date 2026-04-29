import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useEscapeToClose } from '@/hooks/useEscapeToClose';

import css from './FiltersDrawer.module.css';

//===========================================================================

type Props = {
  children: ReactNode;
  onOpenFilters: (open: () => void) => void;
};

//===========================================================================

function FiltersDrawer({ children, onOpenFilters }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    onOpenFilters(open);
  }, [onOpenFilters, open]);

  useEffect(() => {
    if (!isOpen) return;

    const timeoutId = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isOpen]);

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

          <button
            ref={closeButtonRef}
            type="button"
            className={css.closeButton}
            aria-label="Close filters"
            onClick={close}
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        <div className={css.body}>{children}</div>
      </aside>
    </div>
  );
}

export default FiltersDrawer;
