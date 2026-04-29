import type {
  CatalogFiltersValue,
  EquipmentKey,
  VehicleEngine,
  VehicleForm,
  VehicleTransmission,
} from '@/lib/constants/catalogFilters';

import {
  AMENITY_VALUES,
  CAMPER_FORM_VALUES,
  ENGINE_VALUES,
  TRANSMISSION_VALUES,
  formatAmenityLabel,
  formatCamperFormLabel,
  formatEngineLabel,
  formatTransmissionLabel,
} from '@/lib/constants/catalogFilters';

//===========================================================================

function isVehicleForm(value: string): value is VehicleForm {
  return CAMPER_FORM_VALUES.includes(value as VehicleForm);
}

function isEngine(value: string): value is VehicleEngine {
  return ENGINE_VALUES.includes(value as VehicleEngine);
}

function isTransmission(value: string): value is VehicleTransmission {
  return TRANSMISSION_VALUES.includes(value as VehicleTransmission);
}

function isEquipmentKey(value: string): value is EquipmentKey {
  return AMENITY_VALUES.includes(value as EquipmentKey);
}

//===========================================================================

export function filtersFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): CatalogFiltersValue {
  const location =
    typeof searchParams.location === 'string' ? searchParams.location : '';

  const formRaw = searchParams.form;
  const formList = Array.isArray(formRaw)
    ? formRaw
    : typeof formRaw === 'string'
    ? [formRaw]
    : [];

  const form = formList.find(isVehicleForm) ?? '';

  const engineRaw = searchParams.engine;
  const engineList = Array.isArray(engineRaw)
    ? engineRaw
    : typeof engineRaw === 'string'
    ? [engineRaw]
    : [];

  const engine = engineList.find(isEngine) ?? '';

  const transmissionRaw = searchParams.transmission;
  const transmissionList = Array.isArray(transmissionRaw)
    ? transmissionRaw
    : typeof transmissionRaw === 'string'
    ? [transmissionRaw]
    : [];

  const transmission = transmissionList.find(isTransmission) ?? '';

  const equipment: Partial<Record<EquipmentKey, boolean>> = {};

  const equipmentRaw = searchParams.equipment;
  const equipmentList = Array.isArray(equipmentRaw)
    ? equipmentRaw
    : typeof equipmentRaw === 'string'
    ? [equipmentRaw]
    : [];

  equipmentList.forEach((key) => {
    if (isEquipmentKey(key)) {
      equipment[key] = true;
    }
  });

  return {
    search: '',
    location,
    form,
    engine,
    transmission,
    equipment,
    sort: '',
  };
}

//===========================================================================

export function filtersToSearchParams(filters: CatalogFiltersValue) {
  const params = new URLSearchParams();

  const location = filters.location.trim();

  if (location) params.set('location', location);
  if (filters.form) params.set('form', filters.form);
  if (filters.engine) params.set('engine', filters.engine);
  if (filters.transmission) {
    params.set('transmission', filters.transmission);
  }

  (Object.keys(filters.equipment) as EquipmentKey[]).forEach((key) => {
    if (filters.equipment[key]) {
      params.append('equipment', key);
    }
  });

  return params;
}

//===========================================================================

export function filtersToTitle(filters: CatalogFiltersValue) {
  const parts: string[] = [];

  if (filters.form) {
    parts.push(formatCamperFormLabel(filters.form));
  }

  if (filters.transmission) {
    parts.push(formatTransmissionLabel(filters.transmission));
  }

  if (filters.engine) {
    parts.push(formatEngineLabel(filters.engine));
  }

  const equipment = (Object.keys(filters.equipment) as EquipmentKey[])
    .filter((key) => filters.equipment[key])
    .map(formatAmenityLabel);

  if (equipment.length) {
    parts.push(equipment.join(', '));
  }

  const location = filters.location.trim();

  if (location) {
    parts.push(location);
  }

  return parts.length ? parts.join(' • ') : 'All campers';
}
