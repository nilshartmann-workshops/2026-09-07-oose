import { useSuspenseQuery } from "@tanstack/react-query";

import FavoritePlantList from "./FavoritePlantList.tsx";
import PlantCardList from "./PlantCardList.tsx";
import { plantsQueryOptions } from "./plantsQueryOptions.ts";

export default function PlantList() {
  const { data: plants } = useSuspenseQuery(plantsQueryOptions());

  return (
    <div className={"PlantList"}>
      <div>
        <h2>Alle Pflanzen</h2>
        <PlantCardList plants={plants} />
      </div>
      <FavoritePlantList />
    </div>
  );
}
