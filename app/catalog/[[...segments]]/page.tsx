import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';

import { CATALOG_PER_PAGE } from '@/lib/constants/pagination';
import { fetchCampersFromServer } from '@/lib/api/campersApi';
import { campersQueryKeys } from '@/lib/queryKeys/campersQueryKeys';

import {
  buildCatalogApiParams,
  buildCatalogBreadcrumbs,
  isCatalogDetailsPath,
  parseCatalogSegments,
} from '@/lib/utils/catalogSegments';

import { buildCatalogMetadata } from '@/lib/seo/catalogSeo';

import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';

import CatalogPageClient from './CatalogPageClient';

//===========================================================================

type PageProps = {
  params: Promise<{
    segments?: string[];
  }>;
};

//===========================================================================

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { segments } = await params;

  if (isCatalogDetailsPath(segments)) {
    const slug = segments![0];

    return {
      title: 'Redirecting camper page',
      alternates: {
        canonical: `/${slug}`,
      },
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const { filters, page } = parseCatalogSegments(segments);

  return buildCatalogMetadata({
    filters,
    page,
  });
}

//===========================================================================

async function CatalogSegmentsPage({ params }: PageProps) {
  const { segments } = await params;

  if (isCatalogDetailsPath(segments)) {
    permanentRedirect(`/${segments![0]}`);
  }

  const { filters, page } = parseCatalogSegments(segments);

  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: campersQueryKeys.list(filters, page, CATALOG_PER_PAGE),
    queryFn: () =>
      fetchCampersFromServer(
        buildCatalogApiParams(filters, page, CATALOG_PER_PAGE)
      ),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <div className="container">
          <Breadcrumbs items={buildCatalogBreadcrumbs(filters, page)} />

          <CatalogPageClient initialFilters={filters} initialPage={page} />
        </div>
      </main>
    </HydrationBoundary>
  );
}

export default CatalogSegmentsPage;
