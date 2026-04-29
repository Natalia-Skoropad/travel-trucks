import type { CatalogFiltersValue } from '@/lib/constants/catalogFilters';
import type { EquipmentKey } from '@/lib/constants/catalogFilters';

//===========================================================================

function getActiveEquipment(filters: CatalogFiltersValue) {
  return (Object.keys(filters.equipment) as EquipmentKey[])
    .filter((key) => filters.equipment[key])
    .sort();
}

function normalizeFilters(filters: CatalogFiltersValue) {
  return {
    location: filters.location.trim(),
    form: filters.form || '',
    transmission: filters.transmission || '',
    engine: filters.engine || '',
    equipment: getActiveEquipment(filters),
  };
}

//===========================================================================

export const campersQueryKeys = {
  all: ['campers'] as const,

  lists: () => [...campersQueryKeys.all, 'list'] as const,

  list: (filters: CatalogFiltersValue, perPage: number) =>
    [
      ...campersQueryKeys.lists(),
      normalizeFilters(filters),
      { perPage },
    ] as const,

  detail: (id: string) => [...campersQueryKeys.all, 'detail', id] as const,

  reviews: (id: string) => [...campersQueryKeys.all, 'reviews', id] as const,

  filters: () => [...campersQueryKeys.all, 'filters'] as const,
};
