# Validierung mit zodResolver

## Dateien

- `src/plant-form/PlantForm.tsx`

## Aufgabe

Das Formular schickt bisher alles ab, auch zwei leere Felder. Beschreib die Regeln mit zod und häng das Schema über den `zodResolver` an React Hook Form. Wer ein Feld leer lässt, bekommt eine Meldung darunter und ein rot umrandetes Feld.

## Schritte

### 1. Das Schema schreiben

zod kennst du schon von der Systemgrenze, wo es die Antwort des Backends prüft. Hier prüft es die Eingabe der Nutzerin, und der Aufbau ist derselbe:

```ts
const NewPlantSchema = z.object({
  name: z.string().nonempty("..."),
  location: z.string().nonempty("..."),
});
```

Der String im `nonempty` ist die Meldung, die die Nutzerin liest. Schreib sie als Satz, nicht als Feldnamen, und lass sie testweise einmal weg, um zu sehen, was zod stattdessen sagt.

Den TypeScript-Typ aus dem letzten Schritt kannst du löschen, denn das Schema kennt ihn schon: `type NewPlantFormState = z.infer<typeof NewPlantSchema>;`

### 2. Den Resolver einhängen

```ts
const form = useForm<NewPlantFormState>({
  resolver: zodResolver(NewPlantSchema),
  defaultValues: { name: "", location: "" },
});
```

`zodResolver` kommt aus `@hookform/resolvers/zod` und ist ein Übersetzer: React Hook Form ruft ihn mit den Werten auf, er lässt zod prüfen und gibt die Fehler in der Form zurück, die das Formular versteht.

Schick das Formular jetzt leer ab. Auf der Konsole steht nichts mehr, denn `onSubmit` läuft nur, wenn alles gültig ist.

### 3. Die Fehler anzeigen

Die Fehler stehen in `form.formState.errors`, einem Objekt mit denselben Feldnamen wie das Schema. Zeig unter jedem Feld die Meldung an und gib dem Feld selbst die Klasse `error`, dann wird der Rahmen rot:

```tsx
{
  errors.name && <p className={"error-message"}>{errors.name.message}</p>;
}
```

> **Fallstrick:** Vor dem ersten Abschicken ist `errors` leer, `errors.name` also `undefined`. Die Prüfung davor ist deshalb nicht nur fürs Anzeigen da, ohne sie meldet schon TypeScript einen Fehler.

Probier es aus: leer abschicken, dann tippen. Die Meldung verschwindet beim Tippen wieder.

### 4. Wann geprüft wird

React Hook Form hat beim ersten Mal erst beim Abschicken geprüft, danach bei jeder Eingabe. Das ist die Voreinstellung, und sie ist gut gewählt: Wer noch tippt, will nicht bei jedem Buchstaben gerügt werden, wer einen Fehler ausbessert, will sofort sehen, dass es passt.

Steuern kannst du das mit `mode: "onChange"` (oder `"onBlur"`, `"onTouched"`, `"all"`) an `useForm`. Stell es auf `"onChange"` und tipp in ein leeres Feld: Die Meldung erscheint jetzt beim ersten Zeichen und nicht erst beim Abschicken.

### 5. 🧐 Optional (wenn du noch Zeit hast)

- `handleSubmit` nimmt einen **zweiten** Handler, der läuft, wenn die Prüfung fehlschlägt: `form.handleSubmit(onSubmit, (errors) => console.log(errors))`. Praktisch, wenn ein Formular scheinbar nichts tut.
- Wir haben ein eigenes Schema geschrieben, obwohl `PlantSchema` fast dieselben Felder hat. Mit `PlantSchema.omit({ id: true })` ginge es auch. Was spricht dagegen? (Tipp: Welche Meldungen stünden dann da, und was passiert, wenn das Backend ein Feld dazubekommt?)
- Ergänz eine Regel, die zwei Felder zugleich betrifft, etwa mit `.refine(...)` am ganzen Objekt. Wo steht diese Meldung dann in `errors`?
- Schalt den Absende-Knopf ab, solange `form.formState.isValid` falsch ist. Warum ist das mit der Voreinstellung für `mode` keine gute Idee?

## Material

- `zodResolver`: https://github.com/react-hook-form/resolvers#zod
- `formState`: https://react-hook-form.com/docs/useform/formstate
- `useForm` mit `mode`: https://react-hook-form.com/docs/useform#mode
- Die DevTools von React Hook Form: https://react-hook-form.com/dev-tools
- zod Fehlermeldungen anpassen: https://zod.dev/error-customization

## 🧐 Zum Nachlesen

### Zwei Schemas für dieselbe Pflanze

In `types.ts` steht `PlantSchema` und beschreibt, was das Backend liefert. Hier steht `NewPlantSchema` und beschreibt, was die Nutzerin eingibt. Das sieht nach einer Verdopplung aus, ist aber keine.

Die beiden haben verschiedene Felder, denn eine neue Pflanze hat noch keine `id` und `lastWatered` gibt es im Formular gar nicht. Sie haben verschiedene Texte, denn die Meldung an der Systemgrenze liest eine Entwicklerin im Log und die im Formular eine Nutzerin auf dem Bildschirm. Und sie ändern sich aus verschiedenen Gründen: Das eine folgt dem Backend, das andere der Oberfläche.

Wer beide über `omit` oder `pick` aneinanderbindet, spart ein paar Zeilen und handelt sich eine Kopplung ein, die man erst bemerkt, wenn sie stört.

### Das Backend prüft trotzdem

Die Prüfung im Browser ist eine Freundlichkeit gegenüber der Nutzerin und keine Sicherheit. Wer die Anfrage selbst schickt, umgeht sie ohne Mühe, und deshalb prüft das Backend dieselben Daten noch einmal. Es prüft sogar mehr als wir, denn es hat Regeln, die unser Schema nicht kennt. Was dann passiert, sehen wir uns am Ende dieses Blocks an.
