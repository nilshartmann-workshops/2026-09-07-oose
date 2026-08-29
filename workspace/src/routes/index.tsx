import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import App from "../App.tsx";
import { plantsQueryOptions } from "../plant-list/plantsQueryOptions.ts";

// 🔎 Erzählen: das zod-Schema geht direkt an validateSearch, ohne Adapter.
//    Der Router nimmt jedes Schema an, das Standard Schema erfüllt.
const SearchSchema = z.object({
  orderBy: z.enum(["id", "lastWatered"]).default("id"),
});

// 🔎 Zeigen: der Dateiname ist die Adresse. Das Vite-Plugin schreibt daraus
//    routeTree.gen.ts, und erst danach kennt <Link to={"/"}> diesen Pfad.
export const Route = createFileRoute("/")({
  component: App,
  validateSearch: SearchSchema,

  // 🔎 Erzählen: loaderDeps weglassen, dann läuft der Loader beim Umschalten
  //    der Sortierung nicht noch einmal. Der Router sieht die Search Params
  //    nur, wenn sie hier stehen.
  loaderDeps: ({ search: { orderBy } }) => ({ orderBy }),
  loader: ({ context: { queryClient }, deps: { orderBy } }) => {
    queryClient.prefetchQuery(plantsQueryOptions(orderBy));
  },
});
