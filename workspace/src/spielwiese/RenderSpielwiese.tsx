/* eslint-disable react-hooks/refs --
 * Render-Zähler wie in Child.tsx, die Begründung steht dort.
 */
import { useCallback, useMemo, useRef, useState } from "react";

import { ChildMemo } from "./Child.tsx";
import MemoChild from "./MemoChild.tsx";

// virtueller DOM { "div", props: { classname: "..." }, children: [  { "button" } ]

export default function RenderSpielwiese() {
  const [counter, setCounter] = useState(0);
  const [text, setText] = useState("");

  const renderCount = useRef(0);
  renderCount.current++;
  console.log(`RenderSpielwiese rendert (${renderCount.current}. Mal)`);

  // const handleReset = () => setCounter(0);

  const handleReset = useCallback(
    () => setCounter(0),
    []
  );

  const tags = useMemo(
    () => ["Zimmerpflanze", "..."],
    [text]
  );

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
        <ChildMemo name={"Kind A"} value={counter} />
        <ChildMemo name={"Kind B"} value={42} tags={tags} />
      </div>
    </div>
  );
}
