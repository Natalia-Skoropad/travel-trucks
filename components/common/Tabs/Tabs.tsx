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

  renderPanel: (value: T) => React.ReactNode;
};

//===============================================================

function Tabs<T extends string>({
  items,
  value,
  onChange,
  ariaLabel = 'Tabs',
  className,
  renderPanel,
}: Props<T>) {
  const baseId = useId();

  return (
    <div className={`${css.wrap} ${className ?? ''}`}>
      <div className={css.list} role="tablist" aria-label={ariaLabel}>
        {items.map((t) => {
          const isActive = t.value === value;
          const tabId = `${baseId}-tab-${t.value}`;
          const panelId = `${baseId}-panel-${t.value}`;

          const labelForA11y =
            typeof t.count === 'number' ? `${t.label} (${t.count})` : t.label;

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
              aria-label={labelForA11y}
            >
              <span className={css.divCount}>
                <span className={css.label}>{t.label}</span>

                {typeof t.count === 'number' ? (
                  <span className={css.count} aria-hidden="true">
                    {t.count}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      {items.map((t) => {
        const isActive = t.value === value;
        const tabId = `${baseId}-tab-${t.value}`;
        const panelId = `${baseId}-panel-${t.value}`;

        return (
          <div
            key={t.value}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!isActive}
          >
            {isActive ? renderPanel(t.value) : null}
          </div>
        );
      })}
    </div>
  );
}

export default Tabs;
