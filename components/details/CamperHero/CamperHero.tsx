import type { Camper } from '@/types/camper';

import RatingLocation from '../../common/RatingLocation/RatingLocation';
import Gallery from '@/components/details/Gallery/Gallery';

import css from './CamperHero.module.css';

//===========================================================================

type Props = {
  camper: Pick<
    Camper,
    | 'name'
    | 'rating'
    | 'reviews'
    | 'location'
    | 'price'
    | 'gallery'
    | 'description'
  >;
};

//===========================================================================

function CamperHero({ camper }: Props) {
  const images = camper.gallery?.map((g) => g.original) ?? [];
  return (
    <section className={css.section}>
      <h2 className="visually-hidden">Vehicle information</h2>
      <div className={css.head}>
        <RatingLocation
          rating={camper.rating ?? 0}
          reviewsCount={camper.reviews?.length ?? 0}
          location={camper.location ?? ''}
        />

        <span className={css.price}>€{camper.price.toFixed(2)}</span>
      </div>

      <Gallery images={images} />

      <p className={css.desc}>{camper.description}</p>
    </section>
  );
}

export default CamperHero;
