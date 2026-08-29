import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

/** Steht jeder Route zur Verfügung, damit ein Loader Daten vorladen kann. */
type PlantManagerRouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<PlantManagerRouterContext>()({
  component: () => <Outlet />,
});
