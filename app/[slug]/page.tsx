import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import {
  fetchCamperByIdFromServer,
  fetchCamperReviewsFromServer,
} from '@/lib/api/campersApi';

import {
  buildCamperMetadata,
  buildCamperNotFoundMetadata,
} from '@/lib/seo/camperSeo';

import { getCamperIdFromSlug, getCamperSlug } from '@/lib/utils/camperSlug';
import { campersQueryKeys } from '@/lib/queryKeys/campersQueryKeys';

import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import CamperHero from '@/components/details/CamperHero/CamperHero';
import CamperDetailsBottom from '@/components/details/CamperDetailsBottom/CamperDetailsBottom';
import CamperPrevNextNav from '@/components/details/CamperPrevNextNav/CamperPrevNextNav';

import CamperPageClient from './CamperPageClient';

//===========================================================================

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

//===========================================================================

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const camperId = getCamperIdFromSlug(slug);

  if (!camperId) {
    return buildCamperNotFoundMetadata();
  }

  try {
    const camper = await fetchCamperByIdFromServer(camperId);

    return buildCamperMetadata(camper);
  } catch {
    return buildCamperNotFoundMetadata();
  }
}

//===========================================================================

async function CamperPage({ params }: Props) {
  const { slug } = await params;
  const camperId = getCamperIdFromSlug(slug);

  if (!camperId) {
    notFound();
  }

  const queryClient = new QueryClient();

  let camper: Awaited<ReturnType<typeof fetchCamperByIdFromServer>>;
  let reviews: Awaited<ReturnType<typeof fetchCamperReviewsFromServer>>;

  try {
    [camper, reviews] = await Promise.all([
      queryClient.fetchQuery({
        queryKey: campersQueryKeys.detail(camperId),
        queryFn: () => fetchCamperByIdFromServer(camperId),
      }),
      queryClient.fetchQuery({
        queryKey: campersQueryKeys.reviews(camperId),
        queryFn: () => fetchCamperReviewsFromServer(camperId),
      }),
    ]);
  } catch {
    notFound();
  }

  const canonicalSlug = getCamperSlug(camper);

  if (slug !== canonicalSlug) {
    redirect(`/${canonicalSlug}`);
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

        <CamperPrevNextNav currentId={camperId} />

        <CamperPageClient camperId={camperId} title={camper.name} />

        <CamperHero camper={camper} />

        <CamperDetailsBottom camper={camper} reviews={reviews} />
      </main>
    </HydrationBoundary>
  );
}

export default CamperPage;
