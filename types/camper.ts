import type {
  VehicleForm,
  VehicleEngine,
  VehicleTransmission,
} from '@/lib/constants/catalogFilters';

//===========================================================================

export type CamperGalleryItem = {
  thumb: string;
  original: string;
};

export type Camper = {
  id: string;
  name: string;
  price: number;
  rating: number;

  reviews: Array<{
    reviewer_name: string;
    reviewer_rating: number;
    comment: string;
  }>;

  location: string;
  description: string;
  gallery: CamperGalleryItem[];

  transmission: VehicleTransmission;
  engine: VehicleEngine;
  form: VehicleForm;
  AC: boolean;
  bathroom: boolean;
  kitchen: boolean;
  TV: boolean;
  radio: boolean;
  refrigerator: boolean;
  microwave?: boolean;
  gas?: boolean;
  water?: boolean;

  length: string;
  width: string;
  height: string;
  tank: string;
  consumption: string;
};

//===========================================================================

export type CampersResponse = {
  items: Camper[];
  total: number;
};
