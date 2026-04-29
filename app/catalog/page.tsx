import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import type { Metadata } from 'next';

import { fetchCampersFromServer } from '@/lib/api/campersApi';
import { CATALOG_PER_PAGE } from '@/lib/constants/pagination';
import { campersQueryKeys } from '@/lib/queryKeys/campersQueryKeys';
import { buildCampersQuery } from '@/lib/utils/catalogQuery';
import type { CampersResponse } from '@/types/catalog';

import {
  filtersFromSearchParams,
  filtersToTitle,
} from '@/lib/utils/catalogUrl';

import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import CatalogPageClient from './CatalogPageClient';

//===========================================================================

type SearchParams = Record<string, string | string[] | undefined>;

type PageProps = {
  searchParams: Promise<SearchParams>;
};

//===========================================================================

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const filters = filtersFromSearchParams(sp);
  const titleSuffix = filtersToTitle(filters);

  return {
    title: `Catalog — ${titleSuffix}`,
    description: `Browse campers: ${titleSuffix}. Find a camper for your next trip with TravelTrucks.`,
  };
}

//===========================================================================

async function CatalogPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filters = filtersFromSearchParams(sp);

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: campersQueryKeys.list(filters, CATALOG_PER_PAGE),
    queryFn: ({ pageParam }) =>
      fetchCampersFromServer(
        buildCampersQuery(filters, Number(pageParam), CATALOG_PER_PAGE)
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage: CampersResponse) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <div className="container">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Catalog' }]}
          />

          <CatalogPageClient initialFilters={filters} />
        </div>
      </main>
    </HydrationBoundary>
  );
}

export default CatalogPage;
