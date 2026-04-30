//===========================================================================

const SLUG_ID_SEPARATOR = '--';

//===========================================================================

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

//===========================================================================

export function createCamperSlug(name: string, id: string) {
  const nameSlug = slugify(name);

  return `${nameSlug}${SLUG_ID_SEPARATOR}${id}`;
}

//===========================================================================

export function getCamperIdFromSlug(slug: string) {
  const [, id] = slug.split(SLUG_ID_SEPARATOR);

  return id || slug;
}

//===========================================================================

export function getCamperSlug(camper: { id: string; name: string }) {
  return createCamperSlug(camper.name, camper.id);
}

//===========================================================================

export function buildCamperHref(camper: { id: string; name: string }) {
  return `/${getCamperSlug(camper)}`;
}

//===========================================================================

export function buildLegacyCamperHref(camper: { id: string; name: string }) {
  return `/catalog/${getCamperSlug(camper)}`;
}

//===========================================================================

export function isCamperSlug(slug: string) {
  return slug.includes(SLUG_ID_SEPARATOR);
}
