import { Plant } from "../types.ts";
import PlantCardList from "./PlantCardList.tsx";

const allPlants: Plant[] = [
  {
    id: "1",
    name: "Aloe Vera",
    location: "Schlafzimmer",
    wateringInterval: 12,
    lastWatered: "2025-06-16",
  },
  {
    id: "2",
    name: "Orchidee",
    location: "Wohnzimmer",
    wateringInterval: 20,
  },
  {
    id: "3",
    name: "Grüne Monstera",
    location: "Wohnzimmer",
    wateringInterval: 7,
    lastWatered: "2025-06-20",
  },
  {
    id: "4",
    name: "Kleine Sukkulente",
    location: "Küche",
    wateringInterval: 14,
    lastWatered: "2025-06-15",
  },
  {
    id: "5",
    name: "Große Palme",
    location: "Flur",
    wateringInterval: 8,
    lastWatered: "2025-06-19",
  },
];

export default function PlantList() {
  return (
    <div className={"PlantList"}>
      <div>
        <h2>Alle Pflanzen</h2>
        <PlantCardList plants={allPlants} />
      </div>
    </div>
  );
}
