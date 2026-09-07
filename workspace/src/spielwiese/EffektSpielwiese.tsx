import { useState } from "react";
import Counter from "./Counter.tsx";

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
