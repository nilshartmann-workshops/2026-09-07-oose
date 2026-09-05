# TanStack Router: die Startseite wird eine Route

## Dateien

- `src/routes/index.tsx` (neu anlegen)
- `src/main.tsx`
- `src/routes/__root.tsx` und `src/create-router.tsx` (nur lesen)

## Vorbereitung

Backend und Devserver laufen. Der Devserver ist diesmal wichtiger als sonst: Das Router-Plugin von Vite erzeugt `src/routeTree.gen.ts` und schreibt sie jedes Mal neu, wenn unter `src/routes/` eine Datei dazukommt oder verschwindet. Ohne laufenden Devserver bleibt sie leer, und dann kennt der Router keine einzige Route.

Alles andere liegt bereit: das Paket, das Plugin in `vite.config.ts`, `src/create-router.tsx` und `src/routes/__root.tsx`. Sieh dir die beiden Dateien zuerst an, denn sie tragen den Mechanismus, um den es hier geht.

`create-router.tsx` baut den Router aus dem erzeugten Routenbaum. Unten steht eine `declare module`-Deklaration, die den Typ des Routers bei der Bibliothek anmeldet. Sie ist der Grund, warum ein `<Link to={"..."}>` die Pfade deiner Anwendung kennt und einen Tippfehler als Übersetzungsfehler meldet. `routes/__root.tsx` ist die Wurzel über allen Routen; ihre Komponente rendert `<Outlet />`, und dort setzt die getroffene Route ihren Inhalt ein.

## Aufgabe

Bisher entscheidet der Zustand der Reiterleiste, was zu sehen ist. Die Adresszeile bleibt unverändert, und deshalb lässt sich kein Stand teilen, kein Lesezeichen setzen, und der Zurück-Knopf tut nichts.

Du hängst die Anwendung an den Router: Aus der Startseite wird die Route `/`, und der `RouterProvider` tritt an die Stelle von `<App />`. Sichtbar ändert sich dabei nichts, und genau das ist der Punkt.

## Schritte

### 1. Die Startseite wird zur Route

Leg `src/routes/index.tsx` an. Der Dateiname ist die Adresse, `index.tsx` steht für `/`:

```tsx
export const Route = createFileRoute("/")({
  component: App,
});
```

Der Name `Route` ist vorgeschrieben, denn das Plugin sucht genau diesen Export. Die Komponente daneben ist dein bisheriges `App`, unverändert: Eine Route sagt, unter welcher Adresse etwas zu sehen ist, und nicht, wie es aussieht.

> 🧐 **Wenn du magst:** Das `<div className={"AppContainer"}>` steht in `App.tsx` und damit nur um die Startseite. Zieh es nach `__root.tsx` um den `<Outlet />`, dann steht jede Route im selben Rahmen, auch jede, die später dazukommt.

### 2. Den Router einhängen

In `main.tsx` tritt der `RouterProvider` an die Stelle von `<App />`:

```tsx
<QueryClientProvider client={queryClient}>
  <RouterProvider router={plantManagerRouter} />
</QueryClientProvider>
```

Der `QueryClientProvider` bleibt außen, denn die Komponenten unter den Routen fragen weiterhin Queries.

Lade die Seite, es muss aussehen wie vorher. Wirf einen Blick in `src/routeTree.gen.ts`: Dort steht deine Route. Die Datei ist erzeugt, sie gehört dem Plugin, und Änderungen darin sind beim nächsten Speichern weg.

> **Fallstrick:** Das Plugin schreibt die Datei auf die Platte, und manche Editoren bekommen das nicht mit. Steht in `routeTree.gen.ts` nichts Neues, obwohl der Devserver läuft, lass deine IDE die Dateien neu einlesen. In IntelliJ heißt das „Reload from Disk", in VS Code „Developer: Reload Window".

## Material

- TanStack Router, Überblick: https://tanstack.com/router/latest/docs/framework/react/overview
- Dateibasiertes Routing: https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing
- `createFileRoute`: https://tanstack.com/router/latest/docs/framework/react/api/router/createFileRouteFunction
