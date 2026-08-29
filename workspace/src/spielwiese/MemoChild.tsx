/* eslint-disable react-hooks/refs --
 * Render-Zähler wie in Child.tsx, die Begründung steht dort.
 */
import { memo, useRef } from "react";

type MemoChildProps = {
  /** Unterscheidet dieses Kind in der Anzeige und auf der Konsole */
  name: string;
  /** Wird angezeigt, mehr passiert damit nicht */
  value: number;
  /** Setzt den Zähler zurück, und genau hier wird es spannend */
  onReset(): void;
  /** Wird unter dem Wert angezeigt, mit demselben Problem wie die Funktion */
  tags: string[];
};

/**
 * Dasselbe Kind wie `Child`, aber in `memo()` eingepackt.
 *
 * `memo()` gibt eine neue Komponente zurück, die sich das Ergebnis ihres
 * letzten Renderns merkt. Rendert der Vater neu, vergleicht React vorher die
 * Properties: Sind sie alle noch dieselben, rendert dieses Kind nicht mit.
 *
 * "Dieselben" heißt `===`, also Referenzvergleich. Für Strings und Zahlen ist
 * das unproblematisch, für Funktionen, Objekte und Arrays nicht: Die sind bei
 * jedem Render neu und damit *nie* `===`. Deshalb stecken `onReset` und `tags`
 * in der Spielwiese in `useCallback` bzw. `useMemo`.
 *
 * ⚠️ Diese Datei ist fertig, du musst hier nichts implementieren. Wir schauen
 *    sie uns gemeinsam an.
 */
function MemoChild({ name, value, onReset, tags }: MemoChildProps) {
  const renderCount = useRef(0);
  renderCount.current++;

  console.log(`${name} rendert (${renderCount.current}. Mal)`);

  return (
    <div className={"space-y-2 rounded-lg bg-white p-4 shadow-md"}>
      <h3 className={"font-semibold"}>{name}</h3>
      <div className={"text-sm text-gray-600"}>value: {value}</div>
      <div className={"text-sm text-gray-600"}>tags: {tags.join(", ")}</div>
      <button className={"sm"} onClick={onReset}>
        Zähler zurücksetzen
      </button>
      <div className={"RenderCounter"}>{renderCount.current}× gerendert</div>
    </div>
  );
}

export default memo(MemoChild);
