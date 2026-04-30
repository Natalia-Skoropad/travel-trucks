'use client';

import clsx from 'clsx';

import {
  VEHICLE_FORMS,
  type VehicleForm,
} from '@/lib/constants/catalogFilters';

import css from '../VehicleEquipmentFilter/VehicleFilter.module.css';

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

  const select = (next: VehicleForm) => {
    onChange(value === next ? '' : next);
  };

  return (
    <section className={clsx(css.section, className)}>
      <h3 className={css.title}>Vehicle form</h3>
      <div className={css.divider} />

      <ul className={css.grid}>
        {visibleOptions.map((item) => {
          const active = value === item.value;

          return (
            <li key={item.value}>
              <button
                type="button"
                className={clsx(css.item, active && css.active)}
                onClick={() => select(item.value)}
                aria-pressed={active}
              >
                <svg className={css.icon} aria-hidden="true">
                  <use href={`/icons.svg#${item.icon}`} />
                </svg>

                <span className={css.label}>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default VehicleFormFilter;
