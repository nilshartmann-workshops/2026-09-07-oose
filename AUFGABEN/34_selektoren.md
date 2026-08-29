# Selektoren: nur noch rendern, was sich wirklich geändert hat

## Dateien

- `src/plant-list/PlantCard.tsx`
- `src/plant-list/FavoritePlantList.tsx`

## Vorbereitung

Der `console.log` am Anfang von `PlantCard` hat gezeigt, dass beim Klick auf **einen** Favoriten-Button **alle** Karten neu rendern. Wenn du das noch nicht ausprobiert hast, hol es jetzt nach, sonst ist der Rest der Übung nur Umbauen. Lass die Zeile stehen, wir brauchen sie am Ende noch einmal.

## Aufgabe

Dass alle Karten rendern, reparieren wir mit **Selektoren**: Jede Komponente sagt, was sie aus dem Store braucht, und rendert nur noch dafür.

## Schritte

1. Ein Selektor ist eine Funktion, die aus dem Zustand nur das herausgreift, was die Komponente braucht. Du übergibst sie an `useFavoritesStore`. Zustand ruft sie nach *jeder* Änderung im Store auf, rendert die Komponente aber nur dann neu, wenn sich ihr *Rückgabewert* geändert hat.
2. Stell `PlantCard` auf zwei getrennte Zugriffe um:

   ```ts
   const isFavorite = useFavoritesStore((state) =>
     state.favoriteIds.includes(id),
   );
   const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
   ```

   Der erste Wert ändert sich nur, wenn **diese** Karte an- oder abgewählt wird. Der zweite ändert sich nie, denn es ist immer dieselbe Funktion.
3. Stell auch `FavoritePlantList` um: `useFavoritesStore((state) => state.favoriteIds)`.
4. Klick noch einmal auf einen Favoriten-Button und schau in die Konsole. Jetzt stehen dort zwei Zeilen, und beide nennen **dieselbe** Pflanze: die Karte links, deren Status sich geändert hat, und die Karte rechts, die neu entsteht. Die übrigen geben nichts aus. Nimm den `console.log` danach raus.

## Material

- Selektoren und Rendering: https://zustand.docs.pmnd.rs/learn/guides/prevent-rerenders-with-use-shallow
- Zustand mit TypeScript: https://zustand.docs.pmnd.rs/learn/guides/beginner-typescript

## 🧐 Zum Nachlesen

### Der Fallstrick beim Selektor

Ein Selektor darf bei jedem Render neu entstehen, denn verglichen wird nicht die Funktion, sondern ihr **Rückgabewert**.

Anders sieht es aus, wenn der Selektor selbst etwas Neues baut:

```ts
// Fallstrick: gibt bei jedem Aufruf ein neues Objekt zurück
const { favoriteIds, toggleFavorite } = useFavoritesStore((state) => {
  return {
    favoriteIds: state.favoriteIds,
    toggleFavorite: state.toggleFavorite,
  };
});
```

Das zurückgegebene Objekt ist inhaltlich immer gleich und trotzdem jedes Mal ein anderer Wert. Der Vergleich mit `===` sieht eine Änderung, und die Komponente rendert bei jeder Änderung im Store, also genau wie vorher. Das ist dieselbe Referenz-Identität wie bei den Effekt-Dependencies.

Zwei Lösungen für das Problem:

- **Zwei Aufrufe statt einem**, so wie oben in `PlantCard`. Jeder liefert einen einfachen Wert und wird für sich verglichen.
- **`useShallow`** aus `zustand/shallow`, wenn ein Objekt wirklich nötig ist. Damit vergleicht Zustand die Felder statt der Referenz.

Zustand rät zum ersten Weg, und die Dokumentation nennt ihn "atomic selectors": Wer einzelne Werte auswählt, braucht keinen Vergleich über mehrere Felder und bekommt genau die Renders, die er erwartet.

### Wenn ein Selektor mehrfach gebraucht wird

Der Selektor in `PlantCard` steht direkt im Aufruf. Sobald zwei oder drei Komponenten denselben Ausschnitt brauchen, lohnt es sich, ihn zu benennen und neben den Store zu legen:

```ts
export const selectFavoriteCount = (state: FavoritesStore) =>
  state.favoriteIds.length;
```

Die Komponente schreibt dann `useFavoritesStore(selectFavoriteCount)`. Der Gewinn liegt nicht beim Rendern, das bleibt gleich, sondern beim Pflegen: Der Ausschnitt ist einmal beschrieben, hat einen Namen und ändert sich an einer Stelle, wenn der Store umgebaut wird.

Braucht der Selektor selbst einen Wert von außen, etwa die Id einer Pflanze, wird daraus eine Funktion, die eine Funktion zurückgibt:

```ts
export const selectIsFavorite = (id: string) => (state: FavoritesStore) =>
  state.favoriteIds.includes(id);
```

`selectIsFavorite("3")` liefert dann den fertigen Selektor für die Pflanze mit der Id 3.
