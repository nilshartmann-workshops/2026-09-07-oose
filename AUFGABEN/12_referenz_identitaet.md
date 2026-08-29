# Effekte, Dependencies und Referenz-Identität

## Dateien

- `src/spielwiese/EffektSpielwiese.tsx` (legst du neu an)
- `src/spielwiese/Counter.tsx` (das Gerüst liegt da, der Effekt fehlt)
- `src/App.tsx` (bekommt einen Reiter dazu)
- `src/spielwiese/RenderSpielwiese.tsx` (nur für den optionalen Teil)

## Vorbereitung

Öffne die Browser-Konsole und lass sie geöffnet. Ohne sie siehst du die Hälfte dieser Übung nicht.

## Aufgabe

Der `Counter` soll sich mit dem Titel des Browser-Tabs synchronisieren. Du baust den Effekt mit seinen drei Teilen: dem Effekt, dem Dependency-Array und der Aufräum-Funktion. Danach geht es darum, wann React eine Dependency für "geändert" hält.

## Schritte

1. Leg `src/spielwiese/EffektSpielwiese.tsx` an. Sie zeigt den `Counter` (Default-Export) und darüber einen Button, der ihn aus- und einblendet. Ohne den Button bekommst du die Aufräum-Funktion nie zu sehen.
2. Trag in `src/App.tsx` einen weiteren `Tab` "Effekte (Spielwiese)" mit eigener `tabId` und Panel ein.
3. Schreib in `Counter.tsx` an die Stelle mit dem `todo` den Effekt, dazu eine Zeile auf die Konsole, damit du siehst, **wann** er läuft:

   ```tsx
   useEffect(() => {
     window.document.title = `${appleCount} Äpfel`;
   }, [appleCount]);
   ```

4. Ergänze eine **Aufräum-Funktion** (Clean-up function): Der Effekt gibt eine Funktion zurück, die den ursprünglichen Titel wiederherstellt. Den merkst du dir am Anfang des Effekts in einer lokalen Variablen.
5. Beobachte Konsole und Tab-Titel: Was passiert bei "Ein Apfel mehr", was bei "Eine Orange mehr", und was, wenn du den `Counter` ausblendest?
6. Probier das Dependency-Array durch: `[appleCount]`, dann `[]` (läuft nur einmal, was steht dann dauerhaft im Titel?), dann **gar kein** Array (läuft nach jedem Render).
7. 👀 **Zeige ich nur:** ein `setInterval`-Effekt ohne Cleanup. Nach mehrmaligem Aus- und Einblenden läuft nicht ein Timer, sondern für jedes Einblenden einer. Bei Timern, Abos und Verbindungen ist Aufräumen deshalb Pflicht.
8. Jetzt soll der Titel den Singular richtig schreiben. Schreib die Funktion dafür **oberhalb** des Effekts, in der Komponente, und klick danach auf **"Eine Orange mehr"**.

   Warum nicht gleich in den Effekt hinein? Weil sie in echtem Code oft draußen steht: Eine zweite Stelle braucht sie ebenfalls, oder der Effekt würde sonst zu lang. Genau daraus entsteht der Fall, den du im nächsten Schritt siehst.

   ```tsx
   const formatTitle = () => {
     return appleCount === 1 ? "1 Apfel" : `${appleCount} Äpfel`;
   };

   useEffect(() => {
     window.document.title = formatTitle();
   }, [formatTitle]);
   ```

   `formatTitle` gehört ins Array, weil der Effekt sie benutzt. Lässt du sie weg, mahnt ESLint es als Warnung an.
9. Der Effekt läuft jetzt bei jedem Render, obwohl sich an den Äpfeln nichts geändert hat. Der Grund ist die **Referenz-Identität**. Probier in der Browser-Konsole:

   ```js
   (() => 1) === (() => 1); // false
   ({ a: 1 }) === ({ a: 1 }); // false
   "abc" === "abc"; // true
   ```

   Jede neu erzeugte Funktion ist ein neuer Wert, jedes Objekt und Array ebenfalls. React vergleicht Dependencies mit `===`, und `formatTitle` entsteht bei jedem Render neu.
10. Repariert wird in dieser Reihenfolge, die erste Möglichkeit, die funktioniert, ist die richtige:
    - **a) Die Funktion in den Effekt ziehen.** Dann ist sie lokal und keine Dependency mehr, im Array bleibt `[appleCount]`. Mach es so.
    - **b) Nur einfache Werte ins Array**, also `[plant.id]` statt `[plant]`.
    - **c) `useCallback`**, erst wenn a) und b) nicht gehen, etwa weil die Funktion als Property hereinkommt. Merkregel: **`useCallback` für Funktionen, `useMemo` für alles andere.**
11. 🧐 Stell dir vor, im Effekt steht statt `document.title = ...` ein `fetch`. Was passiert dann bei jedem Tastendruck in einem Formular? Ein Rendern zu viel ist ärgerlich, ein Effekt, der zu oft läuft, ist ein Fehler.
12. 🧐 Optional (wenn du noch Zeit hast): Tausch in `RenderSpielwiese.tsx` das erste Zeilenpaar, `useCallback` raus und die Zeile darunter rein. Tipp ins Textfeld: Der Zähler des Memo-Kindes läuft mit, denn eine neue Funktion ist eine geänderte Property. Dasselbe mit dem zweiten Zeilenpaar (`tags`, `useMemo`). Danach wieder zurücktauschen.

## Material

- `useEffect`: https://react.dev/reference/react/useEffect
- "You Might Not Need an Effect": https://react.dev/learn/you-might-not-need-an-effect
- **Dependencies loswerden** (der zweite Teil in ausführlich): https://react.dev/learn/removing-effect-dependencies
- `useCallback`: https://react.dev/reference/react/useCallback
- Gleichheit in JavaScript: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness

## 🧐 Zum Nachlesen

### Effekte sind die letzte Wahl

Aus der React-Dokumentation: "In React, **side effects usually belong inside event handlers**. [...] However, this approach should be your last resort." Das gilt auch fürs Laden von Daten. Man kann in einem Effekt `fetch` aufrufen, muss sich dann aber selbst um Ladezustand, Fehler, Caching und Race Conditions kümmern. Dafür nimmt man heute eine Bibliothek.

### Der Strict Mode

Ist die Wurzelkomponente in `<StrictMode>` eingepackt, ruft React in der Entwicklung jeden Effekt doppelt auf: Effekt, Cleanup, Effekt. Das ist ein Test und keine Fehlfunktion. Geht die Komponente dabei kaputt, fehlt meistens eine saubere Aufräum-Funktion. In unserem Projekt ist der Strict Mode ausgeschaltet, damit die Konsole übersichtlich bleibt.
