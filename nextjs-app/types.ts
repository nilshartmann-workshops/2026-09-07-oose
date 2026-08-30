import { z } from "zod";

export const PlantSchema = z.object({
  id: z.string(),
  name: z.string().nonempty(),
  location: z.string().nonempty(),
  wateringInterval: z.number().min(1),
  lastWatered: z.iso.date().optional(),
});

export type Plant = z.infer<typeof PlantSchema>;

// 🔎 Erzählen: dasselbe Schema prüft gleich zwei Dinge. Im Browser die Eingabe
//    des Formulars, auf dem Server die Nutzlast des Endpunkts.
export const NewPlantSchema = z.object({
  name: z.string().nonempty("Bitte gib der Pflanze einen Namen"),
  location: z.string().nonempty("Bitte gib an, wo die Pflanze steht"),
  wateringInterval: z
    .number()
    .min(1, "Gegossen wird mindestens jeden Tag")
    .max(200, "So lange hält das keine Pflanze aus"),
});

export type NewPlant = z.infer<typeof NewPlantSchema>;
