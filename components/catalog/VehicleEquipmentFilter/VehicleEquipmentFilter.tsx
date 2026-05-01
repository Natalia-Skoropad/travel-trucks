'use client';

import {
  EQUIPMENT_OPTIONS,
  type EquipmentKey,
} from '@/lib/constants/catalogFilters';

import CatalogOptionGrid, {
  type CatalogOptionGridItem,
} from '@/components/catalog/CatalogOptionGrid/CatalogOptionGrid';

//===========================================================================

type Props = {
  value: Partial<Record<EquipmentKey, boolean>>;
  onChange: (next: Partial<Record<EquipmentKey, boolean>>) => void;
  className?: string;
};

//===========================================================================

const EQUIPMENT_GRID_OPTIONS: CatalogOptionGridItem<EquipmentKey>[] =
  EQUIPMENT_OPTIONS.map((option) => ({
    value: option.key,
    label: option.label,
    icon: option.icon,
  }));

//===========================================================================

function VehicleEquipmentFilter({ value, onChange, className }: Props) {
  return (
    <CatalogOptionGrid
      mode="multiple"
      title="Vehicle equipment"
      value={value}
      options={EQUIPMENT_GRID_OPTIONS}
      onChange={onChange}
      className={className}
    />
  );
}

export default VehicleEquipmentFilter;
