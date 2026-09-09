import { createFileRoute } from '@tanstack/react-router'
import PlantDetails from "../../plant-list/PlantDetails.tsx"

export const Route = createFileRoute('/plants/$plantId')({
  component: RouteComponent,
})

function RouteComponent() {

  const plantId = Route.useParams().plantId


  return <PlantDetails plantId={plantId} />
}
