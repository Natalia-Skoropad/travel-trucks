import { NextResponse } from 'next/server';
import axios from 'axios';

import { campersServerApi } from '@/lib/api/api';

import type { CamperFiltersResponse } from '@/types/catalog';

//===========================================================================

function normalizeFiltersResponse(data: unknown): CamperFiltersResponse {
  const value = data as Partial<CamperFiltersResponse>;

  return {
    forms: Array.isArray(value.forms) ? value.forms : [],
    transmissions: Array.isArray(value.transmissions)
      ? value.transmissions
      : [],
    engines: Array.isArray(value.engines) ? value.engines : [],
  };
}

//===========================================================================

export async function GET() {
  try {
    const { data } = await campersServerApi.get('/campers/filters');

    return NextResponse.json(normalizeFiltersResponse(data));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;

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
