import type { Metadata } from 'next';

import ButtonLink from '@/components/common/Button/ButtonLink';
import css from './not-found.module.css';

//===============================================================

export const metadata: Metadata = {
  title: '404 | Page not found',
  description:
    'The page you are looking for does not exist. Return to the TravelTrucks homepage.',
};

//===============================================================

function NotFound() {
  return (
    <main className={css.page}>
      <div className="container">
        <div className={css.heroContent}>
          <span className={css.code}>404</span>

          <h1 className={css.title}>Oops… page not found</h1>
          <p className={css.text}>
            This route took a wrong turn. Let’s get you back to the catalog and
            find a camper you’ll actually enjoy.
          </p>

          <ButtonLink href="/">Go home</ButtonLink>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
