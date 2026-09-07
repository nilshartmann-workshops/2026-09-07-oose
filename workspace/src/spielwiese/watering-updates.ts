export type WateringUpdate = {
  plantId: string;
  plantName: string;
  location: string;
  wateredAt: Date;
};

type WateringUpdateHandler = (update: WateringUpdate) => void;

const PLANT_BY_LOCATION: Record<
  string,
  { plantId: string; plantName: string, location: string }
> = {
  bedroom: { plantId: "p-3", plantName: "Aloe Vera", location: "Schlafzimmer" },
  kitchen: { plantId: "p-7", plantName: "Basilikum-Töpfchen", location: "Küche" },
};

/**
 * Tut so, als hinge eine Verbindung zum Server, über die andere Benutzer
 * melden, dass sie gegossen haben.
 *
 * Gibt die Abmelde-Funktion zurück, die der Effekt direkt aufräumen kann.
 */
export function subscribeToWateringUpdates(
  location: string,
  onUpdate: WateringUpdateHandler,
) {
  console.log(`🔌 Verbindung geöffnet: ${location}`);
  const plant = PLANT_BY_LOCATION[location];

  const timer = setInterval(() => {
    onUpdate({ ...plant, wateredAt: new Date() });
  }, 1500);

  return () => {
    console.log(`🔌 Verbindung geschlossen: ${location}`);
    clearInterval(timer);
  };
}
