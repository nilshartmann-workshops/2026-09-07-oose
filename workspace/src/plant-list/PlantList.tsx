import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";

import FavoritePlantList from "./FavoritePlantList.tsx";
import PlantCardList from "./PlantCardList.tsx";
import { plantsQueryOptions } from "./plantsQueryOptions.ts";

export default function PlantList() {
  // 🔎 Erzählen: kein Prop und kein Store. Der Wert steht in der Adresse, und
  //    von dort liest ihn jede Komponente, die ihn braucht.
  const { orderBy } = useSearch({ from: "/" });
  const { data: plants } = useSuspenseQuery(plantsQueryOptions(orderBy));

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
