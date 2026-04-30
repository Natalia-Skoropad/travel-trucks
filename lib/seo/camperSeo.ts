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

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;

  return `${value.slice(0, maxLength - 1).trim()}…`;
}

//===========================================================================

export function buildCamperTitle(camper: CamperDetails) {
  return `${camper.name} camper rental`;
}

//===========================================================================

export function buildCamperDescription(camper: CamperDetails) {
  const parts: string[] = [];

  if (camper.location) {
    parts.push(`Location: ${camper.location}.`);
  }

  if (camper.form) {
    parts.push(`Vehicle form: ${camper.form.replace('_', ' ')}.`);
  }

  if (camper.transmission) {
    parts.push(`Transmission: ${camper.transmission}.`);
  }

  if (camper.engine) {
    parts.push(`Engine: ${camper.engine}.`);
  }

  if (camper.description?.trim()) {
    parts.push(camper.description.trim());
  }

  const description = parts.join(' ');

  return truncate(description || DEFAULT_SITE_DESCRIPTION, 160);
}

//===========================================================================

export function getCamperOgImage(camper: CamperDetails) {
  return camper.gallery?.[0]?.original || DEFAULT_OG_IMAGE;
}

//===========================================================================

export function buildCamperMetadata(camper: CamperDetails): Metadata {
  const title = buildCamperTitle(camper);
  const description = buildCamperDescription(camper);
  const url = buildAbsoluteUrl(buildCamperHref(camper));
  const image = getCamperOgImage(camper);

  return {
    title: buildPageTitle(title),
    description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: buildPageTitle(title),
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
      title: buildPageTitle(title),
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
