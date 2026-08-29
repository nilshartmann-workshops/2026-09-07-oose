# Ein Formular testen

## Dateien

- `src/plant-form/PlantForm.browsertest.tsx` (anlegen)

## Vorbereitung

Beende das Backend, aus demselben Grund wie vorhin: MSW reicht jede Anfrage durch, für die kein Handler passt.

## Aufgabe

Du testest das Formular, so wie es die Nutzerin bedient: Felder füllen, abschicken, Meldung lesen. Alles, was die Anwendung ausmacht, läuft dabei wirklich, also React Hook Form, das zod-Schema, die Mutation und `fetch`. Getauscht wird allein das Backend.

## Schritte

### 1. Aufsetzen

Leg `src/plant-form/PlantForm.browsertest.tsx` an. Anders als die Startseite kommt `PlantForm` ohne Router aus, ein `QueryClientProvider` genügt ihm:

```tsx
render(
  <QueryClientProvider client={createQueryClient()}>
    <PlantForm />
  </QueryClientProvider>,
);
```

Richte MSW wieder ein, diesmal **ohne** Handler in `setupWorker()`. Was das Backend antwortet, entscheidet jeder Test für sich mit `worker.use()`.

### 2. Der gute Fall

Lass deinen Handler mit Status 201 antworten und eine kurze Verzögerung einlegen. Dann:

1. Füll die beiden Textfelder. Such sie mit `getByLabelText`, denn `label` und `input` sind im Formular verbunden.
2. Klick auf den Knopf. Such ihn über seine Rolle, nicht über einen Klassennamen. Für ihn lohnt sich eine Variable, du brauchst ihn zweimal.
3. Prüf, dass der Knopf gesperrt ist, solange die Anfrage läuft.
4. Prüf, dass danach die Erfolgsmeldung dasteht.

### 3. Der abgelehnte Name

Das Backend nimmt einen Namen aus lauter Großbuchstaben nicht an. Bau diesen Fall nach und prüf, dass die Meldung des Backends unter dem Namensfeld erscheint.

> **Fallstrick:** Es antwortet mit einem **Array** von Meldungen und nicht mit einer einzelnen, also etwa `[{ error: "..." }]` bei Status 400. Antwortet dein Handler mit einem einzelnen Objekt, scheitert schon das Lesen der Antwort, und du siehst eine Meldung von zod statt der des Backends.

### 4. 🧐 Optional (wenn du noch Zeit hast)

- Nimm die Verzögerung aus dem Handler heraus. Was macht die Prüfung auf den gesperrten Knopf, und warum?
- Der Test kennt die Adresse des Backends und den Aufbau seiner Fehlerantwort. Ist das ein Problem? Was müsstest du ändern, wenn das Backend seine Meldungen anders verpackt?

## Material

- Locators: https://vitest.dev/guide/browser/locators
- `worker.use()`: https://mswjs.io/docs/api/setup-worker/use
- Statuscodes und Rumpf einer Antwort: https://mswjs.io/docs/api/http-response
- `vi.mock()`: https://vitest.dev/api/vi.html#vi-mock
- Label und Eingabefeld verbinden: https://react.dev/reference/react-dom/components/input#providing-a-label-for-an-input

## 🧐 Zum Nachlesen

### Auf welcher Ebene man schneidet

Dieser Test tauscht das Backend, und das ist die tiefste Stelle, an der man schneiden kann: Alles darüber läuft echt. Fällt bei einem Umbau eines der beteiligten Teile um, wird der Test rot. Das ist der Zustand, den man will.

Man kann auch weiter oben schneiden, also mitten durch die Anwendung. Eine React-Komponente ist eine Funktion, und ein Modul mit einer Funktion darin lässt sich ersetzen:

```ts
//                der Pfad muss genau so lauten wie der, mit dem du
//           v--  die Komponente importieren würdest
vi.mock("./PlantCard.tsx", () => ({
  // "default", weil PlantCard ein Default-Export ist.
  default({ name }: { name: string }) {
    return <article>{name}</article>;
  },
}));
```

So ein Mock ist verlockend, wenn eine Komponente viel Infrastruktur braucht. `PlantCardList` etwa rendert für jede Pflanze eine `PlantCard`, und mehr tut sie nicht. Die echte `PlantCard` bräuchte dafür einen `QueryClient`, den Router und den Favoriten-Store, und das im Test aufzubauen wäre viel Aufwand für eine Frage, die damit nichts zu tun hat.

Der Mock kostet aber etwas. Ändert sich die Signatur von `PlantCard`, ändert sich der Ersatz nicht mit, und der Test bleibt grün, obwohl die Anwendung kaputt ist. Er ist eine zweite Wahrheit über dieselbe Schnittstelle.

Daraus folgt eine Reihenfolge. Nimm zuerst die Ebene, auf der du ohne Mock auskommst, also HTTP. Erst wenn das zu langsam oder zu umständlich wird, schneidest du weiter oben. Und wo du schneidest, halte den Ersatz so klein, dass jeder auf einen Blick sieht, was er nicht kann.
