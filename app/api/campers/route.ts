import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

import {
  buildEmptyCampersResponse,
  getCampersCatalogResponse,
  isBackendNotFoundError,
} from '@/lib/server/campersCatalogService';

import {
  isCamperAmenity,
  isCamperEngine,
  isCamperForm,
  isCamperSort,
  isCamperTransmission,
} from '@/lib/utils/catalogGuards';

import type { CampersQuery } from '@/types/catalog';

//===========================================================================

function toPositiveNumber(value: string | null) {
  if (!value) return undefined;

  const numberValue = Number(value);

  return Number.isFinite(numberValue) && numberValue > 0
    ? numberValue
    : undefined;
}

function getEquipmentFromSearchParams(searchParams: URLSearchParams) {
  return searchParams.getAll('equipment').filter(isCamperAmenity);
}

function getSearchFromSearchParams(searchParams: URLSearchParams) {
  const search = searchParams.get('search')?.trim();

  return search || undefined;
}

function getQueryFromSearchParams(searchParams: URLSearchParams): CampersQuery {
  const form = searchParams.get('form');
  const transmission = searchParams.get('transmission');
  const engine = searchParams.get('engine');
  const sort = searchParams.get('sort');

  return {
    page: toPositiveNumber(searchParams.get('page')),
    perPage: toPositiveNumber(searchParams.get('perPage')),
    location: searchParams.get('location')?.trim() || undefined,

    form: isCamperForm(form) ? form : undefined,
    transmission: isCamperTransmission(transmission) ? transmission : undefined,
    engine: isCamperEngine(engine) ? engine : undefined,

    search: getSearchFromSearchParams(searchParams),
    sort: isCamperSort(sort) ? sort : undefined,
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
