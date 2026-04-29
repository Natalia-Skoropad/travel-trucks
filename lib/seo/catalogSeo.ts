import type { Metadata } from 'next';

import type {
  CatalogFiltersValue,
  EquipmentKey,
} from '@/lib/constants/catalogFilters';

import {
  formatAmenityLabel,
  formatCamperFormLabel,
  formatEngineLabel,
  formatSortLabel,
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

//===========================================================================

export function buildCatalogTitle(filters: CatalogFiltersValue, page = 1) {
  const parts: string[] = [];

  if (filters.location.trim()) {
    parts.push(filters.location.trim());
  }

  if (filters.form) {
    parts.push(formatCamperFormLabel(filters.form));
  }

  if (filters.transmission) {
    parts.push(formatTransmissionLabel(filters.transmission));
  }

  if (filters.engine) {
    parts.push(formatEngineLabel(filters.engine));
  }

  const amenities = getActiveAmenities(filters).map(formatAmenityLabel);

  if (amenities.length) {
    parts.push(amenities.join(', '));
  }

  if (filters.sort) {
    parts.push(formatSortLabel(filters.sort));
  }

  const baseTitle = parts.length
    ? `Camper rental — ${parts.join(' • ')}`
    : 'Camper rental catalog';

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

  const highlights: string[] = [];

  if (location) {
    highlights.push(location);
  }

  if (filters.form) {
    highlights.push(formatCamperFormLabel(filters.form));
  }

  if (filters.transmission) {
    highlights.push(formatTransmissionLabel(filters.transmission));
  }

  if (filters.engine) {
    highlights.push(formatEngineLabel(filters.engine));
  }

  const amenities = getActiveAmenities(filters).map(formatAmenityLabel);

  highlights.push(...amenities);

  const title = highlights.length
    ? `Choose your ${highlights.join(' • ')} camper for the next road trip`
    : 'Choose your camper for the next road trip';

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
  const title = buildCatalogTitle(filters, page);
  const description = buildCatalogDescription(filters, page);

  const canonicalPath = buildCatalogPath(filters);
  const currentPath = buildCatalogPath(filters, page);

  return {
    title: buildPageTitle(title),
    description: description || DEFAULT_SITE_DESCRIPTION,

    alternates: {
      canonical: buildAbsoluteUrl(canonicalPath),
    },

    robots:
      page > 1
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
