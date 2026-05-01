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
  'Discover TravelTrucks — a camper rental catalog where you can browse vehicles, compare features, check reviews, save favorites, and book the right camper for your next road trip.';

//===========================================================================

export const metadata = buildMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION || DEFAULT_SITE_DESCRIPTION,
  path: ROUTES.HOME,
  image: DEFAULT_OG_IMAGE,
  imageAlt: DEFAULT_OG_ALT,
});

//===========================================================================

const FEATURES = [
  {
    title: 'Smart catalog',
    text: 'Browse campers by location, vehicle form, transmission, engine type, and equipment.',
  },
  {
    title: 'Detailed camper pages',
    text: 'Explore photos, specifications, reviews, ratings, and booking details before making a choice.',
  },
  {
    title: 'Favorites list',
    text: 'Save campers you like and return to them later without losing your shortlist.',
  },
];

const STATS = [
  { value: '20+', label: 'campers in catalog' },
  { value: '9', label: 'equipment filters' },
  { value: '4', label: 'vehicle forms' },
];

//===========================================================================

function Home() {
  return (
    <main className={`${css.page} ${css.homePage}`}>
      <Image
        src={DEFAULT_OG_IMAGE}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className={css.bgImage}
      />

      <div className={css.overlay} />

      <div className="container">
        <section className={css.homeHero} aria-labelledby="home-title">
          <div className={css.homeContent}>
            <p className={css.eyebrow}>Camper rental made simple</p>

            <h1 id="home-title" className={css.title}>
              Campers of your dreams
            </h1>

            <p className={css.text}>
              TravelTrucks helps you find the right camper for your next road
              trip. Compare vehicles, check equipment, read reviews, save your
              favorites, and send a booking request in a few clicks.
            </p>

            <div className={css.actions}>
              <ButtonLink href={ROUTES.CATALOG}>View Now</ButtonLink>
            </div>
          </div>

          <aside className={css.infoPanel} aria-label="TravelTrucks features">
            <div className={css.panelHeader}>
              <p className={css.panelKicker}>Why TravelTrucks?</p>
              <h2 className={css.panelTitle}>
                Everything you need to choose confidently
              </h2>
            </div>

            <ul className={css.features}>
              {FEATURES.map((feature) => (
                <li key={feature.title} className={css.feature}>
                  <span className={css.featureMark} aria-hidden="true">
                    ✓
                  </span>

                  <div>
                    <h3 className={css.featureTitle}>{feature.title}</h3>
                    <p className={css.featureText}>{feature.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <ul className={css.stats} aria-label="TravelTrucks quick facts">
              {STATS.map((item) => (
                <li key={item.label} className={css.stat}>
                  <strong className={css.statValue}>{item.value}</strong>
                  <span className={css.statLabel}>{item.label}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default Home;
