'use client';

import clsx from 'clsx';
import SvgIcon from '@/components/common/SvgIcon/SvgIcon';
import css from './FavoriteButton.module.css';

//===============================================================

type Props = {
  isActive: boolean;
  onToggle: () => void;
  className?: string;
  size?: 'md' | 'lg';
};

//===============================================================

function FavoriteButton({ isActive, onToggle, className, size = 'lg' }: Props) {
  return (
    <button
      type="button"
      className={clsx(css.btn, css[size], isActive && css.active, className)}
      aria-pressed={isActive}
      aria-label={isActive ? 'Remove from favorites' : 'Add to favorites'}
      onClick={onToggle}
    >
      <SvgIcon name="icon-heart" className={css.icon} />
    </button>
  );
}

export default FavoriteButton;
