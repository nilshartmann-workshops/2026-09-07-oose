import { useState } from "react";

/**
 * Zwei Zähler, aber nur einer davon wird gleich einen Effekt interessieren.
 *
 * ⚠️ Das Gerüst ist fertig: zwei States, zwei Buttons, die Anzeige. Was noch
 *    fehlt, ist der `useEffect`. Den baust du später selbst (siehe das `todo`
 *    unten); bis dahin macht diese Komponente nichts weiter als zählen.
 */
export default function Counter() {
  const [appleCount, setAppleCount] = useState(0);
  const [orangeCount, setOrangeCount] = useState(0);

  // todo: Hier kommt später der Effekt hin, der den Titel des Browser-Tabs
  //       auf den aktuellen appleCount setzt, samt Dependency-Array und
  //       Aufräum-Funktion.

  return (
    <div
      className={"flex items-center gap-x-4 rounded-lg bg-white p-4 shadow-md"}
    >
      <span>🍎 {appleCount}</span>
      <span>🍊 {orangeCount}</span>
      <button
        className={"primary"}
        onClick={() => setAppleCount(appleCount + 1)}
      >
        Ein Apfel mehr
      </button>
      <button
        className={"secondary"}
        onClick={() => setOrangeCount(orangeCount + 1)}
      >
        Eine Orange mehr
      </button>
    </div>
  );
}
