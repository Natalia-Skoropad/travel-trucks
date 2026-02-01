'use client';

import { useEffect } from 'react';
import Button from '@/components/common/Button/Button';
import ButtonLink from '@/components/common/Button/ButtonLink';

import css from './error.module.css';

//===============================================================

type Props = {
  error: Error;
  reset: () => void;
};

//===============================================================

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={css.page}>
      <div className={css.overlay} />

      <div className="container">
        <div className={css.heroContent}>
          <span className={css.code}>Error</span>

          <h1 className={css.title}>Something went wrong</h1>

          <p className={css.text}>
            We couldn’t load this page right now. Try again, or return to the
            homepage.
          </p>

          <ul className={css.actions}>
            <li>
              <Button type="button" onClick={reset} variant="outline">
                Try again
              </Button>
            </li>
            <li>
              <ButtonLink href="/">Go home</ButtonLink>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
