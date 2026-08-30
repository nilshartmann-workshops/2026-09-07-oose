# Optimistic UI: die Karte springt sofort um

**Keine Übung**, das schauen wir uns gemeinsam an. Die fertige Fassung von `PlantCard.tsx` steht am Ende dieser Datei.

Dieser Schritt ändert nichts am Repository. Auf `schritte` bleibt die Karte so stehen, wie sie aus dem Mutations-Schritt kommt, und der Schritt danach setzt darauf auf. Wer die Vorführung mitprogrammiert, nimmt sie hinterher wieder heraus.

## Dateien

- `src/plant-list/PlantCard.tsx`

## Vorbereitung

Für diesen Schritt soll das Backend langsam antworten, sonst ist nichts zu sehen. Häng in der `mutationFn` in `src/plant-list/PlantCard.tsx` ein `?slow=2000` an die URL des `PUT`, dann dauert er zwei Sekunden.

## Worum es geht

Ein Klick auf „Jetzt gegossen" ändert die Karte bisher erst, wenn das Backend geantwortet hat und die Liste neu geladen ist. Bei einer langsamen Verbindung sind das mehrere Sekunden, in denen die Nutzerin ein zweites Mal klickt. Du trägst den neuen Wert deshalb sofort in den Cache ein, noch bevor die Anfrage draußen ist, und nimmst ihn zurück, wenn sie scheitert.

## Schritte

### 1. Das Problem ansehen

Klick mit dem langsamen Backend auf „Jetzt gegossen". Der Knopf ist abgeschaltet, das Datum bleibt zwei Sekunden stehen, dann springt es um. Fachlich ist der Fall aber längst klar: Du weißt schon beim Klick, welches Datum gleich dastehen wird.

### 2. Das Datum zum Argument der Mutation machen

Bisher rechnet die `mutationFn` das heutige Datum selbst aus. Gleich braucht es eine zweite Stelle, und beide müssen denselben Wert benutzen. Gib der `mutationFn` deshalb einen Parameter:

```ts
async mutationFn(lastWatered: string) { ... }

onClick={() => markAsWatered(dayjs().format("YYYY-MM-DD"))}
```

Was du `mutate` übergibst, reicht TanStack Query an alle Callbacks der Mutation weiter.

### 3. Den Cache vorab beschreiben (`onMutate`)

`onMutate` läuft, **bevor** die `mutationFn` losgeht. Drei Dinge gehören hinein, in dieser Reihenfolge:

1. **Laufende Refetches abbrechen** mit `queryClient.cancelQueries(plantsQueryOptions())`. Ist gerade eine Anfrage unterwegs, kommt sie sonst mit dem alten Stand zurück und überschreibt, was du hier einträgst.
2. **Den alten Stand sichern** mit `queryClient.getQueryData(plantsQueryOptions().queryKey)`. Ohne diese Kopie gibt es später nichts, wohin man zurückkann.
3. **Den neuen Stand eintragen** mit `queryClient.setQueryData(...)`. Der zweite Parameter darf eine Funktion sein, die die alten Daten bekommt und die neuen zurückgibt:

   ```ts
   queryClient.setQueryData(plantsQueryOptions().queryKey, (plants) => {
     return plants?.map((p) => (p.id === id ? { ...p, lastWatered } : p));
   });
   ```

   Bau eine neue Liste, statt in der alten zu ändern. Der Cache vergleicht Referenzen, genau wie der Favoriten-Store.

Was `onMutate` zurückgibt, bekommen die übrigen Callbacks als dritten Parameter (`context`) gereicht. Gib die Kopie aus Punkt 2 zurück.

Klick jetzt noch einmal. Die Karte springt sofort um, obwohl die Anfrage noch läuft.

### 4. Den Rückweg bauen (`onError`)

Ohne Rückweg ist ein optimistisches Update eine Lüge: Schlägt die Anfrage fehl, steht auf der Karte ein Datum, das im Backend nie angekommen ist. Schreib in `onError` die gesicherte Liste aus dem `context` mit `setQueryData` zurück.

Ausprobieren kannst du das mit einer `id`, die es nicht gibt. Häng in der `mutationFn` etwas an die `id` an, dann antwortet das Backend mit 404.

### 5. `onSuccess` wird zu `onSettled`

Die Invalidierung aus der vorigen Übung soll jetzt in **beiden** Fällen laufen, nach Erfolg und nach Fehler. Dafür gibt es `onSettled`.

Der Grund ist derselbe wie beim Rollback: Nach einem Fehler weißt du nicht, was im Backend steht. Vielleicht ist die Änderung durchgekommen und nur die Antwort verlorengegangen. Ein Neuladen beendet jeden Zweifel.

### 6. 🧐 Fragen in die Runde

- Setz eine Pflanze auf „Favorit", sodass ihre Karte in beiden Listen steht, und gieß sie. Beide Karten springen sofort um, obwohl du nur eine angeklickt hast. Warum?
- Lass `cancelQueries` weg und klick mehrmals schnell hintereinander. Bekommst du den Fall hin, in dem kurz wieder das alte Datum dasteht?
- Der Knopf ist während der Anfrage abgeschaltet (`isPending`). Ist das jetzt noch nötig? Was spricht dafür, was dagegen?

## Material

- Optimistic Updates: https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates
- `setQueryData`: https://tanstack.com/query/latest/docs/reference/QueryClient#queryclientsetquerydata
- `cancelQueries`: https://tanstack.com/query/latest/docs/reference/QueryClient#queryclientcancelqueries
- `useOptimistic`: https://react.dev/reference/react/useOptimistic

## 🧐 Zum Nachlesen

### Die Reihenfolge der Callbacks

Eine Mutation ruft vier Callbacks auf, und jeder hat seinen Platz: `onMutate` läuft vor der Anfrage (hier entsteht das optimistische Bild und wird der alte Stand gesichert), `onSuccess` läuft, wenn die Anfrage durchging, `onError`, wenn sie scheiterte (hier wird zurückgerollt), und `onSettled` in beiden Fällen zuletzt.

Alle drei hinteren bekommen den Rückgabewert von `onMutate` als `context`. Deshalb entsteht die Sicherungskopie dort und nicht in einem `useState`: Sie gehört zu genau diesem einen Lauf der Mutation und nicht zur Komponente.

### Derselbe Gedanke ohne TanStack Query

React kann optimistische Werte auch selbst, mit `useOptimistic` und `useTransition`:

```tsx
const [optimisticLastWatered, setOptimisticLastWatered] =
  useOptimistic(lastWatered);
const [isSaving, startSaving] = useTransition();

const onWateredClick = () => {
  startSaving(async () => {
    setOptimisticLastWatered(dayjs().format("YYYY-MM-DD"));
    await speichern();
  });
};
```

Das ist deutlich weniger Code, und der Rückweg fehlt nicht etwa, sondern ist überflüssig: `useOptimistic` gibt den optimistischen Wert nur aus, solange die Transition läuft. Danach zeigt die Komponente wieder den Wert, der wirklich da ist, auch wenn die Anfrage gescheitert ist.

Der Unterschied liegt darin, wo der Wert wohnt. `useOptimistic` arbeitet auf einem Wert, den **diese** Komponente hat. Unsere Pflanze steht dagegen im Query-Cache, und dieselbe Karte wird zweimal angezeigt, wenn die Pflanze ein Favorit ist. Ein optimistischer Wert in der Komponente bewegt nur eine der beiden.

Als Faustregel: Liegt die Wahrheit im Query-Cache, gehört das optimistische Update auch dorthin. `useOptimistic` ist richtig, wo der Wert lokal ist oder aus einer Server Action zurückkommt, und dort begegnet es uns wieder.

## Die fertige Fassung

`src/plant-list/PlantCard.tsx`, so wie sie nach der Vorführung aussieht:

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

import { getDaysUntilWatering } from "../shared/date-utils.ts";
import { plantsQueryOptions } from "./plantsQueryOptions.ts";
import { useFavoritesStore } from "./useFavoritesStore.ts";

type PlantCardProps = {
  id: string;
  name: string;
  location: string;
  wateringInterval: number;
  lastWatered?: string;
};

export default function PlantCard({
  id,
  name,
  location,
  wateringInterval,
  lastWatered,
}: PlantCardProps) {
  // 🔎 Erzählen: zwei Selektoren statt eines Zugriffs auf den ganzen Store
  const isFavorite = useFavoritesStore((state) =>
    state.favoriteIds.includes(id),
  );
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const queryClient = useQueryClient();

  // 🔎 Erzählen: das Datum ist jetzt das Argument der Mutation. onMutate braucht
  //    denselben Wert wie die mutationFn, und so gibt es ihn nur einmal.
  const {
    mutate: markAsWatered,
    isPending,
    error,
  } = useMutation({
    async mutationFn(lastWatered: string) {
      const response = await fetch(
        `http://localhost:7200/api/plants/${id}/lastWatered`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ lastWatered }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    },

    async onMutate(lastWatered) {
      // Ein Refetch, der schon unterwegs ist, würde gleich mit dem alten Stand
      // antworten und den Eintrag von hier überschreiben.
      await queryClient.cancelQueries(plantsQueryOptions());

      const previousPlants = queryClient.getQueryData(
        plantsQueryOptions().queryKey,
      );

      queryClient.setQueryData(plantsQueryOptions().queryKey, (plants) => {
        return plants?.map((p) => (p.id === id ? { ...p, lastWatered } : p));
      });

      // 🔎 Erzählen: was onMutate zurückgibt, bekommen onError und onSettled
      //    als context gereicht
      return { previousPlants };
    },

    onError(_error, _lastWatered, context) {
      queryClient.setQueryData(
        plantsQueryOptions().queryKey,
        context?.previousPlants,
      );
    },

    // 🔎 Zeigen: onSettled statt onSuccess. Auch nach einem Fehler wollen wir
    //    wissen, was wirklich im Backend steht.
    onSettled() {
      queryClient.invalidateQueries(plantsQueryOptions());
    },
  });

  const wateringInfo =
    wateringInterval === 1
      ? "Jeden Tag gießen!"
      : `Alle ${wateringInterval} Tage gießen`;

  const lastWateredMsg = lastWatered ? (
    <div>Zuletzt: {dayjs(lastWatered).locale("de").format("DD.MM.YYYY")}</div>
  ) : (
    <div>Noch nicht gegossen 🍂</div>
  );

  const daysUntilWatering = lastWatered
    ? getDaysUntilWatering(lastWatered, wateringInterval)
    : null;

  const wateringMsg = daysUntilWatering !== null && (
    <div>
      {daysUntilWatering > 0
        ? `Noch ${daysUntilWatering} Tage bis zum Gießen`
        : daysUntilWatering === 0
          ? "Heute gießen!"
          : `Überfällig seit ${Math.abs(daysUntilWatering)} Tag(en)`}
    </div>
  );

  return (
    <div className={"PlantCard"}>
      <header>
        <h2>{name}</h2>
        <div>📍{location}</div>
        <button onClick={() => toggleFavorite(id)}>
          {isFavorite ? "💚 Favorit" : "🤍 Favorit"}
        </button>
      </header>
      <section>
        <div>{wateringInfo}</div>
        {lastWateredMsg}
        {wateringMsg}
        <button
          type={"button"}
          disabled={isPending}
          onClick={() => markAsWatered(dayjs().format("YYYY-MM-DD"))}
        >
          💧 Jetzt gegossen
        </button>
        {error && <p className={"error-message"}>{error.message}</p>}
      </section>
    </div>
  );
}
```
