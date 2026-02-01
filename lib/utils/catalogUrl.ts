import type {
  CatalogFiltersValue,
  EquipmentKey,
  VehicleForm,
  VehicleEngine,
  VehicleTransmission,
} from '@/lib/constants/catalogFilters';

import { EQUIPMENT_OPTIONS } from '@/lib/constants/catalogFilters';

import {
  VEHICLE_FORMS,
  ENGINE_OPTIONS,
  TRANSMISSION_OPTIONS,
} from '@/lib/constants/catalogFilters';

//===========================================================================

const EQUIPMENT_KEYS = EQUIPMENT_OPTIONS.map((x) => x.key);

//===========================================================================

function isVehicleForm(v: string): v is VehicleForm {
  return VEHICLE_FORMS.some((t) => t.value === v);
}

function isEngine(v: string): v is VehicleEngine {
  return ENGINE_OPTIONS.some((x) => x.value === v);
}

function isTransmission(v: string): v is VehicleTransmission {
  return TRANSMISSION_OPTIONS.some((x) => x.value === v);
}

//===========================================================================

export function filtersFromSearchParams(
  sp: Record<string, string | string[] | undefined>
): CatalogFiltersValue {
  const location = typeof sp.location === 'string' ? sp.location : '';

  const formRaw = sp.form;
  const formList = Array.isArray(formRaw)
    ? formRaw
    : typeof formRaw === 'string'
    ? [formRaw]
    : [];
  const form = (formList.find(isVehicleForm) ?? '') as VehicleForm | '';

  const engineRaw = sp.engine;
  const engineList = Array.isArray(engineRaw)
    ? engineRaw
    : typeof engineRaw === 'string'
    ? [engineRaw]
    : [];
  const engine = (engineList.find(isEngine) ?? '') as VehicleEngine | '';

  const trRaw = sp.transmission;
  const trList = Array.isArray(trRaw)
    ? trRaw
    : typeof trRaw === 'string'
    ? [trRaw]
    : [];
  const transmission = (trList.find(isTransmission) ?? '') as
    | VehicleTransmission
    | '';

  const equipment: Partial<Record<EquipmentKey, boolean>> = {};

  for (const k of EQUIPMENT_KEYS) {
    const v = sp[k];
    const s = Array.isArray(v) ? v[0] : v;
    if (s === '1' || s === 'true') equipment[k] = true;
  }

  const eq = sp.equipment;
  const eqList = Array.isArray(eq) ? eq : typeof eq === 'string' ? [eq] : [];
  eqList.forEach((k) => {
    if (EQUIPMENT_KEYS.includes(k as EquipmentKey))
      equipment[k as EquipmentKey] = true;
  });

  return { location, form, engine, transmission, equipment };
}

//===========================================================================

export function filtersToSearchParams(filters: CatalogFiltersValue) {
  const params = new URLSearchParams();

  const loc = filters.location.trim();
  if (loc) params.set('location', loc);

  if (filters.form) params.set('form', filters.form);
  if (filters.engine) params.set('engine', filters.engine);
  if (filters.transmission) params.set('transmission', filters.transmission);

  (Object.keys(filters.equipment) as EquipmentKey[]).forEach((k) => {
    if (filters.equipment[k]) params.set(k, '1');
  });

  return params;
}

//===========================================================================

function formatFormLabel(v: string) {
  return VEHICLE_FORMS.find((x) => x.value === v)?.label ?? v;
}

function formatEngineLabel(v: string) {
  return ENGINE_OPTIONS.find((x) => x.value === v)?.label ?? v;
}

function formatTransmissionLabel(v: string) {
  return TRANSMISSION_OPTIONS.find((x) => x.value === v)?.label ?? v;
}

//===========================================================================

export function filtersToTitle(filters: CatalogFiltersValue) {
  const parts: string[] = [];

  if (filters.form) parts.push(formatFormLabel(filters.form));
  if (filters.transmission)
    parts.push(formatTransmissionLabel(filters.transmission));
  if (filters.engine) parts.push(formatEngineLabel(filters.engine));

  const eq = Object.entries(filters.equipment)
    .filter(([, v]) => v)
    .map(([k]) => k);

  if (eq.length) parts.push(eq.join(', '));
  if (filters.location.trim()) parts.push(filters.location.trim());

  return parts.length ? parts.join(' • ') : 'All campers';
}
