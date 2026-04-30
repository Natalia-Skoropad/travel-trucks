import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

import { campersServerApi } from '@/lib/api/api';
import type { BookingRequestPayload } from '@/types/booking';

//===========================================================================

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

//===========================================================================

function normalizeBookingPayload(data: unknown): BookingRequestPayload {
  const value = data as Partial<BookingRequestPayload>;

  return {
    name: typeof value.name === 'string' ? value.name.trim() : '',
    email: typeof value.email === 'string' ? value.email.trim() : '',
  };
}

function isValidBookingPayload(payload: BookingRequestPayload) {
  return Boolean(payload.name && payload.email);
}

//===========================================================================

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const body = await request.json();
    const payload = normalizeBookingPayload(body);

    if (!isValidBookingPayload(payload)) {
      return NextResponse.json(
        { message: 'Name and email are required' },
        { status: 400 }
      );
    }

    const { data } = await campersServerApi.post(
      `/campers/${encodeURIComponent(id)}/booking-requests`,
      payload
    );

    return NextResponse.json(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status) {
      return NextResponse.json(
        error.response.data ?? { message: 'Failed to create booking request' },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { message: 'Failed to create booking request' },
      { status: 500 }
    );
  }
}
