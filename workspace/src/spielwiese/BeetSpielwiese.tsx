import { CSSProperties, memo, useEffect, useRef, useState } from "react";


const SPALTEN = 32;
const ZEILEN = 18;
const PFLANZEN = SPALTEN * ZEILEN;

const RUNDEN_SCHLUESSEL = "beet.runden";
const RUNDEN_VORGABE = 1500;

/* Das Messinstrument: Jede Pflanze zählt beim Rendern hoch, und die Anzeige
 * liest den Stand zweimal je Sekunde. Ein Ref je Pflanze ginge nicht, denn
 * gebraucht wird die Summe über alle. */
let pflanzenRenders = 0;

/* Die Arbeit, die eine echte Komponente beim Rendern hat: formatieren, rechnen,
 * ein Datum umwandeln. Hier steht sie als Schleife, damit sie sich über den
 * Regler verstellen lässt. */
function arbeit(startwert: number, runden: number) {
  let wert = startwert;

  for (let i = 0; i < runden; i++) {
    wert = Math.sin(wert) * 1000;
  }

  return wert;
}

/* Der Regler liegt im localStorage, weil das Ein- und Ausschalten des
 * Compilers ein Neuladen der Seite verlangt und die Einstellung das
 * überstehen soll. */
function gespeicherteRunden() {
  const gespeichert = localStorage.getItem(RUNDEN_SCHLUESSEL);
  const wert = Number(gespeichert);

  if (gespeichert === null || !Number.isFinite(wert)) {
    return RUNDEN_VORGABE;
  }

  return wert;
}

type PflanzeProps = {
  index: number;
  runden: number;
  gegossen: boolean;
  onGiessen: (index: number) => void;
};

const Pflanze = memo(function Pflanze({
  index,
  runden,
  gegossen,
  onGiessen,
}: PflanzeProps) {

  const hoehe = 30 + (Math.abs(arbeit(index, runden)) % 40);

  return (
    <div
      className={"Pflanze"}
      data-gegossen={gegossen}
      onPointerEnter={() => onGiessen(index)}
      style={{ "--hoehe": `${hoehe}%` } as CSSProperties}
    />
  );
});

function Beet() {
  // 🔎 Zeigen: diese Zeile auskommentieren. Der Compiler nimmt sich die
  //    Komponente dann vor, und der Zähler fällt von vielen tausend auf null.
  // "use no memo";

  const [kanne, setKanne] = useState({ x: 40, y: 40 });
  const [gegossen, setGegossen] = useState<ReadonlySet<number>>(new Set());
  const [runden, setRunden] = useState(gespeicherteRunden);

  /* Ob die Maustaste unten ist, steht im Ref und nicht im State: Aus einem
   * State hinge giessen daran, und die Funktion wäre bei jedem Druck eine
   * andere. */
  const zieht = useRef(false);

  function giessen(index: number) {
    if (!zieht.current) {
      return;
    }

    setGegossen((alte) => {
      if (alte.has(index)) {
        return alte;
      }

      const neue = new Set(alte);
      neue.add(index);

      return neue;
    });
  }

  const felder = [];

  for (let i = 0; i < PFLANZEN; i++) {
    felder.push(
      <Pflanze
        key={i}
        index={i}
        runden={runden}
        gegossen={gegossen.has(i)}
        onGiessen={giessen}
      />,
    );
  }

  return (
    <>
      <div className={"BeetLeiste"}>
        <label htmlFor={"runden"}>Arbeit je Pflanze</label>
        <input
          id={"runden"}
          type={"range"}
          min={0}
          max={6000}
          step={500}
          value={runden}
          onChange={(e) => {
            const neue = Number(e.target.value);

            setRunden(neue);
            localStorage.setItem(RUNDEN_SCHLUESSEL, String(neue));
          }}
        />
        <output htmlFor={"runden"}>{runden} Runden</output>
        <button
          type={"button"}
          className={"secondary sm"}
          onClick={() => setGegossen(new Set())}
        >
          Beet zurücksetzen
        </button>
      </div>
      <div
        className={"Beet"}
        style={{ "--spalten": SPALTEN } as CSSProperties}
        onPointerDown={() => {
          zieht.current = true;
        }}
        onPointerUp={() => {
          zieht.current = false;
        }}
        onPointerLeave={() => {
          zieht.current = false;
        }}
        onPointerMove={(e) => {
          const kasten = e.currentTarget.getBoundingClientRect();
          setKanne({ x: e.clientX - kasten.left, y: e.clientY - kasten.top });
        }}
      >
        {felder}
        <div
          className={"Giesskanne"}
          style={{ left: `${kanne.x}px`, top: `${kanne.y}px` }}
        />
      </div>
    </>
  );
}

/* Sagt, ob der Compiler `Beet` umgeschrieben hat. Er legt dabei die Slots
 * `$[0]`, `$[1]` und so weiter an, und die stehen im Rumpf, den `toString()`
 * herausgibt. Im Produktions-Build sind die Namen wegminifiziert, dort steht
 * hier immer "aus". */
const BEET_KOMPILIERT = /\$\[\d+\]/.test(Beet.toString());

/* Steht neben dem Beet und nicht darüber: Ihr eigener State soll das Beet nicht
 * mitrendern lassen, sonst misst die Anzeige sich selbst. */
function Anzeige() {
  const [stand, setStand] = useState({ pause: 0, renders: 0 });

  useEffect(() => {
    /* Der Zähler steht im Modul und überlebt den Reiterwechsel. Beim
     * Öffnen des Reiters fängt die Messung trotzdem bei null an. */
    pflanzenRenders = 0;

    let laeuft = true;
    let laengste = 0;
    let voriges = performance.now();
    let letzteAusgabe = voriges;

    function naechstesBild() {
      if (!laeuft) {
        return;
      }

      const jetzt = performance.now();
      laengste = Math.max(laengste, jetzt - voriges);
      voriges = jetzt;

      if (jetzt - letzteAusgabe >= 500) {
        setStand({ pause: Math.round(laengste), renders: pflanzenRenders });
        laengste = 0;
        letzteAusgabe = jetzt;
      }

      requestAnimationFrame(naechstesBild);
    }

    requestAnimationFrame(naechstesBild);

    return () => {
      laeuft = false;
    };
  }, []);

  return (
    <p className={"BeetAnzeige"}>
      <span className={"BeetCompiler"} data-an={BEET_KOMPILIERT}>
        Compiler: {BEET_KOMPILIERT ? "an" : "aus"}
      </span>{" "}
      · längste Pause zwischen zwei Bildern:{" "}
      <span data-testid={"pause"}>{stand.pause}</span> ms ·{" "}
      <span data-testid={"renders"}>{stand.renders}</span> Pflanzen-Renders{" "}
      <button
        type={"button"}
        className={"sm"}
        onClick={() => {
          pflanzenRenders = 0;
          setStand({ pause: 0, renders: 0 });
        }}
      >
        Zähler zurücksetzen
      </button>
    </p>
  );
}

export default function BeetSpielwiese() {
  return (
    <div>
      <h2>Das Beet</h2>
      <p>
        Halte die Maustaste gedrückt und zieh die Gießkanne über das Beet. Jede
        überfahrene Pflanze wird nass.
      </p>
      <Anzeige />
      <Beet />
    </div>
  );
}
