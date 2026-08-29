# Error Boundary: den Fehler auffangen, statt die Seite zu verlieren

**Keine Übung**, das schauen wir uns gemeinsam an.

## Dateien

- `src/shared/HttpError.ts` (neu anlegen)
- `src/plant-list/PlantErrorBoundary.tsx` (neu anlegen)
- `src/plant-list/plantsQueryOptions.ts`
- `src/App.tsx`

## Vorbereitung

Das Backend läuft.

## Worum es geht

`useSuspenseQuery` gibt das Warten an `<Suspense>` ab und den Fehler an eine **Error Boundary**. Die zweite Grenze fehlt bisher, und deshalb reißt ein Fehler beim Laden die ganze Anwendung weg. Wir bauen die Boundary, geben ihr einen Knopf zum Neuversuchen und sorgen dafür, dass sie sagen kann, was schiefgegangen ist.

## Schritte

### 1. Ansehen, was ohne Boundary passiert

Wir stoppen das Backend und laden die Seite neu. Die Anwendung ist weg, auch die Reiterleiste, in der Konsole steht der Fehler. React räumt bei einem Fehler beim Rendern den ganzen Baum ab, wenn ihn niemand auffängt. Das ist gewollt, denn eine Oberfläche, von der niemand weiß, in welchem Zustand sie ist, wäre schlimmer als gar keine.

### 2. Die Boundary anlegen

Wir legen `src/plant-list/PlantErrorBoundary.tsx` an. Die Komponente nimmt `children` entgegen und wickelt sie in `<ErrorBoundary>` aus `react-error-boundary`, das Paket ist installiert.

Ein Fallback gibt man auf einem von drei Wegen an: `fallback` für festen Inhalt, `fallbackRender` als Render Prop und `FallbackComponent` für eine eigene Komponente. Wir nehmen einen davon und zeigen darin eine Überschrift, den Grund und einen Knopf „Erneut versuchen". Das Fallback bekommt `error` und `resetErrorBoundary` gereicht, und `resetErrorBoundary` gehört an den `onClick` des Knopfes.

### 3. Die Boundary einhängen

Sie kommt in `App.tsx` um das Panel mit der Pflanzenliste, **außerhalb** des `<Suspense>`:

```tsx
<PlantErrorBoundary>
  <Suspense fallback={...}>
    <PlantList />
  </Suspense>
</PlantErrorBoundary>
```

Andersherum ginge es auch, sähe aber anders aus: Läge `<Suspense>` außen, bliebe beim Fehler der Ladeindikator im Bild und das Fallback erschiene darin.

Wir stoppen das Backend noch einmal und laden neu. Jetzt steht die Meldung da, und die Reiter bleiben bedienbar.

### 4. Den Knopf zum Laufen bringen

Wir starten das Backend wieder und klicken auf „Erneut versuchen". Nichts passiert, denn `resetErrorBoundary` setzt nur die Boundary zurück. Die Komponente rendert erneut, fragt dieselbe Query, und die steht im Cache immer noch als gescheitert. Dafür gibt es `useQueryErrorResetBoundary`:

```tsx
const { reset } = useQueryErrorResetBoundary();

<ErrorBoundary onReset={reset} ...>
```

`onReset` läuft, wenn die Boundary zurückgesetzt wird, und `reset` räumt dabei die gescheiterten Queries aus dem Cache.

### 5. Eine Fehlerklasse mit Statuscode

Die Meldung im Fallback ist bisher der Text aus der `queryFn`. Damit kann das Fallback nicht unterscheiden, was passiert ist, und ein 404 und ein 500 sind für einen Menschen verschiedene Lagen. Drei Handgriffe ändern das:

- `src/shared/HttpError.ts` bekommt eine Klasse, die von `Error` erbt und den Statuscode als Feld dazunimmt.
- Die `queryFn` wirft sie statt des blanken `Error`.
- Das Fallback fragt sie mit `instanceof` ab und gibt je nach Status einen anderen Satz aus.

Zum Ausprobieren, ohne das Backend anzufassen: `?orderBy=quatsch` an der URL gibt einen 400, ein zusätzliches „s" im Pfad (`/api/plantss`) einen 404.

### 6. 🧐 Zum Ausprobieren hinterher

- Gib der `ErrorBoundary` einen `onError`-Callback und schreib den Fehler auf die Konsole. In einer echten Anwendung ginge er von hier an einen Dienst wie Sentry.
- Zieh eine **zweite** Grenze, nur um `<FavoritePlantList />`, mit eigenem `<Suspense>` und eigener Boundary. Was bleibt stehen, wenn nur diese eine Query scheitert? Woran entscheidest du, wie fein du die Grenzen schneidest?
- Bau einen Fehler ein, der nichts mit dem Laden zu tun hat, etwa ein `throw new Error("Bumm")` am Anfang von `PlantCard`. Fängt die Boundary ihn auch? Und was ist mit einem `throw` im `onClick` des Favoriten-Knopfes?

## Material

- Error Boundaries: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
- `react-error-boundary`: https://github.com/bvaughn/react-error-boundary
- TanStack Query und Error Boundaries: https://tanstack.com/query/latest/docs/framework/react/guides/suspense#resetting-error-boundaries
- `useQueryErrorResetBoundary`: https://tanstack.com/query/latest/docs/framework/react/reference/useQueryErrorResetBoundary

## 🧐 Zum Nachlesen

### Was eine Boundary fängt und was nicht

Eine Error Boundary fängt Fehler, die **beim Rendern** unter ihr auftreten, dazu die aus Lebenszyklus-Methoden und aus dem Konstruktor. Genau da wirft `useSuspenseQuery`.

Nicht gefangen werden Fehler in Event-Handlern, also im `onClick` oder `onChange` (sie landen auf der Konsole, und wer sie an die Boundary geben will, nimmt `useErrorBoundary` aus `react-error-boundary`), Fehler in asynchronem Code nach dem Rendern, etwa in einem `setTimeout`, und Fehler in der Boundary selbst.

Eine Ausnahme ist `useTransition`: Was in der Funktion wirft, die `startTransition` bekommt, fängt seit React 19 die nächste Boundary. Das begegnet uns wieder, wenn wir Formulare abschicken.

### Warum `error` ein `unknown` ist

Im Fallback ist `error` mit `unknown` typisiert und nicht mit `Error`. Das ist ehrlich, denn in JavaScript darf man alles werfen, auch einen String oder ein Objekt, und die Boundary fängt, was unter ihr passiert, ohne es sich aussuchen zu können.

Deshalb steht am Anfang jeder Auswertung eine Prüfung, und `instanceof` ist dafür das richtige Werkzeug: Es prüft zur Laufzeit und verrät TypeScript zugleich den Typ, sodass dahinter `error.status` zur Verfügung steht. Das ist auch der Grund, warum `HttpError` eine eigene Klasse ist und kein Objekt mit einem Feld daran. Eine Klasse kann man abfragen, ein angehängtes Feld nicht.
