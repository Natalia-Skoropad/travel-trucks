'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Filter } from 'lucide-react';

import type { Camper } from '@/types/camper';
import { fetchCamperById } from '@/lib/api/campersApi';
import type { CatalogFiltersValue } from '@/lib/constants/catalogFilters';
import { DEFAULT_CATALOG_FILTERS } from '@/lib/constants/catalogDefaults';
import { useCatalogStore } from '@/lib/store/catalogStore';
import { filtersToSearchParams } from '@/lib/utils/catalogUrl';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

import { LOCATIONS } from '@/lib/constants/locations';

import CatalogFilters from '@/components/catalog/CatalogFilters/CatalogFilters';
import CatalogPageShell from '@/components/catalog/CatalogPageShell/CatalogPageShell';
import CampersList from '@/components/catalog/CampersList/CampersList';
import Button from '@/components/common/Button/Button';
import Tabs from '@/components/common/Tabs/Tabs';

import css from '@/components/catalog/CatalogPageShell/CatalogPageShell.module.css';

//===========================================================================

type Props = {
  initialItems: Camper[];
  initialTotal: number;
  initialFilters: CatalogFiltersValue;
};

type TabValue = 'all' | 'favorites';

//===========================================================================

function isFiltersApplied(v: CatalogFiltersValue) {
  const hasLocation = Boolean(v.location.trim());
  const hasForm = Boolean(v.form);
  const hasEngine = Boolean(v.engine);
  const hasTransmission = Boolean(v.transmission);
  const hasEquipment = Object.values(v.equipment).some(Boolean);

  return hasLocation || hasForm || hasEngine || hasTransmission || hasEquipment;
}

//===========================================================================

function uniqSorted(list: string[]) {
  return Array.from(new Set(list)).sort((a, b) => a.localeCompare(b));
}

//===========================================================================

function CatalogPageClient({
  initialItems,
  initialTotal,
  initialFilters,
}: Props) {
  const router = useRouter();

  const items = useCatalogStore((s) => s.items);
  const total = useCatalogStore((s) => s.total);
  const hasMore = items.length < total;

  const loadMore = useCatalogStore((s) => s.loadMore);
  const openFiltersRef = useRef<(() => void) | null>(null);

  //===========================================================================

  const filters = useCatalogStore((s) => s.filters);
  const debouncedLocation = useDebouncedValue(filters.location, 450);
  const effectiveLocation = filters.location.trim() ? debouncedLocation : '';

  const effectiveFilters: CatalogFiltersValue = useMemo(
    () => ({ ...filters, location: effectiveLocation }),
    [filters, effectiveLocation]
  );

  //===========================================================================

  const didInitRef = useRef(false);
  const init = useCatalogStore((s) => s.init);

  useEffect(() => {
    init({
      items: initialItems,
      total: initialTotal,
      filters: initialFilters ?? DEFAULT_CATALOG_FILTERS,
    });

    didInitRef.current = true;
  }, [init, initialItems, initialTotal, initialFilters]);

  //===========================================================================

  const search = useCatalogStore((s) => s.search);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!didInitRef.current) return;

    const params = filtersToSearchParams(effectiveFilters);
    const qs = params.toString();
    const href = qs ? `/catalog?${qs}` : '/catalog';

    startTransition(async () => {
      router.replace(href);
      await search();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    effectiveFilters.location,
    effectiveFilters.form,
    effectiveFilters.engine,
    effectiveFilters.transmission,
    JSON.stringify(effectiveFilters.equipment),
  ]);

  //===========================================================================

  const setFilters = useCatalogStore((s) => s.setFilters);
  const handleFiltersChange = (next: CatalogFiltersValue) => {
    const safeNext: CatalogFiltersValue = {
      ...next,
      equipment: { ...next.equipment },
    };

    setFilters(safeNext);
  };

  //===========================================================================

  const resetFilters = useCatalogStore((s) => s.resetFilters);

  const reset = () => {
    startTransition(async () => {
      resetFilters();
      router.replace('/catalog');
      await search();
    });
  };

  //===========================================================================

  const [favoriteItems, setFavoriteItems] = useState<Camper[]>([]);
  const [isFavLoading, setIsFavLoading] = useState(false);
  const favorites = useCatalogStore((s) => s.favorites);
  const [tab, setTab] = useState<TabValue>('all');

  useEffect(() => {
    let cancelled = false;

    async function loadFavorites() {
      if (tab !== 'favorites') return;

      if (!favorites.length) {
        setFavoriteItems([]);
        return;
      }

      setIsFavLoading(true);

      try {
        const results = await Promise.all(
          favorites.map(async (id) => {
            try {
              return await fetchCamperById(id);
            } catch {
              return null;
            }
          })
        );

        const clean = results.filter((x): x is Camper => x !== null);
        if (!cancelled) setFavoriteItems(clean);
      } finally {
        if (!cancelled) setIsFavLoading(false);
      }
    }

    void loadFavorites();
    return () => {
      cancelled = true;
    };
  }, [tab, favorites]);

  const visibleItems = tab === 'favorites' ? favoriteItems : items;

  const favoritesCount =
    tab === 'favorites'
      ? isFavLoading
        ? favorites.length
        : favoriteItems.length
      : favorites.length;

  const tabs = [
    { value: 'all' as const, label: 'All', count: total },
    { value: 'favorites' as const, label: 'Favorites', count: favoritesCount },
  ];

  //===========================================================================

  const locationSuggestions = useMemo(() => {
    const fromCards = uniqSorted(
      items.map((c) => (c.location ?? '').trim()).filter((x) => x.length > 0)
    );

    const allowed = new Set<string>(LOCATIONS as readonly string[]);
    return fromCards.filter((x) => allowed.has(x));
  }, [items]);

  const filtersApplied = isFiltersApplied(filters);
  const isLoading = useCatalogStore((s) => s.isLoading);

  const filtersUI = (
    <CatalogFilters
      value={filters}
      onChange={handleFiltersChange}
      onReset={reset}
      isResetDisabled={!filtersApplied || isPending || isLoading}
      isFiltering={isPending || isLoading}
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

      <div className={css.toolbar} style={{ justifyContent: 'flex-end' }}>
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

      <div style={{ marginTop: 24 }}>
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

      {tab === 'all' && hasMore && (
        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}
        >
          <Button
            onClick={() => startTransition(() => loadMore())}
            disabled={isPending || isLoading}
            variant="outlineRed"
          >
            {isPending || isLoading ? 'Loading…' : 'Load more'}
          </Button>
        </div>
      )}
    </CatalogPageShell>
  );
}

export default CatalogPageClient;
