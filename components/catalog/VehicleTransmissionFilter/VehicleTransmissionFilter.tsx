'use client';

import {
  TRANSMISSION_OPTIONS,
  type VehicleTransmission,
} from '@/lib/constants/catalogFilters';

import CatalogOptionGrid from '@/components/catalog/CatalogOptionGrid/CatalogOptionGrid';

//===========================================================================

type Props = {
  value: VehicleTransmission | '';
  onChange: (next: VehicleTransmission | '') => void;
  className?: string;
  options?: VehicleTransmission[];
};

//===========================================================================

function VehicleTransmissionFilter({
  value,
  onChange,
  className,
  options,
}: Props) {
  const visibleOptions = TRANSMISSION_OPTIONS.filter((item) =>
    options?.length ? options.includes(item.value) : true
  );

  return (
    <CatalogOptionGrid
      mode="single"
      title="Vehicle transmission"
      value={value}
      options={visibleOptions}
      onChange={onChange}
      className={className}
    />
  );
}

export default VehicleTransmissionFilter;
