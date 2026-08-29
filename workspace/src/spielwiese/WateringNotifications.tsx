import { useEffect, useEffectEvent, useState } from "react";

import { playNotificationSound } from "./notification-sound.ts";
import { addToast, clearToasts, ToastContainer } from "./watering-toasts.tsx";
import {
  subscribeToWateringUpdates,
  type WateringUpdate,
} from "./watering-updates.ts";

/**
 * Andere Benutzer gießen dieselben Pflanzen. Über eine (simulierte)
 * Serververbindung bekommen wir davon Meldungen.
 *
 * Nicht jede Einstellung geht die Verbindung etwas an: Standort und Empfang
 * schon, der Ton nicht.
 */
export default function WateringNotifications() {
  const [location, setLocation] = useState("bedroom");
  const [updatesEnabled, setUpdatesEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Effect Event: liest immer den aktuellen Wert von "soundEnabled",
  // ist aber nicht reaktiv. Gehört deshalb NICHT ins Dependency-Array.
  const handleUpdate = useEffectEvent((update: WateringUpdate) => {
    addToast(
      `${soundEnabled ? "🔔" : "🔕"} ${update.plantName} wurde gegossen`,
    );
    if (soundEnabled) {
      playNotificationSound();
    }
  });

  useEffect(() => {
    if (!updatesEnabled) {
      return;
    }

    // handleUpdate wird im Effekt AUFGERUFEN und nicht weitergereicht,
    // deshalb die Arrow-Funktion drumherum.
    const unsubscribe = subscribeToWateringUpdates(location, (update) =>
      handleUpdate(update),
    );

    return () => {
      unsubscribe();
      clearToasts();
    };

    // 🔎 Zeigen: ESLint verlangt "handleUpdate" NICHT im Array
    //
    // 🔎 Häkchen bei "Ton" mehrfach umlegen -> Konsole bleibt ruhig, der
    //    Drei-Sekunden-Takt läuft durch, der NÄCHSTE Toast zeigt das
    //    neue Symbol. Frischer Wert ohne Reaktivität.
    //
    // 🔎 Häkchen bei "Meldungen empfangen" umlegen -> Verbindung wird
    //    geschlossen und wieder geöffnet. Genau so soll es sein.
    //
    // 🔎 Standort umstellen -> Verbindung wird neu aufgebaut, ab jetzt
    //    kommt Basilikum statt Aloe Vera.
    //
    // 🔎 Kernsatz: Das Dependency-Array ist eine fachliche Entscheidung,
    //    keine Linter-Frage. Das eine MUSS die Verbindung neu aufbauen,
    //    das andere DARF es nicht.
  }, [location, updatesEnabled]);

  return (
    <div className={"space-y-4 rounded-lg bg-white p-4 shadow-md"}>
      <ToastContainer />

      <label className={"flex items-center gap-x-2"}>
        Standort
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value={"bedroom"}>Schlafzimmer</option>
          <option value={"kitchen"}>Küche</option>
        </select>
      </label>

      <label className={"flex items-center gap-x-2"}>
        <input
          type={"checkbox"}
          checked={updatesEnabled}
          onChange={(e) => setUpdatesEnabled(e.target.checked)}
        />
        Meldungen empfangen
      </label>

      <label className={"flex items-center gap-x-2"}>
        <input
          type={"checkbox"}
          checked={soundEnabled}
          onChange={(e) => setSoundEnabled(e.target.checked)}
        />
        Ton bei neuer Meldung
      </label>
    </div>
  );
}
