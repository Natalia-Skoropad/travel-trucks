import type { Metadata } from 'next';
import { fetchCampers } from '@/lib/api/campersApi';
import { CATALOG_LIMIT } from '@/lib/constants/pagination';

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

  const data = await fetchCampers({
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
  });

  return (
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
  );
}

export default CatalogPage;
