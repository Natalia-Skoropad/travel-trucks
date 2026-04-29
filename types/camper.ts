export type CamperForm =
  | 'alcove'
  | 'panel_van'
  | 'integrated'
  | 'semi_integrated';

export type CamperTransmission = 'automatic' | 'manual';

export type CamperEngine = 'diesel' | 'petrol' | 'hybrid' | 'electric';

export type CamperAmenity =
  | 'ac'
  | 'bathroom'
  | 'kitchen'
  | 'tv'
  | 'radio'
  | 'refrigerator'
  | 'microwave'
  | 'gas'
  | 'water';

//===============================================================

export type CamperGalleryItem = {
  id: string;
  camperId: string;
  thumb: string;
  original: string;
  order: number;
};

//===============================================================

export type CamperListItem = {
  id: string;
  name: string;
  price: number;
  rating: number;
  location: string;

  form: CamperForm;
  length: string;
  width: string;
  height: string;
  tank: string;
  consumption: string;

  transmission: CamperTransmission;
  engine: CamperEngine;
  amenities: CamperAmenity[];

  coverImage: string;
  totalReviews: number;
};

//===============================================================

export type CamperDetails = CamperListItem & {
  description: string;
  gallery: CamperGalleryItem[];
  createdAt: string;
  updatedAt: string;
};
