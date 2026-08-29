import { Plant } from "../types.ts";
import PlantCard from "./PlantCard.tsx";

type PlantCardListProps = {
  plants: Plant[];
};
export default function PlantCardList({ plants }: PlantCardListProps) {
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
