import { Plant, PlantSchema } from "../types.ts";
import PlantCard from "./PlantCard.tsx";
import FavoritePlantList from "./FavoritePlantList.tsx";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getPlantsQueryOptions } from "./plant-queries.ts";

type PlantCardListProps = {
  plants?: Plant[];
};
export default function PlantCardList() {

  const result = useSuspenseQuery(getPlantsQueryOptions());

  const plants = result.data;

  return (
    <div className={"PlantCardList"}>
      {plants.map((p) => (
        <PlantCard
          key={p.id}
          id={p.id}
          name={p.name}
          location={p.location}
          wateringInterval={p.wateringInterval}
          lastWatered={p.lastWatered}
        />
      ))}
    </div>
  );
}
