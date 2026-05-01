import {
  AMENITY_VALUES,
  CAMPER_FORM_VALUES,
  ENGINE_VALUES,
  SORT_VALUES,
  TRANSMISSION_VALUES,
} from '@/lib/constants/catalogFilters';

import type {
  CamperAmenity,
  CamperEngine,
  CamperForm,
  CamperTransmission,
} from '@/types/camper';

import type { CamperSort } from '@/types/catalog';

//===========================================================================

export function isCamperForm(value: unknown): value is CamperForm {
  return (
    typeof value === 'string' &&
    CAMPER_FORM_VALUES.includes(value as CamperForm)
  );
}

export function isCamperTransmission(
  value: unknown
): value is CamperTransmission {
  return (
    typeof value === 'string' &&
    TRANSMISSION_VALUES.includes(value as CamperTransmission)
  );
}

export function isCamperEngine(value: unknown): value is CamperEngine {
  return (
    typeof value === 'string' && ENGINE_VALUES.includes(value as CamperEngine)
  );
}

export function isCamperAmenity(value: unknown): value is CamperAmenity {
  return (
    typeof value === 'string' && AMENITY_VALUES.includes(value as CamperAmenity)
  );
}

export function isCamperSort(value: unknown): value is CamperSort {
  return typeof value === 'string' && SORT_VALUES.includes(value as CamperSort);
}
