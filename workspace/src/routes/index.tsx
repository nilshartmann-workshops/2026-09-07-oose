import { createFileRoute } from "@tanstack/react-router";

import App from "../App.tsx";

// 🔎 Zeigen: der Dateiname ist die Adresse. Das Vite-Plugin schreibt daraus
//    routeTree.gen.ts, und erst danach kennt <Link to={"/"}> diesen Pfad.
export const Route = createFileRoute("/")({
  component: App,
});
