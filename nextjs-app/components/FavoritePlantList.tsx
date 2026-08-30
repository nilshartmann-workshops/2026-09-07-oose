"use client";

import { useFavoritesStore } from "@/lib/useFavoritesStore";
import { Plant } from "@/types";

import PlantCardList from "./PlantCardList";

type FavoritePlantListProps = {
  plants: Plant[];
};

// 🔎 Erzählen: an dieser Signatur ist nicht zu sehen, dass die Liste über die
//    Grenze kommt. Sie sieht aus wie ein gewöhnliches Prop und ist eine
//    Serialisierung.
export default function FavoritePlantList({ plants }: FavoritePlantListProps) {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);

  const favoritePlants = plants.filter((p) => favoriteIds.includes(p.id));

  return (
    <div>
      <h2>Meine Favoriten</h2>
      {favoritePlants.length === 0 ? (
        <p>Noch keine Favoriten ausgewählt.</p>
      ) : (
        <PlantCardList plants={favoritePlants} />
      )}
    </div>
  );
}
