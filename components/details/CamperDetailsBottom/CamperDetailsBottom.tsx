'use client';

import { useMemo, useState } from 'react';
import type { Camper } from '@/types/camper';

import Tabs from '@/components/common/Tabs/Tabs';
import CamperSpecs from '@/components/details/CamperSpecs/CamperSpecs';
import ReviewsList from '@/components/details/ReviewsList/ReviewsList';
import BookingForm from '@/components/details/BookingForm/BookingForm';

import css from './CamperDetailsBottom.module.css';

//===============================================================

type DetailsTab = 'features' | 'reviews';

type Props = {
  camper: Camper;
  className?: string;
};

//===============================================================

function CamperDetailsBottom({ camper, className }: Props) {
  const [tab, setTab] = useState<DetailsTab>('features');

  const reviewsCount = camper.reviews?.length ?? 0;

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
        {/* LEFT: tabs + content */}
        <div className={css.left}>
          <Tabs<DetailsTab>
            ariaLabel="Camper details"
            items={items}
            value={tab}
            onChange={setTab}
          />

          <div className={css.panel}>
            {tab === 'features' ? (
              <CamperSpecs camper={camper} />
            ) : (
              <ReviewsList reviews={camper.reviews} />
            )}
          </div>
        </div>

        {/* RIGHT (desktop) / BOTTOM (mobile+tablet): form */}
        <aside className={css.right}>
          <BookingForm />
        </aside>
      </div>
    </div>
  );
}

export default CamperDetailsBottom;
