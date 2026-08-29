# Zod: die Daten prüfen, die von außen kommen

## Dateien

- `src/types.ts`
- `src/types.test.ts.txt` (benennst du um)

## Aufgabe

Der `Plant`-Typ in `types.ts` ist von Hand geschrieben. TypeScript prüft ihn beim Übersetzen, zur Laufzeit ist er weg. Gleich holen wir die Pflanzen vom Backend, und dann ist der Typ nur noch eine Behauptung über Daten, die jemand anders schickt.

Du ersetzt ihn deshalb durch ein **Zod-Schema**, leitest den TypeScript-Typ daraus ab und schaust dir in einem Test an, was das Schema durchlässt.

## Schritte

1. Importiere `z` in `src/types.ts`: `import { z } from "zod";` Das Paket ist installiert. Wenn dir unterwegs ein `import { z } from "zod/v4"` begegnet, schau unten nach, es hat einen Grund.
2. Schreib ein Schema `PlantSchema` mit `z.object({ ... })` und exportier es. Es beschreibt dieselben Felder wie der bisherige Typ, sagt aber mehr über sie:
   - `id` ist ein String.
   - `name` und `location` sind Strings, die nicht leer sein dürfen (`.nonempty()`).
   - `wateringInterval` ist eine Zahl von mindestens `1` (`.min(1)`).
   - `lastWatered` ist optional (`.optional()`) und, wenn es da ist, ein Datum in der Form `2025-06-16`. Dafür gibt es `z.iso.date()`.
3. Leite den TypeScript-Typ aus dem Schema ab und wirf den handgeschriebenen Typ weg:

   ```ts
   export type Plant = z.infer<typeof PlantSchema>;
   ```

   Der Name bleibt derselbe, alle Komponenten laufen unverändert weiter. Prüf das mit `npm run check:ts`.
4. Die Tests gegen das Schema liegen fertig im Projekt, nur noch nicht unter einem Namen, den Vitest kennt. Benenn `src/types.test.ts.txt` in `src/types.test.ts` um und lies sie durch. Geprüft wird mit `PlantSchema.safeParse(...)`, dazu kommen zwei Matcher aus dem Projekt:

   ```ts
   expect(PlantSchema.safeParse(plant)).toBeZodSuccess();

   expect(PlantSchema.safeParse(plant)).toBeZodFailure(
     /Invalid ISO date/i,
     "lastWatered",
   );
   ```

   `toBeZodFailure` nimmt den erwarteten Meldungstext (String oder regulärer Ausdruck) und das Feld, an dem der Fehler hängt. Beide sind freiwillig, ohne sie prüft der Test nur, *dass* etwas schiefging, und nicht *was*.
5. Die Tests nehmen eine Pflanze, die durchgeht, und verändern jeweils ein Feld. Das sind die Fälle:
   - ein Pflichtfeld fehlt (`undefined`)
   - `name` oder `location` ist der leere String
   - `wateringInterval` ist `0` oder ein String wie `"jeden Tag"`
   - `lastWatered` ist `"gestern"` oder `"2025-13-06"`
   - `lastWatered` fehlt ganz, denn das muss erlaubt sein
6. Lass die Tests mit `npm run test:zod` laufen. Sie sind dein Prüfstein: Läuft alles grün, beschreibt dein Schema genau das, was es soll. Das Script startet Vitest im Watch-Modus, mit `q` beendest du es.
7. 🧐 Optional (wenn du noch Zeit hast): Häng deiner Pflanze im Test ein Feld an, das im Schema nicht vorkommt, etwa `notes: "mag viel Licht"`. Geht die Prüfung durch, und was steht danach in `result.data`? Das Backend liefert genau so ein Feld mit.

## Material

- zod: https://zod.dev/
- Schemas definieren: https://zod.dev/api
- Typen ableiten: https://zod.dev/basics?id=inferring-types
- `parse` und `safeParse`: https://zod.dev/basics?id=parsing-data
- Der Unterpfad `zod/v4`: https://github.com/colinhacks/zod/issues/4371

## 🧐 Zum Nachlesen

### Wann zod?

Zwei Fragen führen zu einem Schema, und eine davon reicht schon.

**Erzeugt die Anwendung den Wert selbst?** Wenn nicht, hat der Übersetzer ihn nie gesehen, und der TypeScript-Typ ist nur eine Behauptung. Was ein `fetch` zurückgibt, ist zur Laufzeit ein `any`, und wer `as Plant[]` darüber schreibt, hat nichts geprüft. Fehlt dann ein Feld, fällt das nicht dort auf, wo die Daten ankommen, sondern tief in einer Komponente, mit einer Meldung weit weg vom Problem. Solche Werte kommen aus der Antwort eines Backends, aus einem Formular, aus dem `localStorage` und aus den Suchparametern der URL.

**Soll der Wert genauer beschrieben werden, als der Typ es kann?** TypeScript kennt `string` und `number`, aber nicht "ein Datum in der Form 2025-06-16", nicht "mindestens ein Zeichen" und nicht "mindestens 1". Ein Schema kann das, und es sagt damit beim Lesen mehr über die Daten aus: `z.iso.date()` sagt mehr als `string`.

Dazu kommt, was ein Schema nebenbei leistet: Über `z.infer` liefert es den TypeScript-Typ gleich mit, sodass Schema und Typ nicht auseinanderlaufen können.

`parse` und `safeParse` unterscheiden sich nur im Fehlerfall: `parse` löst eine Exception aus, `safeParse` gibt ein Objekt mit `success` zurück. Im Test ist `safeParse` bequemer, bei der Antwort des Backends wollen wir dagegen genau das Auslösen.

### Warum manche Beispiele `zod/v4` importieren

Zod 4 kam zuerst innerhalb von Zod 3 heraus, unter dem Unterpfad `zod/v4`. Wer aktualisierte, bekam damit beide Fassungen nebeneinander und konnte Datei für Datei umstellen. Inzwischen ist Zod 4 die reguläre Fassung, und `zod` liefert sie direkt. Den Unterpfad gibt es weiterhin, damit der Code aus der Übergangszeit übersetzt, und er zeigt auf dasselbe. Umgekehrt gibt es `zod/v3` für alles, was noch auf der alten Fassung steht.

Für uns heißt das: `import { z } from "zod"`. Welche Fassung ein Projekt benutzt, steht in seiner `package.json`.
