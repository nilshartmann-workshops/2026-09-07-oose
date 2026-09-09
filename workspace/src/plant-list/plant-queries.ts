import { queryOptions } from "@tanstack/react-query";
import { PlantSchema } from "../types.ts";

export const getPlantsQueryOptions = (orderBy: "id" | "lastWatered" = "id") => queryOptions({
  queryKey: ["plants", orderBy],
  async queryFn() {
    //
    const response = await fetch("http://localhost:7200/api/plants?slow=100&orderBy=" + orderBy); // HTTP GET

    if (!response.ok) {
      throw new Error("Ging nicht :-(");
    }

    const maybePlants = await response.json();
    const plants = PlantSchema.array().parse(maybePlants);

    return plants;
  },
  // staleTime: 20 * 1000
});

export const plantQueryOptions = (plantId: string) => {
  return queryOptions({
    queryKey: ["plants", plantId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:7200/api/plants/${plantId}?slow=2000`,
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      return PlantSchema.parse(data);
    },
  });
};
