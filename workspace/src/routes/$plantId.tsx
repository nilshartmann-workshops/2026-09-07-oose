import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

import PlantDetails from "../plant-detail/PlantDetails.tsx";
import { plantQueryOptions } from "../plant-detail/plantQueryOptions.ts";
import PlantErrorBoundary from "../plant-list/PlantErrorBoundary.tsx";

// 🔎 Zeigen: das Dollarzeichen im Dateinamen macht den Abschnitt zum Parameter,
//    und useParams() gibt ihn unter genau diesem Namen zurück.
export const Route = createFileRoute("/$plantId")({
  component: PlantDetailPage,

  // 🔎 Zeigen: prefetchQuery gegen ensureQueryData tauschen und den Rückgabewert
  //    zurückgeben. Dann wartet der Router, das Suspense-Fallback bleibt weg,
  //    und ein Fehler geht an den Router statt an die Error Boundary.
  loader: ({ context: { queryClient }, params: { plantId } }) => {
    queryClient.prefetchQuery(plantQueryOptions(plantId));
  },
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
