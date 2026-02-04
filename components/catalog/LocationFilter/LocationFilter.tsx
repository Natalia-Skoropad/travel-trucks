'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import SvgIcon from '@/components/common/SvgIcon/SvgIcon';
import css from './LocationFilter.module.css';

//===========================================================================

type Props = {
  value: string;
  onChange: (value: string) => void;

  suggestions?: string[];

  label?: string;
  placeholder?: string;
  name?: string;
};

//===========================================================================

function normalize(s: string) {
  return s.trim().toLowerCase();
}

//===========================================================================

function LocationFilter({
  value,
  onChange,
  suggestions = [],
  label = 'Location',
  placeholder = 'City',
  name = 'location',
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const list = Array.isArray(suggestions) ? suggestions : [];
    const q = normalize(value);

    if (!q) return list;

    const isExactMatch = list.some((x) => normalize(x) === q);
    if (isExactMatch) return list;

    return list.filter((x) => normalize(x).includes(q));
  }, [suggestions, value]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const hasList = filtered.length > 0;
  const listboxId = `${name}-listbox`;
  const showList = open && hasList;

  const pick = (city: string) => {
    onChange(city);
    setOpen(false);
  };

  return (
    <div className={css.field} ref={wrapRef}>
      <label className={css.label} htmlFor={name}>
        {label}
      </label>

      <div className={css.control}>
        <SvgIcon name="icon-map" className={css.icon} title="Location" />

        <input
          id={name}
          name={name}
          type="text"
          className={css.input}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={showList}
          aria-controls={showList ? listboxId : undefined}
          aria-autocomplete="list"
          aria-haspopup="listbox"
        />

        <button
          type="button"
          className={css.chevronBtn}
          onClick={() => setOpen((v) => !v)}
          aria-label={showList ? 'Close list' : 'Open list'}
        >
          <ChevronDown
            className={`${css.chevron} ${open ? css.chevronOpen : ''}`}
          />
        </button>

        {showList && (
          <div className={css.dropdown} role="listbox" id={listboxId}>
            {filtered.map((s) => {
              const active = s === value;
              return (
                <button
                  key={s}
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`${css.option} ${active ? css.optionActive : ''}`}
                  onClick={() => pick(s)}
                >
                  {s}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationFilter;
