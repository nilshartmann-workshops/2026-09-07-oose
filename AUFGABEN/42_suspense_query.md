# TanStack Query: die Pflanzen vom Backend holen

## Dateien

- `src/plant-list/plantsQueryOptions.ts` (neu anlegen)
- `src/plant-list/PlantList.tsx`
- `src/plant-list/FavoritePlantList.tsx`
- `src/App.tsx`

## Vorbereitung

Das Backend muss laufen, in einem zweiten Terminal: `npm run backend`. Schau dir die Antwort einmal an, bevor du Code schreibst: http://localhost:7200/api/plants

Der `QueryClientProvider` ist in `main.tsx` schon eingehängt.

## Aufgabe

`PlantList` hat die Pflanzen bisher als feste Liste im Quelltext. Die holst du jetzt mit `useSuspenseQuery` vom Backend, geprüft durch das Schema aus der vorigen Übung. Danach lagerst du die Query-Beschreibung aus, damit `FavoritePlantList` sie mitbenutzen kann.

## Schritte

### 1. Die Query-Beschreibung anlegen

Leg `src/plant-list/plantsQueryOptions.ts` an und exportiere eine **Funktion**, die `queryOptions` aus `@tanstack/react-query` zurückgibt:

```ts
export const plantsQueryOptions = () => {
  return queryOptions({
    queryKey: ["plants"],
    queryFn: async () => {
      // ...
    },
  });
};
```

`queryOptions` tut zur Laufzeit nichts, sein Nutzen ist der Typ: TanStack Query weiß dadurch, welcher Wert unter dem `queryKey` `["plants"]` im Cache liegt. Dass es eine Funktion ist, brauchen wir später, wenn ein Argument dazukommt (etwa die Sortierung), das in den `queryKey` gehört.

### 2. Die `queryFn` mit `fetch`

1. **Anfragen:** `const response = await fetch("http://localhost:7200/api/plants");`
2. **Status prüfen:** `if (!response.ok) throw new Error(...)`. Ohne diese Zeile merkt niemand, dass etwas schiefging, siehe unten.
3. **Lesen und prüfen:** `await response.json()` liefert ein `any`, schick es durch dein Schema: `return z.array(PlantSchema).parse(data);` Hier `parse` und nicht `safeParse`, denn die Query soll scheitern statt mit halben Daten weiterzulaufen.

### 3. `PlantList` umstellen

Wirf `allPlants` weg und hol die Daten stattdessen mit `useSuspenseQuery(plantsQueryOptions())`. Das `data` daraus ist nie `undefined`, es gibt also kein `isLoading` und keine Abfrage darauf.

### 4. Einen Ladezustand anzeigen

Während der Ladezeit bleibt die Seite leer: `useSuspenseQuery` unterbricht das Rendern, und niemand fängt das auf. Dafür gibt es `<Suspense>`.

- Zieh in `App.tsx` ein `<Suspense fallback={...}>` um `<PlantList />`.
- Überleg dir, wo die Grenze fachlich hingehört. Um die ganze `<TabBar>` gezogen, verschwindet auch die Reiterleiste.
- Häng zum Ausprobieren `?slow=2000` an die URL in deiner `queryFn`.

### 5. `FavoritePlantList` lädt selbst

Bau das Property `plants` aus und ruf auch dort `useSuspenseQuery(plantsQueryOptions())` auf. In `PlantList` fällt damit das `plants={...}` weg. Genau dafür haben wir die Query-Beschreibung ausgelagert.

### 6. Nachschauen, was wirklich passiert

Öffne den Netzwerk-Tab und lade neu: Zwei Komponenten fragen an, es steht aber nur **eine** Anfrage da. Klick danach ein paar Mal auf einen Favoriten-Button, es kommt keine dazu.

### 7. 🧐 Optional (wenn du noch Zeit hast)

- Stopp das Backend und lade neu. Was siehst du, und was steht in der Konsole?
- Verschärf dein Schema, etwa `wateringInterval: z.number().max(1)`. Woran erkennst du in der Meldung, welches Feld welcher Pflanze das Problem war?

## Material

- `useSuspenseQuery`: https://tanstack.com/query/latest/docs/framework/react/reference/useSuspenseQuery
- Query Keys: https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
- `queryOptions`: https://tanstack.com/query/latest/docs/framework/react/reference/queryOptions
- Hintergründe zu `queryOptions`: https://tkdodo.eu/blog/the-query-options-api
- React `<Suspense>`: https://react.dev/reference/react/Suspense
