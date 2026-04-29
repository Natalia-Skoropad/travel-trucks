import type { CampersQuery } from '@/types/catalog';
import type {
  CatalogFiltersValue,
  EquipmentKey,
} from '@/lib/constants/catalogFilters';

//===========================================================================

export function getActiveEquipment(
  equipment: CatalogFiltersValue['equipment']
): EquipmentKey[] {
  return (Object.keys(equipment) as EquipmentKey[]).filter(
    (key) => equipment[key]
  );
}

//===========================================================================

export function buildCampersQuery(
  filters: CatalogFiltersValue,
  page: number,
  perPage: number
): CampersQuery {
  const equipment = getActiveEquipment(filters.equipment);

  return {
    page,
    perPage,

    location: filters.location.trim() || undefined,
    form: filters.form || undefined,
    transmission: filters.transmission || undefined,
    engine: filters.engine || undefined,

    equipment: equipment.length ? equipment : undefined,
  };
}

//===========================================================================

export function isCatalogFiltersApplied(filters: CatalogFiltersValue) {
  const hasLocation = Boolean(filters.location.trim());
  const hasForm = Boolean(filters.form);
  const hasEngine = Boolean(filters.engine);
  const hasTransmission = Boolean(filters.transmission);
  const hasEquipment = Object.values(filters.equipment).some(Boolean);

  return hasLocation || hasForm || hasEngine || hasTransmission || hasEquipment;
}
