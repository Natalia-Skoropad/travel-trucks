'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchCamperFilters } from '@/lib/api/campersApi';

import {
  CAMPER_FORM_VALUES,
  ENGINE_VALUES,
  TRANSMISSION_VALUES,
} from '@/lib/constants/catalogFilters';

import { LOCATIONS } from '@/lib/constants/locations';
import { campersQueryKeys } from '@/lib/queryKeys/campersQueryKeys';

//===========================================================================

export function useCatalogFilterOptions() {
  const query = useQuery({
    queryKey: campersQueryKeys.filters(),
    queryFn: fetchCamperFilters,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });

  return {
    ...query,

    forms: query.data?.forms?.length ? query.data.forms : CAMPER_FORM_VALUES,

    transmissions: query.data?.transmissions?.length
      ? query.data.transmissions
      : TRANSMISSION_VALUES,

    engines: query.data?.engines?.length ? query.data.engines : ENGINE_VALUES,

    locations: query.data?.locations?.length ? query.data.locations : LOCATIONS,
  };
}
