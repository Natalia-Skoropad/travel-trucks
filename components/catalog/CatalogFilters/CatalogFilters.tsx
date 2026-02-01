'use client';
import { X } from 'lucide-react';

import type { CatalogFiltersValue } from '@/lib/constants/catalogFilters';

import LocationFilter from '@/components/catalog/LocationFilter/LocationFilter';
import VehicleEquipmentFilter from '@/components/catalog/VehicleEquipmentFilter/VehicleEquipmentFilter';
import VehicleFormFilter from '@/components/catalog/VehicleFormFilter/VehicleFormFilter';
import VehicleTransmissionFilter from '@/components/catalog/VehicleTransmissionFilter/VehicleTransmissionFilter';
import VehicleEngineFilter from '@/components/catalog/VehicleEngineFilter/VehicleEngineFilter';

import Button from '@/components/common/Button/Button';
import css from './CatalogFilters.module.css';

//===============================================================

type Props = {
  value: CatalogFiltersValue;
  onChange: (next: CatalogFiltersValue) => void;
  onReset: () => void;

  locationSuggestions?: string[];
  className?: string;

  isResetDisabled?: boolean;
  isFiltering?: boolean;
};

//===============================================================

function CatalogFilters({
  value,
  onChange,
  onReset,
  locationSuggestions,
  className,
  isResetDisabled = false,
  isFiltering = false,
}: Props) {
  return (
    <section className={`${css.panel} ${className ?? ''}`}>
      <h2 className="visually-hidden">Catalog filters</h2>

      <div className={css.actions}>
        <Button
          onClick={onReset}
          variant="reset"
          disabled={isResetDisabled}
          iconLeft={!isFiltering ? <X className={css.resetBtn} /> : undefined}
        >
          {isFiltering ? 'Please wait… Filtering' : 'Reset all filters'}
        </Button>
      </div>

      <div className={css.block}>
        <LocationFilter
          value={value.location}
          suggestions={locationSuggestions}
          onChange={(location) => onChange({ ...value, location })}
        />
      </div>

      <div className={css.block}>
        <VehicleEquipmentFilter
          value={value.equipment}
          onChange={(equipment) => onChange({ ...value, equipment })}
        />
      </div>

      <div className={css.block}>
        <VehicleFormFilter
          value={value.form}
          onChange={(form) => onChange({ ...value, form })}
        />
      </div>

      <div className={css.block}>
        <VehicleTransmissionFilter
          value={value.transmission}
          onChange={(transmission) => onChange({ ...value, transmission })}
        />
      </div>

      <div className={css.block}>
        <VehicleEngineFilter
          value={value.engine}
          onChange={(engine) => onChange({ ...value, engine })}
        />
      </div>
    </section>
  );
}

export default CatalogFilters;
