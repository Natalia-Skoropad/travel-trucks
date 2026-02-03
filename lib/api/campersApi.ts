import axios from 'axios';
import { nextServer } from '@/lib/api/api';
import type { Camper, CampersResponse } from '@/types/camper';

//===========================================================================

export type CampersQuery = {
  page?: number;
  limit?: number;

  location?: string;
  form?: string;

  engine?: string;
  transmission?: string;

  AC?: boolean;
  kitchen?: boolean;
  bathroom?: boolean;
  TV?: boolean;
  radio?: boolean;
  refrigerator?: boolean;
  microwave?: boolean;
  gas?: boolean;
  water?: boolean;
};

//===========================================================================

export async function fetchCampers(
  params?: CampersQuery
): Promise<CampersResponse> {
  try {
    const { data } = await nextServer.get<CampersResponse>('/catalog', {
      params,
    });

    return {
      items: Array.isArray(data?.items) ? data.items : [],
      total: typeof data?.total === 'number' ? data.total : 0,
    };
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      return { items: [], total: 0 };
    }
    throw e;
  }
}

//===========================================================================

export async function fetchCamperById(id: string): Promise<Camper> {
  const { data } = await nextServer.get<Camper>(`/catalog/${id}`);
  return data;
}

//===========================================================================

export async function fetchAllLocations(): Promise<string[]> {
  const limit = 100;
  let page = 1;

  const uniq = new Set<string>();

  while (true) {
    const data = await fetchCampers({ page, limit });

    data.items.forEach((c) => {
      const loc = (c.location ?? '').trim();
      if (loc) uniq.add(loc);
    });

    const loaded = page * limit;
    const isLastPage = loaded >= data.total || data.items.length === 0;
    if (isLastPage) break;

    page += 1;
  }

  return Array.from(uniq).sort((a, b) => a.localeCompare(b));
}
