# Mutation: gießen und den Cache aufräumen

## Dateien

- `src/plant-list/PlantCard.tsx`

## Vorbereitung

Das Backend läuft. Die Adresse für diesen Schritt ist `PUT http://localhost:7200/api/plants/:id/lastWatered`, und sie erwartet einen JSON-Body mit dem Feld `lastWatered`.

## Aufgabe

Jede Karte bekommt einen Knopf „Jetzt gegossen". Ein Klick schreibt das heutige Datum ins Backend, und danach zeigt die Anwendung den neuen Stand an. Schreiben geht in TanStack Query mit `useMutation`, und die spannende Frage kommt danach: Woher weiß die Liste, dass sich etwas geändert hat?

## Schritte

### 1. Den Knopf einbauen

Ergänze in `PlantCard` unter den Gießhinweisen einen Knopf „Jetzt gegossen". Noch tut er nichts.

### 2. Die Mutation schreiben

`useMutation` bekommt eine `mutationFn`. Anders als bei einer Query läuft sie nicht von selbst, sondern erst, wenn du die zurückgegebene Funktion `mutate` aufrufst.

```ts
const { mutate: markAsWatered } = useMutation({
  async mutationFn() {
    // ...
  },
});
```

In der `mutationFn` schickst du den `PUT`-Request. Mit `fetch` gehören drei Angaben dazu, die beim `GET` nicht nötig waren:

```ts
{
  method: "PUT",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ lastWatered: /* heute */ }),
}
```

Als Datum schickst du **heute in der Form `2026-08-29`**. `dayjs` ist eingerichtet, `dayjs().format("YYYY-MM-DD")` liefert genau das.

> **Fallstrick:** Naheliegend wäre `new Date().toISOString()`. Das gibt aber `2026-08-29T14:12:33.482Z`, und das Backend speichert, was es bekommt. Beim nächsten Laden fiele die Antwort durch unser Schema, denn `z.iso.date()` erlaubt nur den Tag ohne Uhrzeit. Der Fehler käme verzögert und an ganz anderer Stelle.

Die Statusprüfung brauchst du hier genauso wie in der `queryFn`, aus demselben Grund, und ein `Error` mit dem Status in der Meldung reicht dafür.

Häng den Knopf an `markAsWatered` und klick ihn an. Schau dabei in den Netzwerk-Tab **und** auf die Karte.

### 3. Die Frage, um die es geht

Im Netzwerk steht der `PUT`, und er war erfolgreich. Auf der Karte steht weiter das alte Datum, und ein Neuladen zeigt: Das Backend hat den neuen Wert längst.

Der Grund ist der Cache. TanStack Query hat die Liste unter dem `queryKey` `["plants"]` liegen, und niemand hat ihm gesagt, dass sie nicht mehr stimmt. Eine Mutation weiß von sich aus nicht, welche Queries sie veraltet.

### 4. Den Cache invalidieren

- Hol dir den Client mit `useQueryClient()`.
- Ergänz an der Mutation den Callback `onSuccess` und ruf darin `invalidateQueries` auf.
- Den `queryKey` tippst du nicht ab. `plantsQueryOptions()` enthält ihn, und genau dafür haben wir die Funktion gebaut.

Klick den Knopf noch einmal und schau in den Netzwerk-Tab. Nach dem `PUT` steht dort ein neuer `GET`: Invalidieren heißt „für veraltet erklären", und weil die Liste gerade auf dem Bildschirm ist, holt Query sie sofort neu.

Setz eine Pflanze auf „Favorit" und gieß sie. Beide Listen ändern sich, obwohl nirgends steht, dass sie zusammenhängen. Beide hängen am selben `queryKey`.

### 5. Rückmeldung für die Nutzerin

`useMutation` gibt neben `mutate` auch den Zustand zurück.

- Schalt den Knopf während des Laufs ab (`isPending`). Zum Ausprobieren häng `?slow=2000` an die URL der Mutation.
- Zeig eine Meldung an, wenn es schiefging (`error`). Ausprobieren kannst du das mit einer `id`, die es nicht gibt, dann antwortet das Backend mit 404.

### 6. 🧐 Optional (wenn du noch Zeit hast)

- Gieß eine Pflanze und wechsel **vorher** auf einen anderen Reiter. Kommt der `GET` trotzdem? Und wann?
- `invalidateQueries` wirft die Daten nicht weg, es erklärt sie für veraltet. Was wäre der Unterschied zu `removeQueries`, und was passiert bei `refetchQueries`?
- Was müsste passieren, damit die Karte den neuen Wert schon zeigt, **bevor** das Backend geantwortet hat?

## Material

- `useMutation`: https://tanstack.com/query/latest/docs/framework/react/reference/useMutation
- `useQueryClient`: https://tanstack.com/query/latest/docs/framework/react/reference/useQueryClient
- Invalidierung aus Mutations heraus: https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations
- `invalidateQueries`: https://tanstack.com/query/latest/docs/reference/QueryClient#queryclientinvalidatequeries

## 🧐 Zum Nachlesen

### Warum der Fehler hier nicht bei der Error Boundary landet

Beim Laden reicht `useSuspenseQuery` den Fehler nach oben, und die Boundary fängt ihn. Bei einer Mutation ist das anders: `mutate` läuft in einem Event-Handler und nicht beim Rendern, und dort wirft nichts. Der Fehler kommt stattdessen als Wert zurück, im Feld `error`.

Das ist auch der passendere Umgang. Ein gescheitertes Laden macht die ganze Ansicht sinnlos, ein gescheitertes Speichern nicht: Die Liste steht weiter da, und die Meldung gehört an die eine Karte, an der es nicht geklappt hat.

### Invalidieren oder selbst schreiben

**Invalidieren** heißt, die Daten für veraltet zu erklären und Query neu laden zu lassen. Danach wird garantiert der Stand des Servers angezeigt, auch wenn der mehr geändert hat als erwartet. Der Preis ist eine zusätzliche Anfrage und ein kurzer Moment mit dem alten Wert.

**Selbst schreiben** heißt, mit `setQueryData` den neuen Wert direkt in den Cache zu legen. Das ist sofort sichtbar und kommt ohne zweite Anfrage aus, verlangt aber, dass man die Antwort des Servers richtig vorhersagt.

Für den Anfang ist Invalidieren der ehrlichere Weg, denn es kann nicht auseinanderlaufen. Der zweite Weg ist die Grundlage für Optimistic Updates, und die sehen wir uns als Nächstes an.
