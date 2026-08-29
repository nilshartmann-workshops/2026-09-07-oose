import { useState } from "react";

import Counter from "./Counter.tsx";

// 🔎 Erzählen: Ohne das Aus- und Einblenden bekommt man die Aufräum-Funktion
//    des Effekts nie zu sehen
export default function EffektSpielwiese() {
  const [showCounter, setShowCounter] = useState(true);

  return (
    <div className={"space-y-4"}>
      <button
        className={"secondary"}
        onClick={() => setShowCounter(!showCounter)}
      >
        Counter {showCounter ? "ausblenden" : "einblenden"}
      </button>
      {showCounter && <Counter />}
    </div>
  );
}
