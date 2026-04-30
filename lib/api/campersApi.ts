import axios from 'axios';

import { campersServerApi, nextApi } from '@/lib/api/api';
import {
  buildEmptyCampersResponse,
  getCampersCatalogResponse,
  isBackendNotFoundError,
} from '@/lib/server/campersCatalogService';

import type { CamperDetails } from '@/types/camper';
import { normalizeCamperDetails } from '@/lib/utils/normalizeCamper';

import type {
  BookingRequestPayload,
  BookingRequestResponse,
} from '@/types/booking';

import type {
  CamperFiltersResponse,
  CampersQuery,
  CampersResponse,
} from '@/types/catalog';

import type { Review } from '@/types/review';

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

//===========================================================================
// Catalog list

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
      return buildEmptyCampersResponse(params?.page, params?.perPage);
    }

    throw error;
  }
}

export async function fetchCampersFromServer(
  params?: CampersQuery
): Promise<CampersResponse> {
  try {
    return await getCampersCatalogResponse(params);
  } catch (error) {
    if (isBackendNotFoundError(error)) {
      return buildEmptyCampersResponse(params?.page, params?.perPage);
    }

    throw error;
  }
}

//===========================================================================
// Details

export async function fetchCamperByIdFromServer(
  id: string
): Promise<CamperDetails> {
  const { data } = await campersServerApi.get(
    `/campers/${encodeURIComponent(id)}`
  );

  return normalizeCamperDetails(data);
}

export async function fetchCamperById(id: string): Promise<CamperDetails> {
  const { data } = await nextApi.get(`/campers/${encodeURIComponent(id)}`);

  return normalizeCamperDetails(data);
}

//===========================================================================
// Reviews

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

export async function fetchCamperReviews(id: string): Promise<Review[]> {
  const { data } = await nextApi.get<Review[]>(
    `/campers/${encodeURIComponent(id)}/reviews`
  );

  return Array.isArray(data) ? data : [];
}

//===========================================================================
// Filters

export async function fetchCamperFilters(): Promise<CamperFiltersResponse> {
  const { data } = await nextApi.get<CamperFiltersResponse>('/campers/filters');

  return {
    forms: Array.isArray(data.forms) ? data.forms : [],
    transmissions: Array.isArray(data.transmissions) ? data.transmissions : [],
    engines: Array.isArray(data.engines) ? data.engines : [],
    locations: Array.isArray(data.locations) ? data.locations : [],
  };
}

//===========================================================================
// Booking

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
