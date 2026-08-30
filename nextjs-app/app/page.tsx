import FavoritePlantList from "@/components/FavoritePlantList";
import PlantCardList from "@/components/PlantCardList";
import PlantOrderBar from "@/components/PlantOrderBar";
import { getPlants } from "@/lib/api";

// 🔎 Zeigen: die Komponente ist async und wartet auf die Daten. Kein
//    useEffect, kein useQuery, kein Ladezustand von Hand.
export default async function HomePage({ searchParams }: PageProps<"/">) {
  // 🔎 Erzählen: searchParams ist ein Promise und ein untypisiertes Objekt.
  //    Ein Wert darf mehrfach in der Adresse stehen, deshalb die Prüfung.
  const { orderBy } = await searchParams;
  const currentOrder = typeof orderBy === "string" ? orderBy : "id";

  const plants = await getPlants(currentOrder);

  return (
    <>
      <PlantOrderBar orderBy={currentOrder} />
      <div className={"PlantList"}>
        <div>
          <h2>Alle Pflanzen</h2>
          <PlantCardList plants={plants} />
        </div>
        {/* 🔎 Erzählen: dieselben Objekte gehen als Prop über die Grenze. Der
            Server serialisiert sie, der Browser filtert damit. */}
        <FavoritePlantList plants={plants} />
      </div>
    </>
  );
}
