'use client';

import { useRef, useState } from 'react';
import { Filter } from 'lucide-react';

import type { CatalogFiltersValue } from '@/lib/constants/catalogFilters';

import { buildCatalogSeoText } from '@/lib/seo/catalogSeo';

import { useCatalogCampers } from '@/hooks/useCatalogCampers';
import { useCatalogFilters } from '@/hooks/useCatalogFilters';
import { useFavorites } from '@/hooks/useFavorites';
import { useCatalogFilterOptions } from '@/hooks/useCatalogFilterOptions';
import { useFavoriteCampers } from '@/hooks/useFavoriteCampers';

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

function CatalogPageClient({ initialFilters, initialPage }: Props) {
  const openFiltersRef = useRef<(() => void) | null>(null);
  const filterOptions = useCatalogFilterOptions();

  const [tab, setTab] = useState<TabValue>('all');

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

  const { favoriteIds, favoritesCount, hasHydrated } = useFavorites();

  const {
    data: favoriteItems = [],
    isLoading: isFavLoading,
    isFetching: isFavFetching,
  } = useFavoriteCampers(favoriteIds, hasHydrated && tab === 'favorites');

  const updateFilters = (patch: Partial<CatalogFiltersValue>) => {
    setFilters({
      ...filters,
      ...patch,
      equipment: patch.equipment ?? { ...filters.equipment },
    });
  };

  const visibleItems = tab === 'favorites' ? favoriteItems : campers;

  const favoriteTabCount =
    tab === 'favorites' && hasHydrated && !isFavLoading
      ? favoriteItems.length
      : favoritesCount;

  const tabs = [
    { value: 'all' as const, label: 'All', count: total },
    {
      value: 'favorites' as const,
      label: 'Favorites',
      count: hasHydrated ? favoriteTabCount : 0,
    },
  ];

  const isCatalogBusy = isPending || isFetching;
  const isResetBusy = filtersApplied && isCatalogBusy;
  const catalogSeoTitle = buildCatalogSeoText(effectiveFilters).title;

  const desktopFilters = (
    <CatalogFilters
      value={filters}
      onChange={setFilters}
      onReset={resetFilters}
      isResetDisabled={!filtersApplied || isResetBusy}
      isFiltering={isResetBusy}
      showSearch
      showSort={false}
      forms={filterOptions.forms}
      transmissions={filterOptions.transmissions}
      engines={filterOptions.engines}
    />
  );

  const drawerFilters = (
    <CatalogFilters
      value={filters}
      onChange={setFilters}
      onReset={resetFilters}
      isResetDisabled={!filtersApplied || isResetBusy}
      isFiltering={isResetBusy}
      showSearch={false}
      showSort
      forms={filterOptions.forms}
      transmissions={filterOptions.transmissions}
      engines={filterOptions.engines}
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
      <h1 className={css.pageTitle}>{catalogSeoTitle}</h1>

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

      <div className={css.listWrap}>
        <CampersList
          campers={visibleItems}
          isLoading={
            tab === 'favorites'
              ? !hasHydrated || isFavLoading || isFavFetching
              : isLoading && tab === 'all'
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
