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

import { buildCatalogMetadata } from '@/lib/seo/catalogSeo';
import {
  buildCamperMetadata,
  buildCamperNotFoundMetadata,
} from '@/lib/seo/camperSeo';

import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import CatalogPageClient from '../CatalogPageClient';
import CatalogSeoText from '@/components/catalog/CatalogSeoText/CatalogSeoText';

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

async function generateCatalogPageMetadata(
  segments?: string[]
): Promise<Metadata> {
  const { filters, page } = parseCatalogSegments(segments);

  return buildCatalogMetadata({
    filters,
    page,
  });
}

async function generateCamperPageMetadata(id: string): Promise<Metadata> {
  try {
    const camper = await fetchCamperByIdFromServer(id);

    return buildCamperMetadata(camper);
  } catch {
    return buildCamperNotFoundMetadata();
  }
}

//===========================================================================

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { segments } = await params;

  if (isCatalogDetailsPath(segments)) {
    return generateCamperPageMetadata(segments![0]);
  }

  return generateCatalogPageMetadata(segments);
}

//===========================================================================

async function CatalogListPage({ segments }: { segments?: string[] }) {
  const { filters, page } = parseCatalogSegments(segments);

  const queryClient = new QueryClient();

  const initialData = await queryClient.fetchInfiniteQuery({
    queryKey: campersQueryKeys.list(filters, CATALOG_PER_PAGE),
    queryFn: ({ pageParam }) =>
      fetchCampersFromServer(
        buildCatalogApiParams(filters, Number(pageParam), CATALOG_PER_PAGE)
      ),
    initialPageParam: page,
    getNextPageParam: (lastPage: CampersResponse) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const firstPage = initialData.pages[0];
  const hasCampers = Boolean(firstPage?.campers.length);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <div className="container">
          <Breadcrumbs items={buildCatalogBreadcrumbs(filters, page)} />

          <CatalogPageClient initialFilters={filters} />

          {page === 1 && hasCampers ? (
            <CatalogSeoText filters={filters} />
          ) : null}
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
        queryKey: campersQueryKeys.detail(id),
        queryFn: () => fetchCamperByIdFromServer(id),
      }),
      queryClient.fetchQuery({
        queryKey: campersQueryKeys.reviews(id),
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
