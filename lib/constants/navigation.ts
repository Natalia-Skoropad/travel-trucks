import { ROUTES } from '@/lib/constants/routes';

//===========================================================================

export const NAV_ITEMS = [
  {
    label: 'Home',
    href: ROUTES.HOME,
  },
  {
    label: 'Catalog',
    href: ROUTES.CATALOG,
  },
] as const;
