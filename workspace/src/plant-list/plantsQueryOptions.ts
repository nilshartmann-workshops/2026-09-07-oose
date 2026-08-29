import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { PlantSchema } from "../types.ts";

export const plantsQueryOptions = () => {
  return queryOptions({
    queryKey: ["plants"],
    queryFn: async () => {
      const response = await fetch("http://localhost:7200/api/plants");

      // 🔎 Erzählen: fetch löst bei 404 oder 500 nichts aus, die Antwort kommt
      //    ganz normal an. Ohne diese Zeile ginge die Fehlerseite an zod, und
      //    die Meldung spräche von einem falschen Feld statt vom Backend.
      if (!response.ok) {
        throw new Error(`Loading plants failed with HTTP ${response.status}`);
      }

      const data = await response.json();

      return z.array(PlantSchema).parse(data);
    },
  });
};
