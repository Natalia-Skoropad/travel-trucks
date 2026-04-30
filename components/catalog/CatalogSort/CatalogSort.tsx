'use client';

import CustomSelect, {
  type CustomSelectOption,
} from '@/components/common/CustomSelect/CustomSelect';

import { SORT_OPTIONS } from '@/lib/constants/catalogFilters';

import type { CamperSort } from '@/types/catalog';

//===========================================================================

type Props = {
  value: CamperSort | '';
  onChange: (value: CamperSort | '') => void;
  className?: string;
};

//===========================================================================

const SORT_SELECT_OPTIONS: CustomSelectOption<CamperSort | ''>[] = [
  { value: '', label: 'Default' },
  ...SORT_OPTIONS,
];

//===========================================================================

function CatalogSort({ value, onChange, className }: Props) {
  return (
    <CustomSelect
      value={value}
      options={SORT_SELECT_OPTIONS}
      onChange={onChange}
      label="Sort by"
      placeholder="Default"
      className={className}
      listboxId="catalog-sort-listbox"
    />
  );
}

export default CatalogSort;
