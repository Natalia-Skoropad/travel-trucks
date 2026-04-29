import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

import { campersServerApi } from '@/lib/api/api';

import type { BookingRequestPayload } from '@/types/booking';

//===========================================================================

type Props = {
  params: Promise<{
    id: string;
  }>;
};

//===========================================================================

function isValidPayload(value: unknown): value is BookingRequestPayload {
  if (!value || typeof value !== 'object') return false;

  const payload = value as Partial<BookingRequestPayload>;

  return (
    typeof payload.name === 'string' &&
    payload.name.trim().length >= 2 &&
    typeof payload.email === 'string' &&
    payload.email.trim().length > 0
  );
}

//===========================================================================

export async function POST(request: NextRequest, { params }: Props) {
  const { id } = await params;

  try {
    const body: unknown = await request.json();

    if (!isValidPayload(body)) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const payload: BookingRequestPayload = {
      name: body.name.trim(),
      email: body.email.trim(),
    };

    const { data } = await campersServerApi.post(
      `/campers/${encodeURIComponent(id)}/booking-requests`,
      payload
    );

    return NextResponse.json(data, { status: 201 });
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
