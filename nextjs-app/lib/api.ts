import { z } from "zod";

import { PlantSchema } from "@/types";

const BACKEND_URL = "http://localhost:7200";

// 🔎 Erzählen: dasselbe zod-Schema, das in der SPA im Browser lief, läuft hier
//    auf dem Server. Eine Datei, zwei Laufzeiten.
export async function getPlants(orderBy: string) {
  const response = await fetch(`${BACKEND_URL}/api/plants?orderBy=${orderBy}`);

  if (!response.ok) {
    throw new Error(
      `Pflanzen konnten nicht geladen werden (HTTP ${response.status})`,
    );
  }

  return z.array(PlantSchema).parse(await response.json());
}
