'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchCamperById } from '@/lib/api/campersApi';
import { campersQueryKeys } from '@/lib/queryKeys/campersQueryKeys';

import type { CamperDetails, CamperListItem } from '@/types/camper';

//===========================================================================

function mapCamperDetailsToListItem(camper: CamperDetails): CamperListItem {
  return {
    id: camper.id,
    name: camper.name,
    price: camper.price,
    rating: camper.rating,
    location: camper.location,
    form: camper.form,
    length: camper.length,
    width: camper.width,
    height: camper.height,
    tank: camper.tank,
    consumption: camper.consumption,
    transmission: camper.transmission,
    engine: camper.engine,
    amenities: camper.amenities,
    totalReviews: camper.totalReviews,
    coverImage:
      camper.gallery?.[0]?.thumb ?? camper.gallery?.[0]?.original ?? '',
  };
}

//===========================================================================

export function useFavoriteCampers(favoriteIds: string[], enabled = true) {
  return useQuery({
    queryKey: campersQueryKeys.favorites(favoriteIds),
    queryFn: async () => {
      if (!favoriteIds.length) return [];

      const results = await Promise.all(
        favoriteIds.map(async (id) => {
          try {
            const camper = await fetchCamperById(id);

            return mapCamperDetailsToListItem(camper);
          } catch {
            return null;
          }
        })
      );

      return results.filter((item): item is CamperListItem => item !== null);
    },
    enabled: enabled && favoriteIds.length > 0,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
}
