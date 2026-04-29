import type { Metadata } from 'next';

import {
  DEFAULT_OG_ALT,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  buildAbsoluteUrl,
  buildPageTitle,
} from '@/lib/constants/metadata';

//===========================================================================

type BuildMetadataParams = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
};

//===========================================================================

export function buildMetadata({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  imageAlt = DEFAULT_OG_ALT,
  noIndex = false,
}: BuildMetadataParams): Metadata {
  const fullTitle = buildPageTitle(title);
  const url = buildAbsoluteUrl(path);

  return {
    title: fullTitle,
    description,

    alternates: {
      canonical: url,
    },

    robots: {
      index: !noIndex,
      follow: true,
    },

    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
