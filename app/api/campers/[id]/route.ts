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
      `/campers/${encodeURIComponent(id)}`
    );

    return NextResponse.json(data);
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
