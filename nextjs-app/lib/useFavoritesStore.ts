// 🔎 Erzählen: die eine Zeile, die diese Datei von der der SPA unterscheidet.
//    Sie steht ganz oben, damit ein versehentlicher Import aus einer Server
//    Component sofort auffällt und nicht erst tief im Baum.
"use client";

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
// 🔎 Fallstrick: der Store lebt im Modul und damit im Prozess des Servers. Er
//    trägt hier nur deshalb, weil der Anfangszustand eine Konstante ist und
//    niemand auf dem Server hineinschreibt. Mit Serverdaten vorbelegt teilten
//    sich alle Anfragen einen Stand, im localStorage gehalten wiche der erste
//    Render vom Browser ab. Beides löst ein Provider je Anfrage.
export const useFavoritesStore = create<FavoritesStore>()((set) => ({
  favoriteIds: [],

  toggleFavorite: (id) =>
    set((state) => ({ favoriteIds: toggle(state.favoriteIds, id) })),
}));

// 🔎 Erzählen: eine Funktion, die eine Funktion zurückgibt.
//    selectIsFavorite("3") liefert den fertigen Selector für die Pflanze mit
//    der Id 3.
export const selectIsFavorite =
  (id: string) =>
  (state: FavoritesStore): boolean =>
    state.favoriteIds.includes(id);
