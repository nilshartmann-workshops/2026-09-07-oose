import { Plant } from "../types.ts";
import PlantCardList from "./PlantCardList.tsx";
import { useFavoritesStore } from "./useFavoritesStore.ts";

type FavoritePlantListProps = {
  plants: Plant[];
};

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
