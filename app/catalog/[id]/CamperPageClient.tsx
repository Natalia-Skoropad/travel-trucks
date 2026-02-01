'use client';

import { useEffect, useState } from 'react';

import FavoriteButton from '@/components/common/FavoriteButton/FavoriteButton';
import Toast from '@/components/common/Toast/Toast';
import { useCatalogStore } from '@/lib/store/catalogStore';

import css from './page.module.css';

//===============================================================

type Props = {
  camperId: string;
  title: string;
};

//===============================================================

function CamperPageClient({ camperId, title }: Props) {
  const favorites = useCatalogStore((s) => s.favorites);
  const toggleFavorite = useCatalogStore((s) => s.toggleFavorite);

  const isFav = favorites.includes(camperId);

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleToggle = () => {
    const willBeFav = !isFav;

    toggleFavorite(camperId);

    if (willBeFav) {
      setToastType('success');
      setToastMsg('Camper added to your favorites.');
    } else {
      setToastType('success');
      setToastMsg('Camper removed from your favorites.');
    }
  };

  useEffect(() => {
    if (!toastMsg) return;
    const id = window.setTimeout(() => setToastMsg(''), 2500);
    return () => window.clearTimeout(id);
  }, [toastMsg]);

  return (
    <>
      <div className={css.titleRow}>
        <h1 className={css.title}>{title}</h1>

        <FavoriteButton
          isActive={isFav}
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
