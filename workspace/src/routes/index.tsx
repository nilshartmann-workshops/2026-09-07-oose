import {z} from "zod";
import { createFileRoute } from '@tanstack/react-router'
import App from "../App"

const SearchParam = z.object({
  orderBy: z.enum(["id", "lastWatered"]).default("id").catch("id")
})

export const Route = createFileRoute('/')({
  component: App,
  validateSearch: SearchParam,
  // Such-Parameter beim Seitenwechsel erhalten:
  // search: {
  //   middlewares: retainSearchParam
  // }
})
//
// function RouteComponent() {
//   return <div>Hello "/"!</div>
// }
