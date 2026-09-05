import { queryOptions } from "@tanstack/react-query";

import { PlantSchema } from "../types.ts";

export const plantQueryOptions = (plantId: string) => {
  return queryOptions({
    // 🔎 Erzählen: der Schlüssel beginnt mit "plants", deshalb trifft ihn das
    //    invalidateQueries nach dem Gießen mit.
    queryKey: ["plants", plantId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:7200/api/plants/${plantId}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      return PlantSchema.parse(data);
    },
  });
};
