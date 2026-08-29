import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { HttpError } from "../shared/HttpError.ts";
import { PlantSchema } from "../types.ts";

// 🔎 Erzählen: die erlaubten Werte stehen hier als Union und in der Route als
//    zod-Enum. Beide folgen dem Backend und nicht einander, deshalb teilen sie
//    sich keinen Typ.
export const plantsQueryOptions = (orderBy: "id" | "lastWatered") => {
  return queryOptions({
    // 🔎 Zeigen: orderBy weglassen, dann bleibt die alte Sortierung im Cache
    //    stehen und die Liste ändert sich beim Umschalten nicht.
    queryKey: ["plants", { orderBy }],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:7200/api/plants?orderBy=${orderBy}`,
      );

      // 🔎 Erzählen: fetch löst bei 404 oder 500 nichts aus, die Antwort kommt
      //    ganz normal an. Ohne diese Zeile ginge die Fehlerseite an zod, und
      //    die Meldung spräche von einem falschen Feld statt vom Backend.
      if (!response.ok) {
        throw new HttpError(response.status, response.statusText);
      }

      const data = await response.json();

      return z.array(PlantSchema).parse(data);
    },
  });
};
