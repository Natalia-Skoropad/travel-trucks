export const SITE_NAME = 'TravelTrucks';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const DEFAULT_OG_IMAGE = '/background-picture.jpg';

export const DEFAULT_OG_ALT = 'TravelTrucks camper rental';

export const DEFAULT_SITE_DESCRIPTION =
  'TravelTrucks helps you find and rent campers for comfortable road trips across Ukraine. Browse vehicles, compare features, read reviews, and book your camper online.';

//===========================================================================

export function buildAbsoluteUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return new URL(normalizedPath, SITE_URL).toString();
}

//===========================================================================

export function buildPageTitle(title: string) {
  return title;
}
