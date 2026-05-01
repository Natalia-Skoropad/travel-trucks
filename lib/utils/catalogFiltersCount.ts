import type {
  CatalogFiltersValue,
  EquipmentKey,
} from '@/lib/constants/catalogFilters';

//===========================================================================

export function getAppliedFiltersCount(filters: CatalogFiltersValue) {
  const equipmentCount = (
    Object.keys(filters.equipment) as EquipmentKey[]
  ).filter((key) => filters.equipment[key]).length;

  return (
    Number(Boolean(filters.location.trim())) +
    Number(Boolean(filters.form)) +
    Number(Boolean(filters.transmission)) +
    Number(Boolean(filters.engine)) +
    equipmentCount
  );
}
