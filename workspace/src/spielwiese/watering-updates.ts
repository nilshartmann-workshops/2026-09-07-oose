export type WateringUpdate = {
  plantId: string;
  plantName: string;
  wateredAt: Date;
};

type WateringUpdateHandler = (update: WateringUpdate) => void;

const PLANT_BY_LOCATION: Record<
  string,
  { plantId: string; plantName: string }
> = {
  bedroom: { plantId: "p-3", plantName: "Aloe Vera" },
  kitchen: { plantId: "p-7", plantName: "Basilikum-Töpfchen" },
};

/**
 * Tut so, als hinge eine Verbindung zum Server, über die andere Benutzer
 * melden, dass sie gegossen haben. Immer dieselbe Pflanze, immer im
 * selben Abstand, damit in der Demo nichts zufällig ist.
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
  }, 3000);

  return () => {
    console.log(`🔌 Verbindung geschlossen: ${location}`);
    clearInterval(timer);
  };
}
