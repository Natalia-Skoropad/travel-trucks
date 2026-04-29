import axios from 'axios';

import { campersServerApi, nextApi } from '@/lib/api/api';

import type {
  CamperAmenity,
  CamperDetails,
  CamperListItem,
} from '@/types/camper';

import type {
  BookingRequestPayload,
  BookingRequestResponse,
} from '@/types/booking';

import type {
  CamperFiltersResponse,
  CampersQuery,
  CampersResponse,
  CamperSort,
} from '@/types/catalog';

import type { Review } from '@/types/review';

//===========================================================================

const AGGREGATION_PER_PAGE = 5;

//===========================================================================

type BackendCampersParams = {
  page?: number;
  perPage?: number;
  location?: string;
  form?: string;
  transmission?: string;
  engine?: string;
};

//===========================================================================

function normalizeCampersResponse(data: unknown): CampersResponse {
  const value = data as Partial<CampersResponse>;

  return {
    page: typeof value.page === 'number' ? value.page : 1,
    perPage: typeof value.perPage === 'number' ? value.perPage : 0,
    total: typeof value.total === 'number' ? value.total : 0,
    totalPages: typeof value.totalPages === 'number' ? value.totalPages : 0,
    campers: Array.isArray(value.campers) ? value.campers : [],
  };
}

function hasServerEnhancements(params?: CampersQuery) {
  return Boolean(
    params?.search?.trim() || params?.sort || params?.equipment?.length
  );
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function filterBySearch(campers: CamperListItem[], search?: string) {
  const query = normalizeText(search ?? '');

  if (!query) return campers;

  return campers.filter((camper) => normalizeText(camper.name).includes(query));
}

function filterByEquipment(
  campers: CamperListItem[],
  equipment?: CamperAmenity[]
) {
  if (!equipment?.length) return campers;

  return campers.filter((camper) =>
    equipment.every((amenity) => camper.amenities.includes(amenity))
  );
}

function sortCampers(campers: CamperListItem[], sort?: CamperSort) {
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

  return {
    page: safePage,
    perPage,
    total,
    totalPages,
    campers: campers.slice(start, start + perPage),
  };
}

async function fetchBackendCampers(
  params: BackendCampersParams
): Promise<CampersResponse> {
  const { data } = await campersServerApi.get<CampersResponse>('/campers', {
    params,
  });

  return normalizeCampersResponse(data);
}

async function fetchAllBackendCampers(params?: CampersQuery) {
  const baseParams: BackendCampersParams = {
    page: 1,
    perPage: AGGREGATION_PER_PAGE,
    location: params?.location,
    form: params?.form,
    transmission: params?.transmission,
    engine: params?.engine,
  };

  const firstPage = await fetchBackendCampers(baseParams);

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
        perPage: AGGREGATION_PER_PAGE,
      })
    )
  );

  return [...firstPage.campers, ...pages.flatMap((page) => page.campers)];
}

//===========================================================================
// Client/BFF fetch

export async function fetchCampers(
  params?: CampersQuery
): Promise<CampersResponse> {
  try {
    const { data } = await nextApi.get<CampersResponse>('/campers', {
      params,
      paramsSerializer: {
        indexes: null,
      },
    });

    return normalizeCampersResponse(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        page: params?.page ?? 1,
        perPage: params?.perPage ?? 0,
        total: 0,
        totalPages: 0,
        campers: [],
      };
    }

    throw error;
  }
}

//===========================================================================
// Direct server fetch with BFF-like enhancements

export async function fetchCampersFromServer(
  params?: CampersQuery
): Promise<CampersResponse> {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 5;

  try {
    if (!hasServerEnhancements(params)) {
      return fetchBackendCampers({
        page,
        perPage,
        location: params?.location,
        form: params?.form,
        transmission: params?.transmission,
        engine: params?.engine,
      });
    }

    const allCampers = await fetchAllBackendCampers(params);

    const searchedCampers = filterBySearch(allCampers, params?.search);
    const filteredCampers = filterByEquipment(
      searchedCampers,
      params?.equipment
    );
    const sortedCampers = sortCampers(filteredCampers, params?.sort);

    return paginateCampers(sortedCampers, page, perPage);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        page,
        perPage,
        total: 0,
        totalPages: 0,
        campers: [],
      };
    }

    throw error;
  }
}

//===========================================================================

export async function fetchCamperByIdFromServer(
  id: string
): Promise<CamperDetails> {
  const { data } = await campersServerApi.get<CamperDetails>(
    `/campers/${encodeURIComponent(id)}`
  );

  return data;
}

export async function fetchCamperReviewsFromServer(
  id: string
): Promise<Review[]> {
  try {
    const { data } = await campersServerApi.get<Review[]>(
      `/campers/${encodeURIComponent(id)}/reviews`
    );

    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }

    throw error;
  }
}

//===========================================================================
// BFF/client helpers for client components.

export async function fetchCamperById(id: string): Promise<CamperDetails> {
  const { data } = await nextApi.get<CamperDetails>(
    `/campers/${encodeURIComponent(id)}`
  );

  return data;
}

export async function fetchCamperReviews(id: string): Promise<Review[]> {
  const { data } = await nextApi.get<Review[]>(
    `/campers/${encodeURIComponent(id)}/reviews`
  );

  return Array.isArray(data) ? data : [];
}

export async function fetchCamperFilters(): Promise<CamperFiltersResponse> {
  const { data } = await nextApi.get<CamperFiltersResponse>('/campers/filters');

  return {
    forms: Array.isArray(data.forms) ? data.forms : [],
    transmissions: Array.isArray(data.transmissions) ? data.transmissions : [],
    engines: Array.isArray(data.engines) ? data.engines : [],
  };
}

export async function createBookingRequest(
  camperId: string,
  payload: BookingRequestPayload
): Promise<BookingRequestResponse> {
  const { data } = await nextApi.post<BookingRequestResponse>(
    `/campers/${encodeURIComponent(camperId)}/booking-requests`,
    payload
  );

  return data;
}
