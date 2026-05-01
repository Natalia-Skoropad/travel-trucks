'use client';

import {
  VEHICLE_FORMS,
  type VehicleForm,
} from '@/lib/constants/catalogFilters';

import CatalogOptionGrid from '@/components/catalog/CatalogOptionGrid/CatalogOptionGrid';

//===========================================================================

type Props = {
  value: VehicleForm | '';
  onChange: (next: VehicleForm | '') => void;
  className?: string;
  options?: VehicleForm[];
};

//===========================================================================

function VehicleFormFilter({ value, onChange, className, options }: Props) {
  const visibleOptions = VEHICLE_FORMS.filter((item) =>
    options?.length ? options.includes(item.value) : true
  );

  return (
    <CatalogOptionGrid
      mode="single"
      title="Vehicle form"
      value={value}
      options={visibleOptions}
      onChange={onChange}
      className={className}
    />
  );
}

export default VehicleFormFilter;
