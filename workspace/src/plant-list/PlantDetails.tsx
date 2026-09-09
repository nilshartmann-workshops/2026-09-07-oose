import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { plantQueryOptions } from "./plant-queries.ts";


type PlantDetailsProps = {
  plantId: string;
};

export default function PlantDetails({ plantId }: PlantDetailsProps) {
  const { data: plant } = useSuspenseQuery(plantQueryOptions(plantId));

  return (
    <div className={"PlantCard"}>
      <header>
        <h2>{plant.name}</h2>
      </header>
      <section>
        <div>📍{plant.location}</div>
        <div>
          {plant.wateringInterval === 1
            ? "Jeden Tag gießen!"
            : `Alle ${plant.wateringInterval} Tage gießen`}
        </div>
        <div>
          {plant.lastWatered
            ? `Zuletzt: ${dayjs(plant.lastWatered).locale("de").format("DD.MM.YYYY")}`
            : "Noch nicht gegossen 🍂"}
        </div>
      </section>
      <Link to={"/"}>Zurück</Link>
    </div>
  );
}
