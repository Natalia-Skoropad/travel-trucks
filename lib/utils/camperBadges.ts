import type { Camper } from '@/types/camper';
import type { FeatureBadgeItem } from '@/components/common/FeatureBadges/FeatureBadges';

import {
  EQUIPMENT_OPTIONS,
  ENGINE_OPTIONS,
  TRANSMISSION_OPTIONS,
  VEHICLE_FORMS,
} from '@/lib/constants/catalogFilters';

import {
  hrefByEquipment,
  hrefByEngine,
  hrefByTransmission,
} from '@/lib/utils/catalogNav';

//===========================================================================

function toTitle(s: string) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

//===========================================================================

export function formatVehicleForm(value: Camper['form']) {
  const found = VEHICLE_FORMS.find((x) => x.value === value);
  return found?.label ?? toTitle(value);
}

export function formatTransmission(value: Camper['transmission']) {
  const found = TRANSMISSION_OPTIONS.find((x) => x.value === value);
  return found?.label ?? toTitle(value);
}

export function formatEngine(value: Camper['engine']) {
  const found = ENGINE_OPTIONS.find((x) => x.value === value);
  return found?.label ?? toTitle(value);
}

//===========================================================================

function iconByTransmission(value: Camper['transmission']) {
  return (
    TRANSMISSION_OPTIONS.find((x) => x.value === value)?.icon ??
    'icon-automatic'
  );
}

function iconByEngine(value: Camper['engine']) {
  return ENGINE_OPTIONS.find((x) => x.value === value)?.icon ?? 'icon-petrol';
}

//===========================================================================

export function buildFeatureBadges(camper: Camper): FeatureBadgeItem[] {
  const items: FeatureBadgeItem[] = [];

  items.push({
    label: formatTransmission(camper.transmission),
    icon: iconByTransmission(camper.transmission),
    href: hrefByTransmission(camper.transmission),
  });

  items.push({
    label: formatEngine(camper.engine),
    icon: iconByEngine(camper.engine),
    href: hrefByEngine(camper.engine),
  });

  EQUIPMENT_OPTIONS.forEach(({ key, label, icon }) => {
    if ((camper as Record<string, unknown>)[key] === true) {
      items.push({ label, icon, href: hrefByEquipment(key) });
    }
  });

  return items;
}
