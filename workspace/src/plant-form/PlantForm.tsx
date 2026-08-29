import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Control, Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import IntervalSelector from "./IntervalSelector.tsx";

// 🔎 Zeigen: eine Meldung weglassen, dann steht dort der englische Standardtext
//    von zod. Die Texte gehören zum Schema und nicht ins Formular.
const NewPlantSchema = z.object({
  name: z.string().nonempty("Bitte gib der Pflanze einen Namen"),
  location: z.string().nonempty("Bitte gib an, wo die Pflanze steht"),
  wateringInterval: z
    .number()
    .min(1, "Gegossen wird mindestens jeden Tag")
    .max(200, "So lange hält das keine Pflanze aus"),
});

type NewPlantFormState = z.infer<typeof NewPlantSchema>;

const ProblemsSchema = z.array(z.object({ error: z.string() }));

export default function PlantForm() {
  // 🔎 Zeigen: den Typ weglassen, dann nimmt register jeden Feldnamen an, auch
  //    einen vertippten.
  // 🔎 Erzählen: der Resolver ist die ganze Verbindung zwischen zod und React
  //    Hook Form. Ohne ihn kennt das Formular die Regeln des Schemas nicht.
  const form = useForm<NewPlantFormState>({
    resolver: zodResolver(NewPlantSchema),
    defaultValues: { name: "", location: "", wateringInterval: 1 },
  });

  const { errors } = form.formState;

  const queryClient = useQueryClient();

  const {
    mutate: addPlant,
    isPending,
    isSuccess,
  } = useMutation({
    async mutationFn(newPlant: NewPlantFormState) {
      const response = await fetch("http://localhost:7200/api/plants", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(newPlant),
      });

      if (!response.ok) {
        // 🔎 Fallstrick: im Rumpf steht ein Array von Meldungen und nicht eine
        //    einzelne.
        const problems = ProblemsSchema.parse(await response.json());
        throw new Error(problems.map((problem) => problem.error).join(" "));
      }
    },

    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["plants"] });
      form.reset();
    },

    // 🔎 Erzählen: die Meldung des Backends geht ins Namensfeld, denn dort
    //    steht der Wert, den es abgelehnt hat. React Hook Form nimmt sie über
    //    setError genauso an wie eine Meldung aus dem Schema.
    onError(error) {
      form.setError("name", { message: error.message });
    },
  });

  /* eslint-disable react-hooks/refs -- Der Zähler liest und schreibt beim
   * Rendern, und genau das verbietet die Regel. Hier ist es der Zweck der
   * Sache, denn wir wollen jeden einzelnen Render sehen. */
  const renderCount = useRef(0);
  renderCount.current++;
  const renders = renderCount.current;
  /* eslint-enable react-hooks/refs */

  const onSubmit = (newPlant: NewPlantFormState) => {
    addPlant(newPlant);
  };

  return (
    // 🔎 Erzählen: handleSubmit hängt am form-Element und nicht am Knopf. Es
    //    hält das Neuladen auf und ruft onSubmit mit den Werten des Formulars.
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* 🔎 Zeigen: die DevTools von React Hook Form. Sie zeigen je Feld den
          Wert, den touched-Stand und den Fehler, ohne einen console.log. */}
      <DevTool control={form.control} />

      {/* 🔎 Zeigen: der Zähler läuft jetzt wieder mit, sobald ein Feld einen
          Fehler hat. Fehler sind Zustand, und Zustand rendert. */}
      <div className={"RenderCounter"}>Formular gerendert: {renders}×</div>

      <div className={"FormControl"}>
        <label htmlFor={"name"}>Name der Pflanze</label>
        {/* 🔎 Erzählen: register gibt name, onChange, onBlur und ref zurück,
            aber kein id. Das Verknüpfen mit dem Label bleibt unsere Aufgabe. */}
        <input
          id={"name"}
          className={errors.name && "error"}
          {...form.register("name")}
        />
        {errors.name && (
          <p className={"error-message"}>{errors.name.message}</p>
        )}
      </div>
      <div className={"FormControl"}>
        <label htmlFor={"location"}>Standort</label>
        <input
          id={"location"}
          className={errors.location && "error"}
          {...form.register("location")}
        />
        {errors.location && (
          <p className={"error-message"}>{errors.location.message}</p>
        )}
      </div>

      {/* 🔎 Erzählen: der IntervalSelector kennt kein register. Er arbeitet mit
          interval und onIntervalChange, und der Controller übersetzt dazwischen. */}
      <div className={"FormControl"}>
        <Controller
          control={form.control}
          name={"wateringInterval"}
          // 🔎 Erzählen: render ist eine Render Prop. Die Bibliothek führt
          //    den Wert, das Aussehen bestimmt der Aufrufer.
          //    field hält Wert und Handler, fieldState den Fehler dazu.
          render={({ field, fieldState }) => (
            <>
              <IntervalSelector
                interval={field.value}
                onIntervalChange={field.onChange}
              />
              {fieldState.error && (
                <p className={"error-message"}>{fieldState.error.message}</p>
              )}
            </>
          )}
        />
      </div>

      <PlantPreview control={form.control} />

      <div className={"FormButtons"}>
        {/* 🔎 Zeigen: shouldValidate an setValue hängen, dann verschwindet eine
            Fehlermeldung sofort statt erst beim nächsten Abschicken. */}
        <button
          type={"button"}
          className={"secondary"}
          onClick={() => {
            form.setValue("name", "Grüne Monstera");
            form.setValue("location", "Wohnzimmer");
          }}
        >
          Beispiel ausfüllen
        </button>
        <button type={"submit"} className={"primary"} disabled={isPending}>
          Pflanze hinzufügen 🌱
        </button>
      </div>

      {isSuccess && <p className={"success-message"}>Pflanze angelegt 🌿</p>}
    </form>
  );
}

type PlantPreviewProps = {
  control: Control<NewPlantFormState>;
};

function PlantPreview({ control }: PlantPreviewProps) {
  // 🔎 Zeigen: erst form.watch() oben im Formular und die Werte direkt dort
  //    anzeigen. Der Zähler des Formulars läuft dann bei jedem Zeichen mit.
  // 🔎 Erzählen: useWatch abonniert die Felder in dieser Komponente. Nur sie
  //    rendert neu, das Formular darüber bleibt stehen.
  const [name, location, wateringInterval] = useWatch({
    control,
    name: ["name", "location", "wateringInterval"],
  });

  return (
    <div className={"space-y-1 rounded-lg bg-green-50 p-4 text-sm"}>
      <div>Name: {name || "noch offen"}</div>
      <div>Standort: {location || "noch offen"}</div>
      <div>Gießen: alle {wateringInterval} Tage</div>
    </div>
  );
}
