'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useBackdropClick } from '@/hooks/useBackdropClick';
import { useEscapeToClose } from '@/hooks/useEscapeToClose';

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
  const handleBackdropClick = useBackdropClick(onClose);

  useEscapeToClose(isOpen, onClose);
  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!isOpen) return null;

  return (
    <div
      className={css.backdrop}
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
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
