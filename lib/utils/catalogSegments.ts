import type { CamperAmenity } from '@/types/camper';
import type { CampersQuery } from '@/types/catalog';

import type {
  CatalogFiltersValue,
  EquipmentKey,
} from '@/lib/constants/catalogFilters';

import {
  AMENITY_VALUES,
  formatAmenityLabel,
  formatCamperFormLabel,
  formatEngineLabel,
  formatTransmissionLabel,
} from '@/lib/constants/catalogFilters';

import {
  isCamperAmenity,
  isCamperEngine,
  isCamperForm,
  isCamperSort,
  isCamperTransmission,
} from '@/lib/utils/catalogGuards';

import { DEFAULT_CATALOG_FILTERS } from '@/lib/constants/catalogDefaults';
import { CATALOG_PER_PAGE } from '@/lib/constants/pagination';
import { LOCATIONS } from '@/lib/constants/locations';

//===========================================================================

const PREFIX = {
  search: 'search-',
  location: 'location-',
  form: 'form-',
  transmission: 'transmission-',
  engine: 'engine-',
  amenities: 'amenities-',
  sort: 'sort-',
  page: 'page-',
} as const;

//===========================================================================

export type CatalogSegmentsResult = {
  filters: CatalogFiltersValue;
  page: number;
};

type BreadcrumbItem = {
  label: string;
  href?: string;
};

//===========================================================================

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/['’]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

function unslugify(value: string) {
  return value.split('-').filter(Boolean).join(' ').trim();
}

function formatSearchLabel(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function stripPrefix(segment: string, prefix: string) {
  return segment.startsWith(prefix) ? segment.slice(prefix.length) : '';
}

function findLocationBySlug(slug: string) {
  return LOCATIONS.find((location) => slugify(location) === slug);
}

function cloneDefaultFilters(): CatalogFiltersValue {
  return {
    ...DEFAULT_CATALOG_FILTERS,
    equipment: {},
  };
}

//===========================================================================

export function isCatalogFilterSegment(segment: string) {
  return (
    segment.startsWith(PREFIX.search) ||
    segment.startsWith(PREFIX.location) ||
    segment.startsWith(PREFIX.form) ||
    segment.startsWith(PREFIX.transmission) ||
    segment.startsWith(PREFIX.engine) ||
    segment.startsWith(PREFIX.amenities) ||
    segment.startsWith(PREFIX.sort) ||
    segment.startsWith(PREFIX.page)
  );
}

export function isCatalogDetailsPath(segments?: string[]) {
  if (!segments?.length) return false;

  return segments.length === 1 && !isCatalogFilterSegment(segments[0]);
}

//===========================================================================

export function parseCatalogSegments(
  segments: string[] = []
): CatalogSegmentsResult {
  const filters = cloneDefaultFilters();
  let page = 1;

  for (const segment of segments) {
    if (segment.startsWith(PREFIX.search)) {
      const slug = stripPrefix(segment, PREFIX.search);
      const search = unslugify(slug);

      if (search) {
        filters.search = search;
      }

      continue;
    }

    if (segment.startsWith(PREFIX.location)) {
      const slug = stripPrefix(segment, PREFIX.location);
      const knownLocation = findLocationBySlug(slug);

      filters.location = knownLocation ?? formatSearchLabel(unslugify(slug));
      continue;
    }

    if (segment.startsWith(PREFIX.form)) {
      const value = stripPrefix(segment, PREFIX.form);

      if (isCamperForm(value)) {
        filters.form = value;
      }

      continue;
    }

    if (segment.startsWith(PREFIX.transmission)) {
      const value = stripPrefix(segment, PREFIX.transmission);

      if (isCamperTransmission(value)) {
        filters.transmission = value;
      }

      continue;
    }

    if (segment.startsWith(PREFIX.engine)) {
      const value = stripPrefix(segment, PREFIX.engine);

      if (isCamperEngine(value)) {
        filters.engine = value;
      }
      continue;
    }

    if (segment.startsWith(PREFIX.amenities)) {
      const rawValue = stripPrefix(segment, PREFIX.amenities);
      const amenities = rawValue.split('-').filter(isCamperAmenity);

      amenities.forEach((amenity) => {
        filters.equipment[amenity] = true;
      });

      continue;
    }

    if (segment.startsWith(PREFIX.sort)) {
      const value = stripPrefix(segment, PREFIX.sort);

      if (isCamperSort(value)) {
        filters.sort = value;
      }

      continue;
    }

    if (segment.startsWith(PREFIX.page)) {
      const value = Number(stripPrefix(segment, PREFIX.page));

      if (Number.isInteger(value) && value > 1) {
        page = value;
      }
    }
  }

  return {
    filters,
    page,
  };
}

//===========================================================================

function getActiveAmenities(filters: CatalogFiltersValue): EquipmentKey[] {
  return (Object.keys(filters.equipment) as EquipmentKey[])
    .filter((key) => filters.equipment[key])
    .sort(
      (a, b) =>
        AMENITY_VALUES.indexOf(a as CamperAmenity) -
        AMENITY_VALUES.indexOf(b as CamperAmenity)
    );
}

export function buildCatalogPath(filters: CatalogFiltersValue, page = 1) {
  const segments: string[] = [];

  const search = filters.search.trim();
  const location = filters.location.trim();

  if (search) {
    const searchSlug = slugify(search);

    if (searchSlug) {
      segments.push(`${PREFIX.search}${searchSlug}`);
    }
  }

  if (location) {
    segments.push(`${PREFIX.location}${slugify(location)}`);
  }

  if (filters.form) {
    segments.push(`${PREFIX.form}${filters.form}`);
  }

  if (filters.transmission) {
    segments.push(`${PREFIX.transmission}${filters.transmission}`);
  }

  if (filters.engine) {
    segments.push(`${PREFIX.engine}${filters.engine}`);
  }

  const amenities = getActiveAmenities(filters);

  if (amenities.length) {
    segments.push(`${PREFIX.amenities}${amenities.join('-')}`);
  }

  if (filters.sort) {
    segments.push(`${PREFIX.sort}${filters.sort}`);
  }

  if (page > 1) {
    segments.push(`${PREFIX.page}${page}`);
  }

  return segments.length ? `/catalog/${segments.join('/')}` : '/catalog';
}

//===========================================================================

export function buildCatalogApiParams(
  filters: CatalogFiltersValue,
  page = 1,
  perPage = CATALOG_PER_PAGE
): CampersQuery {
  const equipment = getActiveAmenities(filters);

  return {
    page,
    perPage,

    search: filters.search.trim() || undefined,
    location: filters.location.trim() || undefined,
    form: filters.form || undefined,
    transmission: filters.transmission || undefined,
    engine: filters.engine || undefined,

    sort: filters.sort || undefined,
    equipment: equipment.length ? equipment : undefined,
  };
}

//===========================================================================

export function buildCatalogBreadcrumbs(
  filters: CatalogFiltersValue,
  page = 1
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Catalog', href: '/catalog' },
  ];

  let current: CatalogFiltersValue = cloneDefaultFilters();

  const location = filters.location.trim();

  if (location) {
    current = { ...current, location };
    items.push({
      label: location,
      href: buildCatalogPath(current),
    });
  }

  if (filters.form) {
    current = { ...current, form: filters.form };
    items.push({
      label: formatCamperFormLabel(filters.form),
      href: buildCatalogPath(current),
    });
  }

  if (filters.transmission) {
    current = { ...current, transmission: filters.transmission };
    items.push({
      label: formatTransmissionLabel(filters.transmission),
      href: buildCatalogPath(current),
    });
  }

  if (filters.engine) {
    current = { ...current, engine: filters.engine };
    items.push({
      label: formatEngineLabel(filters.engine),
      href: buildCatalogPath(current),
    });
  }

  const amenities = getActiveAmenities(filters);

  if (amenities.length) {
    amenities.forEach((amenity) => {
      current = {
        ...current,
        equipment: {
          ...current.equipment,
          [amenity]: true,
        },
      };

      items.push({
        label: formatAmenityLabel(amenity),
        href: buildCatalogPath(current),
      });
    });
  }

  if (page > 1) {
    items.push({
      label: `Page ${page}`,
      href: buildCatalogPath(current, page),
    });
  }

  const lastItem = items.at(-1);

  if (lastItem) {
    delete lastItem.href;
  }

  return items;
}
