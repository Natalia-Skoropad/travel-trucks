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
  fetchCampersFromServer,
} from '@/lib/api/campersApi';
import { CATALOG_PER_PAGE } from '@/lib/constants/pagination';
import { campersQueryKeys } from '@/lib/queryKeys/campersQueryKeys';
import type { CampersResponse } from '@/types/catalog';
import {
  buildCatalogApiParams,
  buildCatalogBreadcrumbs,
  isCatalogDetailsPath,
  parseCatalogSegments,
} from '@/lib/utils/catalogSegments';
import { filtersToTitle } from '@/lib/utils/catalogUrl';

import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import CatalogPageClient from '../CatalogPageClient';

import CamperHero from '@/components/details/CamperHero/CamperHero';
import CamperDetailsBottom from '@/components/details/CamperDetailsBottom/CamperDetailsBottom';
import CamperPrevNextNav from '@/components/details/CamperPrevNextNav/CamperPrevNextNav';
import CamperPageClient from '../[id]/CamperPageClient';

//===========================================================================

type PageProps = {
  params: Promise<{
    segments?: string[];
  }>;
};

//===========================================================================

const SITE_URL = 'https://travel-trucks-five-liart.vercel.app';

//===========================================================================

async function generateCatalogMetadata(segments?: string[]): Promise<Metadata> {
  const { filters, page } = parseCatalogSegments(segments);
  const titleSuffix = filtersToTitle(filters);

  return {
    title:
      page > 1
        ? `Catalog — ${titleSuffix} — Page ${page}`
        : `Catalog — ${titleSuffix}`,
    description: `Browse campers: ${titleSuffix}. Find a camper for your next trip with TravelTrucks.`,
  };
}

async function generateCamperMetadata(id: string): Promise<Metadata> {
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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { segments } = await params;

  if (isCatalogDetailsPath(segments)) {
    return generateCamperMetadata(segments![0]);
  }

  return generateCatalogMetadata(segments);
}

//===========================================================================

async function CatalogListPage({ segments }: { segments?: string[] }) {
  const { filters, page } = parseCatalogSegments(segments);

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: campersQueryKeys.list(filters, CATALOG_PER_PAGE),
    queryFn: ({ pageParam }) =>
      fetchCampersFromServer(
        buildCatalogApiParams(filters, Number(pageParam), CATALOG_PER_PAGE)
      ),
    initialPageParam: page,
    getNextPageParam: (lastPage: CampersResponse) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <div className="container">
          <Breadcrumbs items={buildCatalogBreadcrumbs(filters, page)} />

          <CatalogPageClient initialFilters={filters} />
        </div>
      </main>
    </HydrationBoundary>
  );
}

async function CamperDetailsPage({ id }: { id: string }) {
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

//===========================================================================

async function CatalogSegmentsPage({ params }: PageProps) {
  const { segments } = await params;

  if (isCatalogDetailsPath(segments)) {
    return <CamperDetailsPage id={segments![0]} />;
  }

  return <CatalogListPage segments={segments} />;
}

export default CatalogSegmentsPage;
