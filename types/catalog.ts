import type {
  CamperAmenity,
  CamperEngine,
  CamperForm,
  CamperListItem,
  CamperTransmission,
} from '@/types/camper';

//===============================================================

export type CampersResponse = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  campers: CamperListItem[];
};

//===============================================================

export type CamperFiltersResponse = {
  forms: CamperForm[];
  transmissions: CamperTransmission[];
  engines: CamperEngine[];
};

//===============================================================

export type CamperSort =
  | 'price-asc'
  | 'price-desc'
  | 'rating-asc'
  | 'rating-desc';

//===============================================================

type BackendCampersQuery = {
  page?: number;
  perPage?: number;
  location?: string;
  form?: CamperForm;
  transmission?: CamperTransmission;
  engine?: CamperEngine;
};

export type CampersQuery = BackendCampersQuery & {
  search?: string;
  sort?: CamperSort;
  equipment?: CamperAmenity[];
};
