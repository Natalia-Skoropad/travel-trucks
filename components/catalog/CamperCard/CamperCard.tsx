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

function buildShortDescription(item: CamperListItem) {
  const details = [
    formatVehicleForm(item.form),
    formatTransmission(item.transmission),
    formatEngine(item.engine),
    item.length,
  ].filter(Boolean);

  return details.join(' • ');
}

//===============================================================

function CamperCard({ item, className }: Props) {
  const imageSrc = item.coverImage || '/images/placeholder.jpg';

  const description = buildShortDescription(item);
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

      <div className={css.top}>
        <div className={css.media}>
          <ShimmerImage
            as="span"
            src={imageSrc}
            alt={item.name}
            sizes="(max-width: 767px) 100vw, (max-width: 1439px) 265px, 360px"
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

          {description ? (
            <p className={css.description}>{description}</p>
          ) : null}
        </div>
      </div>

      <div className={css.bottom}>
        <FeatureBadges items={badges} className={css.badges} />

        <div className={css.actions}>
          <ButtonLink href={`/catalog/${item.id}`}>Show more</ButtonLink>
        </div>
      </div>
    </article>
  );
}

export default CamperCard;
