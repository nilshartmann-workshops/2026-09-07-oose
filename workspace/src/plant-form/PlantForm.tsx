import { useRef } from "react";
import { useForm } from "react-hook-form";

type NewPlantFormState = {
  name: string;
  location: string;
};

export default function PlantForm() {
  // 🔎 Zeigen: den Typ weglassen, dann nimmt register jeden Feldnamen an, auch
  //    einen vertippten.
  const form = useForm<NewPlantFormState>({
    defaultValues: { name: "", location: "" },
  });

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
      <div className={"RenderCounter"}>Formular gerendert: {renders}×</div>

      <div className={"FormControl"}>
        <label htmlFor={"name"}>Name der Pflanze</label>
        {/* 🔎 Erzählen: register gibt name, onChange, onBlur und ref zurück,
            aber kein id. Das Verknüpfen mit dem Label bleibt unsere Aufgabe. */}
        <input id={"name"} {...form.register("name")} />
      </div>
      <div className={"FormControl"}>
        <label htmlFor={"location"}>Standort</label>
        <input id={"location"} {...form.register("location")} />
      </div>

      <div className={"FormButtons"}>
        <button type={"submit"} className={"primary"}>
          Pflanze hinzufügen 🌱
        </button>
      </div>
    </form>
  );
}
