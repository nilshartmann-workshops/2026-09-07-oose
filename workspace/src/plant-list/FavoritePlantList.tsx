import { Plant, PlantSchema } from "../types.ts";
import PlantCardList from "./PlantCardList.tsx";
import { useFavoriteStore } from "./useFavoritesStore.ts";
import { useSuspenseQuery } from "@tanstack/react-query";
import PlantCard from "./PlantCard.tsx";
import { getPlantsQueryOptions } from "./plant-queries.ts";

type FavoritePlantListProps = {
  plants?: Plant[];
};

export default function FavoritePlantList() {
  const result = useSuspenseQuery(getPlantsQueryOptions());

  const plants = result.data;

  const store = useFavoriteStore();

  const favoritePlants = plants.filter((p) => store.favoriteIds.includes(p.id));

  return (
    <div>
      <h2>Meine Favoriten</h2>
      {favoritePlants.length === 0 ? (
        <p>Noch keine Favoriten ausgewählt.</p>
      ) : (
        favoritePlants.map((p) => (
          <PlantCard
            key={p.id}
            id={p.id}
            name={p.name}
            location={p.location}
            wateringInterval={p.wateringInterval}
            lastWatered={p.lastWatered}
          />
        ))
      )}
    </div>
  );
}
