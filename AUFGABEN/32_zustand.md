# Externes State-Management mit Zustand

## Dateien

- `src/plant-list/useFavoritesStore.ts` (legst du neu an)
- `src/plant-list/FavoritePlantList.tsx` (legst du neu an)
- `src/plant-list/PlantCard.tsx`
- `src/plant-list/PlantList.tsx`

## Aufgabe

Pflanzen sollen sich als Favorit markieren lassen. Der Favoritenstatus ist globaler Zustand: Die `PlantCard` schaltet ihn um, und eine zweite Liste zeigt nur die markierten Pflanzen, ohne dass zwischen den beiden etwas durchgereicht wird. Dafür nehmen wir die Bibliothek [Zustand](https://zustand.docs.pmnd.rs/).

## Schritte

1. Leg `src/plant-list/useFavoritesStore.ts` an:
   - `import { create } from "zustand";`
   - Ein Typ für den Store: `favoriteIds: string[]` und `toggleFavorite: (id: string) => void`
   - `export const useFavoritesStore = create<FavoritesStore>()((set) => ({ … }))`
   - 🧐 Warum legen wir nur die Ids in den Store und nicht die ganzen `Plant`-Objekte?

   > **Zur zweiten Klammer:** `create<T>()(…)` ist ein reines TypeScript-Detail. Man kann nicht nur *einen* Typparameter angeben und den Rest ableiten lassen, deshalb wird der Aufruf in zwei zerlegt. Ohne Zusatzpakete geht auch `create<T>(…)`, sobald aber eine Middleware dazukommt (`persist`, `devtools`, `immer`), braucht man diese Form.
2. Schreib die eigentliche Logik als **normale Funktion**, oberhalb des Stores:

   ```ts
   function toggle(ids: string[], id: string): string[] {
     return ids.includes(id) ? ids.filter((fId) => fId !== id) : [...ids, id];
   }
   ```

   Das ist reines JavaScript und hat mit Zustand nichts zu tun. Genau deshalb steht es getrennt: Man kann es einzeln lesen, testen und erklären.

   > **Fallstrick:** Immer ein **neues** Array zurückgeben (`filter`, Spread), niemals `push` auf das bestehende. Zustand erkennt eine Änderung am Referenzvergleich, genau wie React.
3. Verdrahte die Funktion im Store:

   ```ts
   toggleFavorite: (id) => {
     set((state) => ({ favoriteIds: toggle(state.favoriteIds, id) }));
   },
   ```

   Was du an `set` zurückgibst, ist ein **Teil**-Zustand: Zustand mischt ihn flach in den Store, deshalb genügt `{ favoriteIds: … }` auch dann, wenn der Store später mehr Felder hat.
4. Gib der `PlantCard` einen Favoriten-Button:
   - Die Property `id` ist schon da, `PlantCardList` reicht sie mit. Der `key` daneben reicht **nicht**, denn der ist nur für React und kommt in der Komponente gar nicht an.
   - Lies den Zustand fürs Erste bequem aus: `const { favoriteIds, toggleFavorite } = useFavoritesStore();`
   - Zeig je nach Status "💚 Favorit" oder "🤍 Favorit" an und ruf beim Klick `toggleFavorite(id)` auf. Der Button gehört ins `<header>` der Karte.
5. Bau die `FavoritePlantList`. Sie bekommt als Property `plants: Plant[]`, also **alle** Pflanzen, liest die `favoriteIds` aus dem Store und zeigt die gefilterte Liste mit `PlantCardList` an. Ist nichts markiert, steht dort ein freundlicher Satz.
6. Häng sie in `PlantList` neben die bestehende Liste, `App` fasst du dafür nicht an:

   ```tsx
   <div className={"PlantList"}>
     <div>
       <h2>Alle Pflanzen</h2>
       <PlantCardList plants={allPlants} />
     </div>
     <FavoritePlantList plants={allPlants} />
   </div>
   ```

   Probier es aus: Ein Klick in der linken Liste ändert sofort die rechte. Zwischen den beiden gibt es keine Verbindung außer dem Store, also keinen Provider, keine Properties und keinen gemeinsamen Vater mit State.
7. Zum Schluss machen wir sichtbar, wer alles neu rendert. Häng vorübergehend `console.log("PlantCard rendert:", name);` an den Anfang von `PlantCard`, öffne die Konsole und klick auf **einen** Favoriten-Button.
   - **Alle** Karten rendern, auch die nicht betroffenen. `useFavoritesStore()` ohne Argument abonniert den kompletten Store.
   - Lass den `console.log` stehen, in der nächsten Übung räumen wir das auf.

## Material

- Zustand, Einführung: https://zustand.docs.pmnd.rs/learn/getting-started/introduction
- Zustand mit TypeScript (dort steht auch, warum `create<T>()(…)`): https://zustand.docs.pmnd.rs/learn/guides/advanced-typescript
- Middleware `immer` für tief verschachtelten Zustand: https://zustand.docs.pmnd.rs/reference/middlewares/immer
- Warum rendert React neu? https://react.dev/learn/render-and-commit
