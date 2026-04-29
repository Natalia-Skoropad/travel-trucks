import { create } from 'zustand';
import { persist } from 'zustand/middleware';

//===========================================================================

type CatalogState = {
  favorites: string[];

  toggleFavorite: (id: string) => void;

  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
};

//===========================================================================

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set) => ({
      favorites: [],

      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      toggleFavorite: (id) =>
        set((state) => {
          const isFavorite = state.favorites.includes(id);

          return {
            favorites: isFavorite
              ? state.favorites.filter((itemId) => itemId !== id)
              : [...state.favorites, id],
          };
        }),
    }),
    {
      name: 'traveltrucks_catalog',
      partialize: (state) => ({
        favorites: state.favorites,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          state?.setHasHydrated(true);
        };
      },
    }
  )
);
