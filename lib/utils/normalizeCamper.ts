import type {
  CamperAmenity,
  CamperDetails,
  CamperGalleryItem,
  CamperListItem,
} from '@/types/camper';

import type { CampersResponse } from '@/types/catalog';

import { CATALOG_PER_PAGE } from '@/lib/constants/pagination';

import {
  isCamperAmenity,
  isCamperEngine,
  isCamperForm,
  isCamperTransmission,
} from '@/lib/utils/catalogGuards';

//===========================================================================

const DEFAULT_PAGE = 1;

//===========================================================================

function normalizeString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function normalizeNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

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

function normalizeGalleryItem(data: unknown): CamperGalleryItem | null {
  const value = data as Partial<CamperGalleryItem>;

  if (typeof value.id !== 'string' || !value.id) return null;

  return {
    id: value.id,
    camperId: normalizeString(value.camperId),
    thumb: normalizeString(value.thumb),
    original: normalizeString(value.original),
    order: normalizeNumber(value.order),
  };
}

function normalizeGallery(value: unknown): CamperGalleryItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map(normalizeGalleryItem)
    .filter((item): item is CamperGalleryItem => item !== null)
    .sort((a, b) => a.order - b.order);
}

//===========================================================================

export function normalizeCamperListItem(data: unknown): CamperListItem | null {
  const value = data as Partial<CamperListItem>;

  if (typeof value.id !== 'string' || !value.id) return null;
  if (typeof value.name !== 'string' || !value.name) return null;

  return {
    id: value.id,
    name: value.name,
    price: normalizeNumber(value.price),
    rating: normalizeNumber(value.rating),
    location: normalizeString(value.location),

    form: isCamperForm(value.form) ? value.form : 'alcove',

    length: normalizeString(value.length),
    width: normalizeString(value.width),
    height: normalizeString(value.height),
    tank: normalizeString(value.tank),
    consumption: normalizeString(value.consumption),

    transmission: isCamperTransmission(value.transmission)
      ? value.transmission
      : 'automatic',

    engine: isCamperEngine(value.engine) ? value.engine : 'diesel',

    amenities: normalizeAmenities(value.amenities),

    coverImage: normalizeString(value.coverImage),

    totalReviews: normalizeNumber(value.totalReviews),
  };
}

export function normalizeCamperList(value: unknown): CamperListItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map(normalizeCamperListItem)
    .filter((item): item is CamperListItem => item !== null);
}

export function normalizeCampersResponse(data: unknown): CampersResponse {
  const value = data as Partial<CampersResponse>;

  return {
    page: normalizeNumber(value.page) || DEFAULT_PAGE,
    perPage: normalizeNumber(value.perPage) || CATALOG_PER_PAGE,
    total: normalizeNumber(value.total),
    totalPages: normalizeNumber(value.totalPages),
    campers: normalizeCamperList(value.campers),
  };
}

//===========================================================================

export function normalizeCamperDetails(data: unknown): CamperDetails {
  const value = data as Partial<CamperDetails>;

  return {
    id: normalizeString(value.id),
    name: normalizeString(value.name),
    price: normalizeNumber(value.price),
    rating: normalizeNumber(value.rating),
    totalReviews: normalizeNumber(value.totalReviews),
    location: normalizeString(value.location),
    description: normalizeString(value.description),

    form: isCamperForm(value.form) ? value.form : 'alcove',

    length: normalizeString(value.length),
    width: normalizeString(value.width),
    height: normalizeString(value.height),
    tank: normalizeString(value.tank),
    consumption: normalizeString(value.consumption),

    transmission: isCamperTransmission(value.transmission)
      ? value.transmission
      : 'automatic',

    engine: isCamperEngine(value.engine) ? value.engine : 'diesel',

    amenities: normalizeAmenities(value.amenities),

    gallery: normalizeGallery(value.gallery),

    createdAt: normalizeString(value.createdAt),
    updatedAt: normalizeString(value.updatedAt),
  };
}
