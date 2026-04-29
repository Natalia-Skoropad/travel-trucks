import type {
  CatalogFiltersValue,
  EquipmentKey,
  VehicleEngine,
  VehicleForm,
  VehicleTransmission,
} from '@/lib/constants/catalogFilters';

import { DEFAULT_CATALOG_FILTERS } from '@/lib/constants/catalogDefaults';
import { buildCatalogPath } from '@/lib/utils/catalogSegments';

//===========================================================================

type PartialFilters = Partial<
  Pick<CatalogFiltersValue, 'location' | 'form' | 'engine' | 'transmission'>
> & {
  equipment?: Partial<Record<EquipmentKey, boolean>>;
};

//===========================================================================

export function buildCatalogHref(patch: PartialFilters) {
  const next: CatalogFiltersValue = {
    ...DEFAULT_CATALOG_FILTERS,
    ...patch,
    equipment: {
      ...DEFAULT_CATALOG_FILTERS.equipment,
      ...(patch.equipment ?? {}),
    },
  };

  return buildCatalogPath(next);
}

//===========================================================================

export function hrefByLocation(location: string) {
  return buildCatalogHref({ location });
}

export function hrefByForm(form: VehicleForm) {
  return buildCatalogHref({ form });
}

export function hrefByEquipment(key: EquipmentKey) {
  return buildCatalogHref({
    equipment: {
      [key]: true,
    },
  });
}

export function hrefByEngine(engine: VehicleEngine) {
  return buildCatalogHref({ engine });
}

export function hrefByTransmission(transmission: VehicleTransmission) {
  return buildCatalogHref({ transmission });
}
