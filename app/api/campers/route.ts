import { NextRequest, NextResponse } from 'next/server';
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

import type { CamperSort, CampersResponse } from '@/types/catalog';

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

function isCamperForm(value: string | null): value is CamperForm {
  return Boolean(value && CAMPER_FORM_VALUES.includes(value as CamperForm));
}

function isCamperTransmission(
  value: string | null
): value is CamperTransmission {
  return Boolean(
    value && TRANSMISSION_VALUES.includes(value as CamperTransmission)
  );
}

function isCamperEngine(value: string | null): value is CamperEngine {
  return Boolean(value && ENGINE_VALUES.includes(value as CamperEngine));
}

//===========================================================================

function toPositiveNumber(value: string | null, fallback: number) {
  if (!value) return fallback;

  const numberValue = Number(value);

  return Number.isFinite(numberValue) && numberValue > 0
    ? numberValue
    : fallback;
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
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

function isCamperSort(value: string | null): value is CamperSort {
  return Boolean(value && SORT_VALUES.includes(value as CamperSort));
}

function isCamperAmenity(value: string): value is CamperAmenity {
  return AMENITY_VALUES.includes(value as CamperAmenity);
}

//===========================================================================

function getEquipmentFromSearchParams(
  searchParams: URLSearchParams
): CamperAmenity[] {
  const equipment = searchParams.getAll('equipment').filter(isCamperAmenity);

  return Array.from(new Set(equipment));
}

function getBackendParams(
  searchParams: URLSearchParams,
  page: number,
  perPage: number
): BackendCampersParams {
  const form = searchParams.get('form');
  const transmission = searchParams.get('transmission');
  const engine = searchParams.get('engine');

  return {
    page,
    perPage,
    location: searchParams.get('location')?.trim() || undefined,
    form: isCamperForm(form) ? form : undefined,
    transmission: isCamperTransmission(transmission) ? transmission : undefined,
    engine: isCamperEngine(engine) ? engine : undefined,
  };
}

function getEnhancementParams(
  searchParams: URLSearchParams
): CatalogEnhancementParams {
  const rawSort = searchParams.get('sort');

  return {
    search: normalizeText(searchParams.get('search') ?? ''),
    sort: isCamperSort(rawSort) ? rawSort : '',
    equipment: getEquipmentFromSearchParams(searchParams),
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

  const requests = Array.from(
    { length: firstPage.totalPages - 1 },
    (_, index) => index + 2
  ).map((page) =>
    fetchBackendCampers({
      ...baseParams,
      page,
      perPage: BACKEND_AGGREGATION_PER_PAGE,
    })
  );

  const pages = await Promise.all(requests);

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

  const sorted = [...campers];

  sorted.sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'rating-asc') return a.rating - b.rating;
    if (sort === 'rating-desc') return b.rating - a.rating;

    return 0;
  });

  return sorted;
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
  const end = start + perPage;

  return {
    page: safePage,
    perPage,
    total,
    totalPages,
    campers: campers.slice(start, end),
  };
}

//===========================================================================

function buildEmptyResponse(page = DEFAULT_PAGE, perPage = CATALOG_PER_PAGE) {
  return {
    page,
    perPage,
    total: 0,
    totalPages: 0,
    campers: [],
  } satisfies CampersResponse;
}

//===========================================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = toPositiveNumber(searchParams.get('page'), DEFAULT_PAGE);
  const perPage = toPositiveNumber(
    searchParams.get('perPage'),
    CATALOG_PER_PAGE
  );

  const backendParams = getBackendParams(searchParams, page, perPage);
  const enhancementParams = getEnhancementParams(searchParams);

  try {
    if (!shouldUseBffEnhancements(enhancementParams)) {
      const data = await fetchBackendCampers(backendParams);

      return NextResponse.json(data);
    }

    const allCampers = await fetchAllBackendCampers(backendParams);

    const searchedCampers = filterBySearch(
      allCampers,
      enhancementParams.search
    );

    const equipmentFilteredCampers = filterByEquipment(
      searchedCampers,
      enhancementParams.equipment
    );

    const sortedCampers = sortCampers(
      equipmentFilteredCampers,
      enhancementParams.sort
    );

    const data = paginateCampers(sortedCampers, page, perPage);

    return NextResponse.json(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return NextResponse.json(buildEmptyResponse(page, perPage));
    }

    return NextResponse.json(
      { message: 'Failed to fetch campers' },
      { status: 500 }
    );
  }
}
