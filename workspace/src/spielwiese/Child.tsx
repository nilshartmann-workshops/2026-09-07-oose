/* eslint-disable react-hooks/refs --
 * Der Linter hat recht, und trotzdem schalten wir ihn hier ab. Die Regel
 * `react-hooks/refs` verbietet, ein Ref *während des Renderns* zu lesen oder
 * zu verändern, und genau das tut unser Render-Zähler unten. In normalem Code
 * ist das ein Fehler: React darf eine Komponente rendern, ohne das Ergebnis
 * anzuzeigen, dann stimmt der Zähler nicht mehr. Hier wollen wir aber gerade
 * jeden einzelnen Render sehen. Deshalb die Ausnahme, und deshalb nur für
 * diese eine Datei.
 */
import { memo, useRef } from "react";

type ChildProps = {
  /** Unterscheidet dieses Kind in der Anzeige und auf der Konsole */
  name: string;
  /** Wird angezeigt, mehr passiert damit nicht */
  value: number;

  tags?: string[]
};

const ChildMemo = memo(function Child({ name, tags, value }: ChildProps) {
  const renderCount = useRef(0);
  renderCount.current++;
  console.log(`${name} rendert (${renderCount.current}. Mal), value=${value}`);

  return (
    <div className={"space-y-2 rounded-lg bg-white p-4 shadow-md"}>
      <h3 className={"font-semibold"}>{name}</h3>
      <div className={"text-sm text-gray-600"}>value: {value}</div>
      <div className={"RenderCounter"}>{renderCount.current}× gerendert</div>
      <div>{JSON.stringify(tags)}</div>
    </div>
  );
}, );

export {ChildMemo}