import { useSuspenseQuery } from "@tanstack/react-query";

import PlantCardList from "./PlantCardList.tsx";
import { plantsQueryOptions } from "./plantsQueryOptions.ts";
import { useFavoritesStore } from "./useFavoritesStore.ts";

export default function FavoritePlantList() {
  // 🔎 Zeigen: im Netzwerk-Tab läuft trotzdem nur eine Anfrage, denn beide
  //    Komponenten fragen denselben queryKey
  const { data: plants } = useSuspenseQuery(plantsQueryOptions());
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
