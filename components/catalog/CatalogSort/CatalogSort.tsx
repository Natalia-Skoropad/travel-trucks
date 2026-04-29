'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import type { CamperSort } from '@/types/catalog';
import { SORT_OPTIONS } from '@/lib/constants/catalogFilters';

import css from './CatalogSort.module.css';

//===========================================================================

type Props = {
  value: CamperSort | '';
  onChange: (value: CamperSort | '') => void;
  className?: string;
};

//===========================================================================

const DEFAULT_LABEL = 'Default';

//===========================================================================

function CatalogSort({ value, onChange, className }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const selectedLabel = useMemo(() => {
    return (
      SORT_OPTIONS.find((option) => option.value === value)?.label ??
      DEFAULT_LABEL
    );
  }, [value]);

  const listboxId = 'catalog-sort-listbox';
  const showList = open;

  useEffect(() => {
    const onDown = (event: MouseEvent) => {
      const element = wrapRef.current;

      if (!element) return;
      if (!element.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onDown);

    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const pick = (nextValue: CamperSort | '') => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div className={`${css.field} ${className ?? ''}`} ref={wrapRef}>
      <span className={css.label} id="catalog-sort-label">
        Sort by
      </span>

      <button
        type="button"
        className={css.control}
        aria-labelledby="catalog-sort-label"
        aria-expanded={showList}
        aria-controls={showList ? listboxId : undefined}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
      >
        <span className={css.value}>{selectedLabel}</span>

        <ChevronDown
          className={`${css.chevron} ${open ? css.chevronOpen : ''}`}
          aria-hidden="true"
        />
      </button>

      {showList ? (
        <div className={css.dropdown} role="listbox" id={listboxId}>
          <button
            type="button"
            role="option"
            aria-selected={value === ''}
            className={`${css.option} ${value === '' ? css.optionActive : ''}`}
            onClick={() => pick('')}
          >
            {DEFAULT_LABEL}
          </button>

          {SORT_OPTIONS.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                className={`${css.option} ${active ? css.optionActive : ''}`}
                onClick={() => pick(option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default CatalogSort;
