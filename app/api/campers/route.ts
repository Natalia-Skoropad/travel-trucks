import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

import { campersServerApi } from '@/lib/api/api';

import type { CamperAmenity, CamperListItem } from '@/types/camper';
import type { CamperSort, CampersResponse } from '@/types/catalog';

//===========================================================================

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 4;
const AGGREGATION_PER_PAGE = 100;

//===========================================================================

type BackendCampersParams = {
  page: number;
  perPage: number;
  location?: string;
  form?: string;
  transmission?: string;
  engine?: string;
};

type CatalogEnhancementParams = {
  search: string;
  sort: CamperSort | '';
  equipment: CamperAmenity[];
};

//===========================================================================

const AMENITY_VALUES: CamperAmenity[] = [
  'ac',
  'bathroom',
  'kitchen',
  'tv',
  'radio',
  'refrigerator',
  'microwave',
  'gas',
  'water',
];

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
      typeof value.perPage === 'number' ? value.perPage : DEFAULT_PER_PAGE,
    total: typeof value.total === 'number' ? value.total : 0,
    totalPages: typeof value.totalPages === 'number' ? value.totalPages : 0,
    campers: Array.isArray(value.campers) ? value.campers : [],
  };
}

function isCamperSort(value: string | null): value is CamperSort {
  return (
    value === 'price-asc' ||
    value === 'price-desc' ||
    value === 'rating-asc' ||
    value === 'rating-desc'
  );
}

function isCamperAmenity(value: string): value is CamperAmenity {
  return AMENITY_VALUES.includes(value as CamperAmenity);
}

//===========================================================================

function getEquipmentFromSearchParams(
  searchParams: URLSearchParams
): CamperAmenity[] {
  const values = [
    ...searchParams.getAll('equipment'),
    ...searchParams.getAll('amenities'),
  ].filter(isCamperAmenity);

  for (const amenity of AMENITY_VALUES) {
    const flag = searchParams.get(amenity);

    if (flag === '1' || flag === 'true') {
      values.push(amenity);
    }
  }

  return Array.from(new Set(values));
}

function getBackendParams(
  searchParams: URLSearchParams,
  page: number,
  perPage: number
): BackendCampersParams {
  return {
    page,
    perPage,
    location: searchParams.get('location') || undefined,
    form: searchParams.get('form') || undefined,
    transmission: searchParams.get('transmission') || undefined,
    engine: searchParams.get('engine') || undefined,
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
    perPage: AGGREGATION_PER_PAGE,
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
      perPage: AGGREGATION_PER_PAGE,
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

function buildEmptyResponse(page = DEFAULT_PAGE, perPage = DEFAULT_PER_PAGE) {
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
    DEFAULT_PER_PAGE
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

    const filteredCampers = filterByEquipment(
      searchedCampers,
      enhancementParams.equipment
    );

    const sortedCampers = sortCampers(filteredCampers, enhancementParams.sort);

    return NextResponse.json(paginateCampers(sortedCampers, page, perPage));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;

      if (status === 404) {
        return NextResponse.json(buildEmptyResponse(page, perPage), {
          status: 200,
        });
      }

      return NextResponse.json(
        {
          error:
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message,
        },
        { status }
      );
    }

    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
