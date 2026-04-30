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
      `/campers/${encodeURIComponent(id)}`
    );

    return NextResponse.json(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status) {
      return NextResponse.json(
        { message: 'Failed to fetch camper' },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { message: 'Failed to fetch camper' },
      { status: 500 }
    );
  }
}
