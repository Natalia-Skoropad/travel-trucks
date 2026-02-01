'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

import css from './Button.module.css';

//===============================================================

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?:
    | 'primary'
    | 'outline'
    | 'outlineRed'
    | 'secondary'
    | 'reset'
    | 'filter';
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

//===============================================================

function Button({
  variant = 'primary',
  className,
  type = 'button',
  iconLeft,
  iconRight,
  children,
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={clsx(
        css.button,
        variant === 'outline' && css.outline,
        variant === 'outlineRed' && css.outlineRed,
        variant === 'secondary' && css.secondary,
        variant === 'reset' && css.reset,
        variant === 'filter' && css.filter,
        className
      )}
      {...props}
    >
      {iconLeft && <span className={css.icon}>{iconLeft}</span>}
      <span className={css.label}>{children}</span>
      {iconRight && <span className={css.icon}>{iconRight}</span>}
    </button>
  );
}

export default Button;
