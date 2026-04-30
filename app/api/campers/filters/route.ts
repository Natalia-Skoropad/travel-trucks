import { NextResponse } from 'next/server';
import axios from 'axios';

import { campersServerApi } from '@/lib/api/api';
import { BACKEND_AGGREGATION_PER_PAGE } from '@/lib/constants/pagination';

import type { CampersResponse } from '@/types/catalog';

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

function normalizeStringList(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

function getUniqueSortedLocations(response: CampersResponse) {
  return Array.from(
    new Set(
      response.campers
        .map((camper) => camper.location?.trim())
        .filter((location): location is string => Boolean(location))
    )
  ).sort((a, b) => a.localeCompare(b));
}

async function fetchAllLocations() {
  const firstResponse = await campersServerApi.get('/campers', {
    params: {
      page: 1,
      perPage: BACKEND_AGGREGATION_PER_PAGE,
    },
  });

  const firstPage = normalizeCampersResponse(firstResponse.data);

  if (firstPage.totalPages <= 1) {
    return getUniqueSortedLocations(firstPage);
  }

  const restPages = await Promise.all(
    Array.from(
      { length: firstPage.totalPages - 1 },
      (_, index) => index + 2
    ).map((page) =>
      campersServerApi.get('/campers', {
        params: {
          page,
          perPage: BACKEND_AGGREGATION_PER_PAGE,
        },
      })
    )
  );

  const allCampers = [
    ...firstPage.campers,
    ...restPages.flatMap(
      (response) => normalizeCampersResponse(response.data).campers
    ),
  ];

  return Array.from(
    new Set(
      allCampers
        .map((camper) => camper.location?.trim())
        .filter((location): location is string => Boolean(location))
    )
  ).sort((a, b) => a.localeCompare(b));
}

//===========================================================================

export async function GET() {
  try {
    const [{ data: filtersData }, locations] = await Promise.all([
      campersServerApi.get('/campers/filters'),
      fetchAllLocations(),
    ]);

    return NextResponse.json({
      forms: normalizeStringList(filtersData.forms),
      transmissions: normalizeStringList(filtersData.transmissions),
      engines: normalizeStringList(filtersData.engines),
      locations,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status) {
      return NextResponse.json(
        { message: 'Failed to fetch camper filters' },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { message: 'Failed to fetch camper filters' },
      { status: 500 }
    );
  }
}
