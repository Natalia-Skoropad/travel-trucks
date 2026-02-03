import { NextResponse } from 'next/server';
import axios from 'axios';
import { api, type ApiError } from '../../api';

//===========================================================================

type Props = {
  params: Promise<{ id: string }>;
};

//===========================================================================

export async function GET(_: Request, { params }: Props) {
  const { id } = await params;

  try {
    const { data } = await api.get(`/campers/${id}`);
    return NextResponse.json(data);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const err = e as ApiError;
      const status = err.response?.status ?? 500;

      return NextResponse.json(
        { error: err.response?.data?.error || err.message },
        { status }
      );
    }

    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
