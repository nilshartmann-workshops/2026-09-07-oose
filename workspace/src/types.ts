import { z } from "zod";

export const PlantSchema = z.object({
  id: z.string(),
  name: z.string().nonempty(),
  location: z.string().nonempty(),
  wateringInterval: z.number().min(1),
  lastWatered: z.iso.date().optional(),
});

export type Plant = z.infer<typeof PlantSchema>;
