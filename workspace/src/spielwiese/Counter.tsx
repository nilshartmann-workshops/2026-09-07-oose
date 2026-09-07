import { useEffect, useState } from "react";

// Pure Funktionen
// 1. Render Phase: Liefert virtuellen Dom zurück SEITENEFFEKTE VERBOTEN!!!!
// 2. Commit Phase: Seiteneffekte dürfen verwendet werden

// 100      |  setAppleCount
// 201      |  setOrangeCount

function useTimer() {
  const [timerState, setTimerState] = useState(123);

  useEffect(() => {
    setInterval( () => setTimerState(x => x + 1), 1000)
  }, []);

  return timerState;
}

// function moin() {
//
//   useTimer()
//
// }
//
// class HelloWorld {
//
//
// }

export default function Counter() {
  const [appleCount, setAppleCount] = useState(100); // 1.
  const [orangeCount, setOrangeCount] = useState(200); // 2.
  const timer = useTimer();

  console.log("Timer", timer);

  // // JAVA
  // useEffect( () -> {
  //   const oldTitle = window.document.title;
  // });

  // Lambda
  // Closure

  // const tags = ["Pflanze", "Grün"];

  console.log("Rendering Component", new Date().toLocaleTimeString());
  // window.document.title = `${appleCount} Äpfel`;

  // window.document.title = `${appleCount} Äpfel`;

  // fetch("https://heise.de")
  //   .then(r => r.json())
  //   .then(ergebnis => setAppleCount(ergebnis))

  useEffect(() => {
    const oldTitle = window.document.title;
    console.log("useEffect", new Date().toLocaleTimeString());

    // Effect Callback-Funktionen
    window.document.title = `${appleCount} Äpfel`;

    // Clean-up-Funktion
    return () => {
      window.document.title = oldTitle;
    };
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
