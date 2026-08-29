import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// 🔎 Zeigen: eine Meldung weglassen, dann steht dort der englische Standardtext
//    von zod. Die Texte gehören zum Schema und nicht ins Formular.
const NewPlantSchema = z.object({
  name: z.string().nonempty("Bitte gib der Pflanze einen Namen"),
  location: z.string().nonempty("Bitte gib an, wo die Pflanze steht"),
});

type NewPlantFormState = z.infer<typeof NewPlantSchema>;

export default function PlantForm() {
  // 🔎 Zeigen: den Typ weglassen, dann nimmt register jeden Feldnamen an, auch
  //    einen vertippten.
  // 🔎 Erzählen: der Resolver ist die ganze Verbindung zwischen zod und React
  //    Hook Form. Ohne ihn kennt das Formular die Regeln des Schemas nicht.
  const form = useForm<NewPlantFormState>({
    resolver: zodResolver(NewPlantSchema),
    defaultValues: { name: "", location: "" },
  });

  const { errors } = form.formState;

  /* eslint-disable react-hooks/refs -- Der Zähler liest und schreibt beim
   * Rendern, und genau das verbietet die Regel. Hier ist es der Zweck der
   * Sache, denn wir wollen jeden einzelnen Render sehen. */
  const renderCount = useRef(0);
  renderCount.current++;
  const renders = renderCount.current;
  /* eslint-enable react-hooks/refs */

  const onSubmit = (newPlant: NewPlantFormState) => {
    console.log("Neue Pflanze:", newPlant);
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

      <div className={"FormButtons"}>
        <button type={"submit"} className={"primary"}>
          Pflanze hinzufügen 🌱
        </button>
      </div>
    </form>
  );
}
