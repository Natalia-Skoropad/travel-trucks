'use client';

import {
  ENGINE_OPTIONS,
  type VehicleEngine,
} from '@/lib/constants/catalogFilters';

import CatalogOptionGrid from '@/components/catalog/CatalogOptionGrid/CatalogOptionGrid';

//===========================================================================

type Props = {
  value: VehicleEngine | '';
  onChange: (next: VehicleEngine | '') => void;
  className?: string;
  options?: VehicleEngine[];
};

//===========================================================================

function VehicleEngineFilter({ value, onChange, className, options }: Props) {
  const visibleOptions = ENGINE_OPTIONS.filter((item) =>
    options?.length ? options.includes(item.value) : true
  );

  return (
    <CatalogOptionGrid
      mode="single"
      title="Vehicle engine"
      value={value}
      options={visibleOptions}
      onChange={onChange}
      className={className}
    />
  );
}

export default VehicleEngineFilter;
