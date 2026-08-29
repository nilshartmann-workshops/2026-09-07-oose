# Tests mit Vitest: Unit und Browser Mode

## Dateien

- `src/shared/date-utils.test.ts` (anlegen)
- `src/plant-form/IntervalSelector.browsertest.tsx` (anlegen)

## Vorbereitung

Das Backend brauchst du nicht, beide Tests kommen ohne HTTP aus.

Vitest ist eingerichtet, und zwar mit zwei Projekten. Welches greift, entscheidet der Dateiname:

| Dateiname | Projekt | Läuft in | Script |
|---|---|---|---|
| `*.test.ts` | `unit` | Node | `npm run test:unit` |
| `*.browsertest.tsx` | `browser` | echtes Chromium | `npm run test:browser` |

`npm run test` startet beide zusammen und bleibt im Watch-Modus, bis du mit Ctrl+C abbrichst.

## Aufgabe

Du schreibst zwei Sorten Test. Der erste prüft eine reine Funktion ohne React, der zweite eine Komponente in einem echten Browser.

## Schritte

### Teil 1: eine reine Funktion testen

1. Lies `getDaysUntilWatering` in `src/shared/date-utils.ts`. Die Funktion bekommt das Datum des letzten Gießens und das Intervall in Tagen und sagt, wie viele Tage bis zum nächsten bleiben. Eine positive Zahl heißt „noch Zeit", eine negative „überfällig".
2. Leg `src/shared/date-utils.test.ts` an.
3. Damit stößt du sofort auf das Problem jeder Datumsrechnung im Test: Die Funktion holt sich den heutigen Tag selbst über `new Date()`. Ein Test, der heute grün ist, wäre nächste Woche rot, du musst die Systemzeit also festnageln.
4. Nimm `vi.useFakeTimers()` und `vi.setSystemTime(...)` in einem `beforeEach` und gib die Uhr im `afterEach` mit `vi.useRealTimers()` wieder frei. Ohne das Freigeben laufen alle folgenden Tests der Datei mit einer stehenden Uhr weiter.

   > **Fallstrick:** `new Date(2026, 8, 7)` ist Mitternacht in **deiner** Zeitzone (und der Monat ist 0-basiert, das ist der September). Deine erwarteten Zahlen stimmen dann nur bei dir. Gib den Zeitpunkt in UTC an: `new Date("2026-09-07T00:00:00Z")`.
5. Schreib mindestens zwei Testfälle: einmal steht das Gießen noch aus, einmal ist es überfällig. Lass sie mit `npm run test:unit` laufen.
6. 🧐 Optional (wenn du noch Zeit hast): Schreib den Fall, in dem heute gegossen werden muss. Kommt da 0 heraus oder 1? Schau dir an, was `Math.ceil` in der Funktion damit zu tun hat.

### Teil 2: eine Komponente im Browser testen

7. Lies `src/plant-form/IntervalSelector.tsx`. Die Komponente hält keinen eigenen Zustand: Den Wert bekommt sie über `interval`, jede Änderung meldet sie über `onIntervalChange` zurück. So etwas heißt controlled component.
8. Leg `src/plant-form/IntervalSelector.browsertest.tsx` an. Wegen des `browsertest` im Namen landet die Datei im Browser-Projekt.
9. Für `onIntervalChange` brauchst du eine Mock-Funktion, `vi.fn()`. An ihr liest du hinterher ab, ob und womit sie aufgerufen wurde.
10. Schreib zwei Tests. Der erste tippt eine Zahl ins Eingabefeld und prüft, dass `onIntervalChange` mit dieser Zahl aufgerufen wird, der zweite klickt auf einen der Schnellwahl-Knöpfe („Weekly", „Biweekly") und prüft dasselbe.
11. Such die Elemente so, wie eine Benutzerin sie sucht, also nach ARIA-Rolle und sichtbarem Text. Kein `data-testid`.

    > **Fallstrick:** Das `label` der Komponente ist nicht mit dem `input` verknüpft, `getByLabelText("Interval")` findet also nichts. Ein Zahlenfeld hat die Rolle `spinbutton`, darüber kommst du hin.

    > **Fallstrick:** `render` und `expect.element` sind asynchron. Es heißt `const screen = await render(...)` und `await expect.element(...)`. Vergisst du ein `await`, ist der Test grün, ohne etwas geprüft zu haben.
12. Lass die Tests mit `npm run test:browser` laufen. Es geht ein Chromium auf, in dem du zusehen kannst.
13. 🧐 Optional (wenn du noch Zeit hast): Die Komponente zeigt unter dem Feld „Alle 123 Tage gießen". Versuch, diesen Text mit `getByText("123")` zu finden. Warum geht das nicht, und was findet stattdessen?

## Material

- Vitest: https://vitest.dev/
- `vi.useFakeTimers` und `vi.setSystemTime`: https://vitest.dev/api/vi.html#vi-setsystemtime
- `vi.fn()` für Mock-Funktionen: https://vitest.dev/api/vi.html#vi-fn
- Vitest Browser Mode: https://vitest.dev/guide/browser/
- Locators, also das Suchen im DOM: https://vitest.dev/guide/browser/locators
- Assertions im Browser Mode: https://vitest.dev/guide/browser/assertion-api
- Die Liste der ARIA-Rollen: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles

## 🧐 Zum Nachlesen

### Warum zwei Projekte

Im Unit-Projekt läuft dein Test in Node, ganz ohne DOM. Das ist schnell und reicht für alles, was keine Oberfläche ist.

Sobald eine Komponente im Spiel ist, brauchst du ein DOM. Früher hat man dafür eine Nachbildung genommen (jsdom oder happy-dom), also eine JavaScript-Implementierung der Browser-APIs. Die kommt an ihre Grenzen, sobald echtes Layout, echte Klicks oder echtes Scrollen zählen. Der Browser Mode startet stattdessen einen richtigen Chromium: Was dort grün ist, ist im Browser grün.

Der Preis ist Geschwindigkeit. Deshalb die Trennung: Alles, was ohne DOM auskommt, gehört ins Unit-Projekt.
