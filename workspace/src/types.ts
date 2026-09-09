import { z } from "zod";


// export type Plant = {
//   id: string;
//   name: string;
//   location: string;
//   wateringInterval: number;
//   lastWatered?: string;
// };

// type Person = {
//   firstname: string
// }
//
// const X = {
//   firstname: null
// }

type Versicherung  = {
  name: string;

}

// const LocationSchema = z.string().refine( v =>  true);

// const PlantSchema2 = z.object({
//   id: z.string().min(10),
//   name: z.string(),
//   location: LocationSchema.optional(),
//   wateringInterval: z.number(),
//   lastWatered: z.string().optional(),
//
//   a: z.string().optional(),
//   b: z.string().optional(),
//
// }).superRefine( (validatedObject, ctx) => {
//   if (validatedObject.a && validatedObject.b) {
//     // in Ordnung
//   }
//
//   if (!validatedObject.a && !validatedObject.b) {
//     // in Ordnung: beide fehlen
//   }
//
//   // ...
//   ctx.addIssue({
//     code: "custom",
//     path: ["a"],
//     message: "Fehler in A"
//   })
//
//   ctx.addIssue({
//     code: "custom",
//     path: ["b"],
//     message: "Fehler in B"
//   })
// })


// const PlantSchema = z.object({
//   id: z.string().min(10),
//   name: z.string(),
//   location: z.string(),
//   wateringInterval: z.number(),
//   lastWatered: z.string().optional(),
//
//   a: z.string().optional(),
//   b: z.string().optional(),
// }).refine(
//   validatedObject => {
//     if (validatedObject.a && validatedObject.b) {
//       // in Ordnung
//     }
//
//     if (!validatedObject.a && !validatedObject.b) {
//       // in Ordnung: beide fehlen
//     }
//   },
//   {error: "Mach heile!", path: ["a"]}
//
// )

export const PlantSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  wateringInterval: z.number(),
  lastWatered: z.string().optional(),
})


export type Plant = z.infer<typeof PlantSchema>

// const plant = PlantSchema.parse( {} ) // Exception
// printPlant(plant);
//
// function printPlant(p: Plant) {
//
// }


// zod

// function loadFromServer() {
//   let x: any = null;
//
//   if (typeof x === "object" && x !== null && "id" in x ) {
//
//   }
// }

function saveToServer(plant: Plant) {
  // ...
}
