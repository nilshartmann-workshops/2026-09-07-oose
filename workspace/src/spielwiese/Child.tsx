/* eslint-disable react-hooks/refs --
 * Der Linter hat recht, und trotzdem schalten wir ihn hier ab. Die Regel
 * `react-hooks/refs` verbietet, ein Ref *während des Renderns* zu lesen oder
 * zu verändern, und genau das tut unser Render-Zähler unten. In normalem Code
 * ist das ein Fehler: React darf eine Komponente rendern, ohne das Ergebnis
 * anzuzeigen, dann stimmt der Zähler nicht mehr. Hier wollen wir aber gerade
 * jeden einzelnen Render sehen. Deshalb die Ausnahme, und deshalb nur für
 * diese eine Datei.
 */
import { useRef } from "react";

type ChildProps = {
  /** Unterscheidet dieses Kind in der Anzeige und auf der Konsole */
  name: string;
  /** Wird angezeigt, mehr passiert damit nicht */
  value: number;
};

/**
 * Zeigt einen Wert an und zählt mit, wie oft es gerendert wurde. Mehr macht
 * dieses Kind nicht; es geht nur darum, das Rendern sichtbar zu machen.
 *
 * ⚠️ Diese Datei ist fertig, du musst hier nichts implementieren. Wir schauen
 *    sie uns später gemeinsam an.
 */
export default function Child({ name, value }: ChildProps) {
  // Der Render-Zähler. `useRef` ist eine Kiste, die das Rendern überlebt:
  // Was du hineinlegst, ist beim nächsten Render noch da. Anders als bei
  // `useState` löst das Ändern von `renderCount.current` aber *kein* neues
  // Rendern aus, und genau deshalb nehmen wir hier ein Ref. Mit `useState`
  // hättest du an dieser Stelle eine Endlosschleife gebaut: rendern, State
  // setzen, wieder rendern, ...
  const renderCount = useRef(0);
  renderCount.current++;

  console.log(`${name} rendert (${renderCount.current}. Mal), value=${value}`);

  return (
    <div className={"space-y-2 rounded-lg bg-white p-4 shadow-md"}>
      <h3 className={"font-semibold"}>{name}</h3>
      <div className={"text-sm text-gray-600"}>value: {value}</div>
      <div className={"RenderCounter"}>{renderCount.current}× gerendert</div>
    </div>
  );
}
