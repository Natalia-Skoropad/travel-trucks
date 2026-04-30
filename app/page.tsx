import Image from 'next/image';

import ButtonLink from '@/components/common/Button/ButtonLink';

import { ROUTES } from '@/lib/constants/routes';
import {
  DEFAULT_OG_ALT,
  DEFAULT_OG_IMAGE,
  DEFAULT_SITE_DESCRIPTION,
} from '@/lib/constants/metadata';
import { buildMetadata } from '@/lib/seo/buildMetadata';

import css from './shared-hero.module.css';

//===========================================================================

const HOME_TITLE = 'Campers of your dreams';

const HOME_DESCRIPTION =
  'Discover and rent campers for your next adventure. Browse the catalog, explore features, read reviews, and book your camper with TravelTrucks.';

//===========================================================================

export const metadata = buildMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION || DEFAULT_SITE_DESCRIPTION,
  path: ROUTES.HOME,
  image: DEFAULT_OG_IMAGE,
  imageAlt: DEFAULT_OG_ALT,
});

//===========================================================================

function Home() {
  return (
    <main className={`${css.page} ${css.homePage}`}>
      <Image
        src={DEFAULT_OG_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        className={css.bgImage}
      />

      <div className="container">
        <div className={`${css.heroContent} ${css.homeContent}`}>
          <h1 className={css.title}>Campers of your dreams</h1>

          <p className={css.text}>
            You can find everything you want in our catalog
          </p>

          <ButtonLink href={ROUTES.CATALOG}>View Now</ButtonLink>
        </div>
      </div>
    </main>
  );
}

export default Home;
