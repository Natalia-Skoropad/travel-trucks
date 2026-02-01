import type { CampersQuery } from '@/lib/api/campersApi';

//===========================================================================

export type CatalogFiltersValue = {
  location: string;
  form: VehicleForm | '';

  engine: VehicleEngine | '';
  transmission: VehicleTransmission | '';

  equipment: Partial<Record<EquipmentKey, boolean>>;
};

//===========================================================================

export type EquipmentKey = keyof Pick<
  CampersQuery,
  | 'AC'
  | 'kitchen'
  | 'bathroom'
  | 'TV'
  | 'radio'
  | 'refrigerator'
  | 'microwave'
  | 'gas'
  | 'water'
>;

//===========================================================================

export const EQUIPMENT_OPTIONS: Array<{
  key: EquipmentKey;
  label: string;
  icon: string;
}> = [
  { key: 'AC', label: 'AC', icon: 'icon-wind' },
  { key: 'bathroom', label: 'Bathroom', icon: 'icon-shower' },
  { key: 'gas', label: 'Gas', icon: 'icon-gas' },
  { key: 'kitchen', label: 'Kitchen', icon: 'icon-cup-hot' },
  { key: 'radio', label: 'Radio', icon: 'icon-radios' },
  { key: 'refrigerator', label: 'Refrigerator', icon: 'icon-fridge' },
  { key: 'microwave', label: 'Microwave', icon: 'icon-microwave' },
  { key: 'TV', label: 'TV', icon: 'icon-tv' },
  { key: 'water', label: 'Water', icon: 'icon-water' },
];

//===========================================================================

export type VehicleForm = NonNullable<CampersQuery['form']>;

export const VEHICLE_FORMS: Array<{
  value: VehicleForm;
  label: string;
  icon: string;
}> = [
  {
    value: 'panelTruck',
    label: 'Panel Truck',
    icon: 'icon-grid-1x2',
  },

  {
    value: 'fullyIntegrated',
    label: 'Fully Integrated',
    icon: 'icon-grid-2x2',
  },

  {
    value: 'alcove',
    label: 'Alcove',
    icon: 'icon-grid-3x3',
  },
];

//===========================================================================

export type VehicleTransmission = NonNullable<CampersQuery['transmission']>;

export const TRANSMISSION_OPTIONS: Array<{
  value: VehicleTransmission;
  label: string;
  icon: string;
}> = [
  { value: 'automatic', label: 'Automatic', icon: 'icon-automatic' },
  { value: 'manual', label: 'Manual', icon: 'icon-manual' },
];

//===========================================================================

export type VehicleEngine = NonNullable<CampersQuery['engine']>;

export const ENGINE_OPTIONS: Array<{
  value: VehicleEngine;
  label: string;
  icon: string;
}> = [
  { value: 'petrol', label: 'Petrol', icon: 'icon-petrol' },
  { value: 'diesel', label: 'Diesel', icon: 'icon-diesel' },
  { value: 'hybrid', label: 'Hybrid', icon: 'icon-hybrid' },
];
