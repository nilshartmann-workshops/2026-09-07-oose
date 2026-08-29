# React Hook Form: das Formular ohne State

## Dateien

- `src/routes/neu.tsx` (legst du neu an)
- `src/App.tsx`
- `src/plant-form/PlantForm.tsx`

## Vorbereitung

Backend und Devserver laufen.

## Aufgabe

Das Formular bekommt zuerst eine eigene Adresse. Danach baust du es auf React Hook Form um: `useForm` hält die Werte, `register` hängt die Felder ein, `handleSubmit` gibt sie beim Abschicken heraus. Gespeichert wird noch nichts, die Werte landen auf der Konsole.

## Schritte

### 1. Das Formular bekommt eine eigene Adresse

Bisher hängt es an einem Reiter, und ein Link darauf lässt sich nicht verschicken. Leg `src/routes/neu.tsx` an, nach dem Muster von `index.tsx`:

```tsx
export const Route = createFileRoute("/neu")({
  component: NewPlantPage,
});
```

`NewPlantPage` rendert eine Überschrift, einen `<Link to={"/"}>` zurück zur Liste und darunter das `<PlantForm />`. Für das Aussehen gibt es die Klasse `NewPlantPage` in `index.css`, sie erwartet ein `<header>` um Überschrift und Link.

Nimm danach in `App.tsx` den Reiter „Neue Pflanze" samt seinem Panel heraus und setz über die Reiterleiste einen Link dorthin:

```tsx
<Link to={"/neu"}>Neue Pflanze 🌱</Link>
```

### 2. `useForm` statt der drei `useState`

Beschreib zuerst als Typ, was im Formular steht:

```ts
type NewPlantFormState = {
  name: string;
  location: string;
};
```

Das Intervall lassen wir weg, es kommt später mit einer eigenen Komponente dazu. Nimm den `IntervalSelector` also erst einmal heraus.

Dann legst du das Formular an, und die drei `useState` fliegen raus:

```ts
const form = useForm<NewPlantFormState>({
  defaultValues: { name: "", location: "" },
});
```

> Der Typ ist keine Zierde. Er sorgt dafür, dass `register("nmae")` ein Fehler ist und nicht ein unbemerktes zweites Feld. Lass ihn zum Ausprobieren einmal weg.

### 3. Die Felder registrieren

`form.register("name")` gibt `name`, `onChange`, `onBlur` und `ref` zurück. Das gehört alles ans `input`, dafür gibt es die Spread-Schreibweise:

```tsx
<input {...form.register("name")} />
```

`value` und `onChange` von Hand entfallen damit. Mach das für beide Felder.

Ein `id` liefert `register` **nicht**. Das `id` und das `htmlFor` am Label stehen deshalb schon im Formular und bleiben stehen. Prüf danach, dass ein Klick auf „Name der Pflanze" den Cursor ins Feld setzt.

> **Fallstrick:** Schreib neben das Spread kein eigenes `onChange` ans Feld. Das Spread bringt eines mit, deins würde es überschreiben, und React Hook Form bekäme die Eingabe nie zu sehen. Eigene Attribute wie `id` und `className` stören dagegen nicht.

### 4. Abschicken

Der Knopf ist heute ein `type={"button"}` mit `onClick`. Dreh das um:

- Der Knopf wird `type={"submit"}` und verliert seinen Handler.
- Ans `<form>` kommt `onSubmit={form.handleSubmit(onSubmit)}`.
- `onSubmit` bekommt die Werte als Parameter und schreibt sie auf die Konsole.

`handleSubmit` hält das Neuladen der Seite auf, sammelt die Werte ein und ruft erst dann deine Funktion. Füll das Formular aus und drück den Knopf.

### 5. Der Vergleich

Vorher hat jedes Zeichen die ganze Komponente gerendert, denn jedes Zeichen war ein `setState`. Jetzt passiert beim Tippen nichts mehr.

Der Grund sind **uncontrolled** Felder: Der Wert steht im DOM-Element und nicht im State der Komponente, gelesen wird er erst beim Abschicken über die `ref` aus `register`.

### 6. 🧐 Optional (wenn du noch Zeit hast)

- Bau einen zweiten Knopf „Zurücksetzen" mit `form.reset()`. Was passiert mit den Feldern?
- Schick das Formular leer ab. Was steht auf der Konsole? Wer prüft hier gerade die Eingaben?
- `form.formState.isDirty` sagt, ob etwas geändert wurde. Schalt den Absende-Knopf ab, solange das Formular unberührt ist. Warum rendert die Komponente jetzt beim ersten Zeichen wieder?

## Material

- `useForm`: https://react-hook-form.com/docs/useform
- `register`: https://react-hook-form.com/docs/useform/register
- `handleSubmit`: https://react-hook-form.com/docs/useform/handlesubmit
- Controlled und uncontrolled Komponenten: https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components

## 🧐 Zum Nachlesen

### Die Alternativen

**TanStack Form** ist der jüngere Gegenentwurf aus demselben Haus wie Query und Router, von Grund auf typsicher und auch außerhalb von React zu gebrauchen. **Formik** war jahrelang der Standard und ist es in vielen bestehenden Projekten noch, arbeitet aber controlled. Und für ein Formular mit zwei Feldern bleibt `useState` eine ehrliche Antwort.
