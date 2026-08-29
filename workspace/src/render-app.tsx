import { QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render } from "vitest-browser-react";

import { createQueryClient } from "./create-query-client.tsx";
import { routeTree } from "./routeTree.gen.ts";

/**
 * Rendert die ganze Anwendung für einen Browser-Test, mitsamt Router und
 * TanStack Query.
 *
 * Jeder Aufruf baut einen eigenen QueryClient. Teilen sich zwei Tests einen,
 * sieht der zweite die Daten des ersten im Cache und lädt gar nicht mehr.
 *
 * Statt der Adresszeile, die es im Test nicht gibt, hält der Router seine
 * Adresse im Speicher.
 */
export function renderApp(initialPath = "/") {
  const queryClient = createQueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}
