import axios from 'axios';

import { campersServerApi } from '@/lib/api/api';

import {
  BACKEND_AGGREGATION_PER_PAGE,
  CATALOG_PER_PAGE,
} from '@/lib/constants/pagination';

import {
  isCamperAmenity,
  isCamperEngine,
  isCamperForm,
  isCamperSort,
  isCamperTransmission,
} from '@/lib/utils/catalogGuards';

import { normalizeCampersResponse } from '@/lib/utils/normalizeCamper';

import type {
  CamperAmenity,
  CamperEngine,
  CamperForm,
  CamperListItem,
  CamperTransmission,
} from '@/types/camper';

import type {
  CamperSort,
  CampersQuery,
  CampersResponse,
} from '@/types/catalog';

//===========================================================================

const DEFAULT_PAGE = 1;

//===========================================================================

type BackendCampersParams = {
  page: number;
  perPage: number;
  location?: string;
  form?: CamperForm;
  transmission?: CamperTransmission;
  engine?: CamperEngine;
};

type CatalogEnhancementParams = {
  search: string;
  sort: CamperSort | '';
  equipment: CamperAmenity[];
};

//===========================================================================

function toPositiveNumber(value: unknown, fallback: number) {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) && numberValue > 0
    ? numberValue
    : fallback;
}

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

//===========================================================================

function normalizeEquipment(value: CampersQuery['equipment']) {
  if (!Array.isArray(value)) return [];

  return Array.from(new Set(value.filter(isCamperAmenity)));
}

function getBackendParams(params?: CampersQuery): BackendCampersParams {
  return {
    page: toPositiveNumber(params?.page, DEFAULT_PAGE),
    perPage: toPositiveNumber(params?.perPage, CATALOG_PER_PAGE),
    location: params?.location?.trim() || undefined,
    form: isCamperForm(params?.form) ? params.form : undefined,
    transmission: isCamperTransmission(params?.transmission)
      ? params.transmission
      : undefined,
    engine: isCamperEngine(params?.engine) ? params.engine : undefined,
  };
}

function getEnhancementParams(params?: CampersQuery): CatalogEnhancementParams {
  return {
    search: normalizeText(params?.search),
    sort: isCamperSort(params?.sort) ? params.sort : '',
    equipment: normalizeEquipment(params?.equipment),
  };
}

/**
 * The backend currently supports page, perPage, location, form,
 * transmission and engine filters directly.
 *
 * Search, sort and equipment filtering are handled in this BFF layer,
 * so the catalog is aggregated first and then enhanced locally before
 * being paginated again for the client.
 */
function shouldAggregateCatalog({
  search,
  sort,
  equipment,
}: CatalogEnhancementParams) {
  return Boolean(search || sort || equipment.length);
}

//===========================================================================

async function fetchBackendCampers(
  params: BackendCampersParams
): Promise<CampersResponse> {
  const { data } = await campersServerApi.get('/campers', { params });

  return normalizeCampersResponse(data);
}

async function fetchAllBackendCampers(baseParams: BackendCampersParams) {
  const firstPage = await fetchBackendCampers({
    ...baseParams,
    page: 1,
    perPage: BACKEND_AGGREGATION_PER_PAGE,
  });

  if (firstPage.totalPages <= 1) {
    return firstPage.campers;
  }

  const pages = await Promise.all(
    Array.from(
      { length: firstPage.totalPages - 1 },
      (_, index) => index + 2
    ).map((page) =>
      fetchBackendCampers({
        ...baseParams,
        page,
        perPage: BACKEND_AGGREGATION_PER_PAGE,
      })
    )
  );

  return [...firstPage.campers, ...pages.flatMap((page) => page.campers)];
}

//===========================================================================

function filterBySearch(campers: CamperListItem[], search: string) {
  if (!search) return campers;

  return campers.filter((camper) =>
    normalizeText(camper.name).includes(search)
  );
}

function filterByEquipment(
  campers: CamperListItem[],
  equipment: CamperAmenity[]
) {
  if (!equipment.length) return campers;

  return campers.filter((camper) =>
    equipment.every((amenity) => camper.amenities.includes(amenity))
  );
}

function sortCampers(campers: CamperListItem[], sort: CamperSort | '') {
  if (!sort) return campers;

  return [...campers].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'rating-asc') return a.rating - b.rating;
    if (sort === 'rating-desc') return b.rating - a.rating;

    return 0;
  });
}

function paginateCampers(
  campers: CamperListItem[],
  page: number,
  perPage: number
): CampersResponse {
  const total = campers.length;
  const totalPages = Math.ceil(total / perPage);
  const safePage = totalPages > 0 ? Math.min(page, totalPages) : page;
  const start = (safePage - 1) * perPage;

  return {
    page: safePage,
    perPage,
    total,
    totalPages,
    campers: campers.slice(start, start + perPage),
  };
}

export function buildEmptyCampersResponse(
  page = DEFAULT_PAGE,
  perPage = CATALOG_PER_PAGE
): CampersResponse {
  return {
    page,
    perPage,
    total: 0,
    totalPages: 0,
    campers: [],
  };
}

//===========================================================================

export async function getCampersCatalogResponse(
  params?: CampersQuery
): Promise<CampersResponse> {
  const backendParams = getBackendParams(params);
  const enhancementParams = getEnhancementParams(params);

  if (!shouldAggregateCatalog(enhancementParams)) {
    return fetchBackendCampers(backendParams);
  }

  const allCampers = await fetchAllBackendCampers(backendParams);

  const searchedCampers = filterBySearch(allCampers, enhancementParams.search);

  const equipmentFilteredCampers = filterByEquipment(
    searchedCampers,
    enhancementParams.equipment
  );

  const sortedCampers = sortCampers(
    equipmentFilteredCampers,
    enhancementParams.sort
  );

  return paginateCampers(
    sortedCampers,
    backendParams.page,
    backendParams.perPage
  );
}

export function isBackendNotFoundError(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 404;
}
