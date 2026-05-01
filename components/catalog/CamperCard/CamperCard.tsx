'use client';

import { useState } from 'react';
import clsx from 'clsx';

import type { CamperListItem } from '@/types/camper';

import {
  buildFeatureBadges,
  formatEngine,
  formatTransmission,
  formatVehicleForm,
} from '@/lib/utils/camperBadges';

import { useFavorites } from '@/hooks/useFavorites';
import { buildCamperHref } from '@/lib/utils/camperSlug';

import RatingLocation from '@/components/common/RatingLocation/RatingLocation';
import FeatureBadges from '@/components/common/FeatureBadges/FeatureBadges';
import ButtonLink from '@/components/common/Button/ButtonLink';
import FavoriteButton from '@/components/common/FavoriteButton/FavoriteButton';
import ShimmerImage from '@/components/common/ShimmerImage/ShimmerImage';
import Toast from '@/components/common/Toast/Toast';

import css from './CamperCard.module.css';

//===============================================================

type Props = {
  item: CamperListItem;
  className?: string;
};

//===============================================================

function CamperCard({ item, className }: Props) {
  const imageSrc = item.coverImage || '/images/placeholder.jpg';

  const badges = buildFeatureBadges(item);
  const reviewsCount = item.totalReviews ?? 0;

  const { favoriteIds, toggleFavorite } = useFavorites();

  const isFavorite = favoriteIds.includes(item.id);

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleToggleFavorite = () => {
    const wasFavorite = favoriteIds.includes(item.id);

    toggleFavorite(item.id);

    setToast({
      message: wasFavorite ? 'Removed from favorites' : 'Added to favorites',
      type: 'success',
    });
  };

  return (
    <article className={clsx(css.card, className)}>
      {toast ? (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={2000}
          onClose={() => setToast(null)}
        />
      ) : null}

      <FavoriteButton
        isActive={isFavorite}
        onToggle={handleToggleFavorite}
        className={css.fav}
        size="lg"
      />

      <div className={css.media}>
        <ShimmerImage
          as="span"
          src={imageSrc}
          alt={item.name}
          sizes="(max-width: 767px) 100vw, (max-width: 1439px) 265px, 310px"
          className={css.image}
        />
      </div>

      <div className={css.content}>
        <header className={css.header}>
          <h2 className={css.title}>{item.name}</h2>
          <span className={css.price}>€{item.price.toFixed(2)}</span>
        </header>

        <RatingLocation
          rating={item.rating ?? 0}
          reviewsCount={reviewsCount}
          location={item.location ?? ''}
        />

        <dl className={css.specs} aria-label="Camper main specifications">
          <div className={css.spec}>
            <dt className={css.specLabel}>Camper form:</dt>
            <dd className={css.specValue}>{formatVehicleForm(item.form)}</dd>
          </div>

          <div className={css.spec}>
            <dt className={css.specLabel}>Engine:</dt>
            <dd className={css.specValue}>{formatEngine(item.engine)}</dd>
          </div>

          <div className={css.spec}>
            <dt className={css.specLabel}>Transmission:</dt>
            <dd className={css.specValue}>
              {formatTransmission(item.transmission)}
            </dd>
          </div>
        </dl>

        <FeatureBadges items={badges} className={css.badges} />

        <div className={css.actions}>
          <ButtonLink href={buildCamperHref(item)}>Show more</ButtonLink>
        </div>
      </div>
    </article>
  );
}

export default CamperCard;
