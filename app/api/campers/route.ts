import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

import {
  buildEmptyCampersResponse,
  getCampersCatalogResponse,
  isBackendNotFoundError,
} from '@/lib/server/campersCatalogService';

import type { CamperAmenity } from '@/types/camper';
import type { CamperSort, CampersQuery } from '@/types/catalog';

//===========================================================================

function toPositiveNumber(value: string | null) {
  if (!value) return undefined;

  const numberValue = Number(value);

  return Number.isFinite(numberValue) && numberValue > 0
    ? numberValue
    : undefined;
}

function getEquipmentFromSearchParams(searchParams: URLSearchParams) {
  return searchParams.getAll('equipment') as CamperAmenity[];
}

function getQueryFromSearchParams(searchParams: URLSearchParams): CampersQuery {
  return {
    page: toPositiveNumber(searchParams.get('page')),
    perPage: toPositiveNumber(searchParams.get('perPage')),
    location: searchParams.get('location') || undefined,
    form: searchParams.get('form') as CampersQuery['form'],
    transmission: searchParams.get(
      'transmission'
    ) as CampersQuery['transmission'],
    engine: searchParams.get('engine') as CampersQuery['engine'],
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') as CamperSort | undefined,
    equipment: getEquipmentFromSearchParams(searchParams),
  };
}

//===========================================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = getQueryFromSearchParams(searchParams);

  try {
    const data = await getCampersCatalogResponse(query);

    return NextResponse.json(data);
  } catch (error) {
    if (isBackendNotFoundError(error)) {
      return NextResponse.json(
        buildEmptyCampersResponse(query.page, query.perPage)
      );
    }

    if (axios.isAxiosError(error)) {
      console.error('Failed to fetch campers:', {
        status: error.response?.status,
        data: error.response?.data,
        params: query,
      });
    } else {
      console.error('Failed to fetch campers:', error);
    }

    return NextResponse.json(
      { message: 'Failed to fetch campers' },
      { status: 500 }
    );
  }
}
