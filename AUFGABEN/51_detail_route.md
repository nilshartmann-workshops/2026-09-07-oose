# Die Detailseite: Pfad-Parameter und typisierte Links

## Dateien

- `src/routes/$plantId.tsx` (neu anlegen)
- `src/plant-detail/plantQueryOptions.ts` (neu anlegen)
- `src/plant-detail/PlantDetails.tsx` (neu anlegen)
- `src/plant-list/PlantCard.tsx`

## Vorbereitung

Backend und Devserver laufen. Der Devserver schreibt `src/routeTree.gen.ts` jedes Mal neu, sobald unter `src/routes/` eine Datei dazukommt. Ohne ihn kennt `<Link>` die neue Route nicht.

## Aufgabe

Die Anwendung hängt am Router, hat aber nur eine einzige Adresse. Jetzt bekommt jede Pflanze unter `/$plantId` eine eigene Seite, und die Karte in der Liste verlinkt dorthin. Am Link siehst du, was die Typisierung des Routers wert ist.

## Schritte

### 1. Die Detailseite

Leg `src/routes/$plantId.tsx` an. Das Dollarzeichen im Dateinamen macht den Abschnitt zum Parameter, und `Route.useParams()` gibt ihn unter genau diesem Namen zurück:

```tsx
const { plantId } = Route.useParams();
```

Der Wert ist ein `string`, und zwar getippt, nicht geraten: Der Router leitet den Typ aus dem Dateinamen ab.

Das Backend liefert die eine Pflanze unter `/api/plants/:plantId` und antwortet mit 404, wenn es sie nicht kennt.

- Leg `src/plant-detail/plantQueryOptions.ts` an, nach dem Muster von `plantsQueryOptions.ts`, mit der Statusprüfung und geprüft durch `PlantSchema` (ohne `z.array`, es ist ja nur eine).
- Nimm als `queryKey` etwas, das mit `"plants"` beginnt, etwa `["plants", plantId]`. Dann trifft das `invalidateQueries` nach dem Gießen die Detailseite mit.
- Leg `src/plant-detail/PlantDetails.tsx` an, lade über `useSuspenseQuery` und zeig Name, Standort, Gießintervall und das Datum.
- Wickel das Ganze in der Route in `<PlantErrorBoundary>` und `<Suspense>`, wie bei der Liste, und leg ein `<div className={"AppContainer"}>` darum. Den Rahmen bringt jede Route selbst mit, denn `App.tsx` hält ihn nur für die Startseite.

Ruf `http://localhost:3000/1` auf, danach `http://localhost:3000/999`: Der 404 kommt aus dem Backend, und dein Fallback fängt ihn.

### 2. Der typisierte Link

In `PlantCard` kommt ein `<Link>` neben den Knopf „Jetzt gegossen":

```tsx
<Link to={"/$plantId"} params={{ plantId: id }}>
  Details
</Link>
```

Probier aus, was passiert, wenn du `params` weglässt oder dich im Pfad vertippst. Der Übersetzer meldet es sofort, ohne dass du Typen von Hand gepflegt hättest. Auf der Detailseite gehört ein `<Link to={"/"}>` zurück zur Liste.

### 3. 🧐 Optional (wenn du noch Zeit hast)

- Klick dich durch mehrere Pflanzen und benutz danach den Zurück-Knopf. Was passiert mit den Reitern, wenn du auf der Startseite landest? Und was mit den Render-Zählern in der Reiterleiste?
- Gib `<Link>` ein `activeProps={{ className: "active" }}` mit. Wann ist ein Link aktiv, und was bedeutet dabei `activeOptions`?
- Häng eine `notFoundComponent` an die Wurzelroute und ruf `/gibtesnicht` auf. Wo ist der Unterschied zu dem 404, den das Backend schickt?
- Was würde aus den drei Spielwiesen-Reitern, wenn auch sie eigene Routen bekämen? Was gewinnst du, und was verlierst du gegenüber `<Activity>`?

## Material

- Pfad-Parameter: https://tanstack.com/router/latest/docs/framework/react/guide/path-params
- `<Link>`: https://tanstack.com/router/latest/docs/framework/react/api/router/linkComponent
- `useParams`: https://tanstack.com/router/latest/docs/framework/react/api/router/useParamsHook

## 🧐 Zum Nachlesen

### Woher der Link seine Typen hat

Ein `<Link to={"/$plantId"}>` weiß, dass es `params` mit einem `plantId` braucht, und niemand hat die Pfade zweimal aufgeschrieben.

Die Kette hat drei Glieder. Das Vite-Plugin liest den Ordner `src/routes/` und schreibt daraus `routeTree.gen.ts`, eine Datei voller Typen. `createRouter` baut den Router aus diesem Baum, und sein Typ enthält damit jeden Pfad und jeden Parameter. Die `declare module`-Deklaration in `create-router.tsx` meldet diesen Typ unter dem Namen `Register` bei der Bibliothek an, und `<Link>` liest ihn von dort.

Nimm die Deklaration versuchsweise heraus. `to` ist dann ein beliebiger `string`, und kein Tippfehler fällt mehr auf.

### Links sehen hier aus wie Knöpfe

In `index.css` steht eine Regel für das Element `a`, und die macht jeden Link grün und rechteckig. Das ist keine Eigenschaft des Routers, sondern das Aussehen dieses Projekts, und es trifft `<Link>` genauso wie ein gewöhnliches `<a>`.

Die Regel steht in `@layer base`, und die Utility-Klassen von Tailwind stehen darüber. Ein einzelner Link lässt sich deshalb mit einer Klasse am Element umstellen.
