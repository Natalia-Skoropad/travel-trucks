import type { Metadata } from 'next';

import type {
  CatalogFiltersValue,
  EquipmentKey,
} from '@/lib/constants/catalogFilters';

import {
  formatAmenityLabel,
  formatCamperFormLabel,
  formatEngineLabel,
  formatTransmissionLabel,
} from '@/lib/constants/catalogFilters';

import {
  DEFAULT_OG_ALT,
  DEFAULT_OG_IMAGE,
  DEFAULT_SITE_DESCRIPTION,
  SITE_NAME,
  buildAbsoluteUrl,
  buildPageTitle,
} from '@/lib/constants/metadata';

import { buildCatalogPath } from '@/lib/utils/catalogSegments';

//===========================================================================

function getActiveAmenities(filters: CatalogFiltersValue) {
  return (Object.keys(filters.equipment) as EquipmentKey[]).filter(
    (key) => filters.equipment[key]
  );
}

function getSeoFilters(filters: CatalogFiltersValue): CatalogFiltersValue {
  return {
    ...filters,
    search: '',
    sort: '',
    equipment: { ...filters.equipment },
  };
}

function lower(value: string) {
  return value.toLowerCase();
}

function getArticle(value: string) {
  const firstLetter = value.trim().charAt(0).toLowerCase();

  return ['a', 'e', 'i', 'o', 'u'].includes(firstLetter) ? 'an' : 'a';
}

function joinHumanList(items: string[]) {
  if (items.length <= 1) return items[0] ?? '';

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
}

function buildReadableCatalogPhrase(filters: CatalogFiltersValue) {
  const location = filters.location.trim();

  const form = filters.form ? lower(formatCamperFormLabel(filters.form)) : '';
  const transmission = filters.transmission
    ? `${lower(formatTransmissionLabel(filters.transmission))} transmission`
    : '';
  const engine = filters.engine
    ? `${lower(formatEngineLabel(filters.engine))} engine`
    : '';

  const details = [transmission, engine].filter(Boolean);

  const base = form ? `${getArticle(form)} ${form} camper` : 'your camper';

  const locationText = location ? ` in ${location}` : '';
  const detailsText = details.length ? ` with ${joinHumanList(details)}` : '';

  return `${base}${locationText}${detailsText}`;
}

//===========================================================================

export function buildCatalogTitle(filters: CatalogFiltersValue, page = 1) {
  const phrase = buildReadableCatalogPhrase(filters);

  const baseTitle =
    phrase === 'your camper'
      ? 'Camper rental catalog'
      : `Camper rental — ${phrase}`;

  return page > 1 ? `${baseTitle} — Page ${page}` : baseTitle;
}

//===========================================================================

export function buildCatalogDescription(
  filters: CatalogFiltersValue,
  page = 1
) {
  const location = filters.location.trim();

  const details: string[] = [];

  if (location) {
    details.push(`in ${location}`);
  }

  if (filters.form) {
    details.push(`with ${formatCamperFormLabel(filters.form)} body type`);
  }

  if (filters.transmission) {
    details.push(
      `${formatTransmissionLabel(filters.transmission)} transmission`
    );
  }

  if (filters.engine) {
    details.push(`${formatEngineLabel(filters.engine)} engine`);
  }

  const amenities = getActiveAmenities(filters).map(formatAmenityLabel);

  if (amenities.length) {
    details.push(`with ${amenities.join(', ')}`);
  }

  const filterText = details.length ? ` ${details.join(', ')}` : '';

  const pageText = page > 1 ? ` Page ${page}.` : '';

  return `Browse TravelTrucks campers${filterText}. Compare prices, features, ratings, and locations to choose the right vehicle for your next trip.${pageText}`;
}

//===========================================================================

export function buildCatalogSeoText(filters: CatalogFiltersValue) {
  const location = filters.location.trim();

  const amenities = getActiveAmenities(filters).map(formatAmenityLabel);

  const readablePhrase = buildReadableCatalogPhrase(filters);

  const title =
    readablePhrase === 'your camper'
      ? 'Choose your camper for the next road trip'
      : `Choose ${readablePhrase} for the next road trip`;

  const descriptionParts = [
    {
      text: 'Explore TravelTrucks campers',
      highlighted: false,
    },
  ];

  if (location) {
    descriptionParts.push({ text: ' in ', highlighted: false });
    descriptionParts.push({ text: location, highlighted: true });
  }

  if (filters.form) {
    descriptionParts.push({ text: ' with ', highlighted: false });
    descriptionParts.push({
      text: formatCamperFormLabel(filters.form),
      highlighted: true,
    });
    descriptionParts.push({ text: ' body type', highlighted: false });
  }

  if (filters.transmission) {
    descriptionParts.push({ text: ', ', highlighted: false });
    descriptionParts.push({
      text: formatTransmissionLabel(filters.transmission),
      highlighted: true,
    });
    descriptionParts.push({ text: ' transmission', highlighted: false });
  }

  if (filters.engine) {
    descriptionParts.push({ text: ', ', highlighted: false });
    descriptionParts.push({
      text: formatEngineLabel(filters.engine),
      highlighted: true,
    });
    descriptionParts.push({ text: ' engine', highlighted: false });
  }

  if (amenities.length) {
    descriptionParts.push({
      text: ', and equipment such as ',
      highlighted: false,
    });
    descriptionParts.push({
      text: amenities.join(', '),
      highlighted: true,
    });
  }

  descriptionParts.push({
    text: '. Compare prices, ratings, locations, vehicle specifications, gallery photos, reviews, and booking options to choose the right camper for your trip.',
    highlighted: false,
  });

  return {
    title,
    descriptionParts,
  };
}

//===========================================================================

export function buildCatalogMetadata({
  filters,
  page,
}: {
  filters: CatalogFiltersValue;
  page: number;
}): Metadata {
  const seoFilters = getSeoFilters(filters);

  const title = buildCatalogTitle(seoFilters, page);
  const description = buildCatalogDescription(seoFilters, page);

  const canonicalPath = buildCatalogPath(seoFilters);
  const currentPath = buildCatalogPath(filters, page);

  const hasSearch = Boolean(filters.search.trim());
  const hasSort = Boolean(filters.sort);

  return {
    title: buildPageTitle(title),
    description: description || DEFAULT_SITE_DESCRIPTION,

    alternates: {
      canonical: buildAbsoluteUrl(canonicalPath),
    },

    robots:
      page > 1 || hasSearch || hasSort
        ? {
            index: false,
            follow: true,
          }
        : {
            index: true,
            follow: true,
          },

    openGraph: {
      title: buildPageTitle(title),
      description,
      url: buildAbsoluteUrl(currentPath),
      siteName: SITE_NAME,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: DEFAULT_OG_ALT,
        },
      ],
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: buildPageTitle(title),
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
