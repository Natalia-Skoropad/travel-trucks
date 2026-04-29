import type { CatalogFiltersValue } from '@/lib/constants/catalogFilters';

//===========================================================================

export function isCatalogFiltersApplied(filters: CatalogFiltersValue) {
  const hasLocation = Boolean(filters.location.trim());
  const hasForm = Boolean(filters.form);
  const hasEngine = Boolean(filters.engine);
  const hasTransmission = Boolean(filters.transmission);
  const hasEquipment = Object.values(filters.equipment).some(Boolean);
  const hasSort = Boolean(filters.sort);

  return (
    hasLocation ||
    hasForm ||
    hasEngine ||
    hasTransmission ||
    hasEquipment ||
    hasSort
  );
}
