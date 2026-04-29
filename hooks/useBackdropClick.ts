'use client';

import type { MouseEvent } from 'react';

//===========================================================================

export function useBackdropClick(onClose: () => void) {
  return (event: MouseEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
}
