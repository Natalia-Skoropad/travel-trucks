'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Filter } from 'lucide-react';

import type { CamperListItem } from '@/types/camper';
import { fetchCamperById } from '@/lib/api/campersApi';
import type { CatalogFiltersValue } from '@/lib/constants/catalogFilters';
import { LOCATIONS } from '@/lib/constants/locations';

import { useCatalogCampers } from '@/hooks/useCatalogCampers';
import { useCatalogFilters } from '@/hooks/useCatalogFilters';
import { useFavorites } from '@/hooks/useFavorites';

import CatalogFilters from '@/components/catalog/CatalogFilters/CatalogFilters';
import CatalogPageShell from '@/components/catalog/CatalogPageShell/CatalogPageShell';
import CampersList from '@/components/catalog/CampersList/CampersList';
import Button from '@/components/common/Button/Button';
import Pagination from '@/components/common/Pagination/Pagination';
import Tabs from '@/components/common/Tabs/Tabs';

import css from '@/components/catalog/CatalogPageShell/CatalogPageShell.module.css';

//===========================================================================

type Props = {
  initialFilters: CatalogFiltersValue;
  initialPage: number;
};

type TabValue = 'all' | 'favorites';

//===========================================================================

function uniqSorted(list: string[]) {
  return Array.from(new Set(list)).sort((a, b) => a.localeCompare(b));
}

//===========================================================================

function CatalogPageClient({ initialFilters, initialPage }: Props) {
  const openFiltersRef = useRef<(() => void) | null>(null);

  const {
    filters,
    effectiveFilters,
    page,
    setPage,
    setFilters,
    resetFilters,
    filtersApplied,
    isPending,
  } = useCatalogFilters(initialFilters, initialPage);

  const { campers, total, totalPages, isLoading, isFetching } =
    useCatalogCampers(effectiveFilters, page);

  const { favoriteIds, favoritesCount } = useFavorites();

  const [tab, setTab] = useState<TabValue>('all');
  const [favoriteItems, setFavoriteItems] = useState<CamperListItem[]>([]);
  const [isFavLoading, setIsFavLoading] = useState(false);

  //===========================================================================

  useEffect(() => {
    let cancelled = false;

    async function loadFavorites() {
      if (tab !== 'favorites') return;

      if (!favoriteIds.length) {
        setFavoriteItems([]);
        return;
      }

      setIsFavLoading(true);

      try {
        const results = await Promise.all(
          favoriteIds.map(async (id) => {
            try {
              return await fetchCamperById(id);
            } catch {
              return null;
            }
          })
        );

        const clean = results.filter((item) => item !== null);

        if (!cancelled) {
          setFavoriteItems(clean);
        }
      } finally {
        if (!cancelled) {
          setIsFavLoading(false);
        }
      }
    }

    void loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [tab, favoriteIds]);

  //===========================================================================

  const visibleItems = tab === 'favorites' ? favoriteItems : campers;

  const tabs = [
    { value: 'all' as const, label: 'All', count: total },
    {
      value: 'favorites' as const,
      label: 'Favorites',
      count:
        tab === 'favorites' && !isFavLoading
          ? favoriteItems.length
          : favoritesCount,
    },
  ];

  const locationSuggestions = useMemo(() => {
    const fromCards = uniqSorted(
      campers
        .map((camper) => (camper.location ?? '').trim())
        .filter((location) => location.length > 0)
    );

    const allowed = new Set<string>(LOCATIONS as readonly string[]);

    return fromCards.filter((location) => allowed.has(location));
  }, [campers]);

  const isCatalogBusy = isPending || isFetching;

  const filtersUI = (
    <CatalogFilters
      value={filters}
      onChange={setFilters}
      onReset={resetFilters}
      isResetDisabled={!filtersApplied || isCatalogBusy}
      isFiltering={isCatalogBusy}
      locationSuggestions={locationSuggestions}
    />
  );

  //===========================================================================

  return (
    <CatalogPageShell
      filters={filtersUI}
      onOpenFilters={(open) => {
        openFiltersRef.current = open;
      }}
    >
      <Tabs
        items={tabs}
        value={tab}
        onChange={setTab}
        ariaLabel="Catalog tabs"
        renderPanel={() => <span aria-hidden="true" />}
      />

      <div className={css.toolbar}>
        <Button
          variant="filter"
          iconLeft={<Filter className={css.filterBtn} />}
          onClick={() => openFiltersRef.current?.()}
        >
          All filters
        </Button>
      </div>

      <h1 className="visually-hidden">
        You can find everything you want in our catalog
      </h1>

      <div className={css.listWrap}>
        <CampersList
          campers={visibleItems}
          isLoading={
            tab === 'favorites' ? isFavLoading : isLoading && tab === 'all'
          }
          emptyText={
            tab === 'favorites'
              ? 'No favorites yet.'
              : 'No campers found for your request.'
          }
        />
      </div>

      {tab === 'all' ? (
        <Pagination
          page={page}
          totalPages={totalPages}
          disabled={isCatalogBusy}
          onPageChange={setPage}
        />
      ) : null}
    </CatalogPageShell>
  );
}

export default CatalogPageClient;
