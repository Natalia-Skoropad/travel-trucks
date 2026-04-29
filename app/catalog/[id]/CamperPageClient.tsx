'use client';

import { useEffect, useState } from 'react';

import FavoriteButton from '@/components/common/FavoriteButton/FavoriteButton';
import Toast from '@/components/common/Toast/Toast';
import { useFavorites } from '@/hooks/useFavorites';

import css from './page.module.css';

//===============================================================

type Props = {
  camperId: string;
  title: string;
};

//===============================================================

function CamperPageClient({ camperId, title }: Props) {
  const { favoriteIds, toggleFavorite } = useFavorites();

  const isFavorite = favoriteIds.includes(camperId);

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleToggle = () => {
    const willBeFavorite = !isFavorite;

    toggleFavorite(camperId);

    setToastType('success');
    setToastMsg(
      willBeFavorite
        ? 'Camper added to your favorites.'
        : 'Camper removed from your favorites.'
    );
  };

  useEffect(() => {
    if (!toastMsg) return;

    const timeoutId = window.setTimeout(() => setToastMsg(''), 2500);

    return () => window.clearTimeout(timeoutId);
  }, [toastMsg]);

  return (
    <>
      <div className={css.titleRow}>
        <h1 className={css.title}>{title}</h1>

        <FavoriteButton
          isActive={isFavorite}
          onToggle={handleToggle}
          className={css.favDesktop}
          size="lg"
        />
      </div>

      <Toast
        message={toastMsg}
        type={toastType}
        onClose={() => setToastMsg('')}
        duration={2500}
      />
    </>
  );
}

export default CamperPageClient;
