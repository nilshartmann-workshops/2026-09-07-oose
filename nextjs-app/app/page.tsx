import { getPlants } from "@/lib/api";
import PlantCardList from "@/components/PlantCardList";
import Link from "next/link";

// React Server Components (RSC)
//  - async Funktionen
//  - werden nur auf dem Server ausgeführt!

export default async function HomePage() {
  console.log("Rendering HomePage", new Date().toLocaleTimeString());

  // sql(...)
  // process.exit(1)
  // process.env.SECRET_API_KEY

  const plants = await getPlants();

  return (
    <div>
      <Link href={"/plant/1"}>Pflanze 1</Link>
      <div className={"PlantList"}>
        <div>
          <h2>Alle Pflanzen</h2>
          <PlantCardList plants={plants} />
        </div>
      </div>
    </div>
  );

}
