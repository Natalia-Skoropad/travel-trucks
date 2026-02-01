import type { Metadata } from 'next';
import { fetchCamperById } from '@/lib/api/campersApi';

import CamperHero from '@/components/details/CamperHero/CamperHero';
import CamperDetailsBottom from '@/components/details/CamperDetailsBottom/CamperDetailsBottom';
import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import CamperPrevNextNav from '@/components/details/CamperPrevNextNav/CamperPrevNextNav';

import CamperPageClient from './CamperPageClient';

//===============================================================

type PageProps = {
  params: Promise<{ id: string }>;
};

//===============================================================

const SITE_URL = 'https://travel-trucks.vercel.app';

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const camper = await fetchCamperById(id);
  const title = camper.name;

  const locationPart = camper.location ? ` Location: ${camper.location}.` : '';
  const baseDesc =
    camper.description?.trim() ||
    'Explore camper features, read reviews, and book your next trip with TravelTrucks.';

  const description = `${baseDesc}${locationPart}`;
  const canonicalUrl = `${SITE_URL}/catalog/${id}`;
  const ogImage = camper.gallery?.[0]?.original || '/background-picture.jpg';

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'TravelTrucks',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: camper.name || 'TravelTrucks camper',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

//===============================================================

async function CamperDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const camper = await fetchCamperById(id);

  return (
    <main className="container">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Catalog', href: '/catalog' },
          { label: camper.name },
        ]}
      />

      <CamperPrevNextNav currentId={id} />

      <CamperPageClient camperId={id} title={camper.name} />

      <CamperHero camper={camper} />
      <CamperDetailsBottom camper={camper} />
    </main>
  );
}

export default CamperDetailsPage;
