import "./index.css";
import "./setup-dayjs.ts";

import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";


import App from "./App.tsx";
import { queryClient } from "./create-query-client.tsx";
import { StrictMode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { plantManagerRouter } from "./create-router.tsx";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    {/*<StrictMode>*/}
    <RouterProvider router={plantManagerRouter} />
    {/*</StrictMode>*/}
  </QueryClientProvider>,
);
