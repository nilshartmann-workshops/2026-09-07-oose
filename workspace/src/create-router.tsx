import { createRouter } from "@tanstack/react-router";

import { queryClient } from "./create-query-client.tsx";
import { routeTree } from "./routeTree.gen.ts";

export const plantManagerRouter = createRouter({
  routeTree,
  context: {
    queryClient,
  },
});

// Erst diese Deklaration verbindet den Typ des Routers mit den Typen aus
// "@tanstack/react-router". Ohne sie kennt <Link to={...}> die Pfade der
// Anwendung nicht.
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof plantManagerRouter;
  }
}
