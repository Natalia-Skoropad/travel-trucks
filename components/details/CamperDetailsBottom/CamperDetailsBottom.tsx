'use client';

import { useMemo, useState } from 'react';

import type { CamperDetails } from '@/types/camper';
import type { Review } from '@/types/review';

import Tabs from '@/components/common/Tabs/Tabs';
import CamperSpecs from '@/components/details/CamperSpecs/CamperSpecs';
import ReviewsList from '@/components/details/ReviewsList/ReviewsList';
import BookingForm from '@/components/details/BookingForm/BookingForm';

import css from './CamperDetailsBottom.module.css';

//===============================================================

type DetailsTab = 'features' | 'reviews';

type Props = {
  camper: CamperDetails;
  reviews: Review[];
  className?: string;
};

//===============================================================

function CamperDetailsBottom({ camper, reviews, className }: Props) {
  const [tab, setTab] = useState<DetailsTab>('features');

  const reviewsCount = camper.totalReviews ?? reviews.length;

  const items = useMemo(
    () => [
      { value: 'features' as const, label: 'Features' },
      { value: 'reviews' as const, label: 'Reviews', count: reviewsCount },
    ],
    [reviewsCount]
  );

  return (
    <div className={`${css.section} ${className ?? ''}`}>
      <div className={css.inner}>
        <div className={css.left}>
          <Tabs<DetailsTab>
            ariaLabel="Camper details"
            items={items}
            value={tab}
            onChange={setTab}
            renderPanel={(value) => (
              <div className={css.panel}>
                {value === 'features' ? (
                  <CamperSpecs camper={camper} />
                ) : (
                  <ReviewsList reviews={reviews} />
                )}
              </div>
            )}
          />
        </div>

        <aside className={css.right}>
          <BookingForm camperId={camper.id} />
        </aside>
      </div>
    </div>
  );
}

export default CamperDetailsBottom;
