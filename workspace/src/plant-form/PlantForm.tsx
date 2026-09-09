import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {z} from "zod";
import IntervalSelector from "./IntervalSelector.tsx";
import { zodResolver } from "@hookform/resolvers/zod";

// type PlantFormState = {
//   name: string;
//   location: string;
// }

const PlantFormStateSchema = z.object({
  name: z.string().nonempty("Bitte Pflanzennamen eingeben"),
  location: z.string().nonempty(),
  wateringInterval: z.number().min(1),
  pflegehinweise: z.string().array()
})

type PlantFormState = z.infer<typeof PlantFormStateSchema>



export default function PlantForm() {
  // const [name, setName] = useState("");
  // const [location, setLocation] = useState("");
  // const [wateringInterval, setWateringInterval] = useState(1);

  const form = useForm({
    resolver: zodResolver(PlantFormStateSchema),
    defaultValues: {
      location: "Hier",
      pflegehinweise: ["Gießen!"]
    }
  });

  // const x = useFieldArray({
  //   control: form.control,
  //   name: "pflegehinweise",
  // });

  const [location] = form.watch(["location"]);

  console.log("Rendering PlantForm", new Date().toLocaleTimeString());

  const onError = (err: any) => {
    console.log("Errors in formular", err);
  }

  const onSaveClick = (value: PlantFormState) => {
    console.log("Value in form", value);
  };

  // Kontrollierte Komponente (controlled component)
  // const [art, setArt] = useState("")

  return (
    <form onSubmit={form.handleSubmit(onSaveClick, onError)}>
      <div className={"FormControl"}>
        <label htmlFor={"name"}>Name der Pflanze</label>
        <input
          id={"name"}
          {...form.register("name")}
        />
        <div className={"error-message"}>{form.formState.errors.name?.message}</div>
      </div>

      <div className={"FormControl"}>
        <label htmlFor={"location"}>Standort</label>
        <input
          id={"location"}
          {...form.register("location")}
        />
        <p>Aktueller Standort: {location}</p>
        <div className={"error-message"}>{form.formState.errors.location?.message}</div>
      </div>

      <div className={"FormControl"}>
        <Controller
          control={form.control}
          name={"wateringInterval"}
          render={ opts => {
            return <IntervalSelector
              interval={opts.field.value}
              onIntervalChange={(newWateringInterval) =>
                opts.field.onChange(newWateringInterval)
              }
            />
          }}
        />
      </div>

      <div className={"FormButtons"}>
        <button
          className={"primary"}
        >
          Pflanze hinzufügen 🌱
        </button>
      </div>
    </form>
  );
}
