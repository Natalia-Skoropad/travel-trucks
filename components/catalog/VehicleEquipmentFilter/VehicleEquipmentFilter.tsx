'use client';

import clsx from 'clsx';
import type { EquipmentKey } from '@/lib/constants/catalogFilters';
import { EQUIPMENT_OPTIONS } from '@/lib/constants/catalogFilters';

import css from './VehicleFilter.module.css';

//===========================================================================

type Props = {
  value: Partial<Record<EquipmentKey, boolean>>;
  onChange: (next: Partial<Record<EquipmentKey, boolean>>) => void;
  className?: string;
};

//===========================================================================

function VehicleEquipmentFilter({ value, onChange, className }: Props) {
  const toggle = (key: EquipmentKey) => {
    const current = Boolean(value[key]);
    onChange({ ...value, [key]: !current });
  };

  return (
    <section className={clsx(css.section, className)}>
      <h3 className={css.title}>Vehicle equipment</h3>
      <div className={css.divider} />

      <ul className={css.grid}>
        {EQUIPMENT_OPTIONS.map((opt) => {
          const active = value[opt.key] === true;

          return (
            <li key={opt.key}>
              <button
                type="button"
                className={clsx(css.item, active && css.active)}
                onClick={() => toggle(opt.key)}
                aria-pressed={active}
              >
                <svg className={css.icon} aria-hidden="true">
                  <use href={`/icons.svg#${opt.icon}`} />
                </svg>
                <span className={css.label}>{opt.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default VehicleEquipmentFilter;
