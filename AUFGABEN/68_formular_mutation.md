# Das Formular speichert

## Dateien

- `src/plant-form/PlantForm.tsx`

## Vorbereitung

Das Backend läuft. Die Adresse für diesen Schritt ist `POST http://localhost:7200/api/plants`, und sie erwartet einen JSON-Body mit `name`, `location` und `wateringInterval`.

## Aufgabe

Bisher schreibt das Formular seine Werte auf die Konsole. Schick sie ans Backend, häng die Liste an die Änderung und gib der Nutzerin Rückmeldung. Und dann der interessante Fall: Das Backend kennt eine Regel, die unser Schema nicht kennt, und seine Meldung soll unter dem Feld landen, das sie betrifft.

## Schritte

### 1. Die Mutation

`useMutation` kennst du vom Gießen. Der Unterschied ist, dass die `mutationFn` diesmal ein Argument bekommt, nämlich die Werte des Formulars:

```ts
const { mutate: addPlant } = useMutation({
  async mutationFn(newPlant: NewPlantFormState) {
    // POST
  },
});
```

Ruf `addPlant` in deinem `onSubmit` auf, statt zu loggen. `handleSubmit` gibt dir die geprüften Werte, und die kannst du direkt weiterreichen. Der Request geht wie beim Gießen, samt Statusprüfung.

Leg eine Pflanze an und schau in den Netzwerk-Tab. Sie ist im Backend, aber die Liste weiß noch nichts davon.

### 2. Die Liste nachziehen

Hol dir den `queryClient` und invalidiere im `onSuccess` mit dem groben Schlüssel `["plants"]`, der jede Sortierung im Cache auf einmal trifft. Ruf danach `form.reset()` auf, dann steht das Formular für die nächste Pflanze bereit.

Wechsel auf die Liste. Deine Pflanze ist da.

### 3. Rückmeldung geben

- `isPending` schaltet den Absende-Knopf ab, solange der Request läuft. Zum Ausprobieren häng `?slow=2000` an die URL.
- `isSuccess` zeigt eine Meldung. Dafür gibt es die Klasse `success-message` im Stylesheet.

### 4. Die Meldung des Backends

Leg eine Pflanze mit dem Namen **HÄNGEPFLANZE** an, also in Großbuchstaben. Unser Schema hat nichts dagegen, das Backend schon: Es antwortet mit dem Status 400.

> **Fallstrick:** Im Rumpf steht ein **Array** von Meldungen und nicht eine einzelne, denn das Backend prüft alle Felder und sammelt, was es findet. Jeder Eintrag ist ein Objekt mit dem Feld `error`.

Lies den Rumpf in der Statusprüfung aus und wirf einen `Error` mit den Meldungen darin. Beschreib die Antwort mit zod, so wie an den anderen Systemgrenzen auch. Dann bring die Meldung dorthin, wo sie hingehört. `setError` schreibt einen Fehler in ein Feld, als käme er aus dem Schema:

```ts
onError(error) {
  form.setError("name", { message: error.message });
}
```

Probier es aus. Die Meldung steht unter dem Namensfeld, und das Feld ist rot, ohne dass du für den Fall etwas Eigenes gebaut hättest. Tipp den Namen um, etwa in „Hängepflanze": Die Meldung verschwindet beim Tippen, denn React Hook Form behandelt sie wie jeden anderen Fehler.

## Material

- `useMutation`: https://tanstack.com/query/latest/docs/framework/react/reference/useMutation
- `setError`: https://react-hook-form.com/docs/useform/seterror
- Fehler aus dem Backend in Formularfeldern: https://react-hook-form.com/docs/useform/seterror#rules
