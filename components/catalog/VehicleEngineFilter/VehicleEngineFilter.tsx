'use client';

import clsx from 'clsx';

import {
  ENGINE_OPTIONS,
  type VehicleEngine,
} from '@/lib/constants/catalogFilters';

import css from '../VehicleEquipmentFilter/VehicleFilter.module.css';

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

  const select = (next: VehicleEngine) => {
    onChange(value === next ? '' : next);
  };

  return (
    <section className={clsx(css.section, className)}>
      <h3 className={css.title}>Vehicle engine</h3>
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

export default VehicleEngineFilter;
