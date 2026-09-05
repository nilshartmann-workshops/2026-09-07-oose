import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

import PlantDetails from "../plant-detail/PlantDetails.tsx";
import PlantErrorBoundary from "../plant-list/PlantErrorBoundary.tsx";

// 🔎 Zeigen: das Dollarzeichen im Dateinamen macht den Abschnitt zum Parameter,
//    und useParams() gibt ihn unter genau diesem Namen zurück.
export const Route = createFileRoute("/$plantId")({
  component: PlantDetailPage,
});

function PlantDetailPage() {
  const { plantId } = Route.useParams();

  return (
    <div className={"AppContainer"}>
      <PlantErrorBoundary>
        <Suspense fallback={<p>Pflanze wird geladen ...</p>}>
          <PlantDetails plantId={plantId} />
        </Suspense>
      </PlantErrorBoundary>
    </div>
  );
}
