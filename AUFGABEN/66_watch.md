# Auf Eingaben reagieren: watch und useWatch

**Keine Übung**, das schauen wir uns gemeinsam an.

## Dateien

- `src/plant-form/PlantForm.tsx`

## Worum es geht

Unter das Formular kommt eine Vorschau, die sich bei jeder Eingabe mitändert. Daran zeigt sich die Kehrseite von React Hook Form: Wer die Werte beim Rendern braucht, holt sich die Renders zurück, die er vorher gespart hat. Wo die Werte abgefragt werden, entscheidet, wen es trifft. Zum Schluss geht es einmal in die andere Richtung, mit `setValue`.

## Schritte

### 1. Die Vorschau als eigene Komponente

`PlantPreview` steht in derselben Datei. Sie bekommt genau eine Property, nämlich `control` aus `useForm`, vom Typ `Control<NewPlantFormState>`. Darin kommen die Werte aus dem Hook:

```ts
const [name, location, wateringInterval] = useWatch({
  control,
  name: ["name", "location", "wateringInterval"],
});
```

Die drei Werte werden angezeigt, und `<PlantPreview control={form.control} />` kommt unter die Felder. Ein getippter Name zeigt es: Die Vorschau ändert sich mit, der Zähler des Formulars steht still. Das Abonnement hängt an der Komponente, die den Hook aufruft, und rendert nur sie.

Denselben Wert liefert `form.watch()` oben im Formular, und dort wäre es weniger Code. Es kostet aber mehr, warum, steht unten.

### 2. Werte setzen

Neben den Absende-Knopf kommt ein zweiter mit der Beschriftung „Beispiel ausfüllen":

```ts
form.setValue("name", "Grüne Monstera");
form.setValue("location", "Wohnzimmer");
```

Ein Druck darauf, und die Felder ändern sich, obwohl sie uncontrolled sind. React Hook Form hat ihre `ref` und schreibt direkt ins DOM-Element.

> **Fallstrick:** Steht schon eine Fehlermeldung unter dem Feld, bleibt sie stehen, obwohl der Wert jetzt gültig ist. `setValue` prüft nicht von selbst. Erst `{ shouldValidate: true }` als drittes Argument räumt sie weg.

### 3. 🧐 Zum Ausprobieren hinterher

- Der `Controller` aus dem letzten Schritt ist im Grunde dasselbe: Er abonniert ein Feld und rendert nur sich. Warum rendert das Formular trotzdem mit, sobald ein Feld **ungültig** wird?
- `useWatch` nimmt statt der Liste auch einen einzelnen Namen oder gar keinen. Was ändert sich, wenn du `name` weglässt?
- `form.getValues()` gibt dir die Werte ebenfalls, ganz ohne Abonnement. Wann willst du das, und was passiert, wenn du damit rendern willst?
- Bau die Vorschau so um, dass sie die Anzahl der Tage bis zum nächsten Gießen zeigt. `getDaysUntilWatering` in `src/shared/date-utils.ts` gibt es schon.
- Neben `setValue` gibt es `reset`. Was ist der Unterschied, wenn du hinterher auf `formState.isDirty` schaust?

## Material

- `watch`: https://react-hook-form.com/docs/useform/watch
- `useWatch`: https://react-hook-form.com/docs/usewatch
- `setValue`: https://react-hook-form.com/docs/useform/setvalue
- `getValues`: https://react-hook-form.com/docs/useform/getvalues

## 🧐 Zum Nachlesen

### Warum es überhaupt zwei gibt

React Hook Form hält die Werte außerhalb von React, im DOM und in einem eigenen Speicher. Deshalb kostet das Tippen nichts. Sobald du einen Wert **anzeigen** willst, muss React davon erfahren, und das heißt rendern.

Die Frage ist nur, wer rendert. `watch` ist eine Methode am Formular, also gehört das Abonnement der Komponente, in der `useForm` steht, und das ist die größte, die es gibt. `useWatch` ist ein Hook, also gehört das Abonnement der Komponente, die ihn aufruft, und die kannst du so klein schneiden, wie du willst. Das ist dasselbe Muster wie bei den Selektoren im Store: nicht alles nach oben holen und nach unten reichen, sondern dort abonnieren, wo es gebraucht wird.

### Die Werte lesen, ohne zu rendern

Manchmal brauchst du einen Wert nicht auf dem Bildschirm, sondern in einem Handler. Dafür gibt es `form.getValues()`. Es gibt den aktuellen Stand zurück und abonniert nichts. Beim Rendern ist es deshalb die falsche Wahl: Der Wert stimmt in dem Moment, aber niemand sagt der Komponente Bescheid, wenn er sich ändert.
