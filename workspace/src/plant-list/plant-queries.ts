import { queryOptions } from "@tanstack/react-query";
import { PlantSchema } from "../types.ts";

export const getPlantsQueryOptions = () => queryOptions({
  queryKey: ["plants"],
  async queryFn() {
    //
    const response = await fetch("http://localhost:7200/api/plants?slow=100"); // HTTP GET

    if (!response.ok) {
      throw new Error("Ging nicht :-(");
    }

    const maybePlants = await response.json();
    const plants = PlantSchema.array().parse(maybePlants);

    return plants;
  },
  // staleTime: 20 * 1000
});
