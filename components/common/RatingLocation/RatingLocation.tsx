'use client';

import Link from 'next/link';
import { hrefByLocation } from '@/lib/utils/catalogNav';

import SvgIcon from '@/components/common/SvgIcon/SvgIcon';
import css from './RatingLocation.module.css';

//===============================================================

type Props = {
  rating: number;
  reviewsCount: number;
  location: string;
};

//===============================================================

function RatingLocation({ rating, reviewsCount, location }: Props) {
  return (
    <div className={css.wrap}>
      <div className={css.rating}>
        <SvgIcon name="icon-star" className={css.star} />
        <span className={css.ratingText}>
          {rating.toFixed(1)}
          <span className={css.reviews}>({reviewsCount} Reviews)</span>
        </span>
      </div>

      <div className={css.location}>
        <SvgIcon name="icon-map" className={css.map} />
        <Link href={hrefByLocation(location)} className={css.locationLink}>
          {location}
        </Link>
      </div>
    </div>
  );
}

export default RatingLocation;
