import type {
  CamperAmenity,
  CamperDetails,
  CamperListItem,
} from '@/types/camper';
import type { FeatureBadgeItem } from '@/components/common/FeatureBadges/FeatureBadges';

import {
  EQUIPMENT_OPTIONS,
  formatAmenityLabel,
  formatCamperFormLabel,
  formatEngineLabel,
  formatTransmissionLabel,
} from '@/lib/constants/catalogFilters';

import {
  hrefByEngine,
  hrefByEquipment,
  hrefByTransmission,
} from '@/lib/utils/catalogNav';

//===========================================================================

type CamperWithFeatures = Pick<
  CamperListItem | CamperDetails,
  'transmission' | 'engine' | 'amenities'
>;

//===========================================================================

function getAmenityIcon(value: CamperAmenity) {
  return (
    EQUIPMENT_OPTIONS.find((option) => option.key === value)?.icon ??
    'icon-grid-2x2'
  );
}

//===========================================================================

export function formatVehicleForm(value: CamperListItem['form']) {
  return formatCamperFormLabel(value);
}

export function formatTransmission(value: CamperWithFeatures['transmission']) {
  return formatTransmissionLabel(value);
}

export function formatEngine(value: CamperWithFeatures['engine']) {
  return formatEngineLabel(value);
}

export function formatAmenity(value: CamperAmenity) {
  return formatAmenityLabel(value);
}

//===========================================================================

export function buildFeatureBadges(
  camper: CamperWithFeatures
): FeatureBadgeItem[] {
  const badges: FeatureBadgeItem[] = [
    {
      label: formatTransmissionLabel(camper.transmission),
      icon: 'icon-fuel-pump',
      href: hrefByTransmission(camper.transmission),
    },
    {
      label: formatEngineLabel(camper.engine),
      icon: 'icon-fuel-pump',
      href: hrefByEngine(camper.engine),
    },
  ];

  camper.amenities.forEach((amenity) => {
    badges.push({
      label: formatAmenityLabel(amenity),
      icon: getAmenityIcon(amenity),
      href: hrefByEquipment(amenity),
    });
  });

  return badges;
}
