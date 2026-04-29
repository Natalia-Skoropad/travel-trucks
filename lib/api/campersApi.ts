import axios from 'axios';

import { campersServerApi, nextApi } from '@/lib/api/api';

import type { CamperDetails } from '@/types/camper';
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
// Direct server fetch. Use in Server Components / server metadata.

export async function fetchCampersFromServer(
  params?: CampersQuery
): Promise<CampersResponse> {
  try {
    const { data } = await campersServerApi.get<CampersResponse>('/campers', {
      params: {
        page: params?.page,
        perPage: params?.perPage,
        location: params?.location,
        form: params?.form,
        transmission: params?.transmission,
        engine: params?.engine,
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
