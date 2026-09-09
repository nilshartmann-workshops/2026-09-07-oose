import { Plant, PlantSchema } from "../types.ts";
import PlantCardList from "./PlantCardList.tsx";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import FavoritePlantList from "./FavoritePlantList.tsx";
import PlantOrderBar from "./PlantOrderBar.tsx"
// // tagged union type
// type SuccessServerResponse = {
//   data: string;
//   isSuccess: true
//   code: 1
// }
//
// type ErrorServerResponse = {
//   data: undefined;
//   isSuccess: false;
//   code: 2
// }
//
// type NewErrorServerResponse_V2 = {
//   data: undefined;
//   isSuccess: false;
//   code: 3
// }
//
// type ServerResponse = SuccessServerResponse | ErrorServerResponse | NewErrorServerResponse_V2
//
// // let a = "";
// // a = 7;
// // a = function() {}
//
// function getLength<A extends string|null>(a: A): A extends string ? number : null {
//   if (typeof a === "string") {
//     return a.length;
//   }
//   return null;
// }
//
// const x:number = getLength("Moin");
// const y:null = getLength(null)
//
//
// function handleResponse(result: ServerResponse) {
//
//   switch (result.code) {
//     case 1:
//       return "ok"
//     case 2:
//       return "fehler"
//     case 3:
//       return "v2!";
//   }
//
//   handleUnknownServer(result);
// }
//
//
// //
// function handleUnknownServer(v: never) {
//   // ....
// }



// handleResponse("" as any)

// declare function ourOwnFetch(): unknown;
// const data = ourOwnFetch();
// if (typeof data === "string") {
//   data.toUpperCase();
// }

// data();
// data.x = "...";

export default function PlantList() {

  // Suspense  <-- React-Feature!



  // if (result.isPending) {
  //   return <div>Loading...</div>
  // }
  //
  // if (result.isError) {
  //   return <div>fehler. {JSON.stringify(result.error)}</div>;
  // }

  return (
    <div className={"PlantList"}>
      <div>
        <PlantOrderBar />
        <h2>Alle Pflanzen</h2>
        <PlantCardList />
      </div>
      <FavoritePlantList />
    </div>
  );
}
