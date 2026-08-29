import { createRouter } from "@tanstack/react-router";

import { queryClient } from "./create-query-client.tsx";
import { routeTree } from "./routeTree.gen.ts";

// 🔎 Zeigen: liegt fertig im Startpunkt. Den Routenbaum schreibt das
//    Vite-Plugin nach routeTree.gen.ts, sobald eine Datei unter routes/ dazukommt.
export const plantManagerRouter = createRouter({
  routeTree,
  context: {
    queryClient,
  },

  // 🔎 Zeigen: im Netzwerk-Tab geht die Anfrage schon beim Überfahren des
  //    Links raus, nicht erst beim Klick.
  defaultPreload: "intent",
});

// Erst diese Deklaration verbindet den Typ des Routers mit den Typen aus
// "@tanstack/react-router". Ohne sie kennt <Link to={...}> die Pfade der
// Anwendung nicht.
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof plantManagerRouter;
  }
}
