'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

import SvgIcon from '@/components/common/SvgIcon/SvgIcon';

import css from './CustomSelect.module.css';

//===========================================================================

export type CustomSelectOption<TValue extends string = string> = {
  value: TValue;
  label: string;
};

//===========================================================================

type Props<TValue extends string = string> = {
  value: TValue;
  options: CustomSelectOption<TValue>[];
  onChange: (value: TValue) => void;

  label: string;
  placeholder?: string;
  className?: string;
  iconName?: string;
  listboxId?: string;
};

//===========================================================================

function CustomSelect<TValue extends string = string>({
  value,
  options,
  onChange,
  label,
  placeholder = 'Select',
  className,
  iconName,
  listboxId,
}: Props<TValue>) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const reactId = useId();

  const labelId = `${reactId}-label`;
  const resolvedListboxId = listboxId ?? `${reactId}-listbox`;

  const selectedLabel = useMemo(() => {
    return (
      options.find((option) => option.value === value)?.label ?? placeholder
    );
  }, [options, placeholder, value]);

  const showList = open && options.length > 0;

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const element = wrapRef.current;

      if (!element) return;

      if (!element.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);

    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const pick = (nextValue: TValue) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div className={clsx(css.field, className)} ref={wrapRef}>
      <span className={css.label} id={labelId}>
        {label}
      </span>

      <button
        type="button"
        className={clsx(css.control, iconName && css.controlWithIcon)}
        aria-labelledby={labelId}
        aria-expanded={showList}
        aria-controls={showList ? resolvedListboxId : undefined}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
      >
        {iconName ? (
          <SvgIcon name={iconName} className={css.icon} aria-hidden="true" />
        ) : null}

        <span className={css.value}>{selectedLabel}</span>

        <ChevronDown
          className={clsx(css.chevron, open && css.chevronOpen)}
          aria-hidden="true"
        />
      </button>

      {showList ? (
        <div className={css.dropdown} role="listbox" id={resolvedListboxId}>
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                className={clsx(css.option, active && css.optionActive)}
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

export default CustomSelect;
