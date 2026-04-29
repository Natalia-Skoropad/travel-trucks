import type { CatalogFiltersValue } from '@/lib/constants/catalogFilters';

//===========================================================================

export function isCatalogFiltersApplied(filters: CatalogFiltersValue) {
  const hasSearch = Boolean(filters.search.trim());
  const hasLocation = Boolean(filters.location.trim());
  const hasForm = Boolean(filters.form);
  const hasEngine = Boolean(filters.engine);
  const hasTransmission = Boolean(filters.transmission);
  const hasEquipment = Object.values(filters.equipment).some(Boolean);
  const hasSort = Boolean(filters.sort);

  return (
    hasSearch ||
    hasLocation ||
    hasForm ||
    hasEngine ||
    hasTransmission ||
    hasEquipment ||
    hasSort
  );
}
