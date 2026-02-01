import type {
  CatalogFiltersValue,
  EquipmentKey,
  VehicleForm,
  VehicleEngine,
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
    equipment: { ...(patch.equipment ?? {}) },
  };

  const params = new URLSearchParams();

  if (next.location.trim()) params.set('location', next.location.trim());
  if (next.form) params.set('form', next.form);

  if (next.engine) params.set('engine', next.engine);
  if (next.transmission) params.set('transmission', next.transmission);

  (Object.keys(next.equipment) as EquipmentKey[]).forEach((k) => {
    if (next.equipment[k]) params.set(k, '1');
  });

  const qs = params.toString();
  return qs ? `/catalog?${qs}` : '/catalog';
}

//===========================================================================

export function hrefByLocation(location: string) {
  return buildCatalogHref({ location });
}

export function hrefByForm(form: VehicleForm) {
  return buildCatalogHref({ form });
}

export function hrefByEquipment(key: EquipmentKey) {
  return buildCatalogHref({ equipment: { [key]: true } });
}

export function hrefByEngine(engine: VehicleEngine) {
  return buildCatalogHref({ engine });
}

export function hrefByTransmission(transmission: VehicleTransmission) {
  return buildCatalogHref({ transmission });
}
