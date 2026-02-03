import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Camper } from '@/types/camper';
import type { CampersQuery } from '@/lib/api/campersApi';
import { fetchCampers } from '@/lib/api/campersApi';

import { CATALOG_LIMIT } from '@/lib/constants/pagination';
import { DEFAULT_CATALOG_FILTERS } from '@/lib/constants/catalogDefaults';

import type {
  EquipmentKey,
  CatalogFiltersValue,
} from '@/lib/constants/catalogFilters';

//===========================================================================

type CatalogState = {
  items: Camper[];
  total: number;
  page: number;
  limit: number;

  isLoading: boolean;
  error: string | null;

  filters: CatalogFiltersValue;
  favorites: string[];

  setFilters: (next: CatalogFiltersValue) => void;
  resetFilters: () => void;

  init: (payload: {
    items: Camper[];
    total: number;
    filters: CatalogFiltersValue;
  }) => void;

  search: (overrideFilters?: CatalogFiltersValue) => Promise<void>;
  loadMore: () => Promise<void>;

  toggleFavorite: (id: string) => void;
};

//===========================================================================

function buildQuery(
  filters: CatalogFiltersValue,
  page: number,
  limit: number
): CampersQuery {
  const query: CampersQuery = { page, limit };

  const location = filters.location.trim();
  if (location) query.location = location;

  if (filters.form) query.form = filters.form;
  if (filters.engine) query.engine = filters.engine;
  if (filters.transmission) query.transmission = filters.transmission;

  (Object.keys(filters.equipment) as EquipmentKey[]).forEach((k) => {
    if (filters.equipment[k]) {
      query[k] = true;
    }
  });

  return query;
}

//===========================================================================

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      page: 1,
      limit: CATALOG_LIMIT,

      isLoading: false,
      error: null,

      filters: DEFAULT_CATALOG_FILTERS,
      favorites: [],

      setFilters: (next) => set({ filters: next }),
      resetFilters: () => set({ filters: DEFAULT_CATALOG_FILTERS }),

      init: ({ items, total, filters }) =>
        set({
          items,
          total,
          page: 1,
          filters,
          error: null,
          isLoading: false,
        }),

      search: async (overrideFilters) => {
        const { filters: stateFilters, limit } = get();
        const activeFilters = overrideFilters ?? stateFilters;

        set({ isLoading: true, error: null, items: [], total: 0, page: 1 });

        try {
          const data = await fetchCampers(buildQuery(activeFilters, 1, limit));
          set({
            items: data.items,
            total: data.total,
            page: 1,
            isLoading: false,
          });
        } catch (e) {
          set({
            error: e instanceof Error ? e.message : 'Unknown error',
            isLoading: false,
          });
        }
      },

      loadMore: async () => {
        const { filters, limit, page, items, total, isLoading } = get();
        if (isLoading) return;
        if (items.length >= total) return;

        const nextPage = page + 1;
        set({ isLoading: true, error: null });

        try {
          const data = await fetchCampers(buildQuery(filters, nextPage, limit));
          set({
            items: [...items, ...data.items],
            total: data.total,
            page: nextPage,
            isLoading: false,
          });
        } catch (e) {
          set({
            error: e instanceof Error ? e.message : 'Unknown error',
            isLoading: false,
          });
        }
      },

      toggleFavorite: (id) =>
        set((s) => {
          const has = s.favorites.includes(id);
          return {
            favorites: has
              ? s.favorites.filter((x) => x !== id)
              : [...s.favorites, id],
          };
        }),
    }),
    {
      name: 'traveltrucks_catalog',
      partialize: (s) => ({ filters: s.filters, favorites: s.favorites }),
    }
  )
);
