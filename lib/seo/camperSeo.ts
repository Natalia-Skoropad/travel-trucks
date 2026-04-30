import type { Metadata } from 'next';

import type { CamperDetails } from '@/types/camper';
import { buildCamperHref } from '@/lib/utils/camperSlug';

import {
  DEFAULT_OG_ALT,
  DEFAULT_OG_IMAGE,
  DEFAULT_SITE_DESCRIPTION,
  SITE_NAME,
  buildAbsoluteUrl,
  buildPageTitle,
} from '@/lib/constants/metadata';

//===========================================================================

const DESCRIPTION_MAX_LENGTH = 160;

//===========================================================================

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;

  return `${value.slice(0, maxLength - 1).trim()}…`;
}

function getAbsoluteImageUrl(src: string) {
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  return buildAbsoluteUrl(src);
}

//===========================================================================

export function buildCamperTitle(camper: CamperDetails) {
  return `${camper.name} camper rental`;
}

//===========================================================================

export function buildCamperDescription(camper: CamperDetails) {
  const ownDescription = camper.description?.trim();

  if (ownDescription) {
    return truncate(ownDescription, DESCRIPTION_MAX_LENGTH);
  }

  const fallbackParts = [
    camper.location ? `Location: ${camper.location}.` : '',
    camper.form ? `Vehicle form: ${camper.form.replace('_', ' ')}.` : '',
    camper.transmission ? `Transmission: ${camper.transmission}.` : '',
    camper.engine ? `Engine: ${camper.engine}.` : '',
  ].filter(Boolean);

  const fallbackDescription = fallbackParts.join(' ');

  return truncate(
    fallbackDescription || DEFAULT_SITE_DESCRIPTION,
    DESCRIPTION_MAX_LENGTH
  );
}

//===========================================================================

export function getCamperOgImage(camper: CamperDetails) {
  return (
    camper.gallery?.[0]?.original ||
    camper.gallery?.[0]?.thumb ||
    DEFAULT_OG_IMAGE
  );
}

//===========================================================================

export function buildCamperMetadata(camper: CamperDetails): Metadata {
  const title = buildCamperTitle(camper);
  const pageTitle = buildPageTitle(title);
  const description = buildCamperDescription(camper);
  const url = buildAbsoluteUrl(buildCamperHref(camper));
  const image = getAbsoluteImageUrl(getCamperOgImage(camper));

  return {
    title: pageTitle,
    description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: camper.name || DEFAULT_OG_ALT,
        },
      ],
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [image],
    },
  };
}

//===========================================================================

export function buildCamperNotFoundMetadata(): Metadata {
  return {
    title: buildPageTitle('Camper not found'),
    description:
      'The camper you are looking for was not found on TravelTrucks.',
    robots: {
      index: false,
      follow: true,
    },
  };
}
