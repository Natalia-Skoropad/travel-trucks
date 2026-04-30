import Image from 'next/image';

import ButtonLink from '@/components/common/Button/ButtonLink';

import { ROUTES } from '@/lib/constants/routes';
import { buildMetadata } from '@/lib/seo/buildMetadata';

import css from './not-found.module.css';

//===============================================================

export const metadata = buildMetadata({
  title: '404 | Page not found',
  description:
    'The page you are looking for does not exist. Return to the TravelTrucks homepage.',
  path: '/404',
  image: '/404-page.jpg',
  imageAlt: 'TravelTrucks page not found',
  noIndex: true,
});

//===============================================================

function NotFound() {
  return (
    <main className={css.page}>
      <Image
        src="/404-page.jpg"
        alt=""
        fill
        sizes="100vw"
        priority
        className={css.bgImage}
      />

      <div className="container">
        <div className={css.heroContent}>
          <span className={css.code}>404</span>

          <h1 className={css.title}>Oops… page not found</h1>

          <p className={css.text}>
            This route took a wrong turn. Let’s get you back to the catalog and
            find a camper you’ll actually enjoy.
          </p>

          <ButtonLink href={ROUTES.HOME}>Go home</ButtonLink>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
