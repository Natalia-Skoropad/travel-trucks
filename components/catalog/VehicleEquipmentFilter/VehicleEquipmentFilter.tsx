'use client';

import clsx from 'clsx';

import {
  EQUIPMENT_OPTIONS,
  type EquipmentKey,
} from '@/lib/constants/catalogFilters';

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

    onChange({
      ...value,
      [key]: !current,
    });
  };

  return (
    <section className={clsx(css.section, className)}>
      <h3 className={css.title}>Vehicle equipment</h3>
      <div className={css.divider} />

      <ul className={css.grid}>
        {EQUIPMENT_OPTIONS.map((option) => {
          const active = value[option.key] === true;

          return (
            <li key={option.key}>
              <button
                type="button"
                className={clsx(css.item, active && css.active)}
                onClick={() => toggle(option.key)}
                aria-pressed={active}
              >
                <svg className={css.icon} aria-hidden="true">
                  <use href={`/icons.svg#${option.icon}`} />
                </svg>

                <span className={css.label}>{option.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default VehicleEquipmentFilter;
