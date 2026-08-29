# Das Backend mocken mit MSW

## Dateien

- `src/start-page.browsertest.tsx` (anlegen)

## Vorbereitung

**Beende das Backend.** MSW fängt nur die Anfragen ab, für die ein Handler passt, alles andere reicht es an das echte Ziel durch. Läuft das Backend nebenher, ist ein Test mit einem unpassenden Handler grün, obwohl er das Falsche geprüft hat.

MSW selbst ist eingerichtet, das Paket ist installiert und `public/mockServiceWorker.js` liegt bereit.

## Aufgabe

Du schreibst einen Test für die Startseite. Er lässt die Anwendung wirklich laufen, mitsamt Router, TanStack Query und `fetch`, und tauscht allein das Backend gegen MSW aus.

## Schritte

### 1. Die Anwendung rendern

`src/render-app.tsx` liegt fertig im Projekt. Die Funktion `renderApp()` baut Router und `QueryClientProvider` auf und rendert die Anwendung, so wie `main.tsx` es tut. Ein Unterschied ist wichtig: Im Test gibt es keine Adresszeile, also hält der Router seine Adresse im Speicher (`createMemoryHistory`).

Lies die Datei durch, bevor du weitermachst. Der Rest der Übung dreht sich nur noch um MSW.

> **Fallstrick:** Jeder Aufruf baut einen eigenen `QueryClient`, und das ist Absicht. Teilen sich zwei Tests einen, sieht der zweite die Daten des ersten im Cache und lädt gar nicht mehr.

### 2. MSW einrichten

Leg `src/start-page.browsertest.tsx` an und definier einen Handler für `GET http://localhost:7200/api/plants`, der deine Testpflanzen zurückgibt:

```ts
const worker = setupWorker(
  http.get("http://localhost:7200/api/plants", async () => {
    await delay(125);

    return HttpResponse.json(/* deine Testpflanzen */);
  }),
);

beforeAll(async () => await worker.start());
afterEach(() => worker.resetHandlers());
```

Die Verzögerung ist kein Schmuck: Ohne sie ist die Antwort da, bevor das erste Rendern durch ist, und der Suspense-Fallback erscheint nie.

Deine Testpflanzen müssen durch `PlantSchema` passen, denn die `queryFn` prüft die Antwort mit zod. Gib mindestens zwei an, eine davon ohne `lastWatered`.

### 3. Der Test: Ladeanzeige und Daten

Ruf `await renderApp()` auf und prüf zweierlei: Erst erscheint der Suspense-Fallback aus der Route, danach stehen die Namen deiner Testpflanzen auf der Seite.

### 4. Laufen lassen

`npm run test:browser`

### 5. 🧐 Optional (wenn du noch Zeit hast): der Fehlerfall

Schreib einen zweiten Test, in dem das Backend mit 500 antwortet. Dafür ist `worker.use()` da, und `resetHandlers()` im `afterEach` nimmt den Handler danach wieder weg:

```ts
worker.use(
  http.get(
    "http://localhost:7200/api/plants",
    () => new HttpResponse(null, { status: 500 }),
  ),
);
```

Prüf, dass der Fallback der `PlantErrorBoundary` erscheint und der Knopf „Erneut versuchen" da ist.

> **Fallstrick:** React schreibt jeden Fehler, den eine Error Boundary fängt, auf die Konsole, auch den sauber behandelten. Dein Testlauf steht dann voller roter Ausgaben. Ruhig wird es mit `vi.spyOn(console, "error").mockImplementation(() => {})`, und `vi.restoreAllMocks()` im `afterEach` gibt die Konsole wieder frei.

### 6. 🧐 Optional (wenn du noch mehr Zeit hast)

- Nimm das `await delay(125)` aus dem Handler heraus. Was macht der erste Test, und warum?
- Vertipp dich absichtlich in der URL des Handlers, etwa `/api/plant`. Starte das Backend wieder und schau in die Konsole des Testlaufs. Was meldet MSW, und wer antwortet der Anwendung?

## Material

- MSW: https://mswjs.io/docs
- `http` und `HttpResponse`: https://mswjs.io/docs/api/http
- `setupWorker` für den Browser: https://mswjs.io/docs/api/setup-worker
- `worker.use()` für einen Handler nur in einem Test: https://mswjs.io/docs/api/setup-worker/use
- `vi.spyOn`: https://vitest.dev/api/vi.html#vi-spyon
- Memory-History im TanStack Router: https://tanstack.com/router/latest/docs/framework/react/guide/history-types

## 🧐 Zum Nachlesen

### Wie MSW arbeitet

MSW steht für Mock Service Worker, und der Name sagt, wie es arbeitet. Im Browser registriert MSW einen Service Worker, und der sitzt zwischen deiner Anwendung und dem Netz. Deine Anwendung ruft ganz normal `fetch` auf, die Anfrage geht ganz normal raus, und der Service Worker beantwortet sie, statt sie durchzulassen.

Das ist der Unterschied zu einem Mock von `fetch` selbst. Bei dem müsstest du wissen, wie die Anwendung ihre Anfragen stellt, und dein Test hinge an dieser Entscheidung. Tauschst du `fetch` später gegen eine Bibliothek, ist der Mock kaputt, obwohl sich am Verhalten nichts geändert hat. MSW setzt eine Ebene tiefer an, beim HTTP-Verkehr, und dort ändert sich nichts.

Derselbe Satz Handler lässt sich außerdem im Devserver einhängen. Dann arbeitest du an der Oberfläche weiter, während das echte Backend noch gar nicht existiert.
