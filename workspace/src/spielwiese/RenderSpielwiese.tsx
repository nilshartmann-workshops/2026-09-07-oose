/* eslint-disable react-hooks/refs --
 * Render-Zähler wie in Child.tsx, die Begründung steht dort.
 */
import { useCallback, useMemo, useRef, useState } from "react";

import Child from "./Child.tsx";
import MemoChild from "./MemoChild.tsx";

/**
 * Spielwiese zum Rendern
 *
 * Hier probieren wir Dinge aus, die nichts mit unserer Pflanzen-App zu tun
 * haben. Die Frage dieser Spielwiese: Wann rendert eigentlich welche
 * Komponente?
 *
 * Sie steht für sich und stört den Rest der Anwendung nicht. Sie hat zwei
 * States, die nichts miteinander zu tun haben: einen Zähler und einen
 * Text. Der Text wird nirgends verwendet, er ist nur da, damit wir ein Rendern
 * auslösen können, das die Kinder gar nichts angeht.
 *
 * ⚠️ Diese Datei ist fertig, du musst hier nichts implementieren. Wir schauen
 *    sie uns später gemeinsam an.
 */
export default function RenderSpielwiese() {
  const [counter, setCounter] = useState(0);
  const [text, setText] = useState("");

  const renderCount = useRef(0);
  renderCount.current++;

  console.log(`RenderSpielwiese rendert (${renderCount.current}. Mal)`);

  // Ohne useCallback entstünde hier bei *jedem* Render eine neue Funktion. Sie
  // täte dasselbe, wäre aber eine andere Referenz, und damit wäre das memo()
  // im MemoChild wirkungslos. Zum Ausprobieren: die Zeile darunter
  // einkommentieren und die useCallback-Variante auskommentieren.
  const handleReset = useCallback(() => setCounter(0), []);
  // const handleReset = () => setCounter(0);

  // Dasselbe für ein Array: Ein Array-Literal ist bei jedem Render ein neues
  // Objekt, auch wenn derselbe Inhalt drinsteht.
  const tags = useMemo(() => ["Zimmerpflanze", "pflegeleicht"], []);
  // const tags = ["Zimmerpflanze", "pflegeleicht"];

  return (
    <div className={"space-y-4"}>
      <button className={"primary"} onClick={() => setCounter(counter + 1)}>
        Zähler erhöhen (aktuell: {counter})
      </button>

      <div className={"FormControl"}>
        <label>Ein Textfeld (der Text wird sonst nirgends benutzt)</label>
        <input value={text} onChange={(e) => setText(e.target.value)} />
      </div>

      <div className={"flex gap-x-4"}>
        {/* Kind A bekommt bei jedem Klick auf den Zähler einen neuen Wert... */}
        <Child name={"Kind A"} value={counter} />
        {/* ...Kind B dagegen immer denselben. Was heißt das fürs Rendern? */}
        <Child name={"Kind B"} value={42} />
        {/* ...und das Memo-Kind ist in memo() eingepackt: Seine Properties
            ändern sich nie, also rendert es auch nicht mit. */}
        <MemoChild
          name={"Memo-Kind"}
          value={42}
          onReset={handleReset}
          tags={tags}
        />
      </div>
    </div>
  );
}
