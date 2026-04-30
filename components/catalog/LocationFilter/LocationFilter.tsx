'use client';

import { useMemo } from 'react';

import CustomSelect, {
  type CustomSelectOption,
} from '@/components/common/CustomSelect/CustomSelect';

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

function LocationFilter({
  value,
  onChange,
  suggestions = [],
  label = 'Location',
  placeholder = 'City',
  name = 'location',
}: Props) {
  const options = useMemo<CustomSelectOption<string>[]>(() => {
    const uniqueSuggestions = Array.from(
      new Set(
        suggestions
          .map((suggestion) => suggestion.trim())
          .filter((suggestion) => suggestion.length > 0)
      )
    ).sort((a, b) => a.localeCompare(b));

    return [
      { value: '', label: placeholder },
      ...uniqueSuggestions.map((location) => ({
        value: location,
        label: location,
      })),
    ];
  }, [placeholder, suggestions]);

  const safeValue = options.some((option) => option.value === value)
    ? value
    : '';

  return (
    <CustomSelect
      value={safeValue}
      options={options}
      onChange={onChange}
      label={label}
      placeholder={placeholder}
      iconName="icon-map"
      listboxId={`${name}-listbox`}
    />
  );
}

export default LocationFilter;
