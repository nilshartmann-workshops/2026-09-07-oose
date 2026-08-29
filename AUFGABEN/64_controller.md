# Controller: eine eigene Komponente ins Formular hängen

**Keine Übung**, das schauen wir uns gemeinsam an.

## Dateien

- `src/plant-form/PlantForm.tsx`
- `src/plant-form/IntervalSelector.tsx` (nur lesen)

## Worum es geht

Das Gießintervall fehlt dem Formular noch. Dafür liegt der `IntervalSelector` bereit, eine eigene Komponente mit einem Zahlenfeld und drei Knöpfen für „täglich", „wöchentlich" und „alle zwei Wochen". Wir hängen sie ins Formular, und zwar so, dass React Hook Form ihren Wert kennt und zod ihn prüft.

## Schritte

### 1. Die Komponente ansehen

Zuerst ein Blick in `IntervalSelector.tsx`:

```ts
type IntervalSelectorProps = {
  interval?: number;
  onIntervalChange(newInterval: number): void;
};
```

Damit passt sie nicht zu `register`. Was `register` zurückgibt, sind `name`, `onChange`, `onBlur` und `ref`, also die Attribute eines `input`. Der `IntervalSelector` hat davon keines: Er will einen Wert und eine Funktion, und er gibt eine Zahl heraus und kein Event.

Das ist der Normalfall, sobald eine Komponentenbibliothek im Spiel ist (Datumsauswahl, Combobox, Schieberegler, Editor). Für genau diesen Fall gibt es den `Controller`.

### 2. Das Schema erweitern

Dazu kommt `wateringInterval`, eine Zahl mit einer Meldung für beide Grenzen:

```ts
wateringInterval: z.number().min(1, "...").max(200, "..."),
```

Die Obergrenze ist die des Backends. Der Startwert in `defaultValues` gehört dazu, sonst hat das Feld keinen.

### 3. Den Controller einbauen

```tsx
<Controller
  control={form.control}
  name={"wateringInterval"}
  render={({ field, fieldState }) => (
    // hier die eigene Komponente
  )}
/>
```

`control` kommt aus `useForm` und ist der Draht zum Formular, `name` ist der Feldname aus dem Schema, und `render` ist eine **Render Prop**: eine Funktion als Property, die die Komponente aufruft und der sie dabei ihre Werte hereingibt. Die Bibliothek verwaltet den Wert, wie er aussieht, bestimmt der Aufrufer.

Aus den Parametern von `render` brauchen wir zwei. `field` hält `value`, `onChange`, `onBlur` und `ref`: Der Wert geht an `interval`, die Funktion an `onIntervalChange`. `fieldState` hält den Fehler zu diesem Feld, er steht wie bei den anderen Feldern als `<p className={"error-message"}>` darunter.

> Der `IntervalSelector` bringt keine eigene Stelle für eine Fehlermeldung mit, deshalb steht sie darunter. Wäre die Komponente aus einer Bibliothek, hätte sie meist ein Property dafür, und dann gäbe man ihr `fieldState.error?.message` direkt.

### 4. Was wir uns dabei ansehen

- Ein Klick auf die drei Knöpfe: Steht die neue Zahl im Feld?
- Das Formular abschicken: Steht `wateringInterval` als **Zahl** auf der Konsole und nicht als String?
- Das Zahlenfeld leeren und abschicken: Welche Meldung kommt, und warum diese?
- `500` eintippen: Kommt die andere Meldung?
- Stehen Warnungen auf der Browser-Konsole?

## Material

- `Controller`: https://react-hook-form.com/docs/usecontroller/controller
- `useController`: https://react-hook-form.com/docs/usecontroller
- `control`: https://react-hook-form.com/docs/useform/control

## 🧐 Zum Nachlesen

### Warum es zwei Wege gibt

`register` und `Controller` lösen dieselbe Aufgabe für zwei verschiedene Sorten Komponente.

`register` setzt eine `ref` auf das DOM-Element und liest den Wert später von dort. Das Feld ist **uncontrolled**, es rendert beim Tippen nichts neu, und genau davon lebt React Hook Form. Voraussetzung ist, dass es überhaupt ein DOM-Element gibt, das eine `ref` annimmt.

Eine eigene Komponente hat oft keine solche Stelle. Sie hält ihren Wert als Property und meldet Änderungen über einen Callback, und ihr Wert ist womöglich gar kein String, sondern eine Zahl, ein Datum oder ein Objekt. Für sie führt React Hook Form den Wert selbst mit, gibt ihn als `field.value` heraus und nimmt ihn über `field.onChange` zurück. Dieses eine Feld ist damit **controlled**, und ein `Controller` rendert bei jeder Änderung neu, allerdings nur sich selbst und nicht das ganze Formular.

Die Regel daraus ist einfach: Gibt es ein `input`, `select` oder `textarea`, nimm `register`. Steht dazwischen eine eigene Komponente, nimm den `Controller`.
