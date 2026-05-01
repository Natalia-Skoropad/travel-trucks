import type { CamperAmenity, CamperDetails } from '@/types/camper';

import {
  isCamperAmenity,
  isCamperEngine,
  isCamperForm,
  isCamperTransmission,
} from '@/lib/utils/catalogGuards';

//===========================================================================

export function normalizeAmenities(value: unknown): CamperAmenity[] {
  if (Array.isArray(value)) {
    return Array.from(new Set(value.filter(isCamperAmenity)));
  }

  if (isCamperAmenity(value)) {
    return [value];
  }

  return [];
}

export function normalizeCamperDetails(data: unknown): CamperDetails {
  const value = data as Partial<CamperDetails>;

  return {
    id: typeof value.id === 'string' ? value.id : '',
    name: typeof value.name === 'string' ? value.name : '',
    price: typeof value.price === 'number' ? value.price : 0,
    rating: typeof value.rating === 'number' ? value.rating : 0,
    totalReviews:
      typeof value.totalReviews === 'number' ? value.totalReviews : 0,
    location: typeof value.location === 'string' ? value.location : '',
    description: typeof value.description === 'string' ? value.description : '',

    form: isCamperForm(value.form) ? value.form : 'alcove',
    length: typeof value.length === 'string' ? value.length : '',
    width: typeof value.width === 'string' ? value.width : '',
    height: typeof value.height === 'string' ? value.height : '',
    tank: typeof value.tank === 'string' ? value.tank : '',
    consumption: typeof value.consumption === 'string' ? value.consumption : '',

    transmission: isCamperTransmission(value.transmission)
      ? value.transmission
      : 'automatic',

    engine: isCamperEngine(value.engine) ? value.engine : 'diesel',

    amenities: normalizeAmenities(value.amenities),

    gallery: Array.isArray(value.gallery) ? value.gallery : [],

    createdAt: typeof value.createdAt === 'string' ? value.createdAt : '',
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : '',
  };
}
