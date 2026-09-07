import { useEffect, useEffectEvent, useState } from "react";

import { playNotificationSound } from "./notification-sound.ts";
import { addToast, clearToasts, ToastContainer } from "./watering-toasts.tsx";
import {
  subscribeToWateringUpdates,
  WateringUpdate,
} from "./watering-updates.ts";

export default function WateringNotifications() {
  const [location, setLocation] = useState("bedroom");
  const [updatesEnabled, setUpdatesEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleUpdate = useEffectEvent( (update: WateringUpdate) => {
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
    const unsubscribe = subscribeToWateringUpdates(location, handleUpdate)
    // (update) => {
    //   addToast(
    //     `${soundEnabled ? "🔔" : "🔕"} ${update.plantName} (${update.location})wurde gegossen`,
    //   );
    //   if (soundEnabled) {
    //     playNotificationSound();
    //   }
    // });

    return () => {
      unsubscribe();
      clearToasts();
    };
  },
    [location, updatesEnabled]
  );

  return (
    <div className={"space-y-4 rounded-lg bg-white p-4 shadow-md"}>
      <ToastContainer />

      <button
        className={"secondary flex items-center p-1"}
        type={"button"}
        onClick={() => setUpdatesEnabled(!updatesEnabled)}
      >
        {updatesEnabled ? "Listener beenden" : "Listener starten"}
      </button>

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
          checked={soundEnabled}
          onChange={(e) => setSoundEnabled(e.target.checked)}
        />
        Ton bei neuer Meldung
      </label>
    </div>
  );
}
