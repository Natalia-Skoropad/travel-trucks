import { NextResponse } from 'next/server';
import axios from 'axios';

import { campersServerApi } from '@/lib/api/api';

//===========================================================================

export async function GET() {
  try {
    const { data } = await campersServerApi.get('/campers/filters');

    return NextResponse.json({
      forms: Array.isArray(data.forms) ? data.forms : [],
      transmissions: Array.isArray(data.transmissions)
        ? data.transmissions
        : [],
      engines: Array.isArray(data.engines) ? data.engines : [],
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status) {
      return NextResponse.json(
        { message: 'Failed to fetch camper filters' },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { message: 'Failed to fetch camper filters' },
      { status: 500 }
    );
  }
}
