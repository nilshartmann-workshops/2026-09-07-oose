# Die Grenze von Context

**Keine Übung**, das schauen wir uns gemeinsam an. Der kleinere Teil passiert im Code, der größere am Whiteboard.

## Dateien

- `src/shared/TabBar.tsx` (es kommt nur ein Render-Zähler dazu)

## Vorbereitung

Öffne die Browser-Konsole und lass sie geöffnet. Die React Developer Tools ("Highlight updates when components render") sind hier ebenfalls nützlich.

## Worum es geht

Unsere TabBar benutzt Context, und sie tut es richtig. Trotzdem hört man ständig, Context sei "langsam" oder "kein State-Management". Beides stimmt so nicht, aber es steckt etwas dahinter. Am Ende hast du eine Regel, mit der du in einem echten Projekt entscheiden kannst: Reicht Context hier, oder brauche ich etwas anderes?

## Teil 1: Was Context beim Rendern tut

1. 👀 **Das Messinstrument bauen wir gemeinsam:** derselbe Render-Zähler wie beim Kind auf der Spielwiese, diesmal in `Tab` und hinter der Beschriftung angezeigt.
2. Jetzt klicken wir uns durch die Reiter. Alle Zähler laufen hoch. Beim verlassenen und beim neuen Reiter ist das richtig, denn der eine wird `disabled`, der andere nicht mehr. Aber die Reiter, die **weder vorher noch nachher** aktiv waren, produzieren Zeichen für Zeichen dasselbe Ergebnis wie vorher.
3. Erster Reparaturversuch: `Tab` in `memo()` wickeln. Seine Properties sind konstant, `tabId` ist ein String und `children` ein fester Text.
   - **Beobachtung:** Der Zähler läuft weiter. 🤨
   - **`memo` vergleicht Properties, und ein Context ist keine Property.** Wer einen Context konsumiert, wird von React direkt benachrichtigt, sobald dessen Wert sich ändert, und zwar an `memo` vorbei. Sonst würde die Komponente veraltete Werte anzeigen.
   - `memo` kommt wieder raus.
4. Zweiter Versuch, die Zeile, die man im Netz am häufigsten findet: den Context-Wert in `useMemo` einpacken.

   ```tsx
   <TabBarContext
     value={useMemo(
       () => ({ activeTabId, onTabChange: setActiveTabId }),
       [activeTabId],
     )}
   >
   ```

   - **Beobachtung:** Ändert auch nichts.
   - 🧐 Warum nicht? (Tipp: Was soll da eigentlich stabil gehalten werden?)
   - Auch das kommt wieder raus: Der Code ist umständlicher geworden, das Verhalten ist unverändert.

## Teil 2: Die Regel (Whiteboard)

5. **Jeder Consumer eines Contexts rendert bei jeder Änderung des Context-Werts**, nicht nur die, die den geänderten Teil benutzen. Dagegen hilft weder `memo` noch `useMemo`.
6. Ob das schlimm ist, hängt von zwei Dingen ab:

   |  | **kleiner Consumer-Baum** | **großer Consumer-Baum** |
   |---|---|---|
   | **ändert sich selten** | unauffällig | Theme, Locale, angemeldeter Benutzer, also der klassische Context |
   | **ändert sich häufig** | unsere `TabBar`, ein Accordion, ein `Select` | hier kippt es |

   - Unsere TabBar steht links unten: Der Wert ändert sich bei jedem Klick, aber daran hängen nur ihre eigenen Reiter und Panels. Genau dafür ist Context gemacht, und Radix, Headless UI und jede andere Komponentenbibliothek bauen ihre zusammengesetzten Komponenten so.
   - **Nur rechts unten wird es unangenehm**, also bei einem Wert, den halb die Anwendung liest und der sich ständig ändert.
7. 🧐 Und jetzt die Frage, mit der wir weitermachen: Als Nächstes wollen wir Favoriten einbauen. Eine Pflanze lässt sich zum Favoriten machen, eine zweite Liste zeigt nur die Favoriten, und vielleicht steht die Anzahl auch noch oben in der Ecke.
   - In welchem der vier Felder landet dieser Zustand?
   - Was bräuchte man, damit **nur die eine Karte** neu rendert, deren Favoriten-Status sich geändert hat?

## Material

- Bevor du Context einsetzt (lesenswert): https://react.dev/learn/passing-data-deeply-with-context#before-you-use-context
- Context und Rendern: https://react.dev/reference/react/useContext#optimizing-re-renders-when-passing-objects-and-functions
- React DevTools Profiler: https://react.dev/learn/react-developer-tools

## 🧐 Zum Nachlesen

### Wann `useMemo` am Context-Wert doch hilft

Der Versuch aus Schritt 4 war nicht dumm, er war nur am falschen Ort. Es gibt zwei Situationen, und sie werden oft verwechselt:

- **Der Wert ändert sich wirklich.** Dann gibt es nichts zu stabilisieren, und `useMemo` ist nur zusätzlicher Code. Das ist unser Fall, denn `activeTabId` ist nach dem Klick ein anderer String.
- **Der Wert ändert sich logisch nicht, aber der Provider rendert trotzdem**, weil seine eigene Eltern-Komponente rendert. Dann entsteht durch das Literal `value={{ … }}` bei jedem Render ein neues Objekt, React vergleicht Context-Werte mit `===`, und der ganze Consumer-Baum rendert umsonst mit. **Hier** hilft `useMemo` tatsächlich.

Der zweite Fall trifft vor allem die großen, weit oben aufgehängten Contexts. `useMemo` am Context-Wert lohnt sich also ausgerechnet dort, wo Context richtig eingesetzt ist.

### Die Auswege, und was sie taugen

| Weg | Bringt was? |
|---|---|
| Consumer mit `memo` isolieren | nichts, denn `memo` sieht den Context nicht |
| Context-Wert mit `useMemo` stabilisieren | nur, wenn der Wert sich gar nicht geändert hat |
| Context aufteilen (Zustand / Aktionen) | funktioniert, kostet aber zwei Provider und zwei Hooks |
| Selektor-Funktionen ("nur den Teil, den ich brauche") | mit purem Context nicht machbar, dafür braucht es eine Bibliothek |

Die dritte Zeile ist ein ehrliches Werkzeug, aber ein umständliches: Man verdoppelt die Zeremonie, um ein einzelnes Feld zu isolieren. Bei zwei Feldern geht das noch, bei acht nicht mehr. Die vierte Zeile ist der Grund, warum es Bibliotheken für globalen Zustand gibt, und zugleich der nächste Schritt.
