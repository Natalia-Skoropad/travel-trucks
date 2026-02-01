'use client';

import clsx from 'clsx';
import type { VehicleForm } from '@/lib/constants/catalogFilters';
import { VEHICLE_FORMS } from '@/lib/constants/catalogFilters';

import css from '../VehicleEquipmentFilter/VehicleFilter.module.css';

//===========================================================================

type Props = {
  value: VehicleForm | '';
  onChange: (next: VehicleForm | '') => void;
  className?: string;
};

//===========================================================================

function VehicleFormFilter({ value, onChange, className }: Props) {
  const select = (next: VehicleForm) => {
    onChange(value === next ? '' : next);
  };

  return (
    <section className={clsx(css.section, className)}>
      <h3 className={css.title}>Vehicle form</h3>
      <div className={css.divider} />

      <ul className={css.grid}>
        {VEHICLE_FORMS.map((t) => {
          const active = value === t.value;

          return (
            <li key={t.value}>
              <button
                type="button"
                className={clsx(css.item, active && css.active)}
                onClick={() => select(t.value)}
                aria-pressed={active}
              >
                <svg className={css.icon} aria-hidden="true">
                  <use href={`/icons.svg#${t.icon}`} />
                </svg>
                <span className={css.label}>{t.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default VehicleFormFilter;
