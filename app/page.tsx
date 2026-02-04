import type { Metadata } from 'next';
import Image from 'next/image';

import ButtonLink from '@/components/common/Button/ButtonLink';
import css from './page.module.css';

//===========================================================================

const SITE_URL = 'https://travel-trucks-five-liart.vercel.app/';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'TravelTrucks | Campers of your dreams',
  description:
    'Discover and rent campers for your next adventure. Browse the catalog, explore features, read reviews, and book your camper with TravelTrucks.',

  openGraph: {
    title: 'TravelTrucks | Campers of your dreams',
    description:
      'Discover and rent campers for your next adventure. Browse the catalog, explore features, read reviews, and book your camper with TravelTrucks.',
    url: SITE_URL,
    siteName: 'TravelTrucks',
    images: [
      {
        url: '/background-picture.jpg',
        width: 1200,
        height: 630,
        alt: 'TravelTrucks camper rental',
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'TravelTrucks | Campers of your dreams',
    description:
      'Discover and rent campers for your next adventure with TravelTrucks.',
    images: ['/background-picture.jpg'],
  },
};

//===========================================================================

function Home() {
  return (
    <main className={css.page}>
      <Image
        src="/background-picture.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className={css.bgImage}
      />

      <div className="container">
        <div className={css.heroContent}>
          <h1 className={css.title}>Campers of your dreams</h1>
          <p className={css.text}>
            You can find everything you want in our catalog
          </p>

          <ButtonLink href="/catalog">View Now</ButtonLink>
        </div>
      </div>
    </main>
  );
}

export default Home;
