'use client';

import Link from 'next/link';
import clsx from 'clsx';

import css from './Button.module.css';

//===============================================================

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

//===============================================================

function ButtonLink({ href, children, className }: Props) {
  return (
    <Link href={href} className={clsx(css.button, className)}>
      {children}
    </Link>
  );
}

export default ButtonLink;
