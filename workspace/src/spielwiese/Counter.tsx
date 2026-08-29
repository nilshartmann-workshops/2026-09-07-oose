import { useEffect, useState } from "react";

/**
 * Zwei Zähler, aber nur einer davon interessiert den Effekt.
 */
export default function Counter() {
  const [appleCount, setAppleCount] = useState(0);
  const [orangeCount, setOrangeCount] = useState(0);

  useEffect(() => {
    const previousTitle = window.document.title;

    // Die Funktion steht *im* Effekt und ist damit keine Dependency. Im
    // Dependency-Array bleibt der Wert stehen, um den es wirklich geht.
    const formatTitle = () => {
      return appleCount === 1 ? "1 Apfel" : `${appleCount} Äpfel`;
    };

    console.log("Effekt läuft!", new Date().toLocaleTimeString());
    window.document.title = formatTitle();

    return () => {
      console.log("Aufräumen!");
      window.document.title = previousTitle;
    };

    // 🔎 Zeigen: Dependency-Array auf [] und auf "gar keins" umstellen
    // 🔎 Zeigen: formatTitle über den Effekt ziehen und in die Dependencies
    //    aufnehmen -> der Effekt läuft bei jedem Render, auch bei den Orangen
  }, [appleCount]);

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
