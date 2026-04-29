import type {
  CatalogFiltersValue,
  EquipmentKey,
  VehicleEngine,
  VehicleForm,
  VehicleTransmission,
} from '@/lib/constants/catalogFilters';

import { DEFAULT_CATALOG_FILTERS } from '@/lib/constants/catalogDefaults';

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

  const params = new URLSearchParams();

  const location = next.location.trim();

  if (location) params.set('location', location);
  if (next.form) params.set('form', next.form);
  if (next.engine) params.set('engine', next.engine);
  if (next.transmission) params.set('transmission', next.transmission);

  (Object.keys(next.equipment) as EquipmentKey[]).forEach((key) => {
    if (next.equipment[key]) {
      params.set(key, '1');
    }
  });

  const query = params.toString();

  return query ? `/catalog?${query}` : '/catalog';
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
