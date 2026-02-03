import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api, type ApiError } from '../api';

//===========================================================================

type CatalogResponse = {
  items: unknown[];
  total: number;
};

//===========================================================================

function isCatalogResponse(value: unknown): value is CatalogResponse {
  if (!value || typeof value !== 'object') return false;

  const v = value as Record<string, unknown>;

  return Array.isArray(v.items) && typeof v.total === 'number';
}

//===========================================================================

function toNumber(v: unknown): number | undefined {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

//===========================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const res = await api.get('/campers', { params });
    const data: unknown = res.data;

    if (Array.isArray(data)) {
      const headerTotal = toNumber(res.headers['x-total-count']);

      return NextResponse.json({
        items: data,
        total: headerTotal ?? data.length,
      });
    }

    if (isCatalogResponse(data)) {
      return NextResponse.json(data);
    }

    return NextResponse.json({ items: [], total: 0 });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const err = e as ApiError;
      const status = err.response?.status ?? 500;

      if (status === 404) {
        return NextResponse.json({ items: [], total: 0 }, { status: 200 });
      }

      return NextResponse.json(
        { error: err.response?.data?.error || err.message },
        { status }
      );
    }

    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
