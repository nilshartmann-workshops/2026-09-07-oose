import { Plant } from "../types.ts";
import PlantCardList from "./PlantCardList.tsx";
import { useFavoriteStore } from "./useFavoritesStore.ts";

type FavoritePlantListProps = {
  plants: Plant[];
};

export default function FavoritePlantList({ plants }: FavoritePlantListProps) {

  const store = useFavoriteStore();

  const favoritePlants = plants.filter(
    p => store.favoriteIds.includes(p.id)
  )

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
