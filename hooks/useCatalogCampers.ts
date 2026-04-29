'use client';

import { useMemo } from 'react';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import { fetchCampers } from '@/lib/api/campersApi';
import { CATALOG_PER_PAGE } from '@/lib/constants/pagination';
import type { CatalogFiltersValue } from '@/lib/constants/catalogFilters';
import { campersQueryKeys } from '@/lib/queryKeys/campersQueryKeys';
import { buildCampersQuery } from '@/lib/utils/catalogQuery';

//===========================================================================

export function useCatalogCampers(filters: CatalogFiltersValue) {
  const query = useInfiniteQuery({
    queryKey: campersQueryKeys.list(filters, CATALOG_PER_PAGE),
    queryFn: ({ pageParam }) =>
      fetchCampers(
        buildCampersQuery(filters, Number(pageParam), CATALOG_PER_PAGE)
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const campers = useMemo(
    () => query.data?.pages.flatMap((page) => page.campers) ?? [],
    [query.data]
  );

  const total = query.data?.pages[0]?.total ?? 0;
  const totalPages = query.data?.pages[0]?.totalPages ?? 0;

  return {
    ...query,
    campers,
    total,
    totalPages,
  };
}
