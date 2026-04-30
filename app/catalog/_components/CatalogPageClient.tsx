'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Filter } from 'lucide-react';

import type { CamperDetails, CamperListItem } from '@/types/camper';
import { fetchCamperById } from '@/lib/api/campersApi';
import type { CatalogFiltersValue } from '@/lib/constants/catalogFilters';
import { LOCATIONS } from '@/lib/constants/locations';

import { useCatalogCampers } from '@/hooks/useCatalogCampers';
import { useCatalogFilters } from '@/hooks/useCatalogFilters';
import { useFavorites } from '@/hooks/useFavorites';

import CatalogFilters from '@/components/catalog/CatalogFilters/CatalogFilters';
import CatalogPageShell from '@/components/catalog/CatalogPageShell/CatalogPageShell';
import CampersList from '@/components/catalog/CampersList/CampersList';
import CatalogSearch from '@/components/catalog/CatalogSearch/CatalogSearch';
import CatalogSort from '@/components/catalog/CatalogSort/CatalogSort';
import Button from '@/components/common/Button/Button';
import Pagination from '@/components/common/Pagination/Pagination';
import Tabs from '@/components/common/Tabs/Tabs';

import css from './CatalogPageClient.module.css';

//===============================================================

type Props = {
  initialFilters: CatalogFiltersValue;
  initialPage: number;
};

type TabValue = 'all' | 'favorites';

//===============================================================

function uniqSorted(list: string[]) {
  return Array.from(new Set(list)).sort((a, b) => a.localeCompare(b));
}

//===============================================================

function mapCamperDetailsToListItem(camper: CamperDetails): CamperListItem {
  return {
    id: camper.id,
    name: camper.name,
    price: camper.price,
    rating: camper.rating,
    location: camper.location,
    form: camper.form,
    length: camper.length,
    width: camper.width,
    height: camper.height,
    tank: camper.tank,
    consumption: camper.consumption,
    transmission: camper.transmission,
    engine: camper.engine,
    amenities: camper.amenities,
    totalReviews: camper.totalReviews,
    coverImage:
      camper.gallery?.[0]?.thumb ?? camper.gallery?.[0]?.original ?? '',
  };
}

//===============================================================

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

  const updateFilters = (patch: Partial<CatalogFiltersValue>) => {
    setFilters({
      ...filters,
      ...patch,
      equipment: patch.equipment ?? { ...filters.equipment },
    });
  };

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

        const clean = results
          .filter((item): item is CamperDetails => item !== null)
          .map(mapCamperDetailsToListItem);

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

  const desktopFilters = (
    <CatalogFilters
      value={filters}
      onChange={setFilters}
      onReset={resetFilters}
      isResetDisabled={!filtersApplied || isCatalogBusy}
      isFiltering={isCatalogBusy}
      locationSuggestions={locationSuggestions}
      showSearch
      showSort={false}
    />
  );

  const drawerFilters = (
    <CatalogFilters
      value={filters}
      onChange={setFilters}
      onReset={resetFilters}
      isResetDisabled={!filtersApplied || isCatalogBusy}
      isFiltering={isCatalogBusy}
      locationSuggestions={locationSuggestions}
      showSearch={false}
      showSort
    />
  );

  return (
    <CatalogPageShell
      desktopFilters={desktopFilters}
      drawerFilters={drawerFilters}
      onOpenFilters={(open) => {
        openFiltersRef.current = open;
      }}
    >
      <div className={css.catalogTop}>
        <Tabs
          items={tabs}
          value={tab}
          onChange={setTab}
          ariaLabel="Catalog tabs"
          renderPanel={() => <span aria-hidden="true" />}
        />

        <CatalogSort
          value={filters.sort}
          onChange={(sort) => updateFilters({ sort })}
          className={css.sortDesktop}
        />
      </div>

      <div className={css.mobileSearchRow}>
        <CatalogSearch
          id="catalog-search-mobile"
          value={filters.search}
          onChange={(search) => updateFilters({ search })}
          className={css.mobileSearch}
        />

        <Button
          variant="filter"
          iconLeft={<Filter className={css.filterBtn} />}
          onClick={() => openFiltersRef.current?.()}
          className={css.mobileFilterButton}
        >
          Filters
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
