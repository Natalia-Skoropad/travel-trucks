'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { fetchCampers } from '@/lib/api/campersApi';
import { CATALOG_PER_PAGE } from '@/lib/constants/pagination';
import type { CatalogFiltersValue } from '@/lib/constants/catalogFilters';
import { campersQueryKeys } from '@/lib/queryKeys/campersQueryKeys';
import { buildCatalogApiParams } from '@/lib/utils/catalogSegments';

//===========================================================================

export function useCatalogCampers(filters: CatalogFiltersValue, page: number) {
  const query = useQuery({
    queryKey: campersQueryKeys.list(filters, page, CATALOG_PER_PAGE),
    queryFn: () =>
      fetchCampers(buildCatalogApiParams(filters, page, CATALOG_PER_PAGE)),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    campers: query.data?.campers ?? [],
    total: query.data?.total ?? 0,
    totalPages: query.data?.totalPages ?? 0,
    currentPage: query.data?.page ?? page,
  };
}
