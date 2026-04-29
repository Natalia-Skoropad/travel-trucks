import type { CamperDetails } from '@/types/camper';

import RatingLocation from '@/components/common/RatingLocation/RatingLocation';
import Gallery from '@/components/details/Gallery/Gallery';

import css from './CamperHero.module.css';

//===========================================================================

type Props = {
  camper: Pick<
    CamperDetails,
    | 'name'
    | 'rating'
    | 'totalReviews'
    | 'location'
    | 'price'
    | 'gallery'
    | 'description'
  >;
};

//===========================================================================

function CamperHero({ camper }: Props) {
  const images = camper.gallery?.map((image) => image.original) ?? [];

  return (
    <section className={css.section}>
      <h2 className="visually-hidden">Vehicle information</h2>

      <div className={css.head}>
        <RatingLocation
          rating={camper.rating ?? 0}
          reviewsCount={camper.totalReviews ?? 0}
          location={camper.location ?? ''}
        />

        <span className={css.price}>€{camper.price.toFixed(2)}</span>
      </div>

      <Gallery images={images} />

      {camper.description ? (
        <p className={css.desc}>{camper.description}</p>
      ) : null}
    </section>
  );
}

export default CamperHero;
