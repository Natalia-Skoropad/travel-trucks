'use client';

import clsx from 'clsx';
import type { VehicleEngine } from '@/lib/constants/catalogFilters';
import { ENGINE_OPTIONS } from '@/lib/constants/catalogFilters';

import css from '../VehicleEquipmentFilter/VehicleFilter.module.css';

//===========================================================================

type Props = {
  value: VehicleEngine | '';
  onChange: (next: VehicleEngine | '') => void;
  className?: string;
};

//===========================================================================

function VehicleEngineFilter({ value, onChange, className }: Props) {
  const select = (next: VehicleEngine) => {
    onChange(value === next ? '' : next);
  };

  return (
    <section className={clsx(css.section, className)}>
      <h3 className={css.title}>Vehicle engine</h3>
      <div className={css.divider} />

      <ul className={css.grid}>
        {ENGINE_OPTIONS.map((t) => {
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

export default VehicleEngineFilter;
