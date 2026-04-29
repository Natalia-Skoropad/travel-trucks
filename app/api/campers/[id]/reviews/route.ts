import { NextResponse } from 'next/server';
import axios from 'axios';

import { campersServerApi } from '@/lib/api/api';

//===========================================================================

type Props = {
  params: Promise<{
    id: string;
  }>;
};

//===========================================================================

export async function GET(_: Request, { params }: Props) {
  const { id } = await params;

  try {
    const { data } = await campersServerApi.get(
      `/campers/${encodeURIComponent(id)}/reviews`
    );

    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;

      if (status === 404) {
        return NextResponse.json([], { status: 200 });
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
