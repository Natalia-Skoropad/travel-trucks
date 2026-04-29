import type {
  CamperAmenity,
  CamperEngine,
  CamperForm,
  CamperListItem,
  CamperTransmission,
} from '@/types/camper';

import type { FeatureBadgeItem } from '@/components/common/FeatureBadges/FeatureBadges';

import {
  EQUIPMENT_OPTIONS,
  ENGINE_OPTIONS,
  TRANSMISSION_OPTIONS,
  formatAmenityLabel,
  formatCamperFormLabel,
  formatEngineLabel,
  formatTransmissionLabel,
} from '@/lib/constants/catalogFilters';

import {
  hrefByEquipment,
  hrefByEngine,
  hrefByTransmission,
} from '@/lib/utils/catalogNav';

//===========================================================================

export function formatVehicleForm(value: CamperForm) {
  return formatCamperFormLabel(value);
}

export function formatTransmission(value: CamperTransmission) {
  return formatTransmissionLabel(value);
}

export function formatEngine(value: CamperEngine) {
  return formatEngineLabel(value);
}

export function formatAmenity(value: CamperAmenity) {
  return formatAmenityLabel(value);
}

//===========================================================================

function iconByTransmission(value: CamperTransmission) {
  return (
    TRANSMISSION_OPTIONS.find((item) => item.value === value)?.icon ??
    'icon-fuel-pump'
  );
}

function iconByEngine(value: CamperEngine) {
  return (
    ENGINE_OPTIONS.find((item) => item.value === value)?.icon ??
    'icon-fuel-pump'
  );
}

function iconByAmenity(value: CamperAmenity) {
  return (
    EQUIPMENT_OPTIONS.find((item) => item.key === value)?.icon ?? 'icon-wind'
  );
}

//===========================================================================

export function buildFeatureBadges(
  camper: Pick<CamperListItem, 'transmission' | 'engine' | 'amenities'>
): FeatureBadgeItem[] {
  const items: FeatureBadgeItem[] = [];

  items.push({
    label: formatTransmissionLabel(camper.transmission),
    icon: iconByTransmission(camper.transmission),
    href: hrefByTransmission(camper.transmission),
  });

  items.push({
    label: formatEngineLabel(camper.engine),
    icon: iconByEngine(camper.engine),
    href: hrefByEngine(camper.engine),
  });

  camper.amenities.forEach((amenity) => {
    items.push({
      label: formatAmenityLabel(amenity),
      icon: iconByAmenity(amenity),
      href: hrefByEquipment(amenity),
    });
  });

  return items;
}
