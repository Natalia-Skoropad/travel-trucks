'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import type { CatalogFiltersValue } from '@/lib/constants/catalogFilters';
import { DEFAULT_CATALOG_FILTERS } from '@/lib/constants/catalogDefaults';
import { buildCatalogPath } from '@/lib/utils/catalogSegments';
import { isCatalogFiltersApplied } from '@/lib/utils/catalogQuery';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

//===========================================================================

function cloneFilters(filters: CatalogFiltersValue): CatalogFiltersValue {
  return {
    ...filters,
    equipment: { ...filters.equipment },
  };
}

function resetOnlyCatalogFilters(
  filters: CatalogFiltersValue
): CatalogFiltersValue {
  return {
    ...filters,
    location: '',
    form: '',
    engine: '',
    transmission: '',
    equipment: {},
  };
}

//===========================================================================

export function useCatalogFilters(
  initialFilters: CatalogFiltersValue,
  initialPage = 1
) {
  const router = useRouter();

  const [filters, setFiltersState] = useState<CatalogFiltersValue>(() =>
    cloneFilters(initialFilters ?? DEFAULT_CATALOG_FILTERS)
  );

  const [page, setPageState] = useState(initialPage);
  const [isPending, startTransition] = useTransition();

  const debouncedSearch = useDebouncedValue(filters.search, 450);
  const effectiveSearch = filters.search.trim() ? debouncedSearch : '';

  const debouncedLocation = useDebouncedValue(filters.location, 450);
  const effectiveLocation = filters.location.trim() ? debouncedLocation : '';

  const effectiveFilters = useMemo<CatalogFiltersValue>(
    () => ({
      ...filters,
      search: effectiveSearch,
      location: effectiveLocation,
      equipment: { ...filters.equipment },
    }),
    [filters, effectiveSearch, effectiveLocation]
  );

  const lastHrefRef = useRef(buildCatalogPath(effectiveFilters, page));

  useEffect(() => {
    const href = buildCatalogPath(effectiveFilters, page);

    if (href === lastHrefRef.current) return;

    lastHrefRef.current = href;

    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }, [effectiveFilters, page, router]);

  const setFilters = (next: CatalogFiltersValue) => {
    setPageState(1);
    setFiltersState(cloneFilters(next));
  };

  const setPage = (nextPage: number) => {
    setPageState(nextPage);
  };

  const resetFilters = () => {
    const next = resetOnlyCatalogFilters(filters);
    const href = buildCatalogPath(next, 1);

    setFiltersState(cloneFilters(next));
    setPageState(1);
    lastHrefRef.current = href;

    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  };

  return {
    filters,
    effectiveFilters,
    page,
    setPage,
    setFilters,
    resetFilters,
    filtersApplied: isCatalogFiltersApplied(filters),
    isPending,
  };
}
