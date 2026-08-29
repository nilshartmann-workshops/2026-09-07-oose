# Loader und Prefetching

**Keine Übung**, das schauen wir uns gemeinsam an.

## Dateien

- `src/routes/$plantId.tsx`
- `src/routes/index.tsx`
- `src/create-router.tsx`

## Vorbereitung

Der Netzwerk-Tab ist offen und auf `plants` gefiltert. Ohne ihn ist von diesem Schritt nichts zu sehen.

Das Backend antwortet auf einem schnellen Rechner in wenigen Millisekunden, damit lässt sich kein Unterschied erkennen. Es läuft deshalb langsam, gestartet mit `npm run start:slow`, und braucht dann für jede Antwort gut eine Sekunde.

## Worum es geht

Bisher fängt das Laden an, wenn die Komponente rendert: erst die Route, dann die Komponente, dann `useSuspenseQuery`, dann die Anfrage. Der Router kann früher anfangen. Jede Route darf einen **Loader** haben, der läuft, bevor die Komponente an die Reihe kommt, und mit `preload` läuft er sogar schon, während die Maus über dem Link steht.

## Schritte

### 1. Der Loader an der Detail-Route

`createFileRoute` nimmt neben `component` auch `loader` entgegen:

```tsx
loader: ({ context: { queryClient }, params: { plantId } }) => {
  queryClient.prefetchQuery(plantQueryOptions(plantId));
},
```

Der `context` ist der, den `create-router.tsx` beim `createRouter` mitgegeben hat, und er enthält den `queryClient`. Deshalb liegt der Loader nicht in einer Komponente und braucht trotzdem keinen eigenen Zugang zum Cache. Sein Typ steht in `routes/__root.tsx`, bei `createRootRouteWithContext`. Die `params` sind dieselben, die die Komponente über `Route.useParams()` liest.

Der Klick auf eine Detailseite zeigt es im Netzwerk-Tab: Die Anfrage geht früher raus als vorher, und das Fallback ist kürzer zu sehen.

### 2. Der Loader an der Liste

Die Liste hängt an der Sortierung, und die steht in den Search Params. Der Router gibt sie dem Loader nicht von selbst, denn er muss wissen, welcher Teil der Adresse den Loader betrifft:

```tsx
loaderDeps: ({ search: { orderBy } }) => ({ orderBy }),
loader: ({ context: { queryClient }, deps: { orderBy } }) => {
  queryClient.prefetchQuery(plantsQueryOptions(orderBy));
},
```

Ohne `loaderDeps` läuft der Loader beim ersten Aufruf und danach nie wieder, egal welche Sortierung angeklickt wird. Das sehen wir uns an.

### 3. Preload beim Überfahren

In `create-router.tsx` kommt eine Zeile dazu:

```ts
defaultPreload: "intent",
```

„Intent" heißt: Der Router hält es für wahrscheinlich, dass jemand gleich klickt. Bei einem `<Link>` ist das der Fall, wenn die Maus darüber steht oder der Link den Fokus bekommt.

Die Maus über „Details", ohne zu klicken: Die Anfrage geht raus. Die Maus über „Name" in der Sortierleiste: Die Anfrage für die neue Sortierung geht raus, und die Adresszeile bleibt, wo sie war. Der Klick danach zeigt die Seite sofort und ohne Fallback.

Zum Vergleich rufen wir eine Detailseite über die Adresszeile direkt auf, ohne vorher drüberzufahren. Dann ist das Fallback wieder da.

### 4. Warten oder nicht warten

Der Loader oben ruft `prefetchQuery` auf und gibt nichts zurück. Er stößt das Laden an und ist sofort fertig, um das Warten kümmert sich weiterhin `<Suspense>`. Wir tauschen die Zeile einmal aus:

```tsx
loader: ({ context: { queryClient }, params: { plantId } }) =>
  queryClient.ensureQueryData(plantQueryOptions(plantId)),
```

`ensureQueryData` gibt ein Promise zurück, der Router wartet darauf, und die alte Seite bleibt so lange stehen. Das Suspense-Fallback erscheint gar nicht mehr, denn beim Rendern sind die Daten schon da.

Danach `/999`: Die Meldung sieht anders aus als vorher. Der Fehler ist im Loader entstanden und damit außerhalb des React-Baums, und die Error Boundary kommt nicht mehr an ihn heran. Dafür gibt es `errorComponent` an der Route.

Beides ist richtig, und die Frage ist, wo gewartet werden soll:

- `prefetchQuery` ohne Warten: Die neue Seite kommt sofort und füllt sich, das Fallback bleibt sichtbar, Fehler bleiben bei der Error Boundary.
- `ensureQueryData` mit Warten: Die alte Seite bleibt stehen, bis alles da ist, und die neue erscheint fertig. Fehler und Ladeanzeige liegen beim Router.

Danach geht es mit `prefetchQuery` weiter, damit die Error Boundary greift.

### 5. 🧐 Zum Ausprobieren hinterher

- Setz `defaultPreload` auf `"viewport"`. Was passiert beim Scrollen durch die Liste, und wann wäre das eine schlechte Idee?
- Der Router merkt sich einen Preload standardmäßig eine halbe Minute lang. Mit `defaultPreloadStaleTime: 0` überlässt er die Frage ganz TanStack Query. Fahr danach mehrfach über denselben Link und sieh dir den Netzwerk-Tab an.
- Gib der Route eine `pendingComponent` und ein `pendingMs`. Wann ist sie zu sehen, und wie verhält sie sich zu `<Suspense>`?
- Häng an `plantQueryOptions` ein `staleTime` von 30 Sekunden. Welche der Anfragen von vorhin verschwinden dadurch, und welche bleiben?

## Material

- Loader: https://tanstack.com/router/latest/docs/framework/react/guide/data-loading
- Preloading: https://tanstack.com/router/latest/docs/framework/react/guide/preloading
- Router und TanStack Query zusammen: https://tanstack.com/router/latest/docs/framework/react/guide/external-data-loading
- `ensureQueryData`: https://tanstack.com/query/latest/docs/reference/QueryClient#queryclientensurequerydata

## 🧐 Zum Nachlesen

### Zwei Zwischenspeicher, einer davon reicht

Der Router bringt einen eigenen Zwischenspeicher für das mit, was ein Loader zurückgibt. Wer ohne TanStack Query arbeitet, holt seine Daten im Loader und liest sie in der Komponente mit `Route.useLoaderData()`.

Hier ist es andersherum aufgezogen. Die Daten stehen im Cache von TanStack Query, und der Loader schiebt sie nur früher hinein. Die Komponente fragt weiterhin ihre Query und weiß gar nicht, ob jemand vorgearbeitet hat.

Das ist Absicht, denn beide Zwischenspeicher zu benutzen hieße, zwei Wahrheiten zu pflegen. Nach einer Mutation räumt `invalidateQueries` den Query-Cache auf, und was im Router-Cache läge, wüsste davon nichts. Deshalb gibt der Loader hier auch nichts zurück, und `useLoaderData` kommt nicht vor. Sein einziger Zweck ist der frühere Start.
