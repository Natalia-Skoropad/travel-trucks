import type {
  CamperAmenity,
  CamperEngine,
  CamperForm,
  CamperTransmission,
} from '@/types/camper';
import type { CamperSort } from '@/types/catalog';

//===========================================================================

export type EquipmentKey = CamperAmenity;

export type VehicleForm = CamperForm;
export type VehicleTransmission = CamperTransmission;
export type VehicleEngine = CamperEngine;

//===========================================================================

export type CatalogFiltersValue = {
  location: string;
  form: CamperForm | '';

  engine: CamperEngine | '';
  transmission: CamperTransmission | '';

  equipment: Partial<Record<EquipmentKey, boolean>>;

  sort: CamperSort | '';
};

//===========================================================================

export const CAMPER_FORM_LABELS: Record<CamperForm, string> = {
  alcove: 'Alcove',
  panel_van: 'Panel van',
  integrated: 'Integrated',
  semi_integrated: 'Semi-integrated',
};

export const TRANSMISSION_LABELS: Record<CamperTransmission, string> = {
  automatic: 'Automatic',
  manual: 'Manual',
};

export const ENGINE_LABELS: Record<CamperEngine, string> = {
  diesel: 'Diesel',
  petrol: 'Petrol',
  hybrid: 'Hybrid',
  electric: 'Electric',
};

export const AMENITY_LABELS: Record<CamperAmenity, string> = {
  ac: 'AC',
  bathroom: 'Bathroom',
  kitchen: 'Kitchen',
  tv: 'TV',
  radio: 'Radio',
  refrigerator: 'Refrigerator',
  microwave: 'Microwave',
  gas: 'Gas',
  water: 'Water',
};

export const SORT_LABELS: Record<CamperSort, string> = {
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  'rating-asc': 'Rating: low to high',
  'rating-desc': 'Rating: high to low',
};

//===========================================================================

export function formatCamperFormLabel(value: CamperForm) {
  return CAMPER_FORM_LABELS[value];
}

export function formatTransmissionLabel(value: CamperTransmission) {
  return TRANSMISSION_LABELS[value];
}

export function formatEngineLabel(value: CamperEngine) {
  return ENGINE_LABELS[value];
}

export function formatAmenityLabel(value: CamperAmenity) {
  return AMENITY_LABELS[value];
}

export function formatSortLabel(value: CamperSort) {
  return SORT_LABELS[value];
}

//===========================================================================

export const EQUIPMENT_OPTIONS: Array<{
  key: EquipmentKey;
  label: string;
  icon: string;
}> = [
  { key: 'ac', label: AMENITY_LABELS.ac, icon: 'icon-wind' },
  { key: 'bathroom', label: AMENITY_LABELS.bathroom, icon: 'icon-shower' },
  { key: 'gas', label: AMENITY_LABELS.gas, icon: 'icon-gas-stove' },
  { key: 'kitchen', label: AMENITY_LABELS.kitchen, icon: 'icon-cup-hot' },
  { key: 'radio', label: AMENITY_LABELS.radio, icon: 'icon-radios' },
  {
    key: 'refrigerator',
    label: AMENITY_LABELS.refrigerator,
    icon: 'icon-fridge',
  },
  {
    key: 'microwave',
    label: AMENITY_LABELS.microwave,
    icon: 'icon-microwave',
  },
  { key: 'tv', label: AMENITY_LABELS.tv, icon: 'icon-tv' },
  { key: 'water', label: AMENITY_LABELS.water, icon: 'icon-water' },
];

//===========================================================================

export const VEHICLE_FORMS: Array<{
  value: VehicleForm;
  label: string;
  icon: string;
}> = [
  {
    value: 'panel_van',
    label: CAMPER_FORM_LABELS.panel_van,
    icon: 'icon-grid-1x2',
  },
  {
    value: 'integrated',
    label: CAMPER_FORM_LABELS.integrated,
    icon: 'icon-grid-2x2',
  },
  {
    value: 'semi_integrated',
    label: CAMPER_FORM_LABELS.semi_integrated,
    icon: 'icon-grid-2x2',
  },
  {
    value: 'alcove',
    label: CAMPER_FORM_LABELS.alcove,
    icon: 'icon-grid-3x3',
  },
];

//===========================================================================

export const TRANSMISSION_OPTIONS: Array<{
  value: VehicleTransmission;
  label: string;
  icon: string;
}> = [
  {
    value: 'automatic',
    label: TRANSMISSION_LABELS.automatic,
    icon: 'icon-fuel-pump',
  },
  {
    value: 'manual',
    label: TRANSMISSION_LABELS.manual,
    icon: 'icon-fuel-pump',
  },
];

//===========================================================================

export const ENGINE_OPTIONS: Array<{
  value: VehicleEngine;
  label: string;
  icon: string;
}> = [
  {
    value: 'diesel',
    label: ENGINE_LABELS.diesel,
    icon: 'icon-fuel-pump',
  },
  {
    value: 'petrol',
    label: ENGINE_LABELS.petrol,
    icon: 'icon-fuel-pump',
  },
  {
    value: 'hybrid',
    label: ENGINE_LABELS.hybrid,
    icon: 'icon-fuel-pump',
  },
  {
    value: 'electric',
    label: ENGINE_LABELS.electric,
    icon: 'icon-fuel-pump',
  },
];

//===========================================================================

export const SORT_OPTIONS: Array<{
  value: CamperSort;
  label: string;
}> = [
  { value: 'price-asc', label: SORT_LABELS['price-asc'] },
  { value: 'price-desc', label: SORT_LABELS['price-desc'] },
  { value: 'rating-desc', label: SORT_LABELS['rating-desc'] },
  { value: 'rating-asc', label: SORT_LABELS['rating-asc'] },
];

//===========================================================================

export const CAMPER_FORM_VALUES = VEHICLE_FORMS.map((item) => item.value);
export const TRANSMISSION_VALUES = TRANSMISSION_OPTIONS.map(
  (item) => item.value
);
export const ENGINE_VALUES = ENGINE_OPTIONS.map((item) => item.value);
export const AMENITY_VALUES = EQUIPMENT_OPTIONS.map((item) => item.key);
export const SORT_VALUES = SORT_OPTIONS.map((item) => item.value);
