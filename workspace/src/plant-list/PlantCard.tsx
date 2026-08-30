import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

import { getDaysUntilWatering } from "../shared/date-utils.ts";
import { plantsQueryOptions } from "./plantsQueryOptions.ts";
import { useFavoritesStore } from "./useFavoritesStore.ts";

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
  // 🔎 Erzählen: zwei Selektoren statt eines Zugriffs auf den ganzen Store
  const isFavorite = useFavoritesStore((state) =>
    state.favoriteIds.includes(id),
  );
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const queryClient = useQueryClient();

  const {
    mutate: markAsWatered,
    isPending,
    error,
  } = useMutation({
    async mutationFn() {
      const response = await fetch(
        `http://localhost:7200/api/plants/${id}/lastWatered`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ lastWatered: dayjs().format("YYYY-MM-DD") }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    },

    // 🔎 Zeigen: onSuccess weglassen. Das Backend hat den neuen Wert, die Karte
    //    zeigt weiter den alten, denn im Cache steht die alte Liste.
    //
    // 🔎 Nebenbei: jedes Callback bekommt den QueryClient auch im letzten
    //    Parameter gereicht (context.client). Dann entfällt useQueryClient.
    onSuccess() {
      queryClient.invalidateQueries(plantsQueryOptions());
    },
  });

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
        <button onClick={() => toggleFavorite(id)}>
          {isFavorite ? "💚 Favorit" : "🤍 Favorit"}
        </button>
      </header>
      <section>
        <div>{wateringInfo}</div>
        {lastWateredMsg}
        {wateringMsg}
        <button
          type={"button"}
          disabled={isPending}
          onClick={() => markAsWatered()}
        >
          💧 Jetzt gegossen
        </button>
        {error && <p className={"error-message"}>{error.message}</p>}
      </section>
    </div>
  );
}
