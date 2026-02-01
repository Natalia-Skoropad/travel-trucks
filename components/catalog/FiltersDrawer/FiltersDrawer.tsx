'use client';

import { useCallback, useEffect } from 'react';
import CloseButton from '@/components/common/CloseButton/CloseButton';
import css from './FiltersDrawer.module.css';

//===========================================================================

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

//===========================================================================

function FiltersDrawer({ isOpen, onClose, children }: Props) {
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Filters"
    >
      <div className={css.panel} role="document">
        <header className={css.header}>
          <h2 className={css.title}>Filters</h2>
          <CloseButton onClick={onClose} />
        </header>

        <div className={css.content}>{children}</div>
      </div>
    </div>
  );
}

export default FiltersDrawer;
