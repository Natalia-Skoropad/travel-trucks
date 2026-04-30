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

import { hrefByEquipment } from '@/lib/utils/catalogNav';

//===========================================================================

type CamperWithFeatures = Pick<CamperListItem | CamperDetails, 'amenities'>;

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

export function formatTransmission(value: CamperListItem['transmission']) {
  return formatTransmissionLabel(value);
}

export function formatEngine(value: CamperListItem['engine']) {
  return formatEngineLabel(value);
}

export function formatAmenity(value: CamperAmenity) {
  return formatAmenityLabel(value);
}

//===========================================================================

export function buildFeatureBadges(
  camper: CamperWithFeatures
): FeatureBadgeItem[] {
  return camper.amenities.map((amenity) => ({
    label: formatAmenityLabel(amenity),
    icon: getAmenityIcon(amenity),
    href: hrefByEquipment(amenity),
  }));
}
