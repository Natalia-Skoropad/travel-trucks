'use client';

import { useCallback } from 'react';

import { useCatalogStore } from '@/lib/store/catalogStore';

//===========================================================================

export function useFavorites() {
  const favoriteIds = useCatalogStore((state) => state.favorites);
  const toggleFavorite = useCatalogStore((state) => state.toggleFavorite);
  const hasHydrated = useCatalogStore((state) => state.hasHydrated);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds]
  );

  return {
    favoriteIds,
    favoritesCount: favoriteIds.length,
    toggleFavorite,
    isFavorite,
    hasHydrated,
  };
}
