import "./index.css";
import "./setup-dayjs.ts";

import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { queryClient } from "./create-query-client.tsx";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    {/*<StrictMode>*/}
      <App />
    {/*</StrictMode>*/}
  </QueryClientProvider>,
);
