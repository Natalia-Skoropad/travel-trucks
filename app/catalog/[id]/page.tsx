import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  fetchCamperByIdFromServer,
  fetchCamperReviewsFromServer,
} from '@/lib/api/campersApi';

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

const SITE_URL = 'https://travel-trucks-five-liart.vercel.app';

//===============================================================

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const camper = await fetchCamperByIdFromServer(id);

    const title = camper.name;

    const baseDescription =
      camper.description?.trim() ||
      'Explore camper features, read reviews, and book your next trip with TravelTrucks.';

    const locationPart = camper.location
      ? ` Location: ${camper.location}.`
      : '';

    const description = `${baseDescription}${locationPart}`;
    const canonicalUrl = `${SITE_URL}/catalog/${id}`;

    const ogImage =
      camper.gallery?.[0]?.original ||
      camper.coverImage ||
      '/background-picture.jpg';

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
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
  } catch {
    return {
      title: 'Camper not found',
      description:
        'The camper you are looking for was not found on TravelTrucks.',
    };
  }
}

//===============================================================

async function CamperDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  let camper: Awaited<ReturnType<typeof fetchCamperByIdFromServer>>;
  let reviews: Awaited<ReturnType<typeof fetchCamperReviewsFromServer>>;

  try {
    [camper, reviews] = await Promise.all([
      queryClient.fetchQuery({
        queryKey: ['camper', id],
        queryFn: () => fetchCamperByIdFromServer(id),
      }),
      queryClient.fetchQuery({
        queryKey: ['camper-reviews', id],
        queryFn: () => fetchCamperReviewsFromServer(id),
      }),
    ]);
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
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

        <CamperDetailsBottom camper={camper} reviews={reviews} />
      </main>
    </HydrationBoundary>
  );
}

export default CamperDetailsPage;
