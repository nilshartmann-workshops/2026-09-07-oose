import { useEffect, useState } from "react";

import { playNotificationSound } from "./notification-sound.ts";
import { addToast, clearToasts, ToastContainer } from "./watering-toasts.tsx";
import { subscribeToWateringUpdates } from "./watering-updates.ts";

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

  useEffect(() => {
    if (!updatesEnabled) {
      return;
    }

    const unsubscribe = subscribeToWateringUpdates(location, (update) => {
      addToast(
        `${soundEnabled ? "🔔" : "🔕"} ${update.plantName} wurde gegossen`,
      );
      if (soundEnabled) {
        playNotificationSound();
      }
    });

    return () => {
      unsubscribe();
      clearToasts();
    };
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
