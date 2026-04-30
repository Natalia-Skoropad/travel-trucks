'use client';

import { useEffect } from 'react';
import Image from 'next/image';

import Button from '@/components/common/Button/Button';
import ButtonLink from '@/components/common/Button/ButtonLink';

import css from './shared-hero.module.css';

//===============================================================

type Props = {
  error: Error;
  reset: () => void;
};

//===============================================================

function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={`${css.page} ${css.centeredPage}`}>
      <Image
        src="/error-page.jpg"
        alt=""
        fill
        sizes="100vw"
        priority
        className={`${css.bgImage} ${css.dimmedImage}`}
      />

      <div className="container">
        <div className={css.heroContent}>
          <span className={css.errorCode}>Error</span>

          <h1 className={css.title}>Something went wrong</h1>

          <p className={`${css.text} ${css.errorText}`}>
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

export default GlobalError;
