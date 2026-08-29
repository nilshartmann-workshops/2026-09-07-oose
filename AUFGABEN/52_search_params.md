# Search Params als Anwendungszustand

## Dateien

- `src/routes/index.tsx`
- `src/plant-list/plantsQueryOptions.ts`
- `src/plant-list/PlantOrderBar.tsx` (neu anlegen)
- `src/plant-list/PlantList.tsx`
- `src/plant-list/FavoritePlantList.tsx`
- `src/plant-list/PlantCard.tsx`
- `src/App.tsx`

## Vorbereitung

Das Backend läuft und kennt den Query-Parameter `orderBy`. Erlaubt sind `id`, `name`, `location`, `lastWatered` und `wateringInterval`. Probier es zuerst ohne Anwendung aus: http://localhost:7200/api/plants?orderBy=lastWatered

In der Anwendung bieten wir davon zwei an, `id` und `lastWatered`. Alles Weitere ist danach eine Zeile mehr im Enum und ein Link mehr in der Leiste.

Ein Wert, den das Backend nicht kennt, ergibt einen 400 mit einer Meldung, die die erlaubten Werte aufzählt.

## Aufgabe

Die Liste soll sich sortieren lassen. Der Zustand dafür kommt nicht in ein `useState` und auch nicht in den Store, sondern in die Adresszeile: `/?orderBy=name`. Der Router prüft den Wert beim Hereinkommen, und die Query nimmt ihn in ihren Schlüssel auf.

## Schritte

### 1. Die Query bekommt die Sortierung

`plantsQueryOptions` ist bisher eine Funktion ohne Argument. Gib ihr die Sortierung mit, häng sie in der `queryFn` an die URL und, das ist der wichtige Teil, **nimm sie in den `queryKey` auf**:

```ts
queryKey: ["plants", { orderBy }],
```

Lass den `queryKey` versuchsweise unverändert und schalt die Sortierung um. Die Anfrage geht mit dem neuen Wert raus, die Liste ändert sich aber nicht: Für TanStack Query ist es dieselbe Query, und die Antwort aus dem Cache steht schon da. Der Schlüssel muss alles enthalten, was die Antwort beeinflusst.

Die Signatur schreibt die erlaubten Werte als Union hin:

```ts
export const plantsQueryOptions = (orderBy: "id" | "lastWatered") => { ... }
```

Gleich steht dieselbe Liste noch einmal in der Route, dort als zod-Enum. Warum sie nicht geteilt wird, steht unten.

### 2. Die Route prüft den Parameter

In `routes/index.tsx` bekommt die Route ein `validateSearch`:

```tsx
const SearchSchema = z.object({
  orderBy: z.enum(["id", "lastWatered"]).default("id"),
});

export const Route = createFileRoute("/")({
  component: App,
  validateSearch: SearchSchema,
});
```

Das zod-Schema geht **direkt** hinein, ohne Adapter. Der Router nimmt jedes Schema an, das Standard Schema erfüllt, und zod 4 tut das.

`.default("id")` sorgt dafür, dass der Wert immer da ist. Lade die Seite ohne Parameter: Die Adresse wird zu `/?orderBy=id` ergänzt.

### 3. Die Leiste mit den Links

Leg `src/plant-list/PlantOrderBar.tsx` an. Je Sortierung ein `<Link>`, das den Pfad behält und nur den Parameter setzt:

```tsx
<Link
  to={"/"}
  search={{ orderBy: "lastWatered" }}
  activeProps={{ className: "active" }}
>
  Zuletzt gegossen
</Link>
```

`search` ist typisiert, genau wie `params` vorhin. `activeProps` gibt dem Link Eigenschaften, solange die Adresse zu ihm passt. Der aktive Zustand steht damit in der URL, und niemand muss ihn nebenher in einer Variablen mitführen.

Die Leiste hängst du in `App.tsx` in das Panel mit der Liste, und zwar **außerhalb** der Error Boundary. Dann bleibt sie bedienbar, auch wenn das Laden scheitert.

Das Aussehen liegt fertig in `index.css`, unter `.PlantOrderBar`. Warum dafür eine eigene Regel nötig ist und Utility-Klassen an der Komponente nicht reichen, steht unten.

### 4. Die Listen lesen den Wert

`PlantList` und `FavoritePlantList` holen sich die Sortierung selbst, ohne Prop, Store oder Context:

```tsx
const { orderBy } = useSearch({ from: "/" });
```

Das `from` sagt dem Router, zu welcher Route der Parameter gehört, und darüber kennt er auch dessen Typ.

> **Fallstrick:** Beide Komponenten müssen denselben Wert benutzen. Sonst haben sie verschiedene Schlüssel, und im Netzwerk-Tab stehen plötzlich zwei Anfragen statt einer.

### 5. Die Mutation trifft den richtigen Schlüssel

`PlantCard` invalidiert nach dem Gießen bisher genau die eine Query, mit `plantsQueryOptions()`. Seit die Funktion ein Argument nimmt, übersetzt das nicht mehr, und der Aufruf soll auch gar nicht mehr so heißen. Nimm den groben Schlüssel:

```ts
queryClient.invalidateQueries({ queryKey: ["plants"] });
```

Er trifft jede Sortierung im Cache und die Detailseite dazu. Das ist gewollt, denn nach dem Gießen ist jeder dieser Stände veraltet. Die Karte braucht `plantsQueryOptions` damit nicht mehr, der Import fällt weg.

Probier es aus: Sortier nach „Zuletzt gegossen", gieß die unterste Pflanze und schau zu, wie sie nach oben wandert.

### 6. Einen kaputten Parameter ausprobieren

Ruf `/?orderBy=quatsch` auf. Der Router lässt den Wert nicht durch, und der Fehler aus zod landet auf der Seite. Das ist die zweite Hälfte von `validateSearch`: Die Adresszeile kann jeder ändern, und ohne Prüfung ginge `quatsch` an das Backend und käme als 400 zurück.

### 7. 🧐 Optional (wenn du noch Zeit hast)

- Nimm einen zweiten Parameter dazu, etwa `?search=` für ein Suchfeld. Was passiert mit dem `orderBy`, wenn du ihn per `<Link>` setzt, und was bedeutet dabei `search={(prev) => ({ ...prev, search: "x" })}`?
- Häng `.catch("id")` an das Schema und ruf noch einmal `/?orderBy=quatsch` auf. Die Seite lädt, und aus dem kaputten Wert wird der Standard. Sieh dir danach an, was `<Link search={{ orderBy: ... }}>` noch an Typen kennt.
- Bau ein `<select>` statt der Links, das mit `useNavigate` arbeitet. Wann ist ein Link besser als ein Handler?
- Sortier nach Name, öffne eine Detailseite und geh zurück. Warum steht die Sortierung noch, ohne dass jemand sie gespeichert hat?

## Material

- Search Params: https://tanstack.com/router/latest/docs/framework/react/guide/search-params
- `validateSearch`: https://tanstack.com/router/latest/docs/framework/react/api/router/RouteOptionsType#validatesearch-method
- Standard Schema: https://standardschema.dev/
- Query Keys: https://tanstack.com/query/latest/docs/framework/react/guides/query-keys

## 🧐 Zum Nachlesen

### Warum kein Adapter

In vielen Beispielen im Netz steht `zodValidator` aus `@tanstack/zod-adapter`. Den brauchst du hier nicht, und er würde auch nicht passen, denn das Paket verlangt zod 3 und dieses Projekt fährt zod 4.

Der Adapter stammt aus der Zeit, bevor es Standard Schema gab. Standard Schema ist eine kleine gemeinsame Schnittstelle, auf die sich zod, Valibot, ArkType und andere geeinigt haben: eine Funktion, die prüft und entweder den Wert oder eine Liste von Fehlern zurückgibt. Deshalb nimmt `validateSearch` das Schema jetzt direkt. Dieselbe Schnittstelle steckt hinter dem `zodResolver`, der uns bei den Formularen begegnet.

### Warum die Liste zweimal dasteht

Die erlaubten Sortierungen stehen in der Route als zod-Enum und in der Query als Union. Das sieht nach einer Verdopplung aus, die man wegräumen sollte, und der erste Griff wäre, das Enum zu exportieren und in der Signatur `z.infer` darauf anzuwenden.

Sieh dir vorher an, wovon die beiden wirklich abhängen. Das Enum in der Route beschreibt, was aus der Adresszeile hereinkommen darf, und dahinter steht eine Entscheidung über die Oberfläche: Diese Sortierungen bieten wir an. Die Union in der Query beschreibt, was das Backend am Parameter `orderBy` annimmt. Beide folgen also dem Backend, aber keine folgt der anderen. Wer sie aneinanderbindet, behauptet eine Abhängigkeit, die es nicht gibt, und merkt es an dem Tag, an dem das Backend eine Sortierung kennt, die in der Oberfläche nicht auftauchen soll.

Das heißt nicht, dass Teilen immer falsch wäre. Bei einer langen Liste, die sich oft ändert, ist ein gemeinsames Schema die bessere Wahl. Die Frage ist nur, ob es eine Wahl ist oder ein Reflex.

### Was in die Adresse gehört und was nicht

Die Frage ist immer dieselbe: Soll jemand diesen Stand verschicken oder wiederfinden können?

In die Adresse gehören die Sortierung, ein Filter, ein Suchbegriff, die Seitenzahl einer Blätterliste und die Kennung dessen, was gerade offen ist. Nicht hinein gehört, was nur diese eine Bedienung betrifft: ob ein Menü aufgeklappt ist, wie weit eine Animation gelaufen ist, was in einem Formularfeld steht, solange es niemand abgeschickt hat.

Die Reiterleiste dieser Anwendung liegt genau auf der Grenze. Sie hält ihren Zustand weiter in einem `useState`, und wer den Reiter „Neue Pflanze" per Link verschicken wollte, könnte es nicht.

### Warum die Links eine eigene CSS-Regel brauchen

In `index.css` steht eine Regel für das Element `a`, die jeden Link grün und rechteckig macht. Eine Utility-Klasse an der Komponente kommt dagegen nicht an, unabhängig davon, wie spezifisch sie ist. Deshalb liegen die Regeln für die Leiste dort und nicht als Klassen im JSX.

Der Grund sind Cascade Layer. Tailwind stellt seine Utilities in einen Layer, die Regeln in dieser Datei stehen in keinem, und ungeschichtetes CSS gewinnt gegen geschichtetes. Die Reihenfolge der Layer entscheidet vor jeder Spezifität.
