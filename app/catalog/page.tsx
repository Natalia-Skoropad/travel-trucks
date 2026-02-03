import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import type { Metadata } from 'next';
import { fetchCampers } from '@/lib/api/campersApi';
import { CATALOG_LIMIT } from '@/lib/constants/pagination';
import type { CampersResponse } from '@/types/camper';

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
    description: `Browse campers: ${titleSuffix}`,
  };
}

//===========================================================================

async function CatalogPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filters = filtersFromSearchParams(sp);

  const params = {
    page: 1,
    limit: CATALOG_LIMIT,

    location: filters.location.trim() || undefined,
    form: filters.form || undefined,

    engine: filters.engine || undefined,
    transmission: filters.transmission || undefined,

    ...Object.fromEntries(
      Object.entries(filters.equipment)
        .filter(([, v]) => v)
        .map(([k]) => [k, true])
    ),
  };

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['campers', params],
    queryFn: () => fetchCampers(params),
  });

  const data = queryClient.getQueryData<CampersResponse>([
    'campers',
    params,
  ]) ?? {
    items: [],
    total: 0,
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <div className="container">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Catalog' }]}
          />

          <CatalogPageClient
            initialItems={data.items}
            initialTotal={data.total}
            initialFilters={filters}
          />
        </div>
      </main>
    </HydrationBoundary>
  );
}

export default CatalogPage;
