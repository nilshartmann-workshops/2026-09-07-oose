import { create } from "zustand";

// 🔎 Erzählen: der Store lebt außerhalb von React, kein Provider nötig
type FavoritesStore = {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
};

// 🔎 Fallstrick: immer ein neues Array, nie push oder splice. Sonst sieht der
//    Referenzvergleich keine Änderung.
function toggle(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((fId) => fId !== id) : [...ids, id];
}

// 🔎 Erzählen: die leere Klammer nach create<T> ist ein TypeScript-Detail
export const useFavoritesStore = create<FavoritesStore>()((set) => ({
  favoriteIds: [],

  toggleFavorite: (id) => {
    set((state) => ({ favoriteIds: toggle(state.favoriteIds, id) }));
  },
}));
