// CamperCard.tsx
'use client';

import { useState } from 'react';
import clsx from 'clsx';

import type { Camper } from '@/types/camper';
import { buildFeatureBadges } from '@/lib/utils/camperBadges';
import { useCatalogStore } from '@/lib/store/catalogStore';

import RatingLocation from '@/components/common/RatingLocation/RatingLocation';
import FeatureBadges from '@/components/common/FeatureBadges/FeatureBadges';
import ButtonLink from '@/components/common/Button/ButtonLink';
import FavoriteButton from '@/components/common/FavoriteButton/FavoriteButton';
import ShimmerImage from '@/components/common/ShimmerImage/ShimmerImage';
import Toast from '@/components/common/Toast/Toast';

import css from './CamperCard.module.css';

//===============================================================

type Props = {
  item: Camper;
  className?: string;
};

//===============================================================

const DESCRIPTION_LIMIT = 60;

function truncate(text: string, limit = DESCRIPTION_LIMIT) {
  const value = text?.trim() ?? '';
  if (!value) return '';
  return value.length > limit ? `${value.slice(0, limit)}...` : value;
}

//===============================================================

function CamperCard({ item, className }: Props) {
  const imageSrc =
    item.gallery?.[0]?.thumb ||
    item.gallery?.[0]?.original ||
    '/images/placeholder.jpg';

  const description = truncate(item.description);
  const badges = buildFeatureBadges(item);
  const reviewsCount = item.reviews?.length ?? 0;

  const favorites = useCatalogStore((s) => s.favorites);
  const toggleFavorite = useCatalogStore((s) => s.toggleFavorite);

  const isFav = favorites.includes(item.id);

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleToggleFavorite = () => {
    const wasFav = favorites.includes(item.id);

    toggleFavorite(item.id);

    setToast({
      message: wasFav ? 'Removed from favorites' : 'Added to favorites',
      type: 'success',
    });
  };

  return (
    <article className={clsx(css.card, className)}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={2000}
          onClose={() => setToast(null)}
        />
      )}

      <FavoriteButton
        isActive={isFav}
        onToggle={handleToggleFavorite}
        className={css.fav}
        size="lg"
      />

      <div className={css.top}>
        <div className={css.media}>
          <ShimmerImage
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

          {description && <p className={css.description}>{description}</p>}
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
