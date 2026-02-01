'use client';

import { useId } from 'react';
import css from './Tabs.module.css';

//===============================================================

export type TabItem<T extends string> = {
  value: T;
  label: string;
  disabled?: boolean;
  count?: number;
};

type Props<T extends string> = {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;

  ariaLabel?: string;
  className?: string;
};

//===============================================================

function Tabs<T extends string>({
  items,
  value,
  onChange,
  ariaLabel = 'Tabs',
  className,
}: Props<T>) {
  const baseId = useId();

  return (
    <div className={`${css.wrap} ${className ?? ''}`}>
      <div className={css.list} role="tablist" aria-label={ariaLabel}>
        {items.map((t) => {
          const isActive = t.value === value;
          const tabId = `${baseId}-tab-${t.value}`;
          const panelId = `${baseId}-panel-${t.value}`;

          return (
            <button
              key={t.value}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              disabled={t.disabled}
              className={`${css.tab} ${isActive ? css.active : ''}`}
              onClick={() => onChange(t.value)}
            >
              <div className={css.divCount}>
                <span className={css.label}>{t.label}</span>

                {typeof t.count === 'number' ? (
                  <span className={css.count} aria-label={`${t.count}`}>
                    {t.count}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Tabs;
