'use client';

import { Search, X } from 'lucide-react';

import css from './CatalogSearch.module.css';

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
};

function normalizeSearchInput(value: string) {
  return value
    .replace(/[^A-Za-z0-9\s'-]/g, '')
    .replace(/\s{2,}/g, ' ')
    .slice(0, 50);
}

function CatalogSearch({
  value,
  onChange,
  className,
  id = 'catalog-search',
}: Props) {
  return (
    <div className={`${css.field} ${className ?? ''}`}>
      <label className={css.label} htmlFor={id}>
        Search camper
      </label>

      <div className={css.box}>
        <Search className={css.icon} aria-hidden="true" />

        <input
          id={id}
          type="text"
          value={value}
          className={css.input}
          placeholder="Search by camper name"
          autoComplete="off"
          maxLength={50}
          onChange={(event) => {
            onChange(normalizeSearchInput(event.target.value));
          }}
        />

        {value ? (
          <button
            type="button"
            className={css.clear}
            aria-label="Clear search"
            onClick={() => onChange('')}
          >
            <X size={18} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default CatalogSearch;
