import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

import { campersServerApi } from '@/lib/api/api';

//===========================================================================

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

//===========================================================================

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const { data } = await campersServerApi.get(
      `/campers/${encodeURIComponent(id)}/reviews`
    );

    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return NextResponse.json([]);
    }

    if (axios.isAxiosError(error) && error.response?.status) {
      return NextResponse.json(
        { message: 'Failed to fetch camper reviews' },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { message: 'Failed to fetch camper reviews' },
      { status: 500 }
    );
  }
}
