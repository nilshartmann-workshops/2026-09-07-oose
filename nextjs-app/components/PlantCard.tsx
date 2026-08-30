import dayjs from "dayjs";

import { getDaysUntilWatering } from "@/lib/date-utils";

import FavoriteButton from "./FavoriteButton";
import WaterButton from "./WaterButton";

type PlantCardProps = {
  id: string;
  name: string;
  location: string;
  wateringInterval: number;
  lastWatered?: string;
};

export default function PlantCard({
  id,
  name,
  location,
  wateringInterval,
  lastWatered,
}: PlantCardProps) {
  const wateringInfo =
    wateringInterval === 1
      ? "Jeden Tag gießen!"
      : `Alle ${wateringInterval} Tage gießen`;

  const lastWateredMsg = lastWatered ? (
    <div>Zuletzt: {dayjs(lastWatered).locale("de").format("DD.MM.YYYY")}</div>
  ) : (
    <div>Noch nicht gegossen 🍂</div>
  );

  const daysUntilWatering = lastWatered
    ? getDaysUntilWatering(lastWatered, wateringInterval)
    : null;

  const wateringMsg = daysUntilWatering !== null && (
    <div>
      {daysUntilWatering > 0
        ? `Noch ${daysUntilWatering} Tage bis zum Gießen`
        : daysUntilWatering === 0
          ? "Heute gießen!"
          : `Überfällig seit ${Math.abs(daysUntilWatering)} Tag(en)`}
    </div>
  );

  return (
    <div className={"PlantCard"}>
      <header>
        <h2>{name}</h2>
        <div>📍{location}</div>
        {/* 🔎 Zeigen: die Karte bleibt eine Server Component. Nur der Knopf
            wandert in den Browser. */}
        <FavoriteButton id={id} />
      </header>
      <section>
        <div>{wateringInfo}</div>
        {lastWateredMsg}
        {wateringMsg}
        <div className={"ButtonBar"}>
          <WaterButton id={id} />
        </div>
      </section>
    </div>
  );
}
