'use client';

import clsx from 'clsx';

import css from './CatalogOptionGrid.module.css';

//===========================================================================

export type CatalogOptionGridItem<TValue extends string = string> = {
  value: TValue;
  label: string;
  icon: string;
};

type SingleProps<TValue extends string> = {
  mode: 'single';
  title: string;
  value: TValue | '';
  options: CatalogOptionGridItem<TValue>[];
  onChange: (next: TValue | '') => void;
  className?: string;
};

type MultipleProps<TValue extends string> = {
  mode: 'multiple';
  title: string;
  value: Partial<Record<TValue, boolean>>;
  options: CatalogOptionGridItem<TValue>[];
  onChange: (next: Partial<Record<TValue, boolean>>) => void;
  className?: string;
};

type Props<TValue extends string> = SingleProps<TValue> | MultipleProps<TValue>;

//===========================================================================

function CatalogOptionGrid<TValue extends string>(props: Props<TValue>) {
  const { title, options, className } = props;

  const handleClick = (nextValue: TValue) => {
    if (props.mode === 'single') {
      props.onChange(props.value === nextValue ? '' : nextValue);
      return;
    }

    props.onChange({
      ...props.value,
      [nextValue]: !props.value[nextValue],
    });
  };

  const isActive = (optionValue: TValue) => {
    if (props.mode === 'single') {
      return props.value === optionValue;
    }

    return props.value[optionValue] === true;
  };

  return (
    <section className={clsx(css.section, className)}>
      <h3 className={css.title}>{title}</h3>
      <div className={css.divider} />

      <ul className={css.grid}>
        {options.map((option) => {
          const active = isActive(option.value);

          return (
            <li key={option.value}>
              <button
                type="button"
                className={clsx(css.item, active && css.active)}
                onClick={() => handleClick(option.value)}
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

export default CatalogOptionGrid;
