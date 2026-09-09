import { createFileRoute } from '@tanstack/react-router'
import PlantDetails from "../../plant-list/PlantDetails.tsx"
import { plantQueryOptions } from "../../plant-list/plant-queries.ts";

export const Route = createFileRoute('/plants/$plantId')({
  component: RouteComponent,
  pendingComponent: () => <h1>Lade Pflanze</h1>,
  loader({context, params}) {
    context.queryClient.ensureQueryData(
      plantQueryOptions(params.plantId)
    )
  }
})

function RouteComponent() {
  const plantId = Route.useParams().plantId

  return <PlantDetails plantId={plantId} />
}
