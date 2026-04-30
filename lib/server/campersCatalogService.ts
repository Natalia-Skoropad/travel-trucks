import axios from 'axios';

import { campersServerApi } from '@/lib/api/api';

import {
  BACKEND_AGGREGATION_PER_PAGE,
  CATALOG_PER_PAGE,
} from '@/lib/constants/pagination';

import {
  AMENITY_VALUES,
  CAMPER_FORM_VALUES,
  ENGINE_VALUES,
  SORT_VALUES,
  TRANSMISSION_VALUES,
} from '@/lib/constants/catalogFilters';

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

function isCamperForm(value: unknown): value is CamperForm {
  return (
    typeof value === 'string' &&
    CAMPER_FORM_VALUES.includes(value as CamperForm)
  );
}

function isCamperTransmission(value: unknown): value is CamperTransmission {
  return (
    typeof value === 'string' &&
    TRANSMISSION_VALUES.includes(value as CamperTransmission)
  );
}

function isCamperEngine(value: unknown): value is CamperEngine {
  return (
    typeof value === 'string' && ENGINE_VALUES.includes(value as CamperEngine)
  );
}

function isCamperSort(value: unknown): value is CamperSort {
  return typeof value === 'string' && SORT_VALUES.includes(value as CamperSort);
}

function isCamperAmenity(value: unknown): value is CamperAmenity {
  return (
    typeof value === 'string' && AMENITY_VALUES.includes(value as CamperAmenity)
  );
}

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

function normalizeCampersResponse(data: unknown): CampersResponse {
  const value = data as Partial<CampersResponse>;

  return {
    page: typeof value.page === 'number' ? value.page : DEFAULT_PAGE,
    perPage:
      typeof value.perPage === 'number' ? value.perPage : CATALOG_PER_PAGE,
    total: typeof value.total === 'number' ? value.total : 0,
    totalPages: typeof value.totalPages === 'number' ? value.totalPages : 0,
    campers: Array.isArray(value.campers) ? value.campers : [],
  };
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

function shouldUseBffEnhancements({
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

  if (!shouldUseBffEnhancements(enhancementParams)) {
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
