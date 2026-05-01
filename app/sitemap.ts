import type { MetadataRoute } from 'next';

import { fetchCampersFromServer } from '@/lib/api/campersApi';

import { CATALOG_PER_PAGE } from '@/lib/constants/pagination';
import { SITE_URL } from '@/lib/constants/metadata';
import { ROUTES } from '@/lib/constants/routes';

import { buildCamperHref } from '@/lib/utils/camperSlug';

//===========================================================================

export const dynamic = 'force-dynamic';

//===========================================================================

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}${ROUTES.HOME}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}${ROUTES.CATALOG}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  try {
    const firstPage = await fetchCampersFromServer({
      page: 1,
      perPage: CATALOG_PER_PAGE,
    });

    const restPages =
      firstPage.totalPages > 1
        ? await Promise.all(
            Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
              fetchCampersFromServer({
                page: index + 2,
                perPage: CATALOG_PER_PAGE,
              })
            )
          )
        : [];

    const campers = [
      ...firstPage.campers,
      ...restPages.flatMap((page) => page.campers),
    ];

    const camperRoutes: MetadataRoute.Sitemap = campers.map((camper) => ({
      url: `${SITE_URL}${buildCamperHref(camper)}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticRoutes, ...camperRoutes];
  } catch (error) {
    console.error('Failed to generate camper sitemap routes:', error);

    return staticRoutes;
  }
}
