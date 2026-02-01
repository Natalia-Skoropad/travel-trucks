'use client';

import { useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import CompanyLogo from '@/components/header/CompanyLogo/CompanyLogo';
import MenuNav from '@/components/header/MenuNav/MenuNav';
import CloseButton from '@/components/common/CloseButton/CloseButton';

import css from './MobileOffcanvas.module.css';

//===============================================================

interface MobileOffcanvasProps {
  isOpen: boolean;
  onClose: () => void;
}

//===============================================================

function MobileOffcanvas({ isOpen, onClose }: MobileOffcanvasProps) {
  const pathname = usePathname();

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
    >
      <div className={css.panel} role="document">
        <div className={css.header}>
          <CompanyLogo />
          <CloseButton onClick={onClose} />
        </div>

        <MenuNav />
      </div>
    </div>
  );
}

export default MobileOffcanvas;
