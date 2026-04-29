'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import type { CatalogFiltersValue } from '@/lib/constants/catalogFilters';
import { DEFAULT_CATALOG_FILTERS } from '@/lib/constants/catalogDefaults';
import { filtersToSearchParams } from '@/lib/utils/catalogUrl';
import { isCatalogFiltersApplied } from '@/lib/utils/catalogQuery';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

//===========================================================================

function cloneFilters(filters: CatalogFiltersValue): CatalogFiltersValue {
  return {
    ...filters,
    equipment: { ...filters.equipment },
  };
}

function buildCatalogHref(filters: CatalogFiltersValue) {
  const query = filtersToSearchParams(filters).toString();

  return query ? `/catalog?${query}` : '/catalog';
}

//===========================================================================

export function useCatalogFilters(initialFilters: CatalogFiltersValue) {
  const router = useRouter();

  const [filters, setFiltersState] = useState<CatalogFiltersValue>(() =>
    cloneFilters(initialFilters ?? DEFAULT_CATALOG_FILTERS)
  );

  const [isPending, startTransition] = useTransition();

  const debouncedLocation = useDebouncedValue(filters.location, 450);
  const effectiveLocation = filters.location.trim() ? debouncedLocation : '';

  const effectiveFilters = useMemo<CatalogFiltersValue>(
    () => ({
      ...filters,
      location: effectiveLocation,
      equipment: { ...filters.equipment },
    }),
    [filters, effectiveLocation]
  );

  const lastHrefRef = useRef(buildCatalogHref(effectiveFilters));

  useEffect(() => {
    const href = buildCatalogHref(effectiveFilters);

    if (href === lastHrefRef.current) return;

    lastHrefRef.current = href;

    startTransition(() => {
      router.replace(href, { scroll: false });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    effectiveFilters.location,
    effectiveFilters.form,
    effectiveFilters.engine,
    effectiveFilters.transmission,
    JSON.stringify(effectiveFilters.equipment),
  ]);

  const setFilters = (next: CatalogFiltersValue) => {
    setFiltersState(cloneFilters(next));
  };

  const resetFilters = () => {
    const next = cloneFilters(DEFAULT_CATALOG_FILTERS);

    setFiltersState(next);
    lastHrefRef.current = '/catalog';

    startTransition(() => {
      router.replace('/catalog', { scroll: false });
    });
  };

  return {
    filters,
    effectiveFilters,
    setFilters,
    resetFilters,
    filtersApplied: isCatalogFiltersApplied(filters),
    isPending,
  };
}
