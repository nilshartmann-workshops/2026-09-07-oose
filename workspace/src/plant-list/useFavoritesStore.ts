import { create } from "zustand";

type FavoritesStore = {
  // username: string;
  favoriteIds: string[];

  clear: () => void;

  toggleFavorite: (id: string) => void;
};

function toggle(ids: string[], id: string): string[] {
  return ids.includes(id) ?
    ids.filter( (fId) => fId !== id) :
    [...ids, id];
}

export const useFavoriteStore = create<FavoritesStore>()( (set, getState) => {
  return {
    favoriteIds: [],

    // ACTIONS:
    clear() {
      set({
        favoriteIds: [],
      });
    },

    toggleFavorite(id :string) {
      set(state => ({
        favoriteIds: toggle(state.favoriteIds, id)
      }))
    }
  };
});





