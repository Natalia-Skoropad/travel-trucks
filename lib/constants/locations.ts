export const LOCATIONS = [
  'Ukraine, Kyiv',
  'Ukraine, Dnipro',
  'Ukraine, Odesa',
  'Ukraine, Lviv',
  'Ukraine, Kharkiv',
  'Ukraine, Sumy',
  'Ukraine, Poltava',
] as const;

export type LocationValue = (typeof LOCATIONS)[number];
